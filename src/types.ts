export interface LanguageConfig {
  enabled: boolean;
  commentTrigger: string;
  scopeName: string;
  fileExtensions: string[];
}

export interface SQLRaizConfig {
  enabled: boolean;
  languages: {
    typescript: boolean;
    javascript: boolean;
    python: boolean;
    go: boolean;
  };
  commentTriggers: {
    typescript: string;
    javascript: string;
    python: string;
    go: string;
  };
}

export type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'go';

export interface GrammarPattern {
  name: string;
  begin: string;
  beginCaptures?: { [key: string]: { name: string } };
  end: string;
  contentName: string;
  patterns: Array<{ include: string }>;
}

export interface GrammarDefinition {
  scopeName: string;
  injectionSelector: string;
  patterns: GrammarPattern[];
}