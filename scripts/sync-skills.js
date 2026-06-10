#!/usr/bin/env node
/**
 * Copia .cursor/skills/ → skills/ para distribuição (npx skills add / npm pack).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, ".cursor", "skills");
const dest = path.join(root, "skills");

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

if (!fs.existsSync(src)) {
  console.error("Origem não encontrada:", src);
  process.exit(1);
}

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

copyRecursive(src, dest);
const names = fs.readdirSync(dest);
console.log(`skills/ sincronizado (${names.length}): ${names.join(", ")}`);
