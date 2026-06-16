# .env.example

**Local:** raiz do projeto
**Propósito:** template de variáveis de ambiente — deve refletir exatamente o que o app precisa, explicado o suficiente para qualquer dev configurar sozinho.

## Fluxo de validação

1. **Leia o `.env.example`** atual (se existir)
2. **Leia o `.env`** e identifique variáveis presentes no `.env` mas ausentes ou diferentes no `.env.example`
3. **Leia o código** — procure por `process.env.`, `os.environ`, `config.get()` ou equivalente na stack
4. **Compare as três fontes** e identifique gaps
5. **Proponha o `.env.example` atualizado** ao dev antes de salvar

## Formato do .env.example

```bash
# ============================================================
# SERVIDOR
# ============================================================

# Porta em que o servidor vai escutar
# Padrão: 3000
PORT=3000

# Ambiente de execução
# Opções: development | test | staging | production
NODE_ENV=development

# ============================================================
# BANCO DE DADOS
# ============================================================

# URL de conexão com o PostgreSQL
# Formato: postgresql://usuario:senha@host:porta/banco
# Exemplo local com Docker: postgresql://postgres:postgres@localhost:5432/myapp
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp_dev

# ============================================================
# AUTENTICAÇÃO
# ============================================================

# Chave secreta para assinar tokens JWT
# Gere com: openssl rand -base64 32
# NUNCA use o valor padrão em produção
JWT_SECRET=troque-este-valor-em-producao

# Tempo de expiração do token JWT
# Formato: vercel/ms (ex: 7d, 24h, 60m)
JWT_EXPIRES_IN=7d
```

## Regras obrigatórias
- **Toda variável tem comentário** explicando para que serve
- **Valores sensíveis** (senhas, chaves) têm aviso explícito de não usar em produção
- **Variáveis com opções fixas** listam as opções possíveis (`development | test | production`)
- **Variáveis com formato específico** mostram o formato e um exemplo
- **Variáveis opcionais** são marcadas como tal
- **`.env` nunca é commitado** — só `.env.example`
