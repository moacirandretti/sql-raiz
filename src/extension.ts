import { ExtensionContext } from 'vscode';
import { ConfigurationService } from './configurationService';
import { FileService } from './fileService';
import { SQLRaizExtensionService } from './extensionService';

let extensionService: SQLRaizExtensionService;

/**
 * Extension activation function
 * Sets up the dependency injection and initializes the extension
 */
export async function activate(context: ExtensionContext): Promise<void> {
  try {
    // Dependency injection setup following Dependency Inversion Principle
    const configurationService = new ConfigurationService();
    const fileService = new FileService();
    
    extensionService = new SQLRaizExtensionService(
      configurationService,
      fileService,
      context
    );

    await extensionService.initialize();
    
    console.log('SQLRaiz extension activated successfully');
  } catch (error) {
    console.error('Failed to activate SQLRaiz extension:', error);
    throw error;
  }
}

/**
 * Extension deactivation function
 */
export function deactivate(): void {
  if (extensionService) {
    extensionService.dispose();
  }
  console.log('SQLRaiz extension deactivated');
}