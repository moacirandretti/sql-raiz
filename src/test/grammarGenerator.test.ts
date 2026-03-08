import { 
  JavaScriptGrammarGenerator, 
  PythonGrammarGenerator, 
  GoGrammarGenerator,
  GrammarGeneratorFactory 
} from '../grammarGenerator';
import { ConfigurationService } from '../configurationService';

// Mock configuration service
class MockConfigurationService {
  getCommentTrigger(language: string): string {
    const triggers: { [key: string]: string } = {
      typescript: '/* sql */',
      javascript: '/* sql */',
      python: '# sql',
      go: '/* sql */'
    };
    return triggers[language] || '/* sql */';
  }

  isLanguageEnabled(): boolean {
    return true;
  }

  isGloballyEnabled(): boolean {
    return true;
  }

  getConfig() {
    return {
      enabled: true,
      languages: {
        typescript: true,
        javascript: true,
        python: true,
        go: true
      },
      commentTriggers: {
        typescript: '/* sql */',
        javascript: '/* sql */',
        python: '# sql',
        go: '/* sql */'
      }
    };
  }
}

describe('Grammar Generator Test Suite', () => {
  let mockConfigService: MockConfigurationService;

  beforeEach(() => {
    mockConfigService = new MockConfigurationService();
  });

  it('JavaScript Grammar Generator should create correct grammar', () => {
    const generator = new JavaScriptGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('javascript');

    expect(grammar.scopeName).toBe('sqlraiz.embedded.sql.javascript');
    expect(grammar.injectionSelector).toBe('L:source.js');
    expect(grammar.patterns.length).toBe(1);
    expect(grammar.patterns[0].name).toBe('source.sql.embedded');
    expect(grammar.patterns[0].contentName).toBe('source.sql');
  });

  it('TypeScript Grammar Generator should create correct grammar', () => {
    const generator = new JavaScriptGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('typescript');

    expect(grammar.scopeName).toBe('sqlraiz.embedded.sql.typescript');
    expect(grammar.injectionSelector).toBe('L:source.ts');
    expect(grammar.patterns.length).toBe(1);
  });

  it('Python Grammar Generator should create correct grammar', () => {
    const generator = new PythonGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('python');

    expect(grammar.scopeName).toBe('sqlraiz.embedded.sql.python');
    expect(grammar.injectionSelector).toBe('L:source.python');
    expect(grammar.patterns.length).toBe(6); // f-strings, triple quotes, regular strings
    
    // Test that all pattern types are included
    const patterns = grammar.patterns;
    expect(patterns.some(p => p.begin.includes("f'"))).toBe(true);
    expect(patterns.some(p => p.begin.includes('f"'))).toBe(true);
    expect(patterns.some(p => p.begin.includes('"""'))).toBe(true);
    expect(patterns.some(p => p.begin.includes("'''"))).toBe(true);
  });

  it('Go Grammar Generator should create correct grammar', () => {
    const generator = new GoGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('go');

    expect(grammar.scopeName).toBe('sqlraiz.embedded.sql.go');
    expect(grammar.injectionSelector).toBe('L:source.go');
    expect(grammar.patterns.length).toBe(2); // Raw strings and regular strings
  });

  it('Grammar Generator Factory should create correct generators', () => {
    const factory = new GrammarGeneratorFactory(mockConfigService as any);

    const jsGenerator = factory.createGenerator('javascript');
    expect(jsGenerator).toBeInstanceOf(JavaScriptGrammarGenerator);

    const tsGenerator = factory.createGenerator('typescript');
    expect(tsGenerator).toBeInstanceOf(JavaScriptGrammarGenerator);

    const pyGenerator = factory.createGenerator('python');
    expect(pyGenerator).toBeInstanceOf(PythonGrammarGenerator);

    const goGenerator = factory.createGenerator('go');
    expect(goGenerator).toBeInstanceOf(GoGrammarGenerator);
  });

  it('Grammar Generator Factory should throw error for unsupported language', () => {
    const factory = new GrammarGeneratorFactory(mockConfigService as any);

    expect(() => {
      factory.createGenerator('unsupported' as any);
    }).toThrow(/Unsupported language/);
  });
});