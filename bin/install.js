#!/usr/bin/env node
/**
 * Instala skills deste pacote em .cursor/skills/ (projeto) ou ~/.cursor/skills/ (global).
 *
 * Uso:
 *   npx @insanemor/skill
 *   npx @insanemor/skill -s processo-agil -y
 *   npx @insanemor/skill -g -y
 *   npx @insanemor/skill --list
 */
const fs = require("fs");
const os = require("os");
const path = require("path");

const PKG_ROOT = path.join(__dirname, "..");
const SKILLS_SRC = path.join(PKG_ROOT, "skills");

const HELP = `
insanemor-skills — instala Cursor Agent Skills de @insanemor/skill

Uso:
  npx @insanemor/skill [opções]

Opções:
  -s, --skill <nome>   Skill específica (repita para várias). Omita para instalar todas.
  -g, --global         Instala em ~/.cursor/skills/ (todos os projetos)
  -l, --list           Lista skills disponíveis neste pacote
  -y, --yes            Sem confirmação
  -h, --help           Mostra esta ajuda

Alternativa (ecossistema aberto):
  npx skills add insanemor/skill -a cursor -y
  npx skills add insanemor/skill --list
`.trim();

function parseArgs(argv) {
  const opts = {
    global: false,
    list: false,
    yes: false,
    help: false,
    skills: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      opts.help = true;
    } else if (arg === "-g" || arg === "--global") {
      opts.global = true;
    } else if (arg === "-l" || arg === "--list") {
      opts.list = true;
    } else if (arg === "-y" || arg === "--yes") {
      opts.yes = true;
    } else if (arg === "-s" || arg === "--skill") {
      const next = argv[++i];
      if (!next || next.startsWith("-")) {
        console.error("Erro: -s/--skill requer um nome.");
        process.exit(1);
      }
      opts.skills.push(next);
    } else if (!arg.startsWith("-")) {
      opts.skills.push(arg);
    }
  }

  return opts;
}

function listAvailableSkills() {
  if (!fs.existsSync(SKILLS_SRC)) {
    console.error("Pasta skills/ não encontrada no pacote:", SKILLS_SRC);
    process.exit(1);
  }
  return fs
    .readdirSync(SKILLS_SRC, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(SKILLS_SRC, e.name, "SKILL.md")))
    .map((e) => e.name)
    .sort();
}

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installSkill(name, destRoot) {
  const src = path.join(SKILLS_SRC, name);
  const dest = path.join(destRoot, name);

  if (!fs.existsSync(path.join(src, "SKILL.md"))) {
    console.error(`Skill não encontrada: ${name}`);
    process.exit(1);
  }

  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  copyRecursive(src, dest);
  return dest;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(HELP);
    return;
  }

  const available = listAvailableSkills();

  if (opts.list) {
    console.log("Skills disponíveis:");
    for (const name of available) {
      console.log(`  - ${name}`);
    }
    return;
  }

  const selected =
    opts.skills.length > 0
      ? opts.skills.filter((s) => s !== "*")
      : available;

  for (const name of selected) {
    if (!available.includes(name)) {
      console.error(`Skill desconhecida: ${name}`);
      console.error(`Disponíveis: ${available.join(", ")}`);
      process.exit(1);
    }
  }

  const destRoot = opts.global
    ? path.join(os.homedir(), ".cursor", "skills")
    : path.join(process.cwd(), ".cursor", "skills");

  const scope = opts.global ? "global (~/.cursor/skills/)" : "projeto (.cursor/skills/)";

  if (!opts.yes) {
    console.log(`Instalar ${selected.join(", ")} em ${scope}?`);
    console.log("Destino:", destRoot);
    console.log("Use -y para pular esta mensagem.");
  }

  fs.mkdirSync(destRoot, { recursive: true });

  for (const name of selected) {
    const dest = installSkill(name, destRoot);
    console.log(`✓ ${name} → ${dest}`);
  }

  console.log("\nReabra o Cursor ou recarregue a janela para detectar as skills.");
}

main();
