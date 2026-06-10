---
name: processo-agil
description: >-
  Simula backlog ágil criando épicos, features, stories, tasks e bugs como
  arquivos Markdown em Epicos/. Use quando o usuário pedir criar épico, epic,
  feature, feat, story, história, task, tarefa, bug, fix, fechar card,
  concluir, mover para progresso, em progresso, implementar, implementação,
  codar, versão, V1, cancelar, investigar, investigação, troubleshooting,
  analisar, resolver investigação ou backlog ágil no chat.
---

# Processo Ágil — Backlog em Arquivos

Cria e organiza itens de backlog no workspace atual, na pasta `Epicos/` na raiz do projeto.

## Comandos do usuário (gatilhos)

| Pedido no chat | Tipo | Exemplo |
|----------------|------|---------|
| criar épico / epic | Épico | "criar épico: autenticação", "criar épico na V2: pagamentos" |
| criar feat / feature | Feature | "criar feat no E01: login social" |
| criar story / história | Story | "criar story no E01: recuperar senha" |
| criar task / tarefa | Task | "criar task na S03 do E01: validar API" |
| criar bug / fix | Bug | "criar bug no E01: token expira errado" |
| fechar / concluir / finalizar | Qualquer | "fechar E01", "concluir S03 do E01" |
| mover para progresso / iniciar | Qualquer | "mover E01 para progresso", "iniciar FEAT01" |
| cancelar | Qualquer | "cancelar S02 do E01" |
| implementar / codar | Qualquer | "implementar E01", "implementar S03 do E01", "codar E01-F01" |
| investigar / troubleshooting / analisar | Investigação | "investigar lentidão na API", "continuar INV01" |
| resolver investigação | Investigação | "resolver investigação INV01", "resolver investigacao 01" |

Se faltar épico ou versão, use **V1** como padrão. Investigações usam sempre a **versão mais nova** existente em `Epicos/`. Liste opções quando houver ambiguidade.

## Hierarquia e pastas

Épicos ficam dentro de **pastas de versão** (`V1`, `V2`…). Features, stories, bugs e tasks ficam em subpastas fixas por tipo.

```
Epicos/
├── V1/
│   ├── TROUBLESHOOTING/
│   │   ├── INV01-{slug}.md
│   │   └── INV02-{slug}.md
│   ├── E01-{slug}/
│   │   ├── E01.md
│   │   ├── FEAT/
│   │   │   ├── FEAT01-{slug}.md
│   │   │   └── FEAT02-{slug}.md
│   │   ├── STORY/
│   │   │   ├── S01-{slug}.md
│   │   │   └── S02-{slug}.md
│   │   ├── BUG/
│   │   │   └── F01-{slug}.md
│   │   └── TASK/
│   │       └── T01-{slug}.md
│   └── E02-{slug}/
│       └── ...
└── V2/
    └── ...
```

| Tipo | Caminho do arquivo |
|------|-------------------|
| Épico | `Epicos/V{n}/E{NN}-{slug}/E{NN}.md` |
| Feature | `.../FEAT/FEAT{NN}-{slug}.md` |
| Story | `.../STORY/S{NN}-{slug}.md` |
| Bug | `.../BUG/F{NN}-{slug}.md` |
| Task | `.../TASK/T{NN}-{slug}.md` |
| Investigação | `Epicos/V{n}/TROUBLESHOOTING/INV{NN}-{slug}.md` |

Ao criar épico, crie também as pastas `FEAT/`, `STORY/`, `BUG/` e `TASK/` (vazias).

Investigações ficam em `TROUBLESHOOTING/` na **raiz da versão** (não dentro do épico). Abreviação: **INV** + numeração sequencial por versão.

`slug` = título em minúsculas, sem acentos, palavras separadas por hífen (máx. 50 chars).

**Vínculo lógico** (campo `pai` no frontmatter, não pasta aninhada):

- Story da feature → `pai: FEAT01` (arquivo em `STORY/`)
- Story do épico → `pai: E01`
- Task da story → `pai: S01` (arquivo em `TASK/`)
- Task da feature → `pai: FEAT01`
- Task do épico → `pai: E01`

## Fluxo obrigatório

1. **Identificar** tipo, título, versão (`V1` padrão) e pai.
2. **Obter próximo ID** executando o script:

   PowerShell:
   ```powershell
   .\.cursor\skills\processo-agil\scripts\next_id.ps1 -Tipo <tipo> -Versao <N> [-Epico <NN>]
   ```

   Python:
   ```bash
   python .cursor/skills/processo-agil/scripts/next_id.py --tipo <tipo> --versao <N> --epico <NN>
   ```

   Tipos: `epico`, `feat`, `story`, `task`, `bug`, `investigacao`.
   - `investigacao`: usa versão mais nova; não precisa `-Epico`.
   - `epico`: `-Versao` (padrão: mais nova ou V1).
   - Demais tipos: `-Versao` + `-Epico`.

3. **Criar** arquivo na subpasta correta com template de [templates.md](templates.md).
4. **Preencher** `versao`, `pai`, `epico` e descrição.
5. **Atualizar** tabela **Backlog do épico** em `E{NN}.md`.
6. **Responder** com ID, versão, caminho e pai.

## Regras de numeração

| Tipo | Padrão | Escopo |
|------|--------|--------|
| Épico | `E01`, `E02`… | por versão (`V1`, `V2`…) |
| Feature | `FEAT01`… | por épico |
| Story | `S01`… | por épico (`STORY/`) |
| Task | `T01`… | por épico (`TASK/`) |
| Bug | `E01-F01` (id) / `F01` (arquivo) | por épico (`BUG/`) |
| Investigação | `INV01`, `INV02`… | por versão (`TROUBLESHOOTING/`) |

ID do bug no frontmatter: `E{epico}-F{seq}`. Arquivo: `BUG/F{seq}-{slug}.md`.

## Investigar (somente análise)

Documenta diagnóstico **sem alterar código**. Detalhes: [reference.md](reference.md#investigar-troubleshooting).

Resumo obrigatório:

1. **Localizar versão mais nova** (`V{n}`) ou usar investigação existente (`INV01`, `continuar INV02`).
2. **Criar** `TROUBLESHOOTING/INV{NN}-{slug}.md` (novo) ou **append** no final do arquivo (continuação).
3. **Investigar**: ler logs, código, configs, reproduzir mentalmente — **proibido editar/corrigir o projeto**.
4. **Documentar** no arquivo: contexto, evidências, hipóteses, causa provável, **solução proposta** (ainda não implementada).
5. **Atualizar** `status: em-investigacao` e `atualizado: {DATA}` no frontmatter.
6. **Responder** ao operador com resumo; mudanças detalhadas vão no arquivo INV.

Status da investigação: `em-investigacao`, `aguardando-resolucao`, `resolvendo`, `concluido`, `cancelado`.

Quando a análise estiver completa, mover para `aguardando-resolucao` e deixar **Solução proposta** preenchida.

## Resolver investigação

Só após o operador pedir explicitamente (`resolver investigação INV01`).

1. Ler `Solução proposta` no arquivo INV.
2. `status` → `resolvendo`.
3. **Implementar** a solução documentada (pode alterar código).
4. Registrar em **Registro de resolução** o que foi feito.
5. `status` → `concluido`.

Se `Solução proposta` estiver vazia ou vaga, pergunte ao operador antes de implementar.

## Transição de status

Status válidos: `backlog`, `em-progresso`, `revisao`, `concluido`, `cancelado`.

| Comando | Novo status |
|---------|-------------|
| fechar / concluir / finalizar | `concluido` |
| mover para progresso / iniciar | `em-progresso` |
| mover para revisão / revisar | `revisao` |
| cancelar | `cancelado` |
| reabrir | `backlog` |

Detalhes: [reference.md](reference.md#transição-de-status).

## Implementar (codar)

Atualiza status + codifica no projeto + fecha cada card. Detalhes: [reference.md](reference.md#implementar-codar).

Ordem no épico: **FEAT** → **STORY** (vinculadas à feat, depois ao épico) → **TASK** → **BUG**.

## Não fazer

- Não criar feat/story/bug/task fora de `FEAT/`, `STORY/`, `BUG/`, `TASK/`.
- Não criar épico fora de `Epicos/V{n}/`.
- Não usar subpasta por item (ex.: `S01-{slug}/S01.md`) — use arquivo único em `STORY/`.
- Não reutilizar IDs; use o script.
- Não fechar com filhos abertos sem aviso — exceto no fluxo `implementar`.
- **Não alterar código do projeto** durante `investigar` — apenas documentar no arquivo INV.
- **Não resolver** investigação sem comando explícito do operador.

## Referências

- Templates: [templates.md](templates.md)
- Exemplos: [examples.md](examples.md)
- Nomenclatura: [reference.md](reference.md)
