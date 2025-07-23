import * as assert from 'assert';
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

// Mock workspace.getConfiguration
const originalGetConfiguration = workspace.getConfiguration;
workspace.getConfiguration = () => mockWorkspaceConfiguration;

suite('ConfigurationService Test Suite', () => {
  let configService: ConfigurationService;

  setup(() => {
    configService = new ConfigurationService();
  });

  teardown(() => {
    // Restore original function
    workspace.getConfiguration = originalGetConfiguration;
  });

  test('Should get configuration correctly', () => {
    const config = configService.getConfig();
    
    assert.strictEqual(config.enabled, true);
    assert.strictEqual(config.languages.typescript, true);
    assert.strictEqual(config.languages.javascript, true);
    assert.strictEqual(config.languages.python, true);
    assert.strictEqual(config.languages.go, true);
    assert.strictEqual(config.commentTriggers.typescript, '/* sql */');
    assert.strictEqual(config.commentTriggers.python, '# sql');
  });

  test('Should check if language is enabled correctly', () => {
    assert.strictEqual(configService.isLanguageEnabled('typescript'), true);
    assert.strictEqual(configService.isLanguageEnabled('javascript'), true);
    assert.strictEqual(configService.isLanguageEnabled('python'), true);
    assert.strictEqual(configService.isLanguageEnabled('go'), true);
  });

  test('Should get comment trigger correctly', () => {
    assert.strictEqual(configService.getCommentTrigger('typescript'), '/* sql */');
    assert.strictEqual(configService.getCommentTrigger('javascript'), '/* sql */');
    assert.strictEqual(configService.getCommentTrigger('python'), '# sql');
    assert.strictEqual(configService.getCommentTrigger('go'), '/* sql */');
  });

  test('Should check if globally enabled correctly', () => {
    assert.strictEqual(configService.isGloballyEnabled(), true);
  });
});