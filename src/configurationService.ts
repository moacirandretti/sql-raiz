import { workspace, WorkspaceConfiguration } from 'vscode';
import { SQLRaizConfig, SupportedLanguage } from './types';

/**
 * Interface for configuration management following Single Responsibility Principle
 */
export interface IConfigurationService {
  getConfig(): SQLRaizConfig;
  isLanguageEnabled(language: SupportedLanguage): boolean;
  getCommentTrigger(language: SupportedLanguage): string;
  isGloballyEnabled(): boolean;
}

/**
 * Configuration service implementation
 * Follows Single Responsibility Principle - only handles configuration
 */
export class ConfigurationService implements IConfigurationService {
  private readonly configSection = 'sqlraiz';

  getConfig(): SQLRaizConfig {
    const config: WorkspaceConfiguration = workspace.getConfiguration(this.configSection);
    
    return {
      enabled: config.get('enabled', true),
      languages: config.get('languages', {
        typescript: true,
        javascript: true,
        python: true,
        go: true
      }),
      commentTriggers: config.get('commentTriggers', {
        typescript: '/* sql */',
        javascript: '/* sql */',
        python: '# sql',
        go: '/* sql */'
      })
    };
  }

  isLanguageEnabled(language: SupportedLanguage): boolean {
    const config = this.getConfig();
    return config.enabled && config.languages[language];
  }

  getCommentTrigger(language: SupportedLanguage): string {
    const config = this.getConfig();
    return config.commentTriggers[language];
  }

  isGloballyEnabled(): boolean {
    const config = this.getConfig();
    return config.enabled;
  }
}