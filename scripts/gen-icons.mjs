import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const generateIcon = async (size) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#001a33"/>
    <text x="${size / 2}" y="${size * 0.65}" font-size="${size * 0.5}" font-weight="bold" text-anchor="middle" fill="#4da6ff" font-family="system-ui">MB</text>
  </svg>`;

  const outputPath = path.join(publicDir, `icon-${size}.png`);

  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${outputPath}`);
  } catch (error) {
    console.error(`✗ Failed to generate icon-${size}.png:`, error.message);
    process.exit(1);
  }
};

(async () => {
  console.log('Generating app icons...');
  await generateIcon(192);
  await generateIcon(512);
  console.log('Icons generated successfully!');
})();
