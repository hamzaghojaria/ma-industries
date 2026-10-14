from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parents[2]
source=root/'tmp'/'category-images'
destination=root/'assets'/'images'/'categories'
files=sorted(source.glob('*.png'))
thumbs=[]
for path in files:
    image=Image.open(path).convert('RGB')
    image=ImageOps.fit(image,(800,800),method=Image.Resampling.LANCZOS)
    image.save(destination/(path.stem+'.webp'),'WEBP',quality=82,method=6)
    thumb=image.resize((200,200))
    tile=Image.new('RGB',(220,240),'white')
    tile.paste(thumb,(10,0))
    ImageDraw.Draw(tile).text((6,205),path.stem,fill='black')
    thumbs.append(tile)
if thumbs:
    sheet=Image.new('RGB',(1320,((len(thumbs)+5)//6)*240),'#eeeeee')
    for i,tile in enumerate(thumbs): sheet.paste(tile,((i%6)*220,(i//6)*240))
    sheet.save(root/'tmp'/'category-images'/'contact-sheet.jpg')
print('Optimized',len(files),'catalogue images')
