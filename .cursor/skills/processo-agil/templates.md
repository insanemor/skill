# Templates de backlog

Substitua os placeholders. Data: `YYYY-MM-DD`. Versão padrão: `V1`.

## Épico — `Epicos/V{n}/E{NN}-{slug}/E{NN}.md`

```markdown
---
id: E{NN}
tipo: epico
titulo: {TITULO}
versao: V{n}
status: backlog
criado: {DATA}
pai: null
epico: E{NN}
---

# E{NN} — {TITULO}

## Descrição

{DESCRICAO}

## Objetivo de negócio

## Critérios de aceite

- [ ]

## Backlog do épico

| Tipo | ID | Título | Status |
|------|-----|--------|--------|
| Feature | FEAT{NN} | [{TITULO}](FEAT/FEAT{NN}-{slug}.md) | backlog |
| Story | S{NN} | [{TITULO}](STORY/S{NN}-{slug}.md) | backlog |
| Bug | E{NN}-F{NN} | [{TITULO}](BUG/F{NN}-{slug}.md) | backlog |
```

## Feature — `FEAT/FEAT{NN}-{slug}.md`

```markdown
---
id: FEAT{NN}
tipo: feature
titulo: {TITULO}
versao: V{n}
status: backlog
criado: {DATA}
pai: E{EPICO}
epico: E{EPICO}
---

# FEAT{NN} — {TITULO}

**Épico:** [E{EPICO}](../E{EPICO}.md)

## Descrição

{DESCRICAO}

## Critérios de aceite

- [ ]
```

## Story — `STORY/S{NN}-{slug}.md`

```markdown
---
id: S{NN}
tipo: story
titulo: {TITULO}
versao: V{n}
status: backlog
criado: {DATA}
pai: {PAI}
epico: E{EPICO}
---

# S{NN} — {TITULO}

**Épico:** [E{EPICO}](../E{EPICO}.md)
**Pai:** {PAI}

## Descrição

Como {PERSONA}, quero {ACAO}, para {BENEFICIO}.

## Critérios de aceite

- [ ] Dado… Quando… Então…
```

## Task — `TASK/T{NN}-{slug}.md`

```markdown
---
id: T{NN}
tipo: task
titulo: {TITULO}
versao: V{n}
status: backlog
criado: {DATA}
pai: {PAI}
epico: E{EPICO}
---

# T{NN} — {TITULO}

**Épico:** [E{EPICO}](../E{EPICO}.md)
**Pai:** {PAI}

## Descrição

{DESCRICAO}

## Checklist

- [ ]
```

## Bug — `BUG/F{NN}-{slug}.md`

```markdown
---
id: E{EPICO}-F{NN}
tipo: bug
titulo: {TITULO}
versao: V{n}
status: backlog
criado: {DATA}
pai: E{EPICO}
epico: E{EPICO}
---

# E{EPICO}-F{NN} — {TITULO}

**Épico:** [E{EPICO}](../E{EPICO}.md)

## Descrição do problema

{DESCRICAO}

## Passos para reproduzir

1.

## Comportamento esperado

## Comportamento atual

## Severidade

<!-- baixa | media | alta | critica -->
```

## Investigação — `TROUBLESHOOTING/INV{NN}-{slug}.md`

```markdown
---
id: INV{NN}
tipo: investigacao
titulo: {TITULO}
versao: V{n}
status: em-investigacao
criado: {DATA}
atualizado: {DATA}
pai: null
---

# INV{NN} — {TITULO}

## Resumo atual

{uma frase com o estado mais recente da investigação}

## Problema relatado

{DESCRICAO_INICIAL}

## Escopo

- Versão: V{n}
- Início: {DATA}
- Restrição: somente análise — sem alteração de código até `resolver investigação`

## Solução proposta (não implementada)

<!-- Preencher quando diagnóstico estiver maduro; manter vazio no início -->

## Registro de resolução

<!-- Preencher somente após `resolver investigação INV{NN}` -->

---

## Registro — {DATA} {HORA}

### Contexto

### Análise

### Evidências

### Hipóteses / causa provável

### Solução proposta (não implementada)

### Status desta sessão

em-investigacao
```
