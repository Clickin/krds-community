import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const cli = resolve(root, "packages/cli/src/cli.mjs");
const execFileAsync = promisify(execFile);

describe("component CLI framework support", () => {
  it("lists Astro with the complete 74-component inventory", async () => {
    const { stdout } = await execFileAsync(process.execPath, [cli, "component", "list"], {
      cwd: root,
      encoding: "utf8",
    });

    expect(stdout).toContain("astro (74)");
  });

  it("generates a native Astro component snippet with traceable metadata", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      [cli, "component", "copy", "button", "--framework", "astro"],
      { cwd: root, encoding: "utf8" },
    );

    expect(stdout).toContain("@krds-community/framework: astro");
    expect(stdout).toContain('<Button variant="primary">버튼</Button>');
  });
});
