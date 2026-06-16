---
name: xp-test
description: Executa testes dinâmicos contra o app em execução — smoke, e2e, performance e segurança. Use para validar um app rodando; diferente do /xp-tdd, que escreve testes novos.
argument-hint: "[smoke|e2e|performance|security]"
allowed-tools: Read, Glob, Grep, Bash
---

# /xp-test — Execução de Testes Dinâmicos

Você é o par de programação. Esta skill executa testes dinâmicos contra o app em execução ou a base de código existente.

**Diferença do `/xp-tdd`:** o `/xp-tdd` escreve e guia a criação de testes. O `/xp-test` executa testes já existentes ou realiza validações dinâmicas que não exigem código pré-escrito.

## Modo de uso

```
/xp-test smoke       → verifica se o app está de pé e respondendo
/xp-test e2e         → executa os testes E2E existentes no projeto
/xp-test performance → mede tempo de resposta e identifica gargalos
/xp-test security    → analisa vulnerabilidades dinâmicas no app rodando
/xp-test             → sem argumento: apresenta menu com os 4 modos
```

$ARGUMENTS

Se nenhum modo foi passado, apresente:
> "Qual tipo de teste quer executar?"
> 1. `smoke` — app está respondendo?
> 2. `e2e` — jornadas do usuário passando?
> 3. `performance` — app responde dentro do esperado?
> 4. `security` — app expõe vulnerabilidades dinâmicas?

---

## Modo 1 — SMOKE

**O que é:** verificação rápida de que o app está vivo e as funcionalidades críticas respondem. Roda em segundos. Ideal pós-deploy.

**Pré-requisito:** app rodando (local ou ambiente apontado pelo dev).

### Fluxo

1. Pergunte a URL base do app se não for óbvia.
2. Identifique os endpoints e fluxos críticos — leia o código ou pergunte ao dev.
3. Execute verificações:
   - `GET /` ou rota raiz → status 200
   - Health check se existir (`/health`, `/ping`, `/status`)
   - Endpoints principais da API → respondem sem erro 5xx
   - Autenticação básica → login retorna token (sem credenciais reais — use fixture/mock se disponível)
4. Gere relatório:

```
## Smoke Test — AAAA-MM-DD HH:MM

| Verificação | Status | Tempo | Observação |
|-------------|--------|-------|------------|
| GET /       | ✅ 200 | 45ms  | —          |
| GET /health | ✅ 200 | 12ms  | —          |
| POST /auth  | ✅ 200 | 89ms  | —          |
| GET /api/users | ❌ 500 | —  | Internal Server Error |

**Resultado: X/Y verificações OK**
```

5. Se houver falhas, sugira acionar `/xp-help` para investigar.

---

## Modo 2 — E2E

**O que é:** executa os testes E2E já escritos no projeto (Playwright, Cypress, Selenium, etc.).

**Pré-requisito:** testes E2E existentes no projeto. Se não existirem, oriente a criar via `/xp-task` com uma história `[E2E]` do backlog.

### Fluxo

1. **Identifique o framework E2E** — procure no projeto:
   - Playwright: `playwright.config.ts`, pasta `e2e/` ou `tests/`
   - Cypress: `cypress.config.ts`, pasta `cypress/`
   - Outros: `package.json` scripts, arquivos de config

2. **Verifique o ambiente** — pergunte se o app está rodando ou se os testes sobem o próprio servidor.

3. **Execute os testes:**
   - Playwright: `npx playwright test`
   - Cypress: `npx cypress run`
   - Adapte para a stack identificada

4. **Analise os resultados:**
   - Testes passando: ✅
   - Testes falhando: ❌ com descrição do erro e screenshot se disponível
   - Testes pulados/pendentes: ⚠️

5. **Gere relatório:**

```
## E2E Test — AAAA-MM-DD HH:MM
**Framework:** Playwright
**Total:** X testes | ✅ Y passando | ❌ Z falhando | ⚠️ W pulados

### Falhas
- [nome do teste]: [mensagem de erro]
  Arquivo: [caminho]
  Screenshot: [se disponível]
```

6. Para cada falha, pergunte: "Quer investigar essa falha agora com `/xp-help`?"

---

## Modo 3 — PERFORMANCE

**O que é:** mede tempo de resposta dos endpoints críticos e identifica comportamentos lentos.

**Pré-requisito:** app rodando.

### Fluxo

1. Identifique os endpoints mais críticos (maior uso ou maior impacto).

2. Execute medições — use ferramentas disponíveis:
   - `curl` com `-w "%{time_total}"` para medições simples
   - `k6` se instalado: `k6 run script.js`
   - `ab` (Apache Bench): `ab -n 100 -c 10 http://url/`
   - `hey` se instalado

3. Métricas a coletar por endpoint:
   - Tempo de resposta médio
   - Tempo de resposta P95 (se ferramenta suportar)
   - Taxa de erro sob carga

4. **Thresholds de referência:**

   | Tempo de resposta | Classificação |
   |-------------------|---------------|
   | < 200ms | ✅ Excelente |
   | 200ms – 500ms | ⚠️ Aceitável |
   | 500ms – 1s | ⚠️ Lento |
   | > 1s | ❌ Crítico |

5. **Gere relatório:**

```
## Performance Test — AAAA-MM-DD HH:MM
**Ferramenta:** curl / k6 / ab

| Endpoint | Média | P95 | Classificação |
|----------|-------|-----|---------------|
| GET /api/products | 85ms | 120ms | ✅ Excelente |
| POST /api/orders  | 720ms | 1.2s | ❌ Crítico |

### Recomendações
- POST /api/orders: investigar query N+1 ou falta de índice
```

6. Para endpoints críticos, sugira criar tarefa no backlog via `/xp-plan`.

---

## Modo 4 — SECURITY

**O que é:** testa dinamicamente o app em execução em busca de vulnerabilidades comuns (OWASP Top 10).

**Pré-requisito:** app rodando em ambiente de teste — **nunca rode contra produção**.

### Fluxo

1. **Confirme o ambiente** — pergunte explicitamente:
   > "Confirma que estamos rodando contra um ambiente de teste, não produção?"
   Se for produção, recuse e oriente a usar um ambiente dedicado.

2. **Execute verificações dinâmicas:**

   - **Headers de segurança** — verifique presença de:
     `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`

   - **Exposição de informações** — endpoints retornam stack trace ou dados internos em erros?

   - **Autenticação** — endpoints protegidos retornam 401/403 sem token? Token expirado é rejeitado?

   - **Injeção básica** — campos de input rejeitam `' OR 1=1`, `<script>alert(1)</script>`?

   - **Rate limiting** — múltiplas requisições seguidas são limitadas?

   - **CORS** — origins não autorizadas são rejeitadas?

   - **Dependências** — rode auditoria de deps (`npm audit`, `pip-audit`, etc.) se ainda não foi feita.

3. **Gere relatório:**

```
## Security Test — AAAA-MM-DD HH:MM

| Verificação | Status | Observação |
|-------------|--------|------------|
| Headers de segurança | ⚠️ Parcial | CSP ausente |
| Exposição de erros | ✅ OK | Erros não expõem stack |
| Autenticação | ✅ OK | 401 correto sem token |
| Injeção básica | ✅ OK | Inputs sanitizados |
| Rate limiting | ❌ Ausente | Sem limite configurado |
| CORS | ✅ OK | Origins restritas |
| Auditoria de deps | ⚠️ 2 moderadas | Ver npm audit |

**Resultado: X/Y verificações OK**
```

4. Para cada ❌ ou ⚠️, descreva o risco e recomende a correção.
5. Vulnerabilidades críticas: sugira `/xp-help` imediato. Melhorias: sugira adicionar ao backlog.

---

## Comportamento geral

- Sempre informe qual ferramenta está usando e por quê.
- Se uma ferramenta necessária não estiver instalada, informe e sugira alternativa disponível.
- Nunca execute testes de segurança ou performance contra produção sem confirmação explícita.
- Falhas encontradas em qualquer modo podem virar tarefas via `/xp-plan` ou investigações via `/xp-help`.
- Ao final de qualquer modo, pergunte: "Quer que eu adicione os problemas encontrados ao backlog?"
