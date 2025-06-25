# SQLRaiz

🚀 **SQLRaiz** highlights SQL inside template strings preceded by `/* sql */` in TypeScript and JavaScript files!

## How it works

- Place a `/* sql */` comment right before a template string, and SQL syntax highlighting will be activated inside the string.
- Works with any VSCode theme! 🎨

---

## Example

```typescript
const query = /* sql */ `
  SELECT id, name
  FROM users
  WHERE active = true
    AND email = :email
`;
```

---

## Best Practices 💡

- Always use parameters to prevent SQL Injection.
- Keep your queries clean, readable, and well-organized.
- Comment complex queries for better maintainability.
- Use SOLID and Clean Code principles in your codebase.

---

## Installation

1. Clone this repository and install dependencies:

   ```bash
   npm install && npm run vscode:prepublish
   ```

2. Package the extension:

   ```bash
   npx vsce package
   ```

3. In VSCode:
   - Press `Ctrl+Shift+P`
   - Select “Extensions: Install from VSIX...”
   - Choose the generated `.vsix` file.

---

## Uninstall

- Go to your Extensions panel in VSCode
- Search for “SQLRaiz”
- Click Uninstall

---

## License

MIT

---
