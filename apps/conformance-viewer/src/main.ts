const root = document.querySelector<HTMLElement>('#app')!;
const reportUrl = '/reports/conformance.json';
const render = async () => {
  try {
    const response = await fetch(reportUrl);
    const report = (await response.json()) as {
      upstream: { commit: string; packageVersion: string };
      strictConformance: boolean;
      frameworks: Array<{
        framework: string;
        inventory: number;
        implemented: number;
        strictPassing: number;
        waived: number;
      }>;
    };
    root.innerHTML = `<h1>KRDS conformance 리포트</h1><p>Upstream ${report.upstream.packageVersion} · ${report.upstream.commit}</p><p>엄격 conformance: <strong>${report.strictConformance ? '통과' : '미통과'}</strong></p><table><thead><tr><th>프레임워크</th><th>인벤토리</th><th>구현됨</th><th>엄격 통과</th><th>유예</th></tr></thead><tbody>${report.frameworks.map((framework) => `<tr><td>${framework.framework}</td><td>${framework.inventory}</td><td>${framework.implemented}</td><td>${framework.strictPassing}</td><td>${framework.waived}</td></tr>`).join('')}</tbody></table>`;
  } catch {
    root.innerHTML =
      '<h1>KRDS conformance 리포트</h1><p>먼저 <code>pnpm test:conformance</code>을 실행하여 리포트를 생성하세요.</p>';
  }
};
void render();
