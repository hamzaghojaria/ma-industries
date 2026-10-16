/** Add responsive sources to static photos without changing layout or originals. */
export function responsiveImages(html, manifest) {
  // Mosaic tiles occupy half a row; gateway and directory photos fill mobile rows.
  html = html.replace(/<div class="range-mosaic">[\s\S]*?<\/div>/g, mosaic =>
    mosaic.replace(/<img\b[^>]*>/g, tag => /\bsizes=/.test(tag) ? tag : tag.replace(/>$/, ' sizes="(max-width: 800px) 45vw, (max-width: 1100px) 22vw, 300px">')));
  return html.replace(/<img\b[^>]*>/g, tag => {
    const source = tag.match(/\bsrc="([^"]+)"/)?.[1];
    const variants = manifest[source];
    if (!variants || /\bsrcset=/.test(tag)) return tag;
    // These hints follow the existing card widths. The browser chooses for its DPR.
    let sizes = '(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 550px';
    if (source.endsWith('/brand-logo.png')) sizes = '(max-width: 600px) 70vw, 400px';
    else if (source.includes('/gallery/')) sizes = '(max-width: 800px) 80vw, 600px';
    else if (source.includes('/founders/')) sizes = '(max-width: 600px) 90vw, 360px';
    else if (source.includes('/products/')) sizes = '(max-width: 600px) 90vw, 440px';
    const srcset = variants.map(variant => `${variant.src} ${variant.width}w`).join(', ');
    return tag.replace(/>$/, ` srcset="${srcset}"${/\bsizes=/.test(tag) ? '' : ` sizes="${sizes}"`}>`);
  });
}
