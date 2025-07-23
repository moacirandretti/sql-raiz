import { SupportedLanguage, GrammarDefinition, GrammarPattern } from './types';
import { IConfigurationService } from './configurationService';

/**
 * Interface for grammar generation following Interface Segregation Principle
 */
export interface IGrammarGenerator {
  generateGrammar(language: SupportedLanguage): GrammarDefinition;
}

/**
 * Abstract base class for grammar generators
 * Follows Open/Closed Principle - open for extension, closed for modification
 */
export abstract class BaseGrammarGenerator implements IGrammarGenerator {
  constructor(protected configService: IConfigurationService) {}

  abstract generateGrammar(language: SupportedLanguage): GrammarDefinition;

  protected createSQLPattern(commentPattern: string, stringDelimiter: string, endDelimiter?: string): GrammarPattern {
    const actualEndDelimiter = endDelimiter || stringDelimiter;
    
    return {
      name: "source.sql.embedded",
      begin: `(${this.escapeRegex(commentPattern)}\\s*)${stringDelimiter}`,
      beginCaptures: {
        "1": { "name": "comment.block.documentation.sqlraiz" }
      },
      end: actualEndDelimiter,
      contentName: "source.sql",
      patterns: [
        {
          "include": "source.sql"
        }
      ]
    };
  }

  protected escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

/**
 * JavaScript/TypeScript grammar generator
 */
export class JavaScriptGrammarGenerator extends BaseGrammarGenerator {
  generateGrammar(language: SupportedLanguage): GrammarDefinition {
    const commentTrigger = this.configService.getCommentTrigger(language);
    const scopeName = `sqlraiz.embedded.sql.${language}`;
    const sourceScope = language === 'typescript' ? 'source.ts' : 'source.js';

    return {
      scopeName,
      injectionSelector: `L:${sourceScope}`,
      patterns: [
        this.createSQLPattern(commentTrigger, '`', '`')
      ]
    };
  }
}

/**
 * Python grammar generator
 */
export class PythonGrammarGenerator extends BaseGrammarGenerator {
  generateGrammar(language: SupportedLanguage): GrammarDefinition {
    const commentTrigger = this.configService.getCommentTrigger(language);
    
    return {
      scopeName: `sqlraiz.embedded.sql.${language}`,
      injectionSelector: 'L:source.python',
      patterns: [
        // f-strings with single quotes
        this.createSQLPattern(commentTrigger, "f'", "'"),
        // f-strings with double quotes
        this.createSQLPattern(commentTrigger, 'f"', '"'),
        // Triple quoted strings
        this.createSQLPattern(commentTrigger, '"""', '"""'),
        this.createSQLPattern(commentTrigger, "'''", "'''"),
        // Regular strings
        this.createSQLPattern(commentTrigger, '"', '"'),
        this.createSQLPattern(commentTrigger, "'", "'")
      ]
    };
  }
}

/**
 * Go grammar generator
 */
export class GoGrammarGenerator extends BaseGrammarGenerator {
  generateGrammar(language: SupportedLanguage): GrammarDefinition {
    const commentTrigger = this.configService.getCommentTrigger(language);
    
    return {
      scopeName: `sqlraiz.embedded.sql.${language}`,
      injectionSelector: 'L:source.go',
      patterns: [
        // Raw strings (backticks)
        this.createSQLPattern(commentTrigger, '`', '`'),
        // Regular strings
        this.createSQLPattern(commentTrigger, '"', '"')
      ]
    };
  }
}

/**
 * Factory for creating grammar generators
 * Follows Factory Pattern and Dependency Inversion Principle
 */
export class GrammarGeneratorFactory {
  constructor(private configService: IConfigurationService) {}

  createGenerator(language: SupportedLanguage): IGrammarGenerator {
    switch (language) {
      case 'typescript':
      case 'javascript':
        return new JavaScriptGrammarGenerator(this.configService);
      case 'python':
        return new PythonGrammarGenerator(this.configService);
      case 'go':
        return new GoGrammarGenerator(this.configService);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}