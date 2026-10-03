import sharp from 'sharp';
import { Buffer } from 'node:buffer';

const portrait = await sharp('public/images/karaer-9-960.webp').resize(420, 460, { fit: 'cover', position: 'centre' }).grayscale().toBuffer();
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#eeeae1"/><path d="M45 70H1155M45 568H1155" stroke="#22221f"/><g fill="#22221f" font-family="Arial,sans-serif"><text x="45" y="46" font-size="15" letter-spacing="2">EFE KARAER / KİŞİSEL MESELE.</text><text x="45" y="262" font-weight="900" font-size="158" letter-spacing="-9">EFE</text><text x="40" y="404" font-weight="900" font-size="139" letter-spacing="-10" fill="#c63820">KARAER</text><text x="48" y="482" font-size="23">İyi mi çok mu faça?</text><text x="48" y="520" font-size="17">Karaer Arşivi.</text><text x="45" y="600" font-size="13" letter-spacing="2">SANSARSALVO55</text><text x="915" y="600" font-size="13" letter-spacing="2">KİŞİSEL ARŞİV.</text></g></svg>`;
await sharp(Buffer.from(svg)).composite([{ input: portrait, left: 735, top: 85 }]).png().toFile('public/social-card.png');
console.log('Generated local 1200 × 630 social card.');
