# Skills

Repositório pessoal de **Cursor Agent Skills** — instruções especializadas que ensinam o agente a executar fluxos via chat.

Cada skill fica em `.cursor/skills/<nome-da-skill>/` com um `SKILL.md` e arquivos de apoio (templates, referência, scripts).

## Instalação via Node

Requer **Node.js 18+** no PATH.

### Opção 1 — CLI deste pacote (recomendado)

```bash
# Direto do GitHub (funciona antes de publicar no npm)
npx github:insanemor/skill --list
npx github:insanemor/skill -y

# Depois de publicar no npm (@insanemor/skill)
npx @insanemor/skill --list

# Instalar todas no projeto atual (.cursor/skills/)
npx @insanemor/skill -y

# Instalar uma skill específica
npx @insanemor/skill -s processo-agil -y
npx @insanemor/skill -s sem-gambiarra -y

# Instalar globalmente (qualquer projeto: ~/.cursor/skills/)
npx @insanemor/skill -g -y
```

> Após instalar, reabra o Cursor ou recarregue a janela. As skills aparecem em **Settings → Rules → Agent Decides**.

### Opção 2 — Ecossistema aberto (`skills` CLI)

```bash
# Listar skills no repositório GitHub
npx skills add insanemor/skill --list

# Instalar no Cursor (projeto atual)
npx skills add insanemor/skill --skill processo-agil -a cursor -y
npx skills add insanemor/skill --skill sem-gambiarra -a cursor -y

# Instalar todas
npx skills add insanemor/skill --skill '*' -a cursor -y

# Global
npx skills add insanemor/skill --skill '*' -a cursor -g -y
```

### Opção 3 — Manual

Clone o repositório e copie `.cursor/skills/<nome>/` para `.cursor/skills/` do seu projeto.

---

## Como usar

1. Instale as skills (comandos acima) **ou** abra este repositório no Cursor.
2. No chat, use os comandos (tags) da skill — o agente detecta pelo contexto ou você pode citar explicitamente: *"use a skill processo-agil"* ou *"use a skill sem-gambiarra"*.

---

## Skills

### `processo-agil` — Backlog ágil em arquivos

Simula um processo ágil criando épicos, features, stories, tasks, bugs e investigações como arquivos Markdown em `Epicos/`, com versionamento (`V1`, `V2`…), tabela de status no épico e fluxos de implementação e troubleshooting.

**Caminho:** `.cursor/skills/processo-agil/`

**Comandos (tags):**

`#criar-epico` `#criar-epic` `#criar-feat` `#criar-feature` `#criar-story` `#criar-historia` `#criar-task` `#criar-tarefa` `#criar-bug` `#criar-fix` `#fechar` `#concluir` `#finalizar` `#mover-para-progresso` `#iniciar` `#cancelar` `#implementar` `#codar` `#investigar` `#troubleshooting` `#analisar` `#continuar-inv` `#resolver-investigacao` `#backlog-agil`

| Tag | Ação resumida |
|-----|----------------|
| `#criar-epico` | Cria épico em `Epicos/V{n}/E{NN}-{slug}/` |
| `#criar-feat` | Cria feature em `FEAT/FEAT{NN}-{slug}.md` |
| `#criar-story` | Cria story em `STORY/S{NN}-{slug}.md` |
| `#criar-task` | Cria task em `TASK/T{NN}-{slug}.md` |
| `#criar-bug` | Cria bug em `BUG/F{NN}-{slug}.md` |
| `#fechar` | Move card para `concluido` (avisa se houver filhos abertos) |
| `#mover-para-progresso` | Move card para `em-progresso` |
| `#cancelar` | Move card para `cancelado` |
| `#implementar` | Atualiza status, codifica no projeto e fecha cards em ordem |
| `#investigar` | Cria/atualiza `TROUBLESHOOTING/INV{NN}-{slug}.md` — **sem alterar código** |
| `#resolver-investigacao` | Implementa a solução documentada na investigação |

### `sem-gambiarra` — Implementação sem workarounds

Impede gambiarras e atalhos frágeis durante implementação, correção de bugs e refatoração. Exige entender a causa raiz, seguir padrões do projeto e recusar suppress de lint/type, retries cegos, hardcodes mágicos e soluções temporárias sem follow-up.

**Caminho:** `.cursor/skills/sem-gambiarra/`

**Comandos (tags):**

`#sem-gambiarra` `#gambiarra` `#guabiarra` `#workaround` `#hack` `#fix-rapido` `#solucao-temporaria` `#codigo-limpo` `#causa-raiz`

| Tag | Ação resumida |
|-----|----------------|
| `#sem-gambiarra` | Ativa as regras anti-workaround na sessão |
| `#implementar` / `#codar` | Skill detectada automaticamente ao codificar |
| `#causa-raiz` | Prioriza diagnóstico e correção na origem do problema |

---

## Em construção

Skills planejadas para este repositório (ainda não implementadas):

| Skill | Descrição | Tags (previstas) |
|-------|-----------|------------------|
| — | *Adicione novas skills aqui conforme forem criadas* | — |

---

## Publicar no npm (mantenedores)

Ao alterar skills em `.cursor/skills/`, sincronize antes de publicar:

```bash
npm run sync          # copia .cursor/skills/ → skills/
npm publish --access public
```

---

## Estrutura do repositório

```
.cursor/skills/          ← fonte (desenvolvimento neste repo)
skills/                  ← cópia para distribuição (npx / npm pack)
bin/install.js           ← CLI insanemor-skills
package.json
skills.json
.cursor/skills/
├── processo-agil/
│   ├── SKILL.md
│   ├── reference.md
│   ├── templates.md
│   ├── examples.md
│   └── scripts/
│       ├── next_id.ps1
│       └── next_id.py
└── sem-gambiarra/
    └── SKILL.md
Epicos/                  ← backlog gerado pela skill processo-agil (quando em uso)
```
