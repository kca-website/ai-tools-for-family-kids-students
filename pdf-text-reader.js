(function(){
  "use strict";
  const PDFJS_URL="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
  const PDFJS_WORKER_URL="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  let libPromise=null;

  async function loadPdfJs(){
    if(!libPromise){
      libPromise=import(PDFJS_URL).then((lib)=>{
        if(lib.GlobalWorkerOptions) lib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER_URL;
        return lib;
      });
    }
    return libPromise;
  }

  async function read(file, options){
    const opts=Object.assign({maxBytes:15*1024*1024,maxPages:80,maxChars:50000},options||{});
    if(!file) throw new Error("no_file");
    const isPdf=file.type==="application/pdf" || /\.pdf$/i.test(file.name||"");
    if(!isPdf) throw new Error("not_pdf");
    if(file.size>opts.maxBytes) throw new Error("file_too_large");

    const pdfjs=await loadPdfJs();
    const data=await file.arrayBuffer();
    const pdf=await pdfjs.getDocument({data}).promise;
    const pageLimit=Math.min(pdf.numPages,opts.maxPages);
    const pages=[];
    let totalChars=0;
    let truncated=false;

    for(let n=1;n<=pageLimit;n++){
      const page=await pdf.getPage(n);
      const content=await page.getTextContent();
      const text=content.items
        .map((item)=>typeof item.str==="string"?item.str:"")
        .join(" ")
        .replace(/\s+/g," ")
        .trim();
      if(!text) continue;
      const prefix="[Page "+n+"]\n";
      const room=opts.maxChars-totalChars-prefix.length;
      if(room<=0){truncated=true;break;}
      const slice=text.slice(0,room);
      pages.push(prefix+slice);
      totalChars+=prefix.length+slice.length;
      if(slice.length<text.length){truncated=true;break;}
    }
    if(pdf.numPages>pageLimit) truncated=true;
    const text=pages.join("\n\n").trim();
    if(!text) throw new Error("no_selectable_text");
    return {
      name:file.name||"document.pdf",
      text,
      pagesRead:pageLimit,
      totalPages:pdf.numPages,
      chars:text.length,
      truncated
    };
  }

  window.AITOOLSKIDS_PDF={read,loadPdfJs};
})();