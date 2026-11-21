import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576;
const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const sourcePath = join(rootDir, 'entry.png');

const data = readFileSync(sourcePath);
if (data.byteLength === 0 || data.byteLength > MAX_BYTES) {
  throw new Error(`Invalid entry image size: ${data.byteLength} bytes`);
}

const isPng =
  data.byteLength >= 8 &&
  data[0] === 0x89 &&
  data[1] === 0x50 &&
  data[2] === 0x4e &&
  data[3] === 0x47;
const isJpeg =
  data.byteLength >= 4 &&
  data[0] === 0xff &&
  data[1] === 0xd8 &&
  data[data.byteLength - 2] === 0xff &&
  data[data.byteLength - 1] === 0xd9;

if (!isPng && !isJpeg) {
  throw new Error('entry.png must be a complete PNG or JPEG image');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), data);
