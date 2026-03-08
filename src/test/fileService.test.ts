import * as path from 'path';
import * as fs from 'fs/promises';
import { FileService, GrammarFileService } from '../fileService';
import { SupportedLanguage, GrammarDefinition } from '../types';

// Mock grammar generator
class MockGrammarGenerator {
  generateGrammar(language: SupportedLanguage): GrammarDefinition {
    return {
      scopeName: `sqlraiz.embedded.sql.${language}`,
      injectionSelector: `L:source.${language}`,
      patterns: [
        {
          name: "source.sql.embedded",
          begin: "test",
          end: "test",
          contentName: "source.sql",
          patterns: [{ include: "source.sql" }]
        }
      ]
    };
  }
}

// Mock grammar generator factory
class MockGrammarGeneratorFactory {
  createGenerator(language: SupportedLanguage) {
    return new MockGrammarGenerator();
  }
}

describe('File Service Test Suite', () => {
  let fileService: FileService;
  let grammarFileService: GrammarFileService;
  let tempDir: string;

  beforeEach(async () => {
    fileService = new FileService();
    grammarFileService = new GrammarFileService(
      fileService,
      new MockGrammarGeneratorFactory() as any
    );
    
    // Create temporary directory for tests
    tempDir = path.join(__dirname, '..', '..', 'temp-test');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up temporary directory
    try {
      await fs.rm(tempDir, { recursive: true });
    } catch (error) {
      // Ignore errors during cleanup
    }
  });

  it('Should write grammar file correctly', async () => {
    const testGrammar: GrammarDefinition = {
      scopeName: 'test.scope',
      injectionSelector: 'L:source.test',
      patterns: [
        {
          name: 'test.pattern',
          begin: 'test-begin',
          end: 'test-end',
          contentName: 'source.sql',
          patterns: [{ include: 'source.sql' }]
        }
      ]
    };

    await fileService.writeGrammarFile('typescript', testGrammar, tempDir);

    // Check if file was created
    const filePath = path.join(tempDir, 'syntaxes', 'typescript.tmLanguage.json');
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);

    // Check file content
    const content = await fs.readFile(filePath, 'utf-8');
    const parsedContent = JSON.parse(content);
    expect(parsedContent.scopeName).toBe('test.scope');
    expect(parsedContent.injectionSelector).toBe('L:source.test');
  });

  it('Should ensure directory exists', async () => {
    const testDir = path.join(tempDir, 'test-dir');
    await fileService.ensureDirectoryExists(testDir);

    // Check if directory was created
    const stats = await fs.stat(testDir);
    expect(stats.isDirectory()).toBe(true);
  });

  it('Should generate multiple grammar files', async () => {
    const languages: SupportedLanguage[] = ['typescript', 'javascript', 'python'];
    
    await grammarFileService.generateGrammarFiles(languages, tempDir);

    // Check if all files were created
    for (const language of languages) {
      const filePath = path.join(tempDir, 'syntaxes', `${language}.tmLanguage.json`);
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    }
  });
});