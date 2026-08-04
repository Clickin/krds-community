export const krdsIcons = {
  chevronDown:
    '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
  check:
    '<path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
  react:
    '<circle cx="12" cy="12" r="2" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></g>',
  vue: '<path d="m3 5 9 15 9-15h-4.2L12 12.2 7.2 5H3Z" fill="currentColor"/><path d="m7.2 5 4.8 7.2L16.8 5" fill="none" stroke="white" stroke-width="1.2"/>',
  svelte:
    '<path d="M19.5 4.1c-2.2-2.2-6.1-1.5-8.4.8l-5.5 5.5c-1.3 1.3-1.3 3.4 0 4.7 1.1 1.1 2.8 1.3 4.1.5-1.1 1.2-1 3.1.1 4.2 1.3 1.3 3.4 1.3 4.7 0l5.5-5.5c2.3-2.3 3-6.2.8-8.4-1.1-1.1-2.5-1.5-3.9-1.3 1.3-1.3 3.5-1.2 4.9.1 1.4 1.4 1.4 3.6 0 4.9l-5.5 5.5c-.5.5-1.4.5-1.9 0s-.5-1.4 0-1.9l5.5-5.5c.5-.5.5-1.4 0-1.9s-1.4-.5-1.9 0l-5.5 5.5c-.5.5-1.4.5-1.9 0s-.5-1.4 0-1.9l5.5-5.5c.5-.5 1.4-.5 1.9 0 .5.5.5 1.4 0 1.9l-1.4 1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
  solid:
    '<path d="M5 4h8.2c3.8 0 5.8 2.1 5.8 4.8 0 1.8-.9 3.3-2.4 4.1 1.5.7 2.4 2 2.4 3.7 0 3-2.1 5.4-6.1 5.4H5V4Zm4 3.8v5.2h3.7c1.5 0 2.3-1 2.3-2.6 0-1.6-.8-2.6-2.3-2.6H9Zm0 8.6v2h4c1.4 0 2.2-.8 2.2-2s-.8-2-2.2-2H9v2Z" fill="currentColor"/>',
  angular:
    '<path d="m12 3 8 2-1.2 10.2L12 21l-6.8-5.8L4 5l8-2Zm0 3.1-4.8 10.7L12 19l4.8-2.2L12 6.1Zm0 2.6 3 6.9h-6l3-6.9Z" fill="currentColor"/>',
} as const;

export type KrdsIconName = keyof typeof krdsIcons;

export const iconSvg = (name: KrdsIconName, label?: string): string =>
  `<svg aria-hidden="${label ? "false" : "true"}"${label ? ` aria-label="${label}" role="img"` : ""} viewBox="0 0 24 24" focusable="false">${krdsIcons[name]}</svg>`;
