# GitHub Actions Workflows

Este diretório contém os workflows de automação para o projeto SQLRaiz.

## Workflows

### 1. test.yml - Pipeline de Testes

**Trigger:** Push e Pull Request em qualquer branch

**Função:** Executa os testes unitários do projeto.

**Características:**
- Usa `continue-on-error: true` para permitir que falhas não bloqueiem o pipeline
- Executa em Ubuntu latest com Node.js 18
- Instala dependências e executa `npm test`

**Por que permite falhas?**
De acordo com os requisitos, a pipeline de testes deve permitir falhas para não bloquear o desenvolvimento enquanto os testes estão sendo desenvolvidos ou corrigidos.

### 2. publish.yml - Publicação Automática

**Trigger:** Merge de Pull Request nas branches `master` ou `main`

**Função:** Automatiza a publicação da extensão no VS Code Marketplace e criação de releases.

**Fluxo de trabalho:**

1. **Checkout do código** com histórico completo (branch base após merge)
2. **Instalação de dependências**
3. **Obtenção do título do PR** diretamente de `github.event.pull_request.title`
4. **Versionamento automático:**
   - Executa `scripts/bump-version.js` com o título do PR
   - Incrementa versão baseado em palavras-chave:
     - `BREAKING` → Incrementa MAJOR
     - `FEATURE` → Incrementa MINOR
     - `PATCH`, `HOTFIX` ou `FIX` → Incrementa PATCH
5. **Push das mudanças e tags** para o repositório
6. **Build da extensão** (`npm run vscode:prepublish`)
7. **Criação do pacote** (arquivo `.vsix`)
8. **Criação de GitHub Release** com:
   - Tag no formato `vX.Y.Z`
   - Arquivo `.vsix` anexado
   - Notas de release automáticas
9. **Publicação no VS Code Marketplace** (se `VSCE_PAT` estiver configurado)

## Configuração de Secrets

Para habilitar a publicação no VS Code Marketplace, configure o seguinte secret:

### VSCE_PAT (VS Code Extension Personal Access Token)

1. Acesse https://dev.azure.com/
2. Crie um Personal Access Token (PAT) com permissão `Marketplace > Manage`
3. No GitHub, vá em Settings > Secrets and variables > Actions
4. Adicione um novo secret com nome `VSCE_PAT` e o token gerado

**Nota:** O workflow funciona mesmo sem o `VSCE_PAT`, mas neste caso apenas cria a release no GitHub sem publicar no Marketplace.

## Convenção de Títulos de PR

Para que o versionamento automático funcione corretamente, use as seguintes convenções nos títulos dos Pull Requests:

### BREAKING (Major Version)
```
BREAKING: Remove suporte para Node.js 12
BREAKING: Mudança incompatível na API
```

### FEATURE (Minor Version)
```
FEATURE: Adiciona suporte para Rust
FEATURE: Nova configuração de tema
```

### PATCH/HOTFIX/FIX (Patch Version)
```
PATCH: Corrige bug no highlighting
HOTFIX: Correção crítica de segurança
FIX: Pequena correção
```

## Exemplo de Fluxo

1. Desenvolvedor cria PR com título: `FEATURE: Add Rust support`
2. PR é revisado e aprovado
3. PR é merged na branch `master`
4. Workflow `publish.yml` é disparado automaticamente:
   - Versão é incrementada de `0.0.2` para `0.1.0`
   - Tag `v0.1.0` é criada
   - Release no GitHub é criada
   - Extensão é publicada no Marketplace (se configurado)

## Testando Localmente

### Testar o script de versionamento:

```bash
# Simular um PR com FEATURE
node scripts/bump-version.js "FEATURE: Nova funcionalidade"

# Simular um PR com BREAKING
node scripts/bump-version.js "BREAKING: Mudança incompatível"

# Simular um PR com PATCH
node scripts/bump-version.js "PATCH: Correção de bug"

# Simular um PR com FIX
node scripts/bump-version.js "FIX: Pequena correção"
```

**Nota:** Ao executar localmente, o script não altera as configurações `user.name`/`user.email` do git — essas são configuradas automaticamente apenas quando o script roda no GitHub Actions.

### Validar os workflows:

Use a extensão VS Code [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) para validar a sintaxe dos workflows.

## Troubleshooting

### Workflow não está executando

- Verifique se um PR foi de fato **merged** (não apenas fechado) na branch `master` ou `main`
- Verifique se há algum erro de sintaxe nos arquivos YAML
- Verifique as permissões do `GITHUB_TOKEN`

### Publicação no Marketplace falha

- Verifique se o secret `VSCE_PAT` está configurado corretamente
- Confirme que o PAT tem as permissões necessárias
- Verifique se o `publisher` no `package.json` está correto

### Tag já existe

Se a tag já existe no repositório, o workflow falhará. Neste caso:
1. Delete a tag existente: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`
2. Re-execute o workflow

## Manutenção

### Atualizar versão do Node.js

Edite os workflows para mudar a versão do Node.js:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Mude aqui
```

### Adicionar novos steps

Adicione novos steps antes ou depois dos existentes, mantendo a ordem lógica do fluxo.
