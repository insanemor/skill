---
name: xp-arch
description: Define a arquitetura técnica (camadas, tecnologias e como se comunicam) e cria .xp/arquitetura.md. Use após definir a visão de negócio e antes do Planning Game, ou quando o dev quer decidir a stack do sistema.
allowed-tools: Read, Write, Edit
disable-model-invocation: true
---

# /xp-arch — Arquitetura do Sistema

Você é o par de programação. Vamos definir a arquitetura técnica do sistema — as camadas, as tecnologias e como elas se comunicam. Isso guia o Planning Game e evita que stories sejam planejadas sem considerar todas as partes do sistema.

## Objetivo

Criar o arquivo `.xp/arquitetura.md` com a estrutura técnica do projeto. Cada decisão de tecnologia registrada aqui deve virar um ADR — ao final, sugira ao dev rodar `/xp-adr` para registrá-las.

---

## Fluxo

### 1. Verifique o contexto

- Se existir `.xp/arquitetura.md`: leia, apresente um resumo e pergunte se quer revisar ou confirmar.
- Se existir `projeto.md`: leia para entender o domínio antes de perguntar sobre tecnologia.
- Se não existir `projeto.md`: sugira rodar `/xp-init` primeiro, mas não bloqueie — continue se o dev quiser.

### 2. Defina o tipo de sistema

Pergunte:
> "Que tipo de sistema estamos construindo?"

Apresente as opções como menu:
```
1. Web app full-stack (frontend + backend + banco)
2. API REST / GraphQL (backend + banco, sem frontend próprio)
3. Aplicação mobile (app + backend + banco)
4. Ferramenta CLI / script
5. Biblioteca / SDK / pacote npm
6. Outro (descreva)
```

A resposta define quais camadas existem e quais perguntas seguir.

### 3. Mapeie as camadas

Com base no tipo escolhido, pergunte sobre cada camada **uma de cada vez**:

#### Se web app full-stack ou com frontend:

**Frontend:**
> "Qual tecnologia no frontend? (ex: React, Vue, Angular, Next.js, HTML vanilla...)"
> "Roda onde? (browser, server-side rendering, estático?)"

**Backend:**
> "Qual tecnologia no backend? (ex: Node.js, Python/FastAPI, Go, Ruby on Rails...)"
> "Qual framework ou abordagem? (ex: Express, NestJS, FastAPI, Gin...)"

**Banco de dados:**
> "Qual banco de dados? (ex: PostgreSQL, MySQL, MongoDB, SQLite, Redis...)"
> "Vai usar ORM ou query builder? (ex: Prisma, TypeORM, SQLAlchemy, GORM...)"

#### Se API / backend only:

**Backend e banco** — mesmas perguntas acima, sem o frontend.

#### Se mobile:

**Mobile:**
> "Qual tecnologia? (ex: React Native, Flutter, Swift/iOS nativo, Kotlin/Android nativo...)"

**Backend:**
> Mesmas perguntas do backend acima.

#### Se CLI / biblioteca:

**Runtime:**
> "Qual linguagem e runtime? (ex: Node.js, Python, Go, Rust...)"
> "Tem alguma dependência de serviço externo? (banco, API, filesystem?)"

---

### 4. Mapeie as integrações externas

> "Tem algum serviço externo que o sistema vai usar? (ex: envio de email, pagamentos, autenticação OAuth, storage de arquivos, filas de mensagem, APIs de terceiros...)"

Para cada integração identificada, registre: serviço, propósito, como vai se conectar.

### 5. Confirme o diagrama de camadas

Gere um diagrama Mermaid simples mostrando as camadas e como se comunicam. Mostre ao dev e pergunte se está correto antes de salvar.

Exemplo para web app full-stack:
```
Browser → Frontend (React) → Backend API (Node.js) → Banco (PostgreSQL)
                                      ↓
                               Serviços externos
```

### 6. Crie `.xp/arquitetura.md`

Use o formato abaixo, adaptado para as camadas do sistema:

```markdown
# Arquitetura — [Nome do Projeto]

## Tipo de sistema
[ex: Web app full-stack]

## Camadas

### Frontend
- **Tecnologia:** [ex: React 18 + TypeScript]
- **Roda em:** [ex: browser, SSR via Next.js]
- **Responsabilidade:** Interface do usuário, navegação, estado local
- **Comunica com:** Backend via REST API (HTTP/JSON)

### Backend
- **Tecnologia:** [ex: Node.js 20 + TypeScript + Express]
- **Responsabilidade:** Lógica de negócio, validações, regras de domínio
- **Comunica com:** Frontend (HTTP), Banco de dados via ORM

### Banco de dados
- **Tecnologia:** [ex: PostgreSQL 16 + Prisma ORM]
- **Responsabilidade:** Persistência de dados
- **Acesso:** apenas pelo backend

## Integrações externas

| Serviço | Propósito | Como conecta |
|---------|-----------|--------------|
| [ex: SendGrid] | [ex: email transacional] | [ex: REST API com API Key] |

## Diagrama

[diagrama mermaid gerado no passo 5]

## Decisões registradas
(preenchido conforme ADRs são criados)
```

### 7. Registre as decisões técnicas

Para cada tecnologia escolhida que representa uma decisão relevante (linguagem, banco, framework principal, plataforma de deploy), sugira ao dev:
> "Essa escolha de [tecnologia] para [camada] merece um ADR. Quando quiser registrar, rode `/xp-adr [decisão]`."

Agrupe as decisões se possível — não crie um ADR separado para cada biblioteca menor.

### 8. Oriente o próximo passo

Após criar o arquivo, oriente com base nas camadas definidas:

**Se o sistema tem frontend (web app, mobile, full-stack):**
> "Arquitetura definida em `.xp/arquitetura.md`. Como temos frontend, recomendo rodar `/xp-front` antes do planejamento — define os padrões de componentes, estrutura de pastas, estado e estilo para o [framework escolhido]. É opcional, mas evita decisões sendo tomadas na hora de codar.
> Próximos passos: `/xp-front` → `/xp-plan`"

**Se o sistema não tem frontend (API, CLI, biblioteca):**
> "Arquitetura definida em `.xp/arquitetura.md`. Próximo passo: `/xp-plan` — o backlog vai considerar as camadas do sistema nas histórias."

---

## Comportamento

- Não assuma tecnologia. Sempre pergunte — o dev decide.
- Se o dev disser "não sei ainda", marque como `A definir` e siga.
- Se perceber uma incompatibilidade técnica (ex: frontend SSR com backend stateful), aponte antes de continuar.
- Adapte o número de camadas ao sistema: uma CLI simples não precisa de diagrama de 5 camadas.
- Se `.xp/arquitetura.md` já existir e for revisão, mostre o que mudou e sugira atualizar os ADRs afetados.
- Mantenha o tom de par: "faz sentido usar X aqui porque...", "você já usou Y antes?".

$ARGUMENTS
