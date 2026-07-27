export const pinnedKrdsSnapshot = {
    ref: '1.1.0',
    commit: 'd6bb184c823e4757f05807ea4646a23e3133b6e6',
    package: 'krds-uiux@1.1.0',
    retrieved: '2026-07-26',
    sourceUrl: 'https://github.com/KRDS-uiux/krds-uiux/tree/d6bb184c823e4757f05807ea4646a23e3133b6e6',
    sourceFile: 'upstream/krds-html/SOURCE.md',
    license: 'KOGL-Type-1',
};
export const liveKrdsSource = {
    componentSummary: 'https://www.krds.go.kr/html/site/component/component_summary.html',
    serviceSummary: 'https://www.krds.go.kr/html/site/service/service_summary.html',
    basicSummary: 'https://www.krds.go.kr/html/site/global/global_summary.html',
    retrieved: '2026-07-27',
};
/** Components present in the live component summary but not in the pinned 1.1.0 HTML snapshot inventory. */
export const liveOnlyComponents = [
    'Image',
    'FAB',
    'Accessible multimedia',
    'Visually hidden',
    'Range slider',
    'Back button',
    'Bottom sheet',
    'Quantity toggle',
    'Toast',
    'Snackbar',
    'Tab bars',
    'Splash screen',
];
export const liveSnapshotWarning = `공식 웹사이트(${liveKrdsSource.retrieved} 확인)는 고정된 HTML Component Kit ${pinnedKrdsSnapshot.ref} 스냅샷보다 넓은 컴포넌트 목록을 보여준다. ` +
    `${liveOnlyComponents.join(', ')}는 이 저장소의 ${pinnedKrdsSnapshot.ref} 스냅샷에 포함되지 않으므로 커뮤니티 구현이나 conformance 결과로 추정하지 않는다.`;
//# sourceMappingURL=provenance.js.map