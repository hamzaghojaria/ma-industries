import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import {resolve,dirname,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'dist');
const assets=['index.html','assets/css/style.css','assets/js/app.js','assets/images/brand-logo.png','assets/images/favicon-32.png','assets/images/favicon-192.png','assets/images/apple-touch-icon.png','assets/images/share-preview.png'];
new Script(await readFile(resolve(root,'assets/js/app.js'),'utf8'));
let html=await readFile(resolve(root,'index.html'),'utf8');
const origin=process.env.SITE_URL||process.env.RENDER_EXTERNAL_URL;
if(origin){const url=new URL(origin);if(!['https:','http:'].includes(url.protocol))throw Error('SITE_URL must be an HTTP(S) address');url.pathname='/';url.search='';url.hash='';const base=url.href;html=html.replaceAll('content="assets/images/share-preview.png"','content="'+new URL('assets/images/share-preview.png',base).href+'"');html=html.replace('</head>','<link rel="canonical" href="'+base+'"><meta property="og:url" content="'+base+'"></head>')}
if(dirname(output)!==resolve(root)||basename(output)!=='dist')throw Error('Unexpected build output directory');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const asset of assets){const destination=resolve(output,asset);await mkdir(dirname(destination),{recursive:true});if(asset==='index.html')await writeFile(destination,html);else await copyFile(resolve(root,asset),destination)}
console.log('Validated JavaScript and prepared '+assets.length+' static assets in dist/.');
