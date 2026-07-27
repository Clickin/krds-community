export type PatternCategory = '서비스 패턴' | '기본 패턴';
export type PatternLevel = '필수 (Do)' | '권장 (Better)' | '우수 (Best)';
export type PatternStage = {
    id: string;
    title: string;
    href: string;
};
export type Pattern = {
    id: string;
    slug: string;
    category: PatternCategory;
    title: string;
    description: string;
    officialOverview: string;
    officialExample: string;
    officialChecklist: string;
    officialStageLinks: PatternStage[];
    officialLevels?: PatternLevel[];
    officialVersionBoundary: string;
    sourceNote: string;
};
export declare const servicePatterns: Pattern[];
export declare const basicPatterns: Pattern[];
export declare const allPatterns: Pattern[];
export declare function findPattern(id: string): Pattern;
//# sourceMappingURL=patterns.d.ts.map