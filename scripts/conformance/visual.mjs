import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export const comparePixels = (upstreamBuffer, frameworkBuffer) => {
  const upstream = PNG.sync.read(upstreamBuffer);
  const framework = PNG.sync.read(frameworkBuffer);
  if (upstream.width !== framework.width || upstream.height !== framework.height) {
    return {
      passed: false,
      differingPixels: Math.max(
        upstream.width * upstream.height,
        framework.width * framework.height,
      ),
      expectedSize: { width: upstream.width, height: upstream.height },
      actualSize: { width: framework.width, height: framework.height },
    };
  }
  const differingPixels = pixelmatch(
    upstream.data,
    framework.data,
    null,
    upstream.width,
    upstream.height,
    { includeAA: true, threshold: 0 },
  );
  return {
    passed: differingPixels === 0,
    differingPixels,
    expectedSize: { width: upstream.width, height: upstream.height },
    actualSize: { width: framework.width, height: framework.height },
  };
};
