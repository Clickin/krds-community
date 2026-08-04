/// <reference types="astro/client" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- Starlight does not export ./virtual; path reference is the only way to type the virtual modules.
/// <reference path="../node_modules/@astrojs/starlight/virtual.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- same reason: component virtual modules are declared here.
/// <reference path="../node_modules/@astrojs/starlight/virtual-internal.d.ts" />

declare module "@krds-community/styles";
