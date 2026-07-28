export interface ConformanceServer {
  baseUrl: string;
  setRuntimeDocument: (html: string) => void;
  close: () => Promise<void>;
}

export declare const createConformanceServer: (
  repositoryRoot: string,
) => Promise<ConformanceServer>;
