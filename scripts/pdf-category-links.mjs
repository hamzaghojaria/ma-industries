import fs from 'node:fs';

// Explicit GoTo actions avoid named-destination lookup in mobile PDF readers.
export function fixCategoryLinks(file, categories) {
  const original = fs.readFileSync(file);
  const raw = original.toString('latin1');
  const previous = Number([...raw.matchAll(/startxref\s+(\d+)/g)].at(-1)[1]);
  const trailer = [...raw.matchAll(/trailer\s*<<(.*?)>>/gs)].at(-1)[1];
  const size = trailer.match(/\/Size\s+(\d+)/)[1];
  const root = trailer.match(/\/Root\s+(\d+\s+\d+\s+R)/)[1];
  const info = trailer.match(/\/Info\s+(\d+\s+\d+\s+R)/)?.[1];
  let addition = '\n';
  const entries = [];
  for (const category of categories) {
    const destination = raw.match(new RegExp('/' + category.id + '\\s*\\[(\\d+\\s+0\\s+R)\\s+/XYZ'));
    const annotation = [...raw.matchAll(/(\d+) 0 obj\s*(<<\/Type \/Annot[\s\S]*?)\s*endobj/g)]
      .find(match => match[2].includes('/Dest /' + category.id + '\n'));
    if (!destination || !annotation) throw new Error('Missing category destination: ' + category.id);
    const object = Number(annotation[1]);
    const updated = annotation[2].replace('/Dest /' + category.id,
      '/A <</S /GoTo /D [' + destination[1] + ' /Fit]>>');
    entries.push({object, offset: original.length + Buffer.byteLength(addition, 'latin1')});
    addition += `${object} 0 obj\n${updated}\nendobj\n`;
  }
  const xref = original.length + Buffer.byteLength(addition, 'latin1');
  addition += 'xref\n';
  for (const entry of entries.sort((a,b) => a.object-b.object)) {
    addition += `${entry.object} 1\n${String(entry.offset).padStart(10,'0')} 00000 n \n`;
  }
  addition += `trailer\n<</Size ${size} /Root ${root}${info ? ' /Info '+info : ''} /Prev ${previous}>>\nstartxref\n${xref}\n%%EOF\n`;
  const result = Buffer.concat([original, Buffer.from(addition,'latin1')]);
  for (const entry of entries) {
    if (!result.subarray(entry.offset, entry.offset+20).toString('latin1').startsWith(`${entry.object} 0 obj`)) {
      throw new Error('Invalid category link object offset');
    }
  }
  fs.writeFileSync(file,result);
  console.log(`Verified ${entries.length} explicit category page links.`);
}
