# Referência — Nomenclatura e hierarquia

## Estrutura física

```
Epicos/V{n}/
├── TROUBLESHOOTING/  → INV{NN}-{slug}.md
└── E{NN}-{slug}/
    ├── E{NN}.md
    ├── FEAT/     → FEAT{NN}-{slug}.md
    ├── STORY/    → S{NN}-{slug}.md
    ├── BUG/      → F{NN}-{slug}.md
    └── TASK/     → T{NN}-{slug}.md
```

## Relacionamentos lógicos (`pai`)

```
Épico (E)
 ├── Feature (FEAT)     → arquivo em FEAT/
 │    ├── Story (S)      → STORY/, pai: FEAT{NN}
 │    └── Task (T)       → TASK/, pai: FEAT{NN}
 ├── Story (S)           → STORY/, pai: E{NN}
 ├── Task (T)            → TASK/, pai: E{NN} ou S{NN}
 └── Bug (E{NN}-F{NN})   → BUG/, arquivo F{NN}-{slug}.md
```

## IDs e caminhos

| Tipo | ID | Arquivo |
|------|-----|---------|
| Épico | `E03` | `Epicos/V1/E03-{slug}/E03.md` |
| Feature | `FEAT02` | `.../FEAT/FEAT02-{slug}.md` |
| Story | `S01` | `.../STORY/S01-{slug}.md` |
| Task | `T01` | `.../TASK/T01-{slug}.md` |
| Bug | `E03-F01` | `.../BUG/F01-{slug}.md` |
| Investigação | `INV01` | `Epicos/V{n}/TROUBLESHOOTING/INV01-{slug}.md` |

## Campo `versao`

Todo item deve ter `versao: V1` (ou `V2`, etc.) no frontmatter, alinhado à pasta em `Epicos/`.

## Campo `pai`

| Tipo | `pai` | `epico` |
|------|-------|---------|
| Épico | `null` | `E03` |
| Feature | `E03` | `E03` |
| Story (épico) | `E03` | `E03` |
| Story (feat) | `FEAT02` | `E03` |
| Task (story) | `S01` | `E03` |
| Task (feat) | `FEAT02` | `E03` |
| Task (épico) | `E03` | `E03` |
| Bug | `E03` | `E03` |

## Slug

Minúsculas, sem acentos, hífens entre palavras, máx. 50 caracteres.

## Resolver itens

- Versão: `V1`, `v1`, `versão 1` — padrão `V1`
- Épico: `E01`, `épico 1` — buscar em `Epicos/V*/E01-*/`
- Bug: `E01-F01`, `F01 do E01` → arquivo `BUG/F01-*.md`
- Task: exige contexto (`T01 da S03 do E01`)

## Transição de status

### Filhos em aberto (ao fechar)

| Card | Filhos a verificar |
|------|-------------------|
| Épico | todos em `FEAT/`, `STORY/`, `TASK/`, `BUG/` |
| Feature | stories com `pai: FEAT{NN}` em `STORY/` + tasks com `pai: FEAT{NN}` em `TASK/` |
| Story | tasks com `pai: S{NN}` em `TASK/` |
| Task / Bug | nenhum |

Item em aberto = status ≠ `concluido` e ≠ `cancelado`.

Se houver filhos abertos ao fechar: avisar, listar, pedir confirmação explícita.

### Sincronização da tabela

Feature, Story e Bug: atualizar frontmatter + linha em `E{NN}.md`.

Links na tabela:
- Feature: `FEAT/FEAT01-{slug}.md`
- Story: `STORY/S01-{slug}.md`
- Bug: `BUG/F01-{slug}.md`

## Implementar (codar)

### Ordem no épico

1. Features em `FEAT/` (ordem `FEAT01`, `FEAT02`…)
2. Stories em `STORY/` com `pai: FEAT{NN}` (por feat, em ordem)
3. Stories em `STORY/` com `pai: E{NN}` (ordem `S01`, `S02`…)
4. Tasks em `TASK/` (ordem `T01`, `T02`…)
5. Bugs em `BUG/` (ordem `F01`, `F02`…)
6. Fechar épico

### Por tipo

- **Task**: em-progresso → codar → concluido
- **Bug**: em-progresso → corrigir → concluido + tabela
- **Story**: em-progresso → tasks com `pai: S{NN}` → codar → concluido + tabela
- **Feature**: em-progresso → stories/tasks com `pai: FEAT{NN}` → codar → concluido + tabela
- **Épico**: em-progresso → filhos em ordem → concluido

### Descobrir filhos de uma feature

Ler frontmatter de arquivos em `STORY/` e `TASK/` onde `pai` = `FEAT{NN}`.

### Descobrir tasks de uma story

Ler arquivos em `TASK/` onde `pai` = `S{NN}`.

## Investigar (troubleshooting)

### Versão alvo

Sempre usar a **versão mais nova** em `Epicos/` (`V3` > `V2` > `V1`). Se não existir versão, criar `V1`.

```powershell
.\.cursor\skills\processo-agil\scripts\next_id.ps1 -Tipo investigacao
```

Retorna `INV01`, `INV02`… sequencial na pasta `TROUBLESHOOTING/` da versão mais nova.

### Nova vs. continuação

| Situação | Ação |
|----------|------|
| Novo assunto ("investigar erro X") | Criar `INV{NN}-{slug}.md` |
| Continuação ("continuar INV01", mesmo tema) | **Append** no final do arquivo existente |
| Ambíguo | Perguntar: nova investigação ou continuar INV existente? |

### Regras durante investigação

**Permitido:**
- Ler arquivos, logs, configs, terminal
- Executar comandos **somente leitura** (listar, grep, status, logs)
- Documentar no arquivo INV

**Proibido:**
- Editar código-fonte do projeto
- Aplicar correções, refactors ou workarounds
- Criar épico/story/bug para "resolver enquanto investiga"
- Marcar investigação como `concluido` sem passar por `resolver investigação`

### Estrutura do arquivo (append)

Ao final de cada sessão de investigação, adicionar:

```markdown
---

## Registro — {DATA} {HORA}

### Contexto
{o que o operador pediu nesta conversa}

### Análise
{o que foi investigado}

### Evidências
- {fatos observados}

### Hipóteses / causa provável
{diagnóstico}

### Solução proposta (não implementada)
{passos concretos para quando o operador pedir resolver — ainda sem código alterado}

### Status desta sessão
em-investigacao | aguardando-resolucao
```

Atualizar também a seção **Resumo atual** no topo do corpo (última conclusão em uma frase).

### Status da investigação

| Status | Significado |
|--------|-------------|
| `em-investigacao` | Análise em andamento |
| `aguardando-resolucao` | Diagnóstico pronto; solução proposta documentada |
| `resolvendo` | Operador pediu `resolver investigação`; implementação em curso |
| `concluido` | Solução implementada e registrada |
| `cancelado` | Descartada |

### Resolver investigação

1. Localizar `Epicos/V{n}/TROUBLESHOOTING/INV{NN}-*.md`
2. Validar seção **Solução proposta** preenchida
3. `status` → `resolvendo`
4. Implementar exatamente o plano documentado (pode alterar código)
5. Append em **Registro de resolução** com arquivos alterados e validação
6. `status` → `concluido`

Se o operador quiser solução diferente da documentada, atualize **Solução proposta** primeiro (nova sessão de registro) ou peça confirmação explícita.
