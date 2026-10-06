import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const PUBLIC = "/home/z/my-project/public";
const SRC = join(PUBLIC, "logo.jpg");
const srcBuf = readFileSync(SRC);

async function generate() {
  console.log("Generating favicon assets from logo.jpg...");

  // 1. PNG icons at various sizes (for PWA + modern browsers)
  const sizes = [16, 32, 48, 96, 192, 512];
  for (const s of sizes) {
    await sharp(srcBuf)
      .resize(s, s, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(join(PUBLIC, `icon-${s}.png`));
    console.log(`  ✓ icon-${s}.png`);
  }

  // 2. Apple touch icon (180x180, white bg, padded)
  await sharp(srcBuf)
    .resize(140, 140, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: 20, bottom: 20, left: 20, right: 20,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(join(PUBLIC, "apple-touch-icon.png"));
  console.log("  ✓ apple-touch-icon.png");

  // 3. favicon.ico (multi-size: 16, 32, 48)
  const icoSizes = [16, 32, 48];
  const pngBuffers: Buffer[] = [];
  for (const s of icoSizes) {
    const buf = await sharp(srcBuf)
      .resize(s, s, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
    pngBuffers.push(buf);
  }
  const ico = buildIco(pngBuffers);
  writeFileSync(join(PUBLIC, "favicon.ico"), ico);
  console.log("  ✓ favicon.ico");

  // 4. OG image — branded card (1200x630)
  const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a2a26"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="600" cy="245" r="95" fill="#ffffff"/>
  <text x="600" y="288" font-family="Georgia, serif" font-size="120" font-weight="600" fill="#0f766e" text-anchor="middle">P</text>
  <text x="600" y="430" font-family="Georgia, serif" font-size="64" font-weight="500" fill="#ffffff" text-anchor="middle">Pharmacie Aeria</text>
  <text x="600" y="492" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#a7f3d0" text-anchor="middle">Votre sante, notre priorite.</text>
  <text x="600" y="555" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#99f6e4" text-anchor="middle" opacity="0.85">Aeria Mall · Casablanca</text>
</svg>`;
  await sharp(Buffer.from(ogSvg)).png().toFile(join(PUBLIC, "og-image.png"));
  console.log("  ✓ og-image.png");

  console.log("\nAll favicon assets generated successfully.");
}

function buildIco(pngs: Buffer[]): Buffer {
  const headerSize = 6;
  const dirEntrySize = 16;
  const count = pngs.length;
  const offset = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let dataOffset = offset;
  const dirEntries: Buffer[] = [];
  const sizes = [16, 32, 48];

  pngs.forEach((png, i) => {
    const entry = Buffer.alloc(dirEntrySize);
    const w = sizes[i] >= 256 ? 0 : sizes[i];
    const h = w;
    entry.writeUInt8(w, 0);
    entry.writeUInt8(h, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(dataOffset, 12);
    dirEntries.push(entry);
    dataOffset += png.length;
  });

  return Buffer.concat([header, ...dirEntries, ...pngs]);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
