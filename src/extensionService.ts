import { ExtensionContext, workspace } from 'vscode';
import { SupportedLanguage } from './types';
import { IConfigurationService } from './configurationService';
import { GrammarGeneratorFactory } from './grammarGenerator';
import { GrammarFileService, IFileService } from './fileService';

/**
 * Main extension service following Single Responsibility Principle
 * Orchestrates the entire SQL highlighting functionality
 */
export class SQLRaizExtensionService {
  private readonly supportedLanguages: SupportedLanguage[] = ['typescript', 'javascript', 'python', 'go'];

  constructor(
    private configService: IConfigurationService,
    private fileService: IFileService,
    private context: ExtensionContext
  ) {}

  async initialize(): Promise<void> {
    if (!this.configService.isGloballyEnabled()) {
      return;
    }

    await this.generateGrammarFiles();
    this.setupConfigurationWatcher();
  }

  private async generateGrammarFiles(): Promise<void> {
    const enabledLanguages = this.supportedLanguages.filter(
      lang => this.configService.isLanguageEnabled(lang)
    );

    if (enabledLanguages.length === 0) {
      return;
    }

    const grammarGeneratorFactory = new GrammarGeneratorFactory(this.configService);
    const grammarFileService = new GrammarFileService(this.fileService, grammarGeneratorFactory);
    
    await grammarFileService.generateGrammarFiles(enabledLanguages, this.context.extensionPath);
  }

  private setupConfigurationWatcher(): void {
    const disposable = workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration('sqlraiz')) {
        await this.regenerateGrammarFiles();
      }
    });

    this.context.subscriptions.push(disposable);
  }

  private async regenerateGrammarFiles(): Promise<void> {
    // Regenerate grammar files when configuration changes
    await this.generateGrammarFiles();
  }

  dispose(): void {
    // Clean up resources if needed
  }
}