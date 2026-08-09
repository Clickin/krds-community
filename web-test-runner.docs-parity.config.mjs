// docs-parity 전용 @web/test-runner 설정.
//
// 기본 web-test-runner.config.mjs를 그대로 쓰되, 전체 docs 스윕(106 라우트 ×
// 6 프레임워크)이 기본 testsFinishTimeout(15분)을 초과하므로 상향한다.
// 부분 실행(pnpm docs:parity --routes=...)은 훨씬 빨리 끝난다.
import config from "./web-test-runner.config.mjs";

export default {
  ...config,
  // Fewer concurrent heavy pages reduce hydration-timeout flakes; the full
  // sweep stays well under this budget even at concurrency 3.
  concurrency: 3,
  concurrentBrowsers: 3,
  // The current 106-route catalog contains several calendar and service-pattern
  // pages whose six-framework comparisons take longer than one hour in Chrome.
  testsFinishTimeout: 7200000,
};
