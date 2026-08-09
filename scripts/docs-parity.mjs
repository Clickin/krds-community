// docs-parity — docs 사이트 프레임워크 패리티 감사 (Node 오케스트레이터).
//
// @web/test-runner + Chrome(playwright 미사용)로 apps/docs의 모든 패턴/컴포넌트
// 페이지를 같은 출처 iframe에 로드해, 각 FrameworkPreview 예시가 6개 프레임워크
// 탭에서 동일한 텍스트를 렌더하는지(빈 패널·미하이드레이션·모달 오버레이·배지
// 색·하이드레이션 에러 포함) 검증한다. 워커(tests/web-test-runner/docs-parity.test.mjs)는
// 라우트별 실패 목록을 HTTP collector로 POST하고, 이 스크립트가 집계해
// 실패 1건 이상이면 exit 1을 반환한다.
//
// 실행:
//   pnpm docs:parity                         # 전체 (BASE_PATH=/docs 빌드 포함)
//   pnpm docs:parity --routes=modal,button   # 라우트 부분집합만 (부분 문자열 매치)
//   pnpm docs:parity --routes=service-patterns --skip-build   # 빌드 생략(반복 수정 시)

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  startCollector,
  stopCollector,
  setConfig,
  getPayloads,
} from "./conformance/browser-collector.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const docsContent = join(root, "apps/docs/src/content/docs");
const reportsDirectory = join(root, "reports");

const args = process.argv.slice(2);
const routeFilter = args
  .filter((arg) => arg.startsWith("--routes="))
  .flatMap((arg) => arg.slice("--routes=".length).split(","))
  .map((term) => term.trim())
  .filter(Boolean);
const skipBuild = args.includes("--skip-build");

// 라우트 = FrameworkPreview을 렌더하는 모든 콘텐츠 페이지: 패턴 그룹(index 제외)
// + 컴포넌트 페이지(index, live-only 제외).
const listRoutes = () => {
  const routes = [];
  for (const group of ["service-patterns", "basic-patterns"]) {
    for (const file of readdirSync(join(docsContent, group))) {
      if (!file.endsWith(".mdx") || file === "index.mdx") continue;
      routes.push(`${group}/${file.replace(/\.mdx$/, "")}`);
    }
  }
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".mdx") || entry.name === "index.mdx") continue;
      const relative = full.slice(docsContent.length + 1);
      if (relative.split("/").includes("live-only")) continue;
      // Only FrameworkPreview pages render the [data-framework-preview]
      // examples the worker asserts on; ComponentPage-driven pages (switch,
      // text-input, …) render a different layout and are skipped.
      if (!readFileSync(full, "utf8").includes("<FrameworkPreview")) continue;
      routes.push(relative.replace(/\.mdx$/, ""));
    }
  };
  walk(join(docsContent, "components"));
  return routes.sort();
};

const run = (command, args, env) =>
  new Promise((resolvePromise, reject) => {
    let stderr = "";
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: ["ignore", "inherit", "pipe"],
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (signal) reject(new Error(`${command} received ${signal}\n${stderr.trim()}`));
      else resolvePromise(code ?? 0);
    });
  });

const writeReports = async ({ routes, summaries, missing, failures, wtrExit }) => {
  const categories = [
    "missing",
    "identity",
    "geometry",
    "paint",
    "typography",
    "state",
    "hydration",
    "unknown",
  ];
  const mismatchesByCategory = Object.fromEntries(categories.map((category) => [category, 0]));
  const unknowns = [];
  for (const failure of failures) {
    const category = categories.includes(failure.category) ? failure.category : "unknown";
    mismatchesByCategory[category] += 1;
    if (category === "unknown") unknowns.push(failure);
  }
  const frameworkNodeCounts = Object.fromEntries(
    ["react", "vue", "svelte", "solid", "angular", "astro"].map((framework) => [framework, 0]),
  );
  let exampleCount = 0;
  let referenceNodeCount = 0;
  let comparisonCount = 0;
  const browserUserAgents = new Set();
  for (const summary of summaries) {
    exampleCount += summary.metrics?.exampleCount ?? 0;
    referenceNodeCount += summary.metrics?.referenceNodeCount ?? 0;
    comparisonCount += summary.metrics?.comparisonCount ?? 0;
    for (const [framework, count] of Object.entries(summary.metrics?.frameworkNodeCounts ?? {}))
      if (framework in frameworkNodeCounts) frameworkNodeCounts[framework] += count;
    if (summary.metrics?.browserUserAgent) browserUserAgents.add(summary.metrics.browserUserAgent);
  }
  const report = {
    schemaVersion: 1,
    reportType: "docs-framework-parity",
    generatedAt: new Date().toISOString(),
    frameworks: ["react", "vue", "svelte", "solid", "angular", "astro"],
    routeCount: routes.length,
    coveredRouteCount: new Set(summaries.map((summary) => summary.route)).size,
    exampleCount,
    nodeCount: { reference: referenceNodeCount, byFramework: frameworkNodeCounts },
    comparisonCount,
    tolerance: { geometryPx: 1 },
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      browser: "Chrome via @web/test-runner",
      browserUserAgents: [...browserUserAgents],
      viewport: { width: 1440, height: 900 },
    },
    missingRoutes: missing,
    workerExitCode: wtrExit,
    failureCount: failures.length,
    mismatchesByCategory,
    unknowns,
    failures,
    routes: summaries.map((summary) => ({
      route: summary.route,
      exampleCount: summary.metrics?.exampleCount ?? 0,
      nodeCount: {
        reference: summary.metrics?.referenceNodeCount ?? 0,
        byFramework: summary.metrics?.frameworkNodeCounts ?? {},
      },
      comparisonCount: summary.metrics?.comparisonCount ?? 0,
      failureCount: summary.failures?.length ?? 0,
    })),
    status: wtrExit === 0 && missing.length === 0 && failures.length === 0 ? "passing" : "failing",
  };
  const markdown = [
    "# Docs framework parity",
    "",
    `- Status: **${report.status}**`,
    `- Routes: ${report.coveredRouteCount}/${report.routeCount}`,
    `- Examples: ${report.exampleCount}`,
    `- Reference nodes: ${report.nodeCount.reference}`,
    `- Comparisons: ${report.comparisonCount}`,
    `- Geometry tolerance: ${report.tolerance.geometryPx} CSS px`,
    `- Failures: ${report.failureCount}`,
    `- Unknowns: ${report.unknowns.length}`,
    `- Worker exit: ${report.workerExitCode}`,
    "",
    "## Categories",
    "",
    ...Object.entries(report.mismatchesByCategory).map(
      ([category, count]) => `- ${category}: ${count}`,
    ),
    "",
    "## Environment",
    "",
    `- Node: ${report.environment.node}`,
    `- Platform: ${report.environment.platform}/${report.environment.arch}`,
    `- Browser: ${report.environment.browser}`,
    `- Viewport: ${report.environment.viewport.width}×${report.environment.viewport.height}`,
    "",
    ...(report.unknowns.length
      ? ["## Unknowns", "", ...report.unknowns.map((unknown) => `- ${JSON.stringify(unknown)}`), ""]
      : []),
    ...(missing.length
      ? ["## Missing routes", "", ...missing.map((route) => `- ${route}`), ""]
      : []),
    ...(failures.length
      ? [
          "## Failures",
          "",
          ...failures.map(
            (failure) =>
              `- ${failure.route} · ${failure.example} · ${failure.framework} · ${failure.category}: ${failure.message}`,
          ),
          "",
        ]
      : []),
  ].join("\n");
  await mkdir(reportsDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(reportsDirectory, "docs-parity.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(join(reportsDirectory, "docs-parity.md"), markdown),
  ]);
  return report;
};

const main = async () => {
  // 1. BASE_PATH=/docs 프로덕션 빌드 — stale dev 서버의 모듈 그래프 회귀를
  //    감지하기 위해 정적 산출물을 기준으로 검증한다.
  if (!skipBuild) {
    const buildExit = await run("pnpm", ["--filter", "@krds-community/docs", "build"], {
      BASE_PATH: "/docs",
    });
    if (buildExit !== 0) {
      console.error("docs-parity: docs build failed");
      process.exit(buildExit ?? 1);
    }
  }

  const allRoutes = listRoutes();
  const routes = routeFilter.length
    ? allRoutes.filter((route) => routeFilter.some((term) => route.includes(term)))
    : allRoutes;
  if (!routes.length) {
    console.error(
      `docs-parity: no routes match --routes=${routeFilter.join(",")} (available: service-patterns/*, basic-patterns/*, components/**)`,
    );
    process.exit(1);
  }
  console.log(
    `docs-parity: ${routes.length} route(s)${routeFilter.length ? ` (filtered from ${allRoutes.length})` : ""}`,
  );

  const collectorHost = "127.0.0.1";
  const collectorPort = process.env.KRDS_BROWSER_COLLECTOR_PORT ?? "8123";
  const collectorBase = `http://${collectorHost}:${collectorPort}`;
  try {
    await startCollector();
    setConfig({ routes });
    const worker = resolve(root, "tests/web-test-runner/docs-parity.test.mjs");
    const wtrConfig = resolve(root, "web-test-runner.docs-parity.config.mjs");
    const wtrExit = await run(
      "pnpm",
      ["-w", "exec", "web-test-runner", "--files", worker, "--config", wtrConfig],
      {
        KRDS_BROWSER_COLLECTOR_PORT: collectorPort,
        VITE_STORYBOOK_COLLECTOR: collectorBase,
      },
    );
    const summaries = getPayloads().filter((payload) => payload?.kind === "docs-parity");
    const covered = new Set(summaries.map((summary) => summary.route));
    const missing = routes.filter((route) => !covered.has(route));
    const failures = summaries.flatMap((summary) =>
      (summary.failures ?? []).map((failure) => ({ route: summary.route, ...failure })),
    );
    if (wtrExit !== 0)
      failures.push({
        route: "(worker)",
        example: "(runner)",
        framework: "-",
        category: "hydration",
        message: `web-test-runner exited with ${wtrExit}`,
      });
    const report = await writeReports({ routes, summaries, missing, failures, wtrExit });
    if (missing.length)
      console.error(
        `docs-parity: ${missing.length} routes produced no report: ${missing.join(", ")}`,
      );
    for (const failure of failures)
      console.error(
        `docs-parity FAIL: ${failure.route} | "${failure.example ?? "?"}" | ${failure.framework}: ${failure.message}`,
      );
    if (report.status !== "passing") process.exitCode = 1;
    else console.log(`docs-parity: ${routes.length} routes, 0 failures`);
  } finally {
    await stopCollector().catch(() => {});
  }
};

await main();
