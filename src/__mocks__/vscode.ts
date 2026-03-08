export interface WorkspaceConfiguration {
  get<T>(section: string): T | undefined;
  get<T>(section: string, defaultValue: T): T;
  has(section: string): boolean;
  inspect<T>(section: string): {
    key: string;
  } | undefined;
  update(
    section: string,
    value: any,
    configurationTarget?: boolean | any
  ): Thenable<void>;
}

export const workspace = {
  getConfiguration: jest.fn(),
  workspaceFolders: [],
  onDidChangeConfiguration: jest.fn(),
  onDidChangeWorkspaceFolders: jest.fn(),
};

export const window = {
  showInformationMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showErrorMessage: jest.fn(),
};

export const commands = {
  registerCommand: jest.fn(),
  executeCommand: jest.fn(),
};

export const Uri = {
  file: (path: string) => ({ fsPath: path }),
  parse: (path: string) => ({ fsPath: path }),
};

export const ExtensionContext = jest.fn();
