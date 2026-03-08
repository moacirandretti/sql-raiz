import * as assert from 'assert';
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

suite('Grammar Generator Test Suite', () => {
  let mockConfigService: MockConfigurationService;

  setup(() => {
    mockConfigService = new MockConfigurationService();
  });

  test('JavaScript Grammar Generator should create correct grammar', () => {
    const generator = new JavaScriptGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('javascript');

    assert.strictEqual(grammar.scopeName, 'sqlraiz.embedded.sql.javascript');
    assert.strictEqual(grammar.injectionSelector, 'L:source.js');
    assert.strictEqual(grammar.patterns.length, 1);
    assert.strictEqual(grammar.patterns[0].name, 'source.sql.embedded');
    assert.strictEqual(grammar.patterns[0].contentName, 'source.sql');
  });

  test('TypeScript Grammar Generator should create correct grammar', () => {
    const generator = new JavaScriptGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('typescript');

    assert.strictEqual(grammar.scopeName, 'sqlraiz.embedded.sql.typescript');
    assert.strictEqual(grammar.injectionSelector, 'L:source.ts');
    assert.strictEqual(grammar.patterns.length, 1);
  });

  test('Python Grammar Generator should create correct grammar', () => {
    const generator = new PythonGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('python');

    assert.strictEqual(grammar.scopeName, 'sqlraiz.embedded.sql.python');
    assert.strictEqual(grammar.injectionSelector, 'L:source.python');
    assert.strictEqual(grammar.patterns.length, 6); // f-strings, triple quotes, regular strings
    
    // Test that all pattern types are included
    const patterns = grammar.patterns;
    assert.ok(patterns.some(p => p.begin.includes("f'")));
    assert.ok(patterns.some(p => p.begin.includes('f"')));
    assert.ok(patterns.some(p => p.begin.includes('"""')));
    assert.ok(patterns.some(p => p.begin.includes("'''")));
  });

  test('Go Grammar Generator should create correct grammar', () => {
    const generator = new GoGrammarGenerator(mockConfigService as any);
    const grammar = generator.generateGrammar('go');

    assert.strictEqual(grammar.scopeName, 'sqlraiz.embedded.sql.go');
    assert.strictEqual(grammar.injectionSelector, 'L:source.go');
    assert.strictEqual(grammar.patterns.length, 2); // Raw strings and regular strings
  });

  test('Grammar Generator Factory should create correct generators', () => {
    const factory = new GrammarGeneratorFactory(mockConfigService as any);

    const jsGenerator = factory.createGenerator('javascript');
    assert.ok(jsGenerator instanceof JavaScriptGrammarGenerator);

    const tsGenerator = factory.createGenerator('typescript');
    assert.ok(tsGenerator instanceof JavaScriptGrammarGenerator);

    const pyGenerator = factory.createGenerator('python');
    assert.ok(pyGenerator instanceof PythonGrammarGenerator);

    const goGenerator = factory.createGenerator('go');
    assert.ok(goGenerator instanceof GoGrammarGenerator);
  });

  test('Grammar Generator Factory should throw error for unsupported language', () => {
    const factory = new GrammarGeneratorFactory(mockConfigService as any);

    assert.throws(() => {
      factory.createGenerator('unsupported' as any);
    }, /Unsupported language/);
  });
});