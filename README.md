# SQLRaiz

🚀 Destaque SQL em template strings precedidas de `/* sql */` em arquivos TypeScript/JavaScript!

## Exemplo prático

```typescript
const query = /* sql */ `
  SELECT id, nome
  FROM usuarios
  WHERE ativo = true
    AND email = :email
`;
```

- Use sempre parâmetros para evitar SQL Injection 💡
- Código limpo, legível e seguro!

---

## Instalação rápida

1. Clone o projeto e instale dependências:
   ```bash
   npm install && npm run vscode:prepublish
   ```
2. Empacote:
   ```bash
   npx vsce package
   ```
3. No VSCode:
   - Ctrl+Shift+P → “Extensions: Install from VSIX...” → selecione o `.vsix` gerado.

---