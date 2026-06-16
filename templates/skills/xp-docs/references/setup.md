# docs/doc_setup.md

**Local:** docs/doc_setup.md
**Propósito:** guia completo para configurar o ambiente de desenvolvimento do zero.

## Estrutura

```markdown
# Setup do Ambiente

## Pré-requisitos

| Ferramenta | Versão mínima | Como instalar |
|-----------|--------------|---------------|
| Node.js | 20.x | https://nodejs.org |
| Docker | 24.x | https://docker.com |
| PostgreSQL | 15.x | via Docker (recomendado) |

## Passo a passo

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/org/projeto.git
cd projeto
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configure as variáveis de ambiente
\`\`\`bash
cp .env.example .env
# Edite .env com seus valores locais
\`\`\`

### 4. Suba os serviços (banco, cache, etc.)
\`\`\`bash
docker compose up -d
\`\`\`

### 5. Rode as migrations
\`\`\`bash
npm run db:migrate
\`\`\`

### 6. (Opcional) Popule com dados de seed
\`\`\`bash
npm run db:seed
\`\`\`

### 7. Inicie o servidor
\`\`\`bash
npm run dev
\`\`\`

## Comandos disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento com hot reload |
| `npm test` | Roda todos os testes |
| `npm run lint` | Analisa o código |
| `npm run build` | Gera build de produção |

## Problemas comuns

### Erro: "Cannot connect to database"
[Causa e solução]

### Erro: "Port 3000 already in use"
[Causa e solução]
```

## Boas práticas
- Teste o setup do zero em uma máquina limpa periodicamente
- Documente erros comuns à medida que acontecem
- Versione as ferramentas com precisão — evita "funciona na minha máquina"

## Convenção de branches

Quando o `/xp-standards branches` define a convenção, documente-a aqui na seção "Contribuindo":

```markdown
## Convenção de branches

Formato: `<tipo>/<id-opcional>-<descrição>`

Exemplos:
- `feat/42-login-google`
- `fix/87-email-duplicado`
- `docs/atualizar-setup`
```
