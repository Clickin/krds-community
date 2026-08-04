import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const outputRoot = join(root, "storybook-static");
const composed = {
  id: "composed",
  label: "All frameworks",
  config: ".storybook/composed",
  port: 6005,
};
const projects = [
  { id: "react", label: "React", config: ".storybook/react", port: 6006 },
  { id: "vue", label: "Vue", config: ".storybook/vue", port: 6007 },
  { id: "svelte", label: "Svelte", config: ".storybook/svelte", port: 6008 },
  { id: "solid", label: "SolidJS", config: ".storybook/solid", port: 6009 },
  { id: "angular", label: "Angular", config: ".storybook/angular", port: 6010 },
];

const publicHost =
  process.env.STORYBOOK_PUBLIC_HOST ??
  Object.values(networkInterfaces())
    .flat()
    .find((address) => address?.family === "IPv4" && !address.internal)?.address ??
  "localhost";
const childEnvironment = { ...process.env, STORYBOOK_PUBLIC_HOST: publicHost };

const command = process.argv[2] ?? "dev";
const storybook = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "storybook.cmd" : "storybook",
);
const angularCli = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "ng.cmd" : "ng",
);

const run = (executable, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: root,
      stdio: "inherit",
      env: childEnvironment,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Storybook exited with ${signal ?? code}`));
    });
  });

if (command === "build") {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await run(storybook, ["build", "--config-dir", composed.config, "--output-dir", outputRoot]);
  for (const project of projects) {
    if (project.id === "angular") {
      await run(angularCli, ["run", "krds-storybook:build-storybook"]);
    } else {
      await run(storybook, [
        "build",
        "--config-dir",
        project.config,
        "--output-dir",
        join(outputRoot, project.id),
      ]);
    }
  }
  console.log(`Built one composed and ${projects.length} framework Storybooks in ${outputRoot}.`);
} else if (command === "dev") {
  const children = [composed, ...projects].map((project) => {
    const child =
      project.id === "angular"
        ? spawn(angularCli, ["run", "krds-storybook:storybook"], {
            cwd: root,
            stdio: ["ignore", "pipe", "pipe"],
            env: childEnvironment,
          })
        : spawn(
            storybook,
            [
              "dev",
              "--config-dir",
              project.config,
              "--port",
              String(project.port),
              "--host",
              "0.0.0.0",
              "--no-open",
            ],
            {
              cwd: root,
              stdio: ["ignore", "pipe", "pipe"],
              env: childEnvironment,
            },
          );
    child.stdout.on("data", (data) => process.stdout.write(`[${project.label}] ${data}`));
    child.stderr.on("data", (data) => process.stderr.write(`[${project.label}] ${data}`));
    return { child, project };
  });

  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    children.forEach(({ child }) => child.kill("SIGTERM"));
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  const result = await Promise.race(
    children.map(
      ({ child, project }) =>
        new Promise((resolveExit) => {
          child.once("error", (error) => resolveExit({ error, project }));
          child.once("exit", (code, signal) => resolveExit({ code, signal, project }));
        }),
    ),
  );
  const interrupted = stopping;
  stop();
  if ("error" in result) throw result.error;
  if (!interrupted) {
    throw new Error(
      `${result.project.label} Storybook exited with ${result.signal ?? result.code}.`,
    );
  }
} else {
  throw new Error(`Unknown Storybook command: ${command}. Use dev or build.`);
}
