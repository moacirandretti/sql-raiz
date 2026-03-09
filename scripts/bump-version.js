#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * Script para automatizar o versionamento semântico baseado no título do PR
 * 
 * Regras SemVer:
 * - BREAKING: incrementa versão MAJOR (X.0.0)
 * - FEATURE: incrementa versão MINOR (x.Y.0)
 * - PATCH, HOTFIX ou FIX: incrementa versão PATCH (x.y.Z)
 */

function getCurrentVersion() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

function incrementVersion(currentVersion, versionType) {
  const version = parseVersion(currentVersion);
  
  switch (versionType) {
    case 'MAJOR':
      version.major += 1;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'MINOR':
      version.minor += 1;
      version.patch = 0;
      break;
    case 'PATCH':
      version.patch += 1;
      break;
    default:
      throw new Error(`Tipo de versão desconhecida: ${versionType}`);
  }
  
  return `${version.major}.${version.minor}.${version.patch}`;
}

function determineVersionType(prTitle) {
  const titleUpper = prTitle.toUpperCase();
  
  if (titleUpper.includes('BREAKING')) {
    return 'MAJOR';
  }
  
  if (titleUpper.includes('FEATURE')) {
    return 'MINOR';
  }
  
  if (titleUpper.includes('PATCH') || titleUpper.includes('HOTFIX') || titleUpper.includes('FIX')) {
    return 'PATCH';
  }
  
  // Default para PATCH se não especificado
  console.log('⚠️  Tipo de versão não identificado no título do PR, usando PATCH como padrão');
  return 'PATCH';
}

function validateSemver(version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Versão inválida: "${version}". O formato esperado é X.Y.Z (ex: 1.2.3)`);
  }
}

function updatePackageJson(newVersion) {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

function syncPackageLock() {
  const repoRoot = path.join(__dirname, '..');
  execFileSync('npm', ['install', '--package-lock-only'], { cwd: repoRoot, stdio: 'inherit' });
}

function createGitTag(version) {
  try {
    // Configura git apenas quando executado no GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      execFileSync('git', ['config', 'user.name', 'github-actions[bot]'], { stdio: 'inherit' });
      execFileSync('git', ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com'], { stdio: 'inherit' });
    }

    // Sincroniza o package-lock.json com a nova versão do package.json
    syncPackageLock();

    // Adiciona e commita as mudanças no package.json e package-lock.json
    // [skip ci] evita re-disparar o workflow de publicação
    execFileSync('git', ['add', 'package.json', 'package-lock.json'], { stdio: 'inherit' });
    execFileSync('git', ['commit', '-m', `chore: bump version to ${version} [skip ci]`], { stdio: 'inherit' });
    
    // Cria a tag usando execFileSync para evitar injeção de comandos
    execFileSync('git', ['tag', '-a', `v${version}`, '-m', `Release version ${version}`], { stdio: 'inherit' });
    
    console.log(`✅ Tag v${version} criada com sucesso`);
  } catch (error) {
    console.error('❌ Erro ao criar tag:', error.message);
    throw error;
  }
}

function main() {
  try {
    // Pega o título do PR da variável de ambiente
    const prTitle = process.env.PR_TITLE || process.argv[2];
    
    if (!prTitle) {
      console.error('❌ Título do PR não fornecido. Use: node bump-version.js "TITULO_DO_PR"');
      console.error('   Ou defina a variável de ambiente PR_TITLE');
      process.exit(1);
    }
    
    console.log('📋 Título do PR:', prTitle);
    
    const currentVersion = getCurrentVersion();
    console.log('📦 Versão atual:', currentVersion);

    // Valida o formato da versão atual antes de prosseguir
    validateSemver(currentVersion);
    
    const versionType = determineVersionType(prTitle);
    console.log('🔄 Tipo de incremento:', versionType);
    
    const newVersion = incrementVersion(currentVersion, versionType);
    console.log('🎉 Nova versão:', newVersion);
    
    updatePackageJson(newVersion);
    console.log('✅ package.json atualizado');
    
    createGitTag(newVersion);
    
    // Exporta a nova versão para uso em outros steps do workflow
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_version=${newVersion}\n`);
    }
    
    console.log('\n✨ Versionamento concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { determineVersionType, incrementVersion, parseVersion, validateSemver };
