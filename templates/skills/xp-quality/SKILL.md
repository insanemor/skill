---
name: xp-quality
description: Audita 7 pilares de qualidade do projeto (testes, lint, tipagem, cobertura, segurança e mais) e gera um relatório com recomendações. Use quando o dev quer um diagnóstico completo do estado do projeto.
allowed-tools: Read, Glob, Grep, Bash
disable-model-invocation: true
---

# /xp-quality — Validação de Qualidade do Projeto

Você é o par de programação. Vamos auditar se o projeto está configurado com as práticas de qualidade essenciais e gerar um relatório com o estado atual e recomendações.

Esta skill é independente — não é acionada automaticamente por nenhuma outra. Rode quando quiser um diagnóstico completo do projeto. O relatório gerado pode ser enviado ao `/xp-plan` para criar tarefas de melhoria.

---

## Fase 1 — IDENTIFICAR A STACK

1. Leia os arquivos de configuração e manifesto do projeto para identificar:
   - **Linguagem principal** (TypeScript, Python, Go, Java, Ruby, etc.)
   - **Runtime / framework** (Node.js, Django, Spring, Rails, etc.)
   - **Gerenciador de pacotes / dependências** (npm, pip, maven, bundler, etc.)
   - **Arquivos de configuração presentes** (package.json, pyproject.toml, pom.xml, Gemfile, go.mod, etc.)

2. Informe ao dev o que foi identificado antes de continuar:
   > "Identifiquei: [linguagem] com [runtime]. Vou auditar os 7 pilares de qualidade para essa stack."

---

## Fase 2 — AUDITAR OS 7 PILARES

Para cada pilar abaixo, verifique **três camadas**:

- **Configurado?** — existe ferramenta definida para isso no projeto
- **Executável?** — tem comando mapeado que pode ser rodado
- **Passa?** — ao rodar o comando, o resultado é satisfatório

Classifique cada pilar com um dos status:
- ✅ `OK` — configurado, executável e passando
- ⚠️ `Parcial` — configurado mas com problemas, ou sem cobertura adequada
- ❌ `Ausente` — não configurado ou sem ferramenta definida

---

### Pilar 1 — Análise Estática (Lint)

**O que é:** verifica padrões de código, estilo e erros sem executar o programa.

Ferramentas por linguagem:
- JS/TS: ESLint, Biome
- Python: Ruff, Flake8, Pylint
- Go: golangci-lint
- Java: Checkstyle, PMD, SpotBugs
- Ruby: RuboCop
- Rust: Clippy

**Verificar:**
- Existe ferramenta instalada e configurada?
- Existe arquivo de configuração com regras definidas? (`.eslintrc`, `ruff.toml`, `.golangci.yml`, etc.)
- Existe comando mapeado? (`lint`, `check`, `fmt:check`)
- Ao rodar, passa sem erros?

**Critério de qualidade:**
- Regras habilitadas para erros comuns da linguagem
- Integrado ao CI (se existir pipeline)
- Zero warnings ignorados sem justificativa

---

### Pilar 2 — Tipagem Estática (Typecheck)

**O que é:** verifica a consistência de tipos sem executar o código. Só aplicável a linguagens com sistema de tipos.

Ferramentas por linguagem:
- TypeScript: `tsc --noEmit`
- Python: mypy, pyright, pytype
- Java/Kotlin/Go/Rust: nativo na compilação
- Ruby: Sorbet, RBS

**Verificar:**
- A linguagem suporta tipagem estática?
- Está configurada no modo estrito (strict mode)?
- Existe comando mapeado? (`typecheck`, `type-check`, `check:types`)
- Ao rodar, passa sem erros?

**Critério de qualidade:**
- Modo estrito habilitado (sem `any` implícito, sem `ignore` excessivo)
- Integrado ao CI

---

### Pilar 3 — Suite de Testes

**O que é:** conjunto de testes automatizados que verificam o comportamento do sistema.

Ferramentas por linguagem:
- JS/TS: Jest, Vitest, Mocha
- Python: pytest, unittest
- Go: testing (nativo), testify
- Java: JUnit, TestNG
- Ruby: RSpec, Minitest
- Rust: testing nativo

**Verificar:**
- Existe framework de testes instalado e configurado?
- Existem arquivos de teste no projeto?
- Existe comando mapeado? (`test`, `spec`)
- Ao rodar, todos os testes passam?

**Critério de qualidade:**
- Testes unitários e de integração presentes
- Todos os testes passando
- Testes organizados próximos ao código que testam
- Integrado ao CI

---

### Pilar 4 — Cobertura de Testes

**O que é:** mede o percentual do código exercitado pelos testes.

Ferramentas por linguagem:
- JS/TS: Istanbul/nyc (embutido no Jest/Vitest)
- Python: coverage.py, pytest-cov
- Go: `go test -cover` (nativo)
- Java: JaCoCo, Cobertura
- Ruby: SimpleCov
- Rust: llvm-cov, tarpaulin

**Verificar:**
- Existe ferramenta de cobertura configurada?
- Existe comando mapeado? (`test:coverage`, `coverage`)
- Existe threshold mínimo definido? (ex: 80%)
- Qual é a cobertura atual?

**Critério de qualidade:**
- Cobertura mínima de 80% definida e respeitada
- Relatório de cobertura gerado
- Integrado ao CI com falha abaixo do threshold

---

### Pilar 5 — Validação de Arquitetura

**O que é:** verifica se as regras de dependência e estrutura do projeto estão sendo respeitadas (ex: a camada de UI não pode importar diretamente do banco).

Ferramentas por linguagem:
- JS/TS: dependency-cruiser, eslint-plugin-import
- Python: import-linter, pydeps
- Java: ArchUnit, jQAssistant
- Go: go-arch-lint
- Ruby: packwerk

**Verificar:**
- Existe ferramenta de validação de arquitetura configurada?
- Existem regras de dependência definidas?
- Existe comando mapeado? (`arch`, `arch:check`)
- Ao rodar, passa sem violações?

**Critério de qualidade:**
- Regras explícitas definindo quais camadas podem depender de quais
- Integrado ao CI
- Zero violações toleradas

---

### Pilar 6 — Análise de Segurança do Código

**O que é:** analisa o código-fonte em busca de padrões inseguros (SQL injection, XSS, secrets expostos, etc.).

Ferramentas por linguagem:
- JS/TS: Semgrep, ESLint security plugins
- Python: Bandit, Semgrep
- Go: gosec, Semgrep
- Java: SpotBugs + find-sec-bugs, Semgrep
- Ruby: Brakeman, Semgrep
- Genérico: Semgrep (suporta múltiplas linguagens)

**Verificar:**
- Existe ferramenta de análise de segurança configurada?
- Existe comando mapeado? (`security`, `sec:check`)
- Ao rodar, passa sem vulnerabilidades críticas ou altas?

**Critério de qualidade:**
- Zero vulnerabilidades críticas ou altas não tratadas
- Integrado ao CI
- Secrets scanning habilitado (nunca commitar credenciais)

---

### Pilar 7 — Auditoria de Dependências

**O que é:** verifica se as bibliotecas externas utilizadas possuem vulnerabilidades conhecidas (CVEs).

Ferramentas por linguagem:
- JS/TS: `npm audit`, `yarn audit`, Snyk
- Python: `pip-audit`, Safety
- Go: `govulncheck`
- Java: OWASP Dependency-Check, Snyk
- Ruby: `bundler-audit`
- Rust: `cargo audit`

**Verificar:**
- Existe ferramenta de auditoria configurada ou disponível?
- Existe comando mapeado? (`audit`, `deps:audit`)
- Ao rodar, há vulnerabilidades abertas?

**Critério de qualidade:**
- Zero vulnerabilidades críticas ou altas abertas
- Integrado ao CI
- Dependências atualizadas regularmente

---

## Fase 3 — GERAR O RELATÓRIO

Ao final da auditoria, gere o relatório no seguinte formato:

```markdown
# Relatório de Qualidade — [Nome do Projeto]
**Data:** AAAA-MM-DD
**Stack:** [linguagem] / [runtime]

## Resumo

| Pilar | Status | Observação |
|-------|--------|------------|
| Análise Estática     | ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |
| Tipagem Estática     | ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |
| Suite de Testes      | ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |
| Cobertura de Testes  | ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |
| Validação Arquitetura| ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |
| Análise de Segurança | ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |
| Auditoria de Deps    | ✅ OK / ⚠️ Parcial / ❌ Ausente | ... |

**Score: X/7 pilares OK**

## Problemas encontrados

### Críticos (❌ Ausente)
[Lista de pilares ausentes com impacto e ferramenta recomendada para a stack]

### Melhorias (⚠️ Parcial)
[Lista de pilares parciais com o que está faltando]

## Recomendações

Para cada pilar ❌ ou ⚠️, descreva:
- Ferramenta recomendada para a stack identificada
- Como configurar (arquivo de config, comando a mapear)
- Como integrar ao CI

## Próximo passo

Este relatório pode ser enviado ao `/xp-plan` para criar tarefas de melhoria priorizadas.
Sugestão de priorização: Críticos primeiro, depois Parciais por impacto.
```

---

## Comportamento

- Não instale ferramentas — apenas verifique e recomende.
- Se não conseguir rodar um comando, registre como `⚠️ Parcial` com o motivo.
- Se a linguagem não suportar um pilar (ex: tipagem em JavaScript puro), registre como `N/A` com explicação.
- Seja específico nas recomendações — indique a ferramenta certa para a stack identificada, não genéricos.
- Se existir CI (GitHub Actions, GitLab CI, etc.), verifique se os pilares presentes estão integrados a ele.
