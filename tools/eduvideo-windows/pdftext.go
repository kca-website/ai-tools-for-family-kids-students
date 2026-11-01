package main

import (
 "bytes"
 "compress/zlib"
 "encoding/hex"
 "encoding/ascii85"
 "encoding/binary"
 "fmt"
 "io"
 "os"
 "regexp"
 "strconv"
 "sort"
 "strings"
 "unicode/utf16"
 "unicode/utf8"
)

// Lightweight bundled PDF text extractor. It handles searchable, non-encrypted
// PDF streams with FlateDecode, including embedded-font ToUnicode CMaps.
// Scanned images, encrypted documents, and unsupported PDF filters are rejected.
var pdfObj = regexp.MustCompile(`(?s)(\d+)\s+\d+\s+obj\b(.*?)\bendobj`)
var pdfRef = regexp.MustCompile(`(\d+)\s+\d+\s+R`)
var pdfFont = regexp.MustCompile(`/([A-Za-z][A-Za-z0-9_+.-]+)\s+(\d+)\s+\d+\s+R`)
var pdfHex = regexp.MustCompile(`<([A-Fa-f0-9]+)>`)
var cmapEntry = regexp.MustCompile(`(?m)<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>(?:\s*<([0-9A-Fa-f]+)>|\s*\[([^\]]+)\])?`)
var pdfOperation = regexp.MustCompile(`(?s)(\[[^\]]*\]|\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]+>)\s*(Tj|TJ|\x27|\x22)`)
var pdfStringTok = regexp.MustCompile(`(?s)\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]+>`)
var pdfBlock = regexp.MustCompile(`(?s)\bBT\b(.*?)\bET\b`)
var pdfSwitch = regexp.MustCompile(`/([A-Za-z][A-Za-z0-9_+.-]*)\s+[\d.\-]+\s+Tf`)
func extractStream(o []byte) ([]byte,error) {
 start:=bytes.Index(o,[]byte("stream")); if start<0 {return nil,fmt.Errorf("no stream")}
 p:=start+6; if p<len(o) && o[p]=='\r' {p++}; if p<len(o) && o[p]=='\n' {p++}
 end:=bytes.LastIndex(o,[]byte("endstream"));if end<p{return nil,fmt.Errorf("no endstream")}
 data:=bytes.TrimRight(o[p:end],"\r\n")
 header:=o[:start]
 if bytes.Contains(header,[]byte("/ASCII85Decode")) {out:=make([]byte,len(data));n,_,e:=ascii85.Decode(out,bytes.TrimSuffix(data,[]byte("~>")),true);if e!=nil{return nil,e};data=out[:n]}
 if bytes.Contains(header,[]byte("/FlateDecode")) {r,e:=zlib.NewReader(bytes.NewReader(data));if e!=nil{return nil,e};defer r.Close(); return io.ReadAll(io.LimitReader(r,48*1024*1024))}
 if bytes.Contains(header,[]byte("/DCTDecode"))||bytes.Contains(header,[]byte("/JPXDecode")) {return nil,fmt.Errorf("unsupported filter")}
 return data,nil
}
func fromHex(s string) []byte {b,e:=hex.DecodeString(s);if e!=nil{return nil};return b}
func unicodeHex(s string) string {b:=fromHex(s);if len(b)<2{return string(b)}; if len(b)%2!=0 {return string(b)}; u:=make([]uint16,len(b)/2);for i:=range u{u[i]=binary.BigEndian.Uint16(b[i*2:])};return string(utf16.Decode(u))}
func cmapParse(data []byte) map[string]string {
 result:=map[string]string{}
 src:=string(data)
 // bfchar mappings and bfrange first form; ignore CMap metadata.
 blocks:=regexp.MustCompile(`(?s)\b(beginbfchar|beginbfrange)\b(.*?)\bendbf(?:char|range)`).FindAllStringSubmatch(src,-1)
 for _,block:=range blocks {
  if block[1]=="beginbfchar" {p:=regexp.MustCompile(`<([A-Fa-f0-9]+)>\s*<([A-Fa-f0-9]+)>`).FindAllStringSubmatch(block[2],-1);for _,q:=range p{result[strings.ToUpper(q[1])]=unicodeHex(q[2])}}
  if block[1]=="beginbfrange" {lines:=strings.Split(block[2],"\n");for _,line:=range lines {
    matches:=pdfHex.FindAllStringSubmatch(line,-1);if len(matches)<3{continue}
    lo,e1:=strconv.ParseInt(matches[0][1],16,64);hi,e2:=strconv.ParseInt(matches[1][1],16,64);dest,e3:=strconv.ParseInt(matches[2][1],16,64)
    if e1!=nil||e2!=nil||e3!=nil||hi<lo||hi-lo>4096{continue}
    width:=len(matches[0][1]);dw:=len(matches[2][1]);
    for k:=lo;k<=hi;k++{v:=dest+(k-lo);result[fmt.Sprintf("%0*X",width,k)]=unicodeHex(fmt.Sprintf("%0*X",dw,v))}
  }}
 }
 return result
}
func pdfLiteral(s string) []byte {
 if strings.HasPrefix(s,"<") {return fromHex(strings.Map(func(r rune) rune {if r==' '||r=='\n'||r=='\r'{return -1};return r},s[1:len(s)-1]))}
 if !strings.HasPrefix(s,"(") {return []byte(s)}
 s=s[1:len(s)-1]; out:=make([]byte,0,len(s))
 for i:=0;i<len(s);i++{if s[i]!='\\'{out=append(out,s[i]);continue};i++;if i>=len(s){break};switch s[i]{case 'n':out=append(out,'\n');case 'r':out=append(out,'\r');case 't':out=append(out,'\t');case 'b':out=append(out,'\b');case 'f':out=append(out,'\f');case '\n':case '\r':if i+1<len(s)&&s[i+1]=='\n'{i++};case '0','1','2','3','4','5','6','7': start:=i;for i+1<len(s)&&i-start<2&&s[i+1]>='0'&&s[i+1]<='7'{i++};val,_:=strconv.ParseUint(s[start:i+1],8,8);out=append(out,byte(val));default:out=append(out,s[i])}}
 return out
}
func decodePDFText(b []byte, mapping map[string]string) string {
 if len(mapping)==0 {if utf8.Valid(b){return string(b)};var sb strings.Builder;for _,v:=range b{if v>=32{sb.WriteRune(rune(v))}};return sb.String()}
 width:=1;for code:=range mapping{if len(code)>2{width=len(code)/2;break}}
 var sb strings.Builder
 for i:=0;i<len(b); {n:=width;if i+n>len(b){n=1};k:=strings.ToUpper(hex.EncodeToString(b[i:i+n]));if val,ok:=mapping[k];ok{sb.WriteString(val)} else if n==1&&b[i]>=32{sb.WriteByte(b[i])};i+=n}
 return sb.String()
}
func extractPDF(file string) (string,error) {
 data,e:=os.ReadFile(file);if e!=nil{return "",e}; if len(data)>32*1024*1024{return "",fmt.Errorf("PDF exceeds 32MB")};if !bytes.HasPrefix(data,[]byte("%PDF-")){return "",fmt.Errorf("not a PDF")}
 objs:=map[string][]byte{};for _,m:=range pdfObj.FindAllSubmatch(data,-1){objs[string(m[1])]=m[2]}
 // Collect maps for fonts referenced by their PDF resource names.
 fontMaps:=map[string]map[string]string{}
 for _,o:=range objs {for _,f:=range pdfFont.FindAllSubmatch(o,-1) {
  fontObj:=objs[string(f[2])];if !bytes.Contains(fontObj,[]byte("/ToUnicode")){continue}
  ref:=pdfRef.FindSubmatch(fontObj[bytes.Index(fontObj,[]byte("/ToUnicode")):]);if ref==nil{continue}; stream,err:=extractStream(objs[string(ref[1])]);if err==nil{fontMaps[string(f[1])]=cmapParse(stream)}
 }}
 // Fallback: when font resources reside in an uncompressed object stream, collect available maps.
 var global map[string]string
 for _,obj:=range objs {if !bytes.Contains(obj,[]byte("begincmap")) && !bytes.Contains(obj,[]byte("/FlateDecode")){continue};b,err:=extractStream(obj);if err==nil&&bytes.Contains(b,[]byte("beginbf")){m:=cmapParse(b);if len(m)>len(global){global=m}}}
 var parts []string
 // Follow the PDF page tree (object-map order is nondeterministic).
 ids:=[]string{}
 roots:=[]string{}
 for id,obj:=range objs {if regexp.MustCompile(`/Type\s*/Pages\b`).Match(obj){roots=append(roots,id)}}
 sort.Slice(roots,func(i,j int)bool{a,_:=strconv.Atoi(roots[i]);b,_:=strconv.Atoi(roots[j]);return a<b})
 visited:=map[string]bool{}
 var walk func(string)
 walk=func(id string){if visited[id]{return};visited[id]=true;obj:=objs[id];if regexp.MustCompile(`/Type\s*/Page\b`).Match(obj){ids=append(ids,id);return}
 at:=bytes.Index(obj,[]byte("/Kids"));if at<0{return};left:=bytes.Index(obj[at:],[]byte("["));right:=bytes.Index(obj[at:],[]byte("]"));if left<0||right<left{return};for _,r:=range pdfRef.FindAllSubmatch(obj[at+left:at+right],-1){walk(string(r[1]))}}
 for _,r:=range roots{walk(r)}
 if len(ids)==0{for id,obj:=range objs{if regexp.MustCompile(`/Type\s*/Page\b`).Match(obj){ids=append(ids,id)}};sort.Slice(ids,func(i,j int)bool{a,_:=strconv.Atoi(ids[i]);b,_:=strconv.Atoi(ids[j]);return a<b})}
 // Only decode /Contents referenced from /Type /Page objects, not fonts/metadata.
 for _,pageID:=range ids {page:=objs[pageID];at:=bytes.Index(page,[]byte("/Contents"));if at<0{continue};chunk:=page[at+len("/Contents"):];if len(chunk)>500{chunk=chunk[:500]};if end:=bytes.Index(chunk,[]byte("/Resources"));end>=0{chunk=chunk[:end]}
  refs:=pdfRef.FindAllSubmatch(chunk,-1);for _,r:=range refs{stream,err:=extractStream(objs[string(r[1])]);if err!=nil{continue};for _,block:=range pdfBlock.FindAllSubmatch(stream,-1){textBlock:=string(block[1]);font:="";for _,line:=range strings.Split(textBlock,"\n") {if sw:=pdfSwitch.FindStringSubmatch(line);sw!=nil{font=sw[1]}}
    var sb strings.Builder;last:=0
    for _,loc:=range pdfOperation.FindAllStringSubmatchIndex(textBlock,-1) {
       begin:=loc[0];if sw:=pdfSwitch.FindAllStringSubmatch(textBlock[last:begin],-1);len(sw)>0 {font=sw[len(sw)-1][1]}
       raw:=textBlock[loc[2]:loc[3]];fmap:=fontMaps[font];if len(fmap)==0{fmap=global}
       for _,tok:=range pdfStringTok.FindAllString(raw,-1){sb.WriteString(decodePDFText(pdfLiteral(tok),fmap))}
       if strings.Contains(textBlock[last:begin]," T*")||strings.Contains(textBlock[last:begin]," Td")||strings.Contains(textBlock[last:begin]," TD"){sb.WriteString("\n")} else {sb.WriteString(" ")}
       last=loc[1]
    }
    line:=strings.TrimSpace(sb.String());if line!=""{parts=append(parts,line)}
   }}
 }
 text:=strings.TrimSpace(strings.Join(parts,"\n"))
 if len([]rune(text))<20{return "",fmt.Errorf("No usable text layer. Scanned, encrypted or unsupported PDF; OCR is not included")}
 return text,nil
}