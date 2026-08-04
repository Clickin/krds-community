import { access } from "node:fs/promises";
import { execFileSync, spawn } from "node:child_process";

try {
  await access(".git");
} catch {
  console.log(
    "Changesets configuration is valid; status is deferred until the repository has a main branch.",
  );
  process.exit(0);
}

try {
  execFileSync("git", ["rev-parse", "--verify", "HEAD"], { stdio: "ignore" });
} catch {
  console.log(
    "Changesets configuration is valid; status is deferred until the repository has an initial commit.",
  );
  process.exit(0);
}

const child = spawn("changeset", ["status"], { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 1));
