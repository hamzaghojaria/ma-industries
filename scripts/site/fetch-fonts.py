"""Refresh locally hosted Latin font subsets from Google Fonts and their licenses.

Maintenance only: the deployment copies checked-in assets and never fetches fonts.
"""
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
URL = ('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700'
       '&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap')
USER_AGENT = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
              '(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36')


def download(url):
    with urlopen(Request(url, headers={'User-Agent': USER_AGENT}), timeout=30) as response:
        return response.read()


folder = ROOT / 'assets/fonts'
folder.mkdir(parents=True, exist_ok=True)
css = download(URL).decode('utf-8')
blocks = re.findall(r'/\* latin \*/\s*(@font-face\s*\{[^}]+\})', css)
if not blocks:
    raise RuntimeError('Google Fonts returned no Latin WOFF2 subsets')
files = set()
local_blocks = []
for block in blocks:
    remote = re.search(r'url\((https://[^)]+\.woff2)\)', block).group(1)
    family = 'dm-sans' if "'DM Sans'" in block else 'playfair-display'
    style = re.search(r'font-style: (\w+)', block).group(1)
    name = f'{family}-{style}-latin.woff2'
    relative = f'assets/fonts/{name}'
    if relative not in files:
        (folder / name).write_bytes(download(remote))
        files.add(relative)
    # Optional avoids a late font swap on slow connections and resulting shifts.
    local_blocks.append(block.replace(remote, '../fonts/' + name).replace('font-display: swap', 'font-display: optional'))
for family, upstream in [('dm-sans', 'dmsans'), ('playfair-display', 'playfairdisplay')]:
    path = f'assets/fonts/{family}-OFL.txt'
    (ROOT / path).write_bytes(download(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{upstream}/OFL.txt'))
    files.add(path)
(ROOT / 'assets/css/fonts.css').write_text(
    '/* Local Latin subsets. Refresh with scripts/site/fetch-fonts.py. */\n' + '\n'.join(local_blocks) + '\n', encoding='utf-8'
)
(ROOT / 'scripts/site/manifests/fonts.json').write_text(json.dumps(sorted(files), indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(files)} local font and license files.')
