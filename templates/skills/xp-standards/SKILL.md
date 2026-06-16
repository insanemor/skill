---
name: xp-standards
description: Configura padrões do projeto com ferramentas reais — Conventional Commits, lint, formatação, git hooks, convenção de branches e template de PR. Use para padronizar a qualidade estrutural do repositório.
argument-hint: "[commits|lint|format|hooks|branches|pr|tudo]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
disable-model-invocation: true
---

# /xp-standards — Padrões do Projeto

Você é o par de programação. Vamos configurar os padrões de código, commit e colaboração do projeto — uma vez, bem feito, para que toda a equipe (e agentes) sigam o mesmo ritmo.

Esta skill configura os padrões **estruturalmente** no projeto, não só como convenção verbal. Cada padrão é aplicado com ferramentas que automatizam a verificação.

## Modo de uso

```
/xp-standards              → auditoria: lista o que está configurado e o que falta
/xp-standards commits      → configura Conventional Commits + Commitlint
/xp-standards lint         → configura ESLint / Ruff / golangci-lint (detecta stack)
/xp-standards format       → configura Prettier / Black / gofmt (detecta stack)
/xp-standards hooks        → configura Husky + lint-staged (ou equivalente)
/xp-standards branches     → define e documenta convenção de branches
/xp-standards pr           → cria template de Pull Request
/xp-standards tudo         → configura todos os padrões em sequência
```

$ARGUMENTS

Se nenhum argumento foi passado, execute o **modo auditoria**.

---

## Modo Auditoria (sem argumento)

1. **Detecte a stack** — leia `package.json`, `pyproject.toml`, `go.mod`, etc.

2. **Avalie os 6 padrões:**

| Padrão | O que verifica |
|--------|---------------|
| **Conventional Commits** | Commitlint configurado, formato de commit definido |
| **Lint** | Ferramenta instalada, regras configuradas, integrada ao CI |
| **Format** | Formatador configurado, regras definidas |
| **Git Hooks** | Hooks automáticos antes do commit e push |
| **Branch naming** | Convenção documentada |
| **PR Template** | Template de Pull Request presente |

3. **Gere o relatório:**

```markdown
## Auditoria de Padrões — AAAA-MM-DD
**Stack detectada:** [linguagem / runtime]

| Padrão | Status | Observação |
|--------|--------|------------|
| Conventional Commits | ❌ Ausente | Sem commitlint configurado |
| Lint | ✅ OK | ESLint com regras definidas |
| Format | ⚠️ Parcial | Prettier instalado, sem integração no hook |
| Git Hooks | ❌ Ausente | Sem Husky configurado |
| Branch naming | ⚠️ Parcial | Convenção verbal, não documentada |
| PR Template | ❌ Ausente | — |

**Score: X/6 padrões configurados**
```

---

## Conventional Commits

**O que é:** formato padronizado para mensagens de commit que torna o histórico legível e permite geração automática de changelog.

### Formato

```
<tipo>(<escopo opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos obrigatórios

| Tipo | Quando usar |
|------|------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `test` | Adição ou correção de testes |
| `refactor` | Refatoração sem mudança de comportamento |
| `docs` | Documentação |
| `ci` | Configuração de CI/CD |
| `infra` | Infraestrutura e deploy |
| `chore` | Tarefas de manutenção (deps, configs) |
| `perf` | Melhoria de performance |
| `style` | Formatação (sem mudança de lógica) |
| `revert` | Reverter commit anterior |

### Exemplos

```
feat(auth): usuário pode fazer login com Google OAuth
fix(orders): pedido cancelado não aparece mais no histórico ativo
test(auth): cobre cenário de email duplicado no cadastro
ci: adiciona step de typecheck no pipeline de PR
infra: configura healthcheck no Fly.io
```

### Setup (Node.js)

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'test', 'refactor', 'docs',
      'ci', 'infra', 'chore', 'perf', 'style', 'revert'
    ]],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-max-length': [2, 'always', 100],
  }
}
```

### Setup (Python / Go / outras linguagens)
- Python: `pre-commit` com hook `commitlint` ou `gitlint`
- Go: `pre-commit` com `commitlint` via npm ou `go-conventional-commits`
- Genérico: `pre-commit` framework com hook customizado

---

## Lint

Configura análise estática para a stack detectada.

### Por linguagem

**TypeScript / JavaScript:**
```bash
npm install --save-dev eslint @eslint/js typescript-eslint
```

```js
// eslint.config.js
import js from '@eslint/js'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  {
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
)
```

**Python:**
```bash
pip install ruff
```
```toml
# pyproject.toml
[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "UP", "S", "B"]
```

**Go:**
```bash
# .golangci.yml
linters:
  enable:
    - errcheck
    - gosimple
    - govet
    - ineffassign
    - staticcheck
    - unused
```

### Boas práticas
- Habilite regras de segurança desde o início (`eslint-plugin-security`, `bandit`, `gosec`)
- Integre ao CI — lint falhou = PR bloqueado
- Zero warnings ignorados sem justificativa no código

---

## Format

Configura formatação automática e consistente.

### Por linguagem

**TypeScript / JavaScript — Prettier:**
```bash
npm install --save-dev prettier
```
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

**Python — Black + isort:**
```toml
# pyproject.toml
[tool.black]
line-length = 88

[tool.isort]
profile = "black"
```

**Go — gofmt / goimports:**
Nativo na linguagem — configure no editor e no CI:
```yaml
- run: goimports -l . | grep . && exit 1 || exit 0
```

### Boas práticas
- Integre ao hook de pre-commit para formatação automática
- Nunca discuta estilo manualmente — a ferramenta decide
- Configure o editor para formatar ao salvar

---

## Git Hooks

Automatiza verificações antes do commit e push para que problemas sejam pegos localmente, não no CI.

### Setup Node.js — Husky + lint-staged

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**Hook pre-commit** (`.husky/pre-commit`):
```bash
npx lint-staged
```

**lint-staged** (`package.json`):
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

**Hook commit-msg** (`.husky/commit-msg`):
```bash
npx --no -- commitlint --edit $1
```

**Hook pre-push** (`.husky/pre-push`):
```bash
npm run typecheck && npm test
```

### Setup Python / Go — pre-commit

```bash
pip install pre-commit
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff --fix
      - id: ruff-format
```

### O que cada hook faz

| Hook | Quando roda | O que verifica |
|------|------------|----------------|
| `pre-commit` | Antes de cada commit | Lint + format nos arquivos staged |
| `commit-msg` | Ao escrever a mensagem | Conventional Commits |
| `pre-push` | Antes do push | Typecheck + testes |

---

## Branch Naming

Define e documenta a convenção de branches. Proposta ao dev antes de aplicar.

### Convenção sugerida

```
<tipo>/<id-opcional>-<descrição-curta>

feat/42-login-google
fix/87-email-duplicado
chore/atualizar-dependencias
docs/setup-ambiente
ci/pipeline-typecheck
infra/configurar-fly
```

### Tipos de branch

| Tipo | Quando usar |
|------|------------|
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `chore/` | Manutenção, dependências |
| `docs/` | Documentação |
| `ci/` | CI/CD |
| `infra/` | Infraestrutura |
| `spike/` | Experimento / PoC |

### Onde documentar

Adicione em `docs/doc_setup.md` na seção "Contribuindo":

```markdown
## Convenção de branches

Formato: `<tipo>/<id-opcional>-<descrição>`

Exemplos:
- `feat/42-login-google`
- `fix/87-email-duplicado`
- `docs/atualizar-setup`
```

---

## PR Template

Cria `.github/pull_request_template.md` (ou equivalente para GitLab/Bitbucket).

### Template sugerido

```markdown
## O que esse PR faz?

[Descreva a mudança em linguagem de usuário — o que muda no comportamento do sistema]

## Motivação

[Por que essa mudança é necessária? Relacione ao backlog ou problema]

## Como testar

- [ ] [Passo 1]
- [ ] [Passo 2]
- [ ] Testes automatizados passando

## Checklist

- [ ] Testes escritos para o comportamento novo
- [ ] Lint e typecheck passando
- [ ] `.env.example` atualizado (se adicionou variável)
- [ ] Documentação atualizada (se necessário)
- [ ] CHANGELOG.md atualizado (se for release)

## Tipo de mudança

- [ ] `feat` — nova funcionalidade
- [ ] `fix` — correção de bug
- [ ] `refactor` — sem mudança de comportamento
- [ ] `ci/infra` — pipeline ou infraestrutura
- [ ] `docs` — documentação
```

---

## Modo `tudo`

Configura todos os padrões em sequência, confirmando com o dev antes de cada etapa:

1. Commits → 2. Lint → 3. Format → 4. Hooks → 5. Branches → 6. PR Template

Ao final, gere um commit com todas as configurações:
```
chore: configurar padrões do projeto (commitlint, eslint, prettier, husky)
```

Em seguida, oriente:
> "Padrões configurados. Próximo passo: `/xp-deploy configurar` — define o build, variáveis de ambiente e pipeline de CI/CD. Depois disso, `/xp-task` para começar a codar."

---

## Comportamento

- Proponha cada configuração antes de aplicar — o dev decide o que quer.
- Adapte sempre para a stack detectada — não use configurações genéricas.
- Se um padrão já estiver configurado, mostre o que existe e pergunte se quer revisar.
- Ao configurar lint e format, rode uma vez para verificar que não há falsos positivos na base de código existente.
- Se houver muitos erros de lint na base existente ao configurar, sugira um `// eslint-disable` temporário na regra mais problemática e crie tarefa no backlog para resolver progressivamente.
- Ao final de qualquer configuração, se o projeto ainda não tiver deploy configurado (sem `fly.toml`, `vercel.json`, Dockerfile ou pipeline CI), oriente: "Próximo passo: `/xp-deploy configurar`".
