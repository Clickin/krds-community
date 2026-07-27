export type ComponentFramework = 'react' | 'vue' | 'svelte' | 'solid' | 'angular' | 'astro';
export type ComponentId = 'button' | 'text-input' | 'checkbox' | 'radio' | 'switch' | 'accordion';
export type ComponentProp = {
    name: string;
    type: string;
    description: string;
};
export type ComponentGuide = {
    id: ComponentId;
    title: string;
    category: string;
    summary: string;
    packageNames: Record<ComponentFramework, string>;
    officialUrl: string;
    sourcePaths: Record<ComponentFramework, string>;
    sourceHashes: Record<ComponentFramework, string>;
    sourceSnapshot: string;
    props: readonly ComponentProp[];
    events: readonly string[];
    forms: readonly string[];
    accessibility: readonly string[];
    usage: readonly string[];
    snippets: Record<ComponentFramework, string>;
};
export declare const coreComponents: ComponentGuide[];
export declare function findComponent(id: string): ComponentGuide;
//# sourceMappingURL=components.d.ts.map