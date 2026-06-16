#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TARGET_DIR = process.cwd();
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(color, icon, msg) {
  console.log(`${color}${icon}${RESET} ${msg}`);
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function installSkills() {
  const skillsSrc = path.join(TEMPLATES_DIR, 'skills');
  const skillsDest = path.join(TARGET_DIR, '.claude', 'skills');

  const skillDirs = fs.readdirSync(skillsSrc, { withFileTypes: true });
  for (const entry of skillDirs) {
    if (!entry.isDirectory()) continue;
    const skillName = entry.name;
    const src = path.join(skillsSrc, skillName);
    const dest = path.join(skillsDest, skillName);
    const exists = fs.existsSync(path.join(dest, 'SKILL.md'));
    // Copia a pasta inteira da skill (SKILL.md + arquivos de apoio, ex: reference.md, templates/).
    copyDir(src, dest);
    log(GREEN, exists ? '↺' : '✓', `${exists ? 'Atualizado' : 'Instalado'}: .claude/skills/${skillName}/`);
  }
}

function installClaudeMd() {
  const src = path.join(TEMPLATES_DIR, 'CLAUDE.md');
  const dest = path.join(TARGET_DIR, 'CLAUDE.md');

  if (fs.existsSync(dest)) {
    const existing = fs.readFileSync(dest, 'utf8');
    const marker = '<!-- multitech-xp -->';

    if (existing.includes(marker)) {
      log(YELLOW, '↺', 'CLAUDE.md já contém as regras XP — pulando (use --force para sobrescrever)');
      return;
    }

    const xpBlock = fs.readFileSync(src, 'utf8');
    fs.appendFileSync(dest, '\n\n' + xpBlock);
    log(GREEN, '✓', 'Regras XP adicionadas ao CLAUDE.md existente');
  } else {
    copyFile(src, dest);
    log(GREEN, '✓', 'CLAUDE.md criado com regras XP');
  }
}

function main() {
  const force = process.argv.includes('--force');

  console.log('');
  console.log(`${BOLD}${CYAN}⚡ Multitech XP Skill${RESET}`);
  console.log(`${CYAN}Instalando metodologia XP + TDD no projeto...${RESET}`);
  console.log('');

  try {
    if (force) {
      const dest = path.join(TARGET_DIR, 'CLAUDE.md');
      if (fs.existsSync(dest)) {
        const src = path.join(TEMPLATES_DIR, 'CLAUDE.md');
        copyFile(src, dest);
        log(GREEN, '✓', 'CLAUDE.md sobrescrito (--force)');
      }
    } else {
      installClaudeMd();
    }

    installSkills();

    console.log('');
    log(GREEN, '✓', `${BOLD}Pronto! Skills disponíveis no projeto:${RESET}`);
    console.log('');
    console.log(`  ${BOLD}Fundação${RESET}`);
    console.log(`  ${CYAN}/xp-init${RESET}       → Define a visão de negócio → .xp/projeto.md`);
    console.log(`  ${CYAN}/xp-arch${RESET}       → Define as camadas técnicas → .xp/arquitetura.md`);
    console.log(`  ${CYAN}/xp-front${RESET}      → Padrões de frontend (opcional) → .xp/frontend.md`);
    console.log('');
    console.log(`  ${BOLD}Planejamento${RESET}`);
    console.log(`  ${CYAN}/xp-plan${RESET}       → Planning Game: histórias por camada → .xp/xp-backlog.md`);
    console.log(`  ${CYAN}/xp-standards${RESET}  → Configura lint, commits, hooks e PR template`);
    console.log(`  ${CYAN}/xp-deploy${RESET}     → Configura build, variáveis e CI/CD`);
    console.log('');
    console.log(`  ${BOLD}Desenvolvimento${RESET}`);
    console.log(`  ${CYAN}/xp-task${RESET}       → Pega a próxima tarefa e aciona o ciclo TDD`);
    console.log(`  ${CYAN}/xp-tdd${RESET}        → Ciclo TDD: red → green → refactor`);
    console.log(`  ${CYAN}/xp-help${RESET}       → Investiga e corrige bugs com TDD`);
    console.log(`  ${CYAN}/xp-feature${RESET}    → Avalia e registra uma nova feature`);
    console.log('');
    console.log(`  ${BOLD}Decisões e contrato${RESET}`);
    console.log(`  ${CYAN}/xp-adr${RESET}        → Registra decisão arquitetural → .xp/decisions/`);
    console.log(`  ${CYAN}/xp-ctr${RESET}        → Gerencia regras do projeto → .xp/contract.md`);
    console.log('');
    console.log(`  ${BOLD}Qualidade e entrega${RESET}`);
    console.log(`  ${CYAN}/xp-quality${RESET}    → Audita 7 pilares de qualidade`);
    console.log(`  ${CYAN}/xp-test${RESET}       → Testes dinâmicos: smoke, e2e, performance, security`);
    console.log(`  ${CYAN}/xp-docs${RESET}       → Cria ou atualiza documentação do projeto`);
    console.log('');
    console.log(`${YELLOW}Fluxo sugerido para projeto novo:${RESET}`);
    console.log(`  ${CYAN}/xp-init${RESET} → ${CYAN}/xp-arch${RESET} → ${CYAN}/xp-adr${RESET} → ${CYAN}/xp-plan${RESET} → ${CYAN}/xp-task${RESET}`);
    console.log('');
  } catch (err) {
    log(RED, '✗', `Erro durante instalação: ${err.message}`);
    process.exit(1);
  }
}

main();
