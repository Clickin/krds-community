import type { Locator } from 'playwright';

export type VisualCaptureContext = {
  origin?: { x: number; y: number };
  gutter?: number;
};

export declare const captureVisualSignature: (
  locator: Locator,
  context?: VisualCaptureContext,
) => Promise<unknown>;
export declare const captureCanonicalScreenshot: (
  locator: Locator,
  options?: Parameters<Locator['screenshot']>[0],
  context?: VisualCaptureContext,
) => Promise<Buffer>;
export declare const comparePixels: (
  upstreamBuffer: Buffer,
  frameworkBuffer: Buffer,
) => {
  passed: boolean;
  differingPixels: number;
  expectedSize: { width: number; height: number };
  actualSize: { width: number; height: number };
};
