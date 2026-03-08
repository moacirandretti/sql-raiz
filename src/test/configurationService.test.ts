import { ConfigurationService } from '../configurationService';
import { workspace, WorkspaceConfiguration } from 'vscode';

// Mock vscode workspace
const mockWorkspaceConfiguration = {
  get: (key: string, defaultValue?: any) => {
    switch (key) {
      case 'enabled':
        return true;
      case 'languages':
        return {
          typescript: true,
          javascript: true,
          python: true,
          go: true
        };
      case 'commentTriggers':
        return {
          typescript: '/* sql */',
          javascript: '/* sql */',
          python: '# sql',
          go: '/* sql */'
        };
      default:
        return defaultValue;
    }
  }
} as WorkspaceConfiguration;

describe('ConfigurationService Test Suite', () => {
  let configService: ConfigurationService;

  beforeEach(() => {
    // Mock workspace.getConfiguration before creating the service
    (workspace.getConfiguration as jest.Mock).mockReturnValue(mockWorkspaceConfiguration);
    configService = new ConfigurationService();
  });

  afterEach(() => {
    // Clear mocks after each test
    jest.clearAllMocks();
  });

  it('Should get configuration correctly', () => {
    const config = configService.getConfig();
    
    expect(config.enabled).toBe(true);
    expect(config.languages.typescript).toBe(true);
    expect(config.languages.javascript).toBe(true);
    expect(config.languages.python).toBe(true);
    expect(config.languages.go).toBe(true);
    expect(config.commentTriggers.typescript).toBe('/* sql */');
    expect(config.commentTriggers.python).toBe('# sql');
  });

  it('Should check if language is enabled correctly', () => {
    expect(configService.isLanguageEnabled('typescript')).toBe(true);
    expect(configService.isLanguageEnabled('javascript')).toBe(true);
    expect(configService.isLanguageEnabled('python')).toBe(true);
    expect(configService.isLanguageEnabled('go')).toBe(true);
  });

  it('Should get comment trigger correctly', () => {
    expect(configService.getCommentTrigger('typescript')).toBe('/* sql */');
    expect(configService.getCommentTrigger('javascript')).toBe('/* sql */');
    expect(configService.getCommentTrigger('python')).toBe('# sql');
    expect(configService.getCommentTrigger('go')).toBe('/* sql */');
  });

  it('Should check if globally enabled correctly', () => {
    expect(configService.isGloballyEnabled()).toBe(true);
  });
});