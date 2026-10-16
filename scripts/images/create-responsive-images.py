"""Create checked-in WebP derivatives; deployment needs no image dependencies.

Run after changing source photos: python scripts/images/create-responsive-images.py
Requires Pillow. Originals remain available for full-size views and catalogue use.
"""
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
manifest = {}
sources = [ROOT / 'assets/images/brand-logo.png']
for folder in ('ranges', 'gallery', 'categories', 'founders'):
    sources.extend(sorted((ROOT / 'assets/images' / folder).iterdir()))
for source in sources:
    if source.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp'):
        continue
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
        variants = []
        # Never upscale a small source; descriptors always match actual pixels.
        for width in sorted({min(size, image.width) for size in (320, 640, 960)}):
            folder = source.parent.name if source.parent.name != 'images' else 'brand'
            target = ROOT / 'assets/images/responsive' / folder / f'{source.stem}-{width}.webp'
            target.parent.mkdir(parents=True, exist_ok=True)
            height = round(image.height * width / image.width)
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                target, 'WEBP', quality=78, method=6
            )
            variants.append({'src': target.relative_to(ROOT).as_posix(), 'width': width})
        manifest[source.relative_to(ROOT).as_posix()] = variants
path = ROOT / 'scripts/site/manifests/responsive-images.json'
path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(f'Prepared responsive variants for {len(manifest)} images.')
