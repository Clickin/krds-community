import { vi } from "vitest";

export function captureHydrationWarnings() {
  const messages: string[] = [];
  const record = (...values: unknown[]) => {
    messages.push(
      values.map((value) => (value instanceof Error ? value.message : String(value))).join(" "),
    );
  };
  const warn = vi.spyOn(console, "warn").mockImplementation(record);
  const error = vi.spyOn(console, "error").mockImplementation(record);

  return {
    messages,
    restore() {
      warn.mockRestore();
      error.mockRestore();
    },
  };
}
