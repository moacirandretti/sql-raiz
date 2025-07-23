import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { SupportedLanguage, GrammarDefinition } from './types';
import { IGrammarGenerator } from './grammarGenerator';

/**
 * Interface for file operations following Single Responsibility Principle
 */
export interface IFileService {
  writeGrammarFile(language: SupportedLanguage, grammar: GrammarDefinition, extensionPath: string): Promise<void>;
  ensureDirectoryExists(path: string): Promise<void>;
}

/**
 * File service implementation
 * Follows Single Responsibility Principle - only handles file operations
 */
export class FileService implements IFileService {
  async writeGrammarFile(language: SupportedLanguage, grammar: GrammarDefinition, extensionPath: string): Promise<void> {
    const syntaxesDir = join(extensionPath, 'syntaxes');
    await this.ensureDirectoryExists(syntaxesDir);
    
    const fileName = `${language}.tmLanguage.json`;
    const filePath = join(syntaxesDir, fileName);
    
    const content = JSON.stringify(grammar, null, 2);
    await writeFile(filePath, content, 'utf-8');
  }

  async ensureDirectoryExists(path: string): Promise<void> {
    try {
      await mkdir(path, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }
}

/**
 * Service for managing grammar files
 * Follows Single Responsibility Principle and Dependency Inversion Principle
 */
export class GrammarFileService {
  constructor(
    private fileService: IFileService,
    private grammarGeneratorFactory: { createGenerator(language: SupportedLanguage): IGrammarGenerator }
  ) {}

  async generateGrammarFiles(languages: SupportedLanguage[], extensionPath: string): Promise<void> {
    const promises = languages.map(async (language) => {
      const generator = this.grammarGeneratorFactory.createGenerator(language);
      const grammar = generator.generateGrammar(language);
      await this.fileService.writeGrammarFile(language, grammar, extensionPath);
    });

    await Promise.all(promises);
  }
}