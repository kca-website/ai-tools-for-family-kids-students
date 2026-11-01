// EduVideo Studio v0.8 - Windows portable Piper & FFmpeg bundled at build time.
//go:build windows
package main
import (
 _ "embed"
 "fmt"
 "os"
 "os/exec"
 "path/filepath"
 "syscall"
 "time"
 "unsafe"
)
//go:embed app.ps1
var script string
func message(t, m string, icon uintptr){p:=syscall.NewLazyDLL("user32.dll").NewProc("MessageBoxW");a,_:=syscall.UTF16PtrFromString(m);b,_:=syscall.UTF16PtrFromString(t);p.Call(0,uintptr(unsafe.Pointer(a)),uintptr(unsafe.Pointer(b)),icon)}
func main(){
 if len(os.Args)==4 && os.Args[1]=="--pdftext" {
  txt,err:=extractPDF(os.Args[2]);if err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)}
  if err=os.WriteFile(os.Args[3],[]byte(txt),0600);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(3)}
  return
 }
 
 isWorker:=len(os.Args)>=3 && os.Args[1]=="--render"
 dir:=filepath.Join(os.Getenv("LOCALAPPDATA"),"EduVideoStudio","runtime-v080")
 if e:=os.MkdirAll(dir,0700);e!=nil{message("EduVideo Studio",e.Error(),0x10);return}
 scriptPath:=filepath.Join(dir,"studio.ps1")
 b:=append([]byte{0xef,0xbb,0xbf},[]byte(script)...)
 if e:=os.WriteFile(scriptPath,b,0600);e!=nil{message("EduVideo Studio",e.Error(),0x10);return}
 exe,_:=os.Executable()
 cmd:=exec.Command("powershell.exe","-NoProfile","-STA","-ExecutionPolicy","Bypass","-File",scriptPath)
 env:=append(os.Environ(),"EDUVIDEO_BIN="+exe,"EDUVIDEO_HOME="+filepath.Dir(exe))
 readyPath:=filepath.Join(dir,"ready.flag")
 if !isWorker { _=os.Remove(readyPath);env=append(env,"EDUVIDEO_READY_FILE="+readyPath) }
 if isWorker{env=append(env,"EDUVIDEO_JOB_DIR="+os.Args[2])}
 cmd.Env=env
 cmd.SysProcAttr=&syscall.SysProcAttr{CreationFlags:0x08000000}
 logPath:=filepath.Join(dir,"last-run.log")
 if isWorker{logPath=filepath.Join(os.Args[2],"worker.log")}
 file,e:=os.Create(logPath);if e!=nil{message("EduVideo Studio",e.Error(),0x10);return}
 defer file.Close();cmd.Stdout=file;cmd.Stderr=file
 if e=cmd.Start();e!=nil{message("EduVideo Studio","Δεν ξεκίνησε η εφαρμογή: "+e.Error(),0x10);return}
 if isWorker {if e=cmd.Wait();e!=nil {fmt.Fprintln(file,e)};return}
 done:=make(chan error,1);go func(){done<-cmd.Wait()}()
 ticks:=time.NewTicker(250*time.Millisecond);defer ticks.Stop()
 timeout:=time.NewTimer(18*time.Second);defer timeout.Stop()
 for {
 select {
 case err:=<-done:
  if _,e:=os.Stat(readyPath);e==nil{return}
  bb,_:=os.ReadFile(logPath);tail:=string(bb);if len(tail)>2300{tail=tail[len(tail)-2300:]}
  message("EduVideo Studio · Σφάλμα εκκίνησης",fmt.Sprintf("Η εφαρμογή έκλεισε: %v\n\n%s\n\nΚαταγραφή: %s",err,tail,logPath),0x10);return
 case <-ticks.C:
  if _,e:=os.Stat(readyPath);e==nil{return}
 case <-timeout.C:
  if _,e:=os.Stat(readyPath);e==nil{return}
  message("EduVideo Studio · Σφάλμα εκκίνησης","Η εφαρμογή δεν άνοιξε μετά από 18 δευτερόλεπτα. Καταγραφή: "+logPath,0x30);return
 }
 }
}