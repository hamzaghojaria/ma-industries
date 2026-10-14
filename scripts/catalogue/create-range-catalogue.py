"""Build the complete product catalogue from the website's exported data."""
import argparse
import html
import json
import shutil
from io import BytesIO
from pathlib import Path
from urllib.parse import quote

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import pymupdf

parser = argparse.ArgumentParser(description='Generate the M&A Industries product catalogue.')
parser.add_argument('--preview', action='store_true', help='Render the cover and category index for visual review.')
args = parser.parse_args()

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf'
TMP = ROOT / 'tmp/pdfs'
IMAGE_CACHE = TMP / 'catalogue-image-cache'
DATA = json.loads((TMP / 'catalogue-data.json').read_text(encoding='utf-8'))
OUT.mkdir(parents=True, exist_ok=True)
W, H = 595.276, 841.89
RED, INK, MUTED = '#a70027', '#262922', '#62675c'
DEST = OUT / 'MA-Industries-Catalogue.pdf'
c = canvas.Canvas(str(DEST), pagesize=(W, H))
c.setTitle('M&A Industries | Product Catalogue')
c.setAuthor('M&A Industries')
page_number = 0
body = ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=15, textColor=HexColor(MUTED))

def text(x,y,value,size=11,font='Helvetica',color=INK):
    c.setFillColor(HexColor(color)); c.setFont(font,size); c.drawString(x,y,value)

def para(x,y,value,width,size=10,leading=15,color=MUTED):
    style=ParagraphStyle('copy',parent=body,fontSize=size,leading=leading,textColor=HexColor(color))
    p=Paragraph(html.escape(value),style); _,height=p.wrap(width,1000); p.drawOn(c,x,y-height)
    return height

def photo(file,x,y,w,h):
    source_path=ROOT / file
    IMAGE_CACHE.mkdir(parents=True,exist_ok=True)
    cached=IMAGE_CACHE/(source_path.stem+'.jpg')
    if not cached.exists() or cached.stat().st_mtime < source_path.stat().st_mtime:
        with Image.open(source_path) as original:
            original=original.convert('RGB')
            original.thumbnail((850,850))
            original.save(cached,format='JPEG',quality=74,optimize=True,progressive=True)
    image=ImageReader(str(cached)); iw,ih=image.getSize(); scale=max(w/iw,h/ih)
    c.saveState(); clip=c.beginPath(); clip.rect(x,y,w,h); c.clipPath(clip,stroke=0)
    c.drawImage(image,x+(w-iw*scale)/2,y+(h-ih*scale)/2,iw*scale,ih*scale,mask='auto'); c.restoreState()

def page(label):
    global page_number
    page_number+=1
    c.setFillColor(HexColor('#fffaf7')); c.rect(0,0,W,H,fill=1,stroke=0)
    text(44,795,label,9,'Helvetica-Bold',RED)
    c.setStrokeColor(HexColor('#ddc9c3')); c.line(44,42,W-44,42)
    text(44,27,'M&A Industries / Product catalogue',8,color=MUTED)
    text(W-60,27,f'{page_number:02}',8,color=MUTED)

def contact(y):
    for label,url in [('+91 97696 81761','https://wa.me/919769681761?text='+quote('Hello M&A Industries, I viewed your catalogue. Please help with product options, specifications, pricing and availability.')),('info@maindustries.in','mailto:info@maindustries.in'),('maindustries.in','http://maindustries.in/')]:
        text(44,y,label,12,'Helvetica-Bold',RED); c.linkURL(url,(44,y-3,400,y+14)); y-=27

page('THE COMPLETE COLLECTION')
c.drawImage(str(ROOT/'assets/images/brand-logo.png'),44,710,width=245,height=44,mask='auto')
text(44,650,'Thoughtful materials.',38,'Times-Roman')
text(44,602,'Everyday possibilities.',38,'Times-Italic',RED)
para(44,568,'Paper and packaging. Sugarcane-based products. Recycled household essentials.',490,14,21)
photo('assets/images/categories/packaging.webp',44,230,244,255)
photo('assets/images/products/sugarcane-plates-photo.jpg',300,230,251,255)
text(44,196,f"{len(DATA['papers'])} products / {len(DATA['categories'])} categories",15,'Helvetica-Bold')
para(44,176,'Explore the range, then share what your business needs.',490,12,18)
contact(126); c.showPage()

page('CONTENTS / 12 PRODUCT CATEGORIES')
text(44,748,'Find what fits your business.',30,'Times-Roman')
para(44,720,'Browse the contents by category. Select a name to jump directly to its collection.',500,11,17)
for i,g in enumerate(DATA['categories']):
    col=i//6; row=i%6
    x=44+col*260; y=644-row*62
    c.setFillColor(HexColor('#ffffff')); c.roundRect(x,y-42,247,52,5,fill=1,stroke=0)
    text(x+13,y-7,f'{i+1:02}',9,'Helvetica-Bold',RED)
    text(x+43,y-8,g['name'],10,'Helvetica-Bold')
    count=sum(p['group']==g['id'] for p in DATA['papers'])
    text(x+43,y-27,f'{count} products',8,color=MUTED)
    text(x+219,y-21,'>',12,'Helvetica-Bold',RED)
    c.linkRect('',g['id'],(x,y-42,x+247,y+10),relative=0,thickness=0)
para(44,220,'Tell us the application, quantity and specifications you need. We confirm material composition, availability and item documentation on enquiry.',500,10,15)
c.showPage()

for g in DATA['categories']:
    products=[p for p in DATA['papers'] if p['group']==g['id']]
    for start in range(0,len(products),6):
        page('THE COLLECTION / '+('SUGARCANE & RECYCLED' if g.get('collection') else 'PAPER & PACKAGING'))
        if start==0: c.bookmarkPage(g['id']); c.addOutlineEntry(g['name'],g['id'],0)
        text(44,750,g['name']+(' / continued' if start else ''),28,'Times-Roman')
        para(44,726,g['desc'],500,10,15)
        for j,p in enumerate(products[start:start+6]):
            x=44+(j%2)*260; top=662-(j//2)*196
            c.setFillColor(HexColor('#ffffff')); c.rect(x,top-182,247,182,fill=1,stroke=0)
            photo(p['image'],x,top-108,247,108)
            height=para(x+10,top-116,p['name'],227,11,13,INK)
            spec=(f"{p['gsm']['min']}-{p['gsm']['max']} GSM / reference" if p.get('gsm') else 'Availability confirmed on enquiry' if p.get('sourcingOnly') else 'Specifications on enquiry')
            para(x+10,top-120-height,spec,227,8,10)
            text(x+10,top-172,'Explore product >',9,'Helvetica-Bold',RED)
            product_url='https://maindustries.in/products.html?category='+quote(p['group'])+'#paper-'+p['id']
            c.linkURL(product_url,(x,top-182,x+247,top))
        c.showPage()

page("LET'S FIND YOUR STARTING POINT")
text(44,720,'A requirement in mind?',38,'Times-Roman')
text(44,670,"Let's talk.",40,'Times-Italic',RED)
para(44,620,"Share your application, quantity and specifications. We'll help you explore suitable options across our paper, packaging, sugarcane and recycled ranges.",490,15,23)
text(44,490,'For a useful enquiry, include:',16,'Helvetica-Bold')
for y,line in zip(range(455,300,-30),['Product or application','Required quantity and pack size','Dimensions, capacity or reel width','Material, finish and performance requirements','Delivery location and timeline']): text(54,y,line,12)
contact(260)
para(44,142,'Pricing, stock, minimum quantities and suitability are confirmed at enquiry. For food-contact, temperature, care or environmental requirements, request documentation for the selected item.',490,10,15)
c.showPage(); c.save()

doc=pymupdf.open(DEST)
all_text=''.join(p.get_text() for p in doc)
for product in DATA['papers']:
    assert product['name'] in all_text, product['name']
assert len(doc)==page_number
assert sum(len(p.get_links()) for p in doc)>=len(DATA['papers'])+len(DATA['categories'])+6
for i,p in enumerate(doc):
    for block in p.get_text('blocks'):
        assert block[0]>=0 and block[1]>=0 and block[2]<=W+1 and block[3]<=H+1, (i,block)
    if args.preview and i < 2:
        p.get_pixmap(matrix=pymupdf.Matrix(1,1),alpha=False).save(TMP/f'catalogue-page-{i+1:02}.png')
shutil.copyfile(DEST,ROOT/'assets/catalogues/MA-Industries-Paper-Catalogue.pdf')
print(f'Created and verified {page_number} pages with {len(DATA["papers"])} products.')
