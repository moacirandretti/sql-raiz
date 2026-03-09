# Scripts de Automação

## bump-version.js

Script para automatizar o versionamento semântico baseado no título do Pull Request.

### Uso

```bash
node scripts/bump-version.js "TITULO_DO_PR"
```

Ou usando variável de ambiente:

```bash
PR_TITLE="FEATURE: Nova funcionalidade" node scripts/bump-version.js
```

### Convenção de Versionamento (SemVer)

O script segue a convenção de versionamento semântico (X.Y.Z):

- **BREAKING**: Incrementa versão MAJOR (X.0.0)
  - Mudanças incompatíveis com versões anteriores
  - Exemplo: `BREAKING: Remove deprecated API`

- **FEATURE**: Incrementa versão MINOR (x.Y.0)
  - Funcionalidades adicionadas de maneira compatível
  - Exemplo: `FEATURE: Add Python support`

- **PATCH, HOTFIX ou FIX**: Incrementa versão PATCH (x.y.Z)
  - Correções de bugs sem afetar a compatibilidade
  - Exemplo: `PATCH: Fix syntax highlighting bug`
  - Exemplo: `HOTFIX: Critical security fix`
  - Exemplo: `FIX: Small correction`

### Funcionamento

1. Lê a versão atual do `package.json` e valida o formato `X.Y.Z`
2. Determina o tipo de incremento baseado no título do PR
3. Calcula a nova versão seguindo SemVer
4. Atualiza o `package.json` com a nova versão
5. Sincroniza o `package-lock.json` com `npm install --package-lock-only`
6. Cria um commit com ambos os arquivos
7. Cria uma tag git no formato `vX.Y.Z`

### Exemplo

```bash
# Versão atual: 0.0.2
node scripts/bump-version.js "FEATURE: Add GoLang support"
# Nova versão: 0.1.0
# Tag criada: v0.1.0
```

### Uso no GitHub Actions

O script é executado automaticamente pelo workflow `publish.yml` quando há um merge de PR na branch master/main.

Quando executado no GitHub Actions (`GITHUB_ACTIONS=true`), o script configura automaticamente `git user.name` e `git user.email`. Ao rodar localmente, essas configurações **não** são alteradas.
