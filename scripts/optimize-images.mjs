import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const source = 'docs/original/images';
await mkdir('public/images', { recursive: true });
const metadata = {};
for (const file of await readdir(source)) {
  if (!/\.(png|jpg)$/.test(file)) continue;
  // Retain this reference original, but do not publish unused background variants.
  if (file === 'efek.com2.jpg') continue;
  const name = file.replace(/\.(png|jpg)$/, '');
  const input = join(source, file);
  const info = await sharp(input).metadata();
  metadata[name] = { width: info.width, height: info.height, original: file };
  for (const width of [480, 960]) {
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`public/images/${name}-${width}.webp`);
  }
}
await writeFile('src/data/image-metadata.json', JSON.stringify(metadata, null, 2));
console.log(`Optimized ${Object.keys(metadata).length} original images into responsive WebP variants.`);
