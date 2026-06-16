---
name: xp-deploy
description: Configura, audita ou valida o processo de deploy (build, variáveis de ambiente, CI/CD), agnóstico de plataforma. Use quando o dev quer configurar ou revisar o deploy do projeto.
argument-hint: "[configurar|validar|variáveis]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
disable-model-invocation: true
---

# /xp-deploy — Configuração e Validação de Deploy

Você é o par de programação. Vamos configurar, revisar ou validar o processo de deploy do projeto.

Esta skill é agnóstica de plataforma — detecta o ambiente do projeto e adapta o fluxo. Segue o ciclo de infra do `/xp-tdd`: validar estado atual → configurar mínimo → refinar.

## Modo de uso

```
/xp-deploy              → auditoria: detecta plataforma e lista o que está ok e o que falta
/xp-deploy configurar   → guia a configuração do deploy do zero
/xp-deploy validar      → valida se o deploy atual está saudável e seguro
/xp-deploy variáveis    → revisa variáveis de ambiente de produção
```

$ARGUMENTS

Se nenhum argumento foi passado, execute o **modo auditoria**.

---

## Modo Auditoria (sem argumento)

1. **Detecte a plataforma de deploy** — leia os arquivos do projeto:

| Arquivo encontrado | Plataforma |
|-------------------|------------|
| `vercel.json` / `.vercel/` | Vercel |
| `fly.toml` | Fly.io |
| `railway.json` / `railway.toml` | Railway |
| `render.yaml` | Render |
| `Dockerfile` + `docker-compose.yml` | Docker |
| `.github/workflows/*.yml` com deploy | GitHub Actions |
| `appspec.yml` | AWS CodeDeploy |
| `app.yaml` | Google App Engine |
| `Procfile` | Heroku / Railway |
| Nenhum encontrado | Não configurado |

2. **Avalie os 6 pilares de deploy:**

| Pilar | O que verifica |
|-------|---------------|
| **Build** | Processo de build definido e funcional |
| **Variáveis de ambiente** | `.env.example` completo, produção configurada separadamente |
| **Healthcheck** | Endpoint de saúde definido e monitorado |
| **Rollback** | Estratégia de rollback em caso de falha |
| **CI/CD** | Pipeline automatizado de deploy |
| **Segurança** | Secrets não expostos, HTTPS, headers de segurança |

3. **Gere o relatório:**

```markdown
## Auditoria de Deploy — AAAA-MM-DD
**Plataforma detectada:** [nome]

| Pilar | Status | Observação |
|-------|--------|------------|
| Build | ✅ OK | npm run build configurado |
| Variáveis | ⚠️ Parcial | DATABASE_URL ausente no ambiente de produção |
| Healthcheck | ❌ Ausente | Sem endpoint /health |
| Rollback | ⚠️ Parcial | Sem estratégia definida |
| CI/CD | ✅ OK | GitHub Actions configurado |
| Segurança | ⚠️ Parcial | HTTPS ok, falta HSTS |

**Score: X/6 pilares OK**
```

4. Pergunte: "Quer configurar os pilares com problema agora?"

---

## Modo Configurar

### Passo 1 — Identifique a plataforma

Se não foi detectada automaticamente, pergunte:
> "Qual plataforma vamos usar para deploy? (Vercel, Fly.io, Railway, Render, Docker, AWS, GCP, outro)"

### Passo 2 — Build

Verifique se existe um comando de build definido:
- `package.json` → script `build`
- `Makefile` → target `build`
- `Dockerfile` → stage de build

Se não existir, defina junto com o dev. Rode o build localmente para confirmar que passa antes de configurar o deploy.

### Passo 3 — Variáveis de ambiente de produção

1. Leia o `.env.example` — lista todas as variáveis necessárias
2. Para cada variável, classifique:

| Tipo | Exemplos | Como configurar |
|------|---------|-----------------|
| **Segredo** | `JWT_SECRET`, `DATABASE_URL`, `API_KEY` | Painel da plataforma / secrets manager — nunca no código |
| **Configuração** | `NODE_ENV`, `PORT`, `LOG_LEVEL` | Variável de ambiente padrão da plataforma |
| **Feature flag** | `FEATURE_X_ENABLED` | Variável de ambiente |

3. Confirme com o dev que todas estão configuradas no ambiente de produção.

### Passo 4 — Healthcheck

Se não existir endpoint de healthcheck, proponha criar:

```typescript
// Exemplo Node.js/Express
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
})
```

Configure na plataforma:
- **Vercel:** não requer (serverless)
- **Fly.io:** `[http_service] → internal_port` + `[[services.http_checks]]`
- **Railway:** Health Check Path no painel
- **Docker:** `HEALTHCHECK CMD curl -f http://localhost:PORT/health`

### Passo 5 — CI/CD

Se não existir pipeline, proponha um fluxo básico para a stack detectada:

```yaml
# Exemplo GitHub Actions — Node.js
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        # comando específico da plataforma
```

**Regra:** deploy só acontece após lint + typecheck + testes passando. Nunca deploy direto sem CI.

### Passo 6 — Rollback

Defina junto com o dev a estratégia de rollback:

| Estratégia | Quando usar | Como |
|------------|------------|------|
| **Redeploy da versão anterior** | Maioria dos casos | Plataforma com histórico de deploys |
| **Feature flag** | Features de risco | Desabilitar sem redeploy |
| **Blue/Green** | Zero downtime obrigatório | Duas instâncias, troca de tráfego |

Documente a estratégia escolhida em `docs/doc_setup.md`.

---

## Modo Validar

Verifica se o deploy atual está saudável:

1. **Healthcheck** — chama o endpoint `/health` (ou equivalente) e verifica resposta
2. **Variáveis** — confirma que todas as variáveis do `.env.example` estão presentes no ambiente (sem expor os valores)
3. **Build reproduzível** — o build roda localmente sem erros?
4. **Dependências** — `npm audit` / equivalente sem vulnerabilidades críticas
5. **Logs** — há erros recorrentes nos logs de produção? (se o dev tiver acesso)

---

## Modo Variáveis

Auditoria focada em variáveis de ambiente:

1. Leia `.env.example` — lista de variáveis esperadas
2. Pergunte ao dev quais estão configuradas no ambiente de produção
3. Identifique:
   - Variáveis no `.env.example` mas não em produção → **gap crítico**
   - Variáveis em produção mas não no `.env.example` → **não documentadas**
   - Variáveis com valores padrão inseguros (`troque-este-valor`) → **risco de segurança**

4. Gere checklist para o dev resolver:

```markdown
## Checklist de Variáveis — Produção

- [ ] DATABASE_URL configurada no painel
- [ ] JWT_SECRET com valor forte (não o padrão)
- [ ] NODE_ENV=production
- [ ] SMTP_PASSWORD configurada (não exposta no código)
```

---

## Comportamento

- Nunca exponha valores de variáveis de ambiente — trabalhe com nomes, não valores.
- Se detectar secrets hardcoded no código durante a análise, aponte imediatamente como risco crítico.
- Adapte os exemplos de configuração para a plataforma e stack detectadas — não use exemplos genéricos.
- Ao final de qualquer modo, sugira commitar as configurações adicionadas com: `infra: configurar deploy [plataforma]`
