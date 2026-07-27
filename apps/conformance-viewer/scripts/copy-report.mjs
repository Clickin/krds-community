import { copyFile, mkdir } from 'node:fs/promises';
try {
  await mkdir('public/reports', { recursive: true });
  await copyFile('../../reports/conformance.json', 'public/reports/conformance.json');
} catch {
  // The viewer remains usable as an explicit report-generation prompt before the first report exists.
}
