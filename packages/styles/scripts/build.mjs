import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
await mkdir(join(root, 'dist'), { recursive: true });
await copyFile(join(root, 'src/index.css'), join(root, 'dist/index.css'));
if (process.argv.includes('--check')) console.log('styles source is buildable');
