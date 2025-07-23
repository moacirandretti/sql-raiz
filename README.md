# SQLRaiz 🌵

🚀 **SQLRaiz** highlights SQL inside template strings with support for **TypeScript**, **JavaScript**, **Python**, and **GoLang**!

## Features ✨

- **Multi-language support**: TypeScript, JavaScript, Python, and GoLang
- **Customizable triggers**: Configure the comment that activates highlighting for each language
- **Flexible configuration**: Enable/disable highlighting globally or per language
- **Dynamic grammar generation**: Automatically generates appropriate syntax patterns
- **Works with any VSCode theme** 🎨

## How it works

Place a trigger comment right before a string, and SQL syntax highlighting will be activated inside the string.

### Default triggers by language:

- **TypeScript/JavaScript**: `/* sql */`
- **Python**: `# sql`
- **GoLang**: `/* sql */`

## Examples

### TypeScript/JavaScript
```typescript
const query = /* sql */ `
  SELECT id, name, email
  FROM users
  WHERE active = true
    AND created_at > :since
`;
```

### Python
```python
# sql
query = """
  SELECT id, name, email
  FROM users
  WHERE active = %s
    AND created_at > %s
"""

# Also works with f-strings
# sql
query = f"""
  SELECT * FROM users 
  WHERE name = '{user_name}'
"""
```

### GoLang
```go
query := /* sql */ `
  SELECT id, name, email
  FROM users
  WHERE active = $1
    AND created_at > $2
`
```

## Configuration

You can customize SQLRaiz behavior through VSCode settings:

### Global Settings

```json
{
  "sqlraiz.enabled": true,
  "sqlraiz.languages": {
    "typescript": true,
    "javascript": true,
    "python": true,
    "go": true
  },
  "sqlraiz.commentTriggers": {
    "typescript": "/* sql */",
    "javascript": "/* sql */",
    "python": "# sql",
    "go": "/* sql */"
  }
}
```

### Configuration Options

- **`sqlraiz.enabled`**: Enable/disable SQL highlighting globally
- **`sqlraiz.languages`**: Enable/disable highlighting for specific languages
- **`sqlraiz.commentTriggers`**: Customize the trigger comment for each language

## Installation

### From VSIX (Recommended)

1. Clone this repository and install dependencies:
   ```bash
   npm install && npm run compile
   ```

2. Package the extension:
   ```bash
   npx vsce package
   ```

3. In VSCode:
   - Press `Ctrl+Shift+P`
   - Select "Extensions: Install from VSIX..."
   - Choose the generated `.vsix` file

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/moacirandretti/sql-raiz.git
   cd sql-raiz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile TypeScript:
   ```bash
   npm run compile
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Architecture

SQLRaiz follows SOLID principles with a clean, modular architecture:

- **Single Responsibility**: Each service handles one specific concern
- **Open/Closed**: Easy to extend for new languages without modifying existing code
- **Liskov Substitution**: Grammar generators can be substituted transparently
- **Interface Segregation**: Clean, focused interfaces for each component
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### Key Components

- **ConfigurationService**: Manages VSCode settings and configuration
- **GrammarGenerator**: Creates TextMate grammar patterns for each language
- **FileService**: Handles file operations and grammar file generation
- **ExtensionService**: Orchestrates the entire extension lifecycle

## Language Support

| Language   | String Types | Comment Style | Status |
|------------|-------------|---------------|---------|
| TypeScript | Template literals (`` ` ``) | `/* sql */` | ✅ |
| JavaScript | Template literals (`` ` ``) | `/* sql */` | ✅ |
| Python     | All string types (`"`, `'`, `"""`, `'''`, f-strings) | `# sql` | ✅ |
| GoLang     | Raw strings (`` ` ``), regular strings (`"`) | `/* sql */` | ✅ |

## Best Practices 💡

- **Security**: Always use parameterized queries to prevent SQL injection
- **Readability**: Keep queries clean, well-formatted, and documented
- **Performance**: Consider query optimization and indexing
- **Maintainability**: Use meaningful variable names and comments
- **Testing**: Write tests for your SQL queries and database interactions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following SOLID principles
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## Changelog

### v0.0.2
- ✨ Added support for Python and GoLang
- ⚙️ Added configurable settings for languages and triggers
- 🏗️ Refactored architecture following SOLID principles
- 🧪 Added comprehensive unit tests
- 📝 Enhanced documentation

### v0.0.1
- 🎉 Initial release with TypeScript/JavaScript support

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Uninstall

- Go to your Extensions panel in VSCode
- Search for "SQLRaiz"  
- Click Uninstall

---

Made with ❤️ for developers who love clean SQL code!