import { rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await rm('tsconfig.tsbuildinfo', { force: true });
