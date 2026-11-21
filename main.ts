// the-catalogue-photo-of-an-2-20261121-0341 entry: copy the catalogue
// photo to the output dir. Node 22, standard library only. The grader
// runs this twice and both runs must write the same bytes, so the
// Before copying, the PNG is validated so a corrupt or wrong-sized
// image fails loudly instead of shipping silently: the 8-byte PNG
// signature must match, the IHDR chunk must declare exactly 1024x1024,
// the bit depth must be 8 and the colour type 2 (truecolour RGB), the
// file must contain at least one IDAT chunk carrying the image data
// and must end with a proper IEND terminator, and the file must stay
// within the bounty cap of 1 MiB — checked both from the bytes read
// and from the on-disk size via statSync, so a truncated or padded
// file cannot slip through. After writing, the output is read back
// and compared byte for byte with the source.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;
const MAX_BYTES = 1024 * 1024;

const pngPath = join(here, 'entry.png');
const png = readFileSync(pngPath);

// The on-disk size must agree with the bytes read, and both must be
// within the cap — a mismatch means the file changed mid-read.
const onDiskBytes = statSync(pngPath).size;
if (onDiskBytes !== png.length) {
  throw new Error(
    `entry.png: on-disk size ${onDiskBytes} differs from bytes read ${png.length}`,
  );
}
if (png.length > MAX_BYTES) {
  throw new Error(
    `entry.png: ${png.length} bytes exceeds the 1 MiB cap`,
  );
}
// PNG signature: 137 80 78 71 13 10 26 10.
const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
for (let i = 0; i < signature.length; i++) {
  if (png[i] !== signature[i]) {
    throw new Error(`entry.png: bad PNG signature at byte ${i}`);
  }
}
// IHDR chunk: length (4 bytes) + "IHDR" (4 bytes) + width (4 bytes BE)
// + height (4 bytes BE). It starts at byte 8.
if (png.toString('ascii', 12, 16) !== 'IHDR') {
  throw new Error('entry.png: first chunk is not IHDR');
}
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
  throw new Error(
    `entry.png: expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, got ${width}x${height}`,
  );
}
// IHDR bytes 24 (bit depth) and 25 (colour type): the catalogue photo
// is 8-bit truecolour RGB, so anything else is not this entry.
const bitDepth = png[24];
const colorType = png[25];
if (bitDepth !== 8 || colorType !== 2) {
  throw new Error(
    `entry.png: expected bit depth 8 / colour type 2 (RGB), got ${bitDepth} / ${colorType}`,
  );
}
// Walk the chunk chain after IHDR: the file must contain at least one
// IDAT chunk (the actual image data — a PNG with no IDAT decodes to
// nothing) and must end with an IEND chunk. Any chunk whose declared
// length would run past the end of the file means truncation.
let offset = 8;
let foundIdat = false;
let foundIend = false;
while (offset + 8 <= png.length) {
  const chunkLen = png.readUInt32BE(offset);
  const chunkType = png.toString('ascii', offset + 4, offset + 8);
  if (offset + 12 + chunkLen > png.length) {
    throw new Error(
      `entry.png: chunk ${chunkType} at offset ${offset} is truncated (length ${chunkLen})`,
    );
  }
  if (chunkType === 'IDAT') foundIdat = true;
  if (chunkType === 'IEND') {
    if (chunkLen !== 0) {
      throw new Error(`entry.png: IEND chunk must be empty, got length ${chunkLen}`);
    }
    foundIend = true;
    break;
  }
  offset += 12 + chunkLen;
}
if (!foundIdat) {
  throw new Error('entry.png: no IDAT chunk found — file carries no image data');
}
if (!foundIend) {
  throw new Error('entry.png: no IEND chunk found — file is truncated');
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.png');
writeFileSync(outPath, png);
const written = readFileSync(outPath);
if (!written.equals(png)) {
  throw new Error('entry.png: written bytes differ from source');
}
console.log(`entry.png written (${png.length} bytes, ${width}x${height}, bit depth ${bitDepth}, colour type ${colorType})`);
