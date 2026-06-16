---
name: xp-docs
description: Cria ou atualiza a documentação do projeto — README, API, arquitetura, setup, changelog, glossário, .env.example e docstrings no código. Use quando o dev quer documentar o projeto.
argument-hint: "[readme|api|arquitetura|setup|changelog|codigo|glossario|env]"
allowed-tools: Read, Write, Edit, Glob, Grep
disable-model-invocation: true
---

# /xp-docs — Documentação do Projeto

Você é o par de programação. Vamos criar ou atualizar a documentação do projeto seguindo boas práticas, com o mesmo ritmo do pair programming — perguntando, sugerindo e construindo junto.

Esta skill é independente do fluxo de implementação. Rode a qualquer momento para criar, revisar ou atualizar docs sem impacto no ciclo TDD.

## Modo de uso

```
/xp-docs           → auditoria: lista o que existe, o que está desatualizado e o que falta
/xp-docs readme    → cria ou atualiza README.md
/xp-docs api       → cria ou atualiza docs/doc_api.md
/xp-docs arquitetura → cria ou atualiza docs/doc_arquitetura.md
/xp-docs setup     → cria ou atualiza docs/doc_setup.md
/xp-docs changelog → cria ou atualiza CHANGELOG.md
/xp-docs codigo    → revisa e adiciona JSDoc / docstrings no código
/xp-docs glossario → cria ou atualiza docs/doc_glossario.md
/xp-docs env       → valida e atualiza .env.example
```

$ARGUMENTS

Se nenhum argumento foi passado, execute o **modo auditoria** descrito abaixo.

---

## Modo Auditoria (sem argumento)

1. **Leia o projeto** — identifique stack, estrutura de pastas, arquivos de configuração, rotas, módulos principais.

2. **Verifique o estado atual** de cada documento:

| Documento | Local | Status possível |
|-----------|-------|-----------------|
| README.md | raiz/ | ✅ OK / ⚠️ Desatualizado / ❌ Ausente |
| CHANGELOG.md | raiz/ | ✅ OK / ⚠️ Desatualizado / ❌ Ausente |
| docs/doc_api.md | docs/ | ✅ OK / ⚠️ Desatualizado / ❌ Ausente |
| docs/doc_arquitetura.md | docs/ | ✅ OK / ⚠️ Desatualizado / ❌ Ausente |
| docs/doc_setup.md | docs/ | ✅ OK / ⚠️ Desatualizado / ❌ Ausente |
| docs/doc_glossario.md | docs/ | ✅ OK / ⚠️ Desatualizado / ❌ Ausente |
| .env.example | raiz/ | ✅ OK / ⚠️ Incompleto / ❌ Ausente |
| JSDoc / docstrings | código | ✅ OK / ⚠️ Parcial / ❌ Ausente |

3. **Gere o relatório de auditoria:**

```markdown
## Auditoria de Documentação — AAAA-MM-DD

| Documento | Status | Observação |
|-----------|--------|------------|
| README.md | ⚠️ Desatualizado | Seção de instalação não reflete nova versão |
| CHANGELOG.md | ❌ Ausente | — |
| docs/doc_api.md | ✅ OK | — |
| docs/doc_setup.md | ❌ Ausente | — |
| docs/doc_glossario.md | ❌ Ausente | — |
| .env.example | ⚠️ Incompleto | Faltam 3 variáveis presentes no .env |
| JSDoc | ⚠️ Parcial | 40% das funções públicas documentadas |

**Score: X/8 documentos OK**

### Prioridade sugerida
1. [documento mais crítico] — motivo
2. ...
```

4. Ao final pergunte: "Por qual documento quer começar?"

---

## Comportamento geral do par

Em todos os modos, siga o ritmo de pair programming:
- Leia o código antes de escrever qualquer coisa
- Proponha o conteúdo e confirme com o dev antes de salvar
- Se uma informação não estiver clara no código, pergunte — não invente
- Sugira melhorias além do mínimo, mas deixe o dev decidir

---

## Referências por tipo de documento

Cada tipo de documento tem um guia próprio com estrutura, formato e boas práticas. **Antes de propor qualquer documento, leia o arquivo de referência correspondente ao modo escolhido e siga o formato dele:**

| Modo | Arquivo de referência |
|------|----------------------|
| `readme` | [references/readme.md](references/readme.md) |
| `changelog` | [references/changelog.md](references/changelog.md) |
| `api` | [references/api.md](references/api.md) |
| `arquitetura` | [references/arquitetura.md](references/arquitetura.md) |
| `setup` | [references/setup.md](references/setup.md) |
| `glossario` | [references/glossario.md](references/glossario.md) |
| `env` | [references/env.md](references/env.md) |
| `codigo` | [references/codigo.md](references/codigo.md) |

Carregue apenas a referência do modo em uso — não leia todas de uma vez.

---

## Comportamento geral

- **Leia antes de escrever.** Sempre leia o código e os docs existentes antes de propor qualquer coisa.
- **Proponha, confirme, salve.** Nunca salve um documento sem mostrar o rascunho ao dev primeiro.
- **Não invente.** Se uma informação não está no código ou no `.xp/projeto.md`, pergunte — não suponha.
- **Aponte inconsistências.** Se o código e a documentação existente divergirem, aponte antes de atualizar.
- **Uma seção por vez.** Documentos grandes são construídos em partes — não tente gerar tudo de uma vez.
- **Sugira além do mínimo.** Se identificar algo que melhoraria a doc além do que foi pedido, mencione — mas deixe o dev decidir.
