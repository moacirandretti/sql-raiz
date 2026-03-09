# Guia de Teste da Automação

## Como Testar a Implementação

### 1. Testar o Script de Versionamento Localmente

```bash
# Teste com FEATURE (incrementa MINOR)
node scripts/bump-version.js "FEATURE: Add Rust support"
# Esperado: 0.0.2 → 0.1.0

# Desfazer mudanças
git reset --hard HEAD~1
git tag -d v0.1.0

# Teste com PATCH
node scripts/bump-version.js "PATCH: Fix bug in highlighting"
# Esperado: 0.0.2 → 0.0.3

# Desfazer mudanças
git reset --hard HEAD~1
git tag -d v0.0.3

# Teste com FIX (equivalente ao PATCH)
node scripts/bump-version.js "FIX: Small correction"
# Esperado: 0.0.2 → 0.0.3

# Desfazer mudanças
git reset --hard HEAD~1
git tag -d v0.0.3

# Teste com BREAKING
node scripts/bump-version.js "BREAKING: Remove deprecated API"
# Esperado: 0.0.2 → 1.0.0

# Desfazer mudanças
git reset --hard HEAD~1
git tag -d v1.0.0
```

**Nota:** Ao executar localmente, as configurações `user.name`/`user.email` do git **não** são alteradas. Essas configurações são aplicadas apenas quando o script roda no GitHub Actions.

### 2. Testar o Workflow de Testes

O workflow `test.yml` será executado automaticamente em qualquer push ou pull request.

Para testar manualmente:
1. Crie uma nova branch
2. Faça um commit qualquer
3. Faça push da branch
4. Verifique a aba "Actions" no GitHub
5. O workflow "Run Tests" deve aparecer e executar

### 3. Testar o Workflow de Publicação

**ATENÇÃO:** Este workflow faz mudanças reais (cria tags e releases).

O workflow `publish.yml` é disparado ao **fazer merge de um PR** na branch `master` ou `main` (não em push direto).

Para testar em ambiente de desenvolvimento:
1. Crie um fork ou repositório de teste
2. Configure o repositório no `package.json`
3. Crie um PR com título contendo palavra-chave (ex: `FEATURE: Add support`)
4. Faça o merge do PR
5. Verifique:
   - Nova tag criada
   - Release criada no GitHub
   - Arquivo .vsix anexado ao release

### 4. Verificar os Workflows no GitHub

1. Acesse: `https://github.com/moacirandretti/sql-raiz/actions`
2. Você verá dois workflows:
   - "Run Tests" - executado em todos os pushes/PRs
   - "Publish Extension" - executado apenas ao fazer merge de um PR em master/main

### 5. Configurar VSCE_PAT (Opcional)

Para publicar no VS Code Marketplace:

1. Acesse https://dev.azure.com/
2. Crie uma organização se ainda não tiver
3. Vá em User Settings → Personal Access Tokens
4. Crie novo token com:
   - Name: "VS Code Extension Publishing"
   - Organization: All accessible organizations
   - Scopes: Marketplace → Manage
5. Copie o token gerado
6. No GitHub:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `VSCE_PAT`
   - Value: [cole o token]

### 6. Exemplo Completo de Fluxo

```bash
# 1. Criar branch de feature
git checkout -b feature/add-rust-support

# 2. Fazer alterações no código
# ... suas mudanças ...

# 3. Commit e push
git add .
git commit -m "Add Rust syntax support"
git push origin feature/add-rust-support

# 4. Criar Pull Request no GitHub
# Título: "FEATURE: Add Rust language support"
# Descrição: Adiciona suporte para highlighting de SQL em Rust

# 5. Revisar e aprovar o PR

# 6. Fazer merge para master
# O workflow de publicação será acionado automaticamente

# 7. Verificar:
# - Nova versão: 0.1.0 (era 0.0.2)
# - Tag: v0.1.0
# - Release no GitHub com o .vsix
# - (Se VSCE_PAT configurado) Extensão publicada no marketplace
```

### 7. Monitorar Execução

Para ver o que está acontecendo:

```bash
# Ver tags existentes
git tag -l

# Ver último commit
git log -1

# Ver versão no package.json
cat package.json | grep '"version"'
```

### 8. Solução de Problemas

#### Workflow não executou
- Verifique se o PR foi **merged** (não apenas fechado)
- Verifique se o PR foi merged na branch `master` ou `main`
- Verifique se há erros na aba Actions
- Verifique as permissões do GITHUB_TOKEN

#### Tag já existe
```bash
# Deletar tag local
git tag -d v0.1.0

# Deletar tag remota
git push origin :refs/tags/v0.1.0
```

#### Publicação no marketplace falhou
- Verifique se VSCE_PAT está configurado
- Verifique se o token tem as permissões corretas
- Verifique se o publisher no package.json existe no marketplace

## Validação Final

Execute estes comandos para validar a implementação:

```bash
# Validar sintaxe YAML
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/test.yml'))"
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/publish.yml'))"

# Testar lógica do script
node -e "
const { determineVersionType, incrementVersion, validateSemver } = require('./scripts/bump-version.js');
console.log('FEATURE:', determineVersionType('FEATURE: test'));
console.log('PATCH:', determineVersionType('PATCH: test'));
console.log('HOTFIX:', determineVersionType('HOTFIX: test'));
console.log('FIX:', determineVersionType('FIX: test'));
console.log('BREAKING:', determineVersionType('BREAKING: test'));
console.log('0.0.2 + MINOR =', incrementVersion('0.0.2', 'MINOR'));
validateSemver('1.2.3'); // deve passar sem erro
"

# Verificar estrutura
ls -la .github/workflows/
ls -la scripts/
```

## Checklist de Implementação

- [x] Workflows criados (.github/workflows/)
- [x] Script de versionamento criado (scripts/bump-version.js)
- [x] Documentação completa (READMEs)
- [x] Permissões de segurança configuradas
- [x] Trigger trocado para pull_request merged (evita loop infinito)
- [x] Título do PR obtido de github.event.pull_request.title (confiável)
- [x] package-lock.json incluído no commit de bump
- [x] [skip ci] no commit de bump (proteção extra contra loops)
- [x] execFileSync com arrays de argumentos (previne injeção de comandos)
- [x] Validação do formato semver antes de usar
- [x] git config aplicado apenas no GitHub Actions (sem efeito colateral local)
- [x] FIX reconhecido como PATCH no script e na documentação

## Pronto para Uso! 🚀

A automação está totalmente funcional e pronta para uso em produção.
