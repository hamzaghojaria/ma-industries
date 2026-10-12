import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fixCategoryLinks} from './pdf-category-links.mjs';

const root = process.cwd();
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('assets/js/catalogue-data.js','utf8'),context);
const {papers,categories}=context.window.MACatalogueData;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const image=p=>'file:///'+path.join(root,p).replaceAll('\\','/');
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
fs.mkdirSync('tmp/pdfs/optimized-images',{recursive:true});
fs.mkdirSync('output/pdf',{recursive:true});
const imagePaths=[...new Set([...papers.map(p=>p.image),'assets/images/categories/packaging.webp'])];
const optimizedPath=p=>path.join(root,'tmp/pdfs/optimized-images',path.basename(p,'.webp')+'.jpg');
const changedImages=imagePaths.filter(p=>!fs.existsSync(optimizedPath(p)) || fs.statSync(p).mtimeMs>fs.statSync(optimizedPath(p)).mtimeMs);
if(changedImages.length){
const optimizer=`<!doctype html><html><body><script>
const paths=${JSON.stringify(changedImages.map(p=>({path:p,url:image(p)})))};
Promise.all(paths.map(async entry=>{
 const img=new Image();img.src=entry.url;await img.decode();
 const width=Math.min(img.naturalWidth,entry.path.includes('/categories/')?1200:750);
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=Math.round(img.naturalHeight*width/img.naturalWidth);
 canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
 return {path:entry.path,data:canvas.toDataURL('image/jpeg',0.78).split(',')[1]};
})).then(images=>document.body.textContent=JSON.stringify(images));
</script></body></html>`;
fs.writeFileSync('tmp/pdfs/optimize-images.html',optimizer);
const optimizedDom=execFileSync(edge,['--headless','--no-sandbox','--disable-gpu','--disable-software-rasterizer','--allow-file-access-from-files',`--user-data-dir=${root}/tmp/pdfs/edge-profile`,'--virtual-time-budget=10000','--dump-dom',image('tmp/pdfs/optimize-images.html')],{timeout:60000,maxBuffer:20*1024*1024,stdio:['ignore','pipe','pipe']}).toString();
const optimized=JSON.parse(optimizedDom.match(/<body>([\s\S]*?)<\/body>/)[1]);
for(const entry of optimized)fs.writeFileSync(path.join(root,'tmp/pdfs/optimized-images',path.basename(entry.path,'.webp')+'.jpg'),Buffer.from(entry.data,'base64'));
}
const photo=p=>image('tmp/pdfs/optimized-images/'+path.basename(p,'.webp')+'.jpg');
const catalogueMessage='Hello M&A Industries,\n\nI viewed your PDF catalogue and would like to enquire about your paper products. Please share suitable grades, pricing and availability.\n\nPaper product / application:\nQuantity:\nSize / GSM / finish:\n\nThank you.';
const whatsappUrl='https://wa.me/919769681761?text='+encodeURIComponent(catalogueMessage);
const emailUrl='mailto:info@maengineerings.in?subject='+encodeURIComponent('PDF catalogue enquiry | M&A Industries')+'&body='+encodeURIComponent(catalogueMessage);
const contact=`<a href="${esc(whatsappUrl)}">WhatsApp: +91 97696 81761</a><a href="${esc(emailUrl)}">info@maengineerings.in</a>`;
const footer=n=>`<footer><span>M&amp;A Industries / Paper catalogue</span><span>${String(n).padStart(2,'0')}</span></footer>`;
let pages=[`<section class="page cover"><img class="logo" src="${image('assets/images/brand-logo.png')}"><p class="eyebrow">THE PAPER COLLECTION</p><h1>Paper for every<br>possibility.</h1><p class="intro">Packaging. Printing. Stationery. Specialty finishes.</p><img class="hero" src="${photo('assets/images/categories/packaging.webp')}"><div class="cover-bottom"><strong>36 paper families / 8 categories</strong><p>A guide to materials for your next project.</p><div class="contact">${contact}</div></div>${footer(1)}</section>`];
pages.push(`<section class="page"><p class="eyebrow">EXPLORE THE COLLECTION</p><h2>Find your paper.</h2><p class="intro">Start with your application. Explore the paper families, then discuss the grade, finish and quantity with our team.</p><div class="contents">${categories.map((g,i)=>`<a href="#${g.id}"><span>0${i+1}</span><div><h3>${esc(g.name)}</h3><p>${esc(g.line)}</p></div><b>${papers.filter(p=>p.group===g.id).length} products</b></a>`).join('')}</div><div class="note"><h3>Choosing the right grade</h3><p>GSM ranges are reference guides, not confirmed stock specifications. Confirm availability, size, finish and suitability for your application before ordering. Product images are illustrative.</p></div>${footer(2)}</section>`);
categories.forEach((g,i)=>{
 const products=papers.filter(p=>p.group===g.id);
 pages.push(`<section class="page" id="${g.id}"><p class="eyebrow">COLLECTION / 0${i+1}</p><h2>${esc(g.name)}</h2><p class="category-desc">${esc(g.desc)}</p><div class="grid">${products.map(p=>`<a class="product-card" href="https://wa.me/919769681761?text=${encodeURIComponent('Hello M&A Industries, I would like to enquire about '+p.name+'. Please share suitable grades, pricing and availability.')}"><img src="${photo(p.image)}"><div class="card-copy"><h3>${esc(p.name)}</h3><p class="gsm">${p.gsm?`${p.gsm.min}-${p.gsm.max} GSM / reference`:'Grade-based sourcing'}</p><span class="enquire">Enquire &#8594;</span></div></a>`).join('')}</div>${footer(i+3)}</section>`);
});
pages.push(`<section class="page closing"><img class="logo" src="${image('assets/images/brand-logo.png')}"><p class="eyebrow">LET'S TALK PAPER</p><h1>Bring your<br>next idea<br>to paper.</h1><p class="intro">Share your application and requirements.<br>We'll help you explore suitable paper options.</p><div class="brief"><h3>For a useful enquiry, include:</h3><p>Paper family or intended use<br>Required quantity<br>Sheet size or reel width<br>GSM, finish and colour<br>Printing or converting requirements</p></div><div class="contact">${contact}</div><div class="note"><p>Pricing, stock, minimum quantities and application suitability are confirmed at enquiry. For wrapping and foodservice applications, confirm the specific grade's suitability and required compliance documentation.</p></div>${footer(11)}</section>`);
const style=`@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#262922;background:#ddd}a{color:inherit;text-decoration:none}.page{width:210mm;height:297mm;position:relative;background:#fffaf7;padding:17mm 16mm 18mm;break-after:page;overflow:hidden}.page:last-child{break-after:auto}.eyebrow{color:#a70027;font-size:10px;letter-spacing:2px;font-weight:bold;margin:0 0 12px}h1{font-family:Georgia,serif;font-weight:normal;font-size:57px;line-height:1.08;margin:28px 0 18px}h2{font-family:Georgia,serif;font-weight:normal;font-size:34px;margin:0 0 12px}h3{font-size:14px;margin:0 0 7px}p{font-size:11px;line-height:1.5;margin:0 0 9px}.intro{font-size:15px;line-height:1.6;max-width:620px}.logo{width:260px;height:auto;margin:0 0 42px}.cover .eyebrow{margin-top:4px}.hero{width:100%;height:290px;object-fit:cover;margin-top:21px;border-radius:6px}.cover-bottom{margin-top:27px}.cover-bottom strong{font-size:16px}.cover-bottom p{margin-top:8px}.contact{display:flex;flex-direction:column;align-items:flex-start;gap:12px;font-size:14px;color:#a70027;margin-top:23px;font-weight:bold}footer{position:absolute;bottom:12mm;left:16mm;right:16mm;display:flex;justify-content:space-between;border-top:1px solid #ddc9c3;padding-top:9px;color:#786a63;font-size:9px}.contents{margin-top:25px}.contents>a{display:flex;gap:20px;align-items:center;padding:17px 0;border-bottom:1px solid #e6d7d0}.contents>a>span{font-size:12px;color:#a70027}.contents h3{font-size:17px;margin-bottom:4px}.contents p{margin:0;color:#776b65}.contents b{margin-left:auto;font-size:12px;color:#a70027}.note{background:#f3e8e3;padding:18px;margin-top:25px}.note p{margin:0;font-size:11px}.category-desc{font-size:12px;min-height:36px;margin-bottom:15px;max-width:630px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.grid .product-card{display:block;background:white;border:1px solid #e9ddd6;border-radius:5px;overflow:hidden;height:270px}.grid .product-card>img{display:block;width:100%;height:180px;object-fit:cover}.card-copy{padding:10px 12px}.card-copy h3{font-size:14px;margin-bottom:7px}.card-copy p{font-size:9px;line-height:1.4;margin-bottom:6px}.card-copy .gsm{font-size:9px;font-weight:bold;color:#a70027}.uses{color:#6c6058}.enquire{display:inline-block;background:#a70027;color:white;font-size:11px;font-weight:bold;padding:5px 14px;border-radius:4px}.small-note{font-size:9px;color:#786a63;margin-top:14px}.closing h1{font-size:68px}.closing .eyebrow{margin-top:24px}.brief{margin:35px 0;padding-left:20px;border-left:3px solid #a70027}.brief p{font-size:15px;line-height:1.9}.closing .note{margin-top:35px}@media print{body{background:white}}`;
fs.mkdirSync('tmp/pdfs',{recursive:true});fs.mkdirSync('output/pdf',{recursive:true});
fs.writeFileSync('tmp/pdfs/catalogue.html',`<!doctype html><html><head><meta charset="utf-8"><title>M&A Industries | Paper Catalogue</title><style>${style}</style></head><body>${pages.join('')}</body></html>`);
execFileSync(edge,['--headless','--no-sandbox','--disable-gpu','--disable-software-rasterizer','--no-pdf-header-footer',`--user-data-dir=${root}/tmp/pdfs/edge-profile`,`--print-to-pdf=${root}/output/pdf/MA-Industries-Paper-Catalogue.pdf`,image('tmp/pdfs/catalogue.html')],{timeout:60000,stdio:'pipe'});
fs.writeFileSync('tmp/pdfs/preview.html',`<!doctype html><html><head><meta charset="utf-8"><style>${style}body{display:grid;grid-template-columns:repeat(3,210mm);gap:10px}.page{transform-origin:top left}</style></head><body>${pages.join('')}</body></html>`);
execFileSync(edge,['--headless','--no-sandbox','--disable-gpu','--disable-software-rasterizer',`--user-data-dir=${root}/tmp/pdfs/edge-profile`,'--hide-scrollbars','--window-size=2420,4540',`--screenshot=${root}/tmp/pdfs/catalogue-preview.png`,image('tmp/pdfs/preview.html')],{timeout:60000,stdio:'pipe'});
fixCategoryLinks('output/pdf/MA-Industries-Paper-Catalogue.pdf',categories);
fs.mkdirSync('assets/catalogues',{recursive:true});
fs.copyFileSync('output/pdf/MA-Industries-Paper-Catalogue.pdf','assets/catalogues/MA-Industries-Paper-Catalogue.pdf');
console.log('Created catalogue: '+papers.length+' products, '+pages.length+' pages.');
const pdf=fs.readFileSync('output/pdf/MA-Industries-Paper-Catalogue.pdf');
const raw=pdf.toString('latin1');
const pageCount=(raw.match(/\/Type \/Page\b/g)||[]).length;
const linkCount=(raw.match(/\/URI\s*\(/g)||[]).length;
if(pageCount!==pages.length || linkCount!==papers.length+4)throw new Error('PDF page or contact link count is incorrect');
console.log(`Verified ${pageCount} pages and ${linkCount} contact links; ${(pdf.length/1e6).toFixed(2)} MB.`);





