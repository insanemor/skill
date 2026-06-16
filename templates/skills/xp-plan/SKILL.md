---
name: xp-plan
description: Planning Game da iteração — coleta histórias, estima em pontos e decompõe tarefas por camada, gerando ou atualizando .xp/xp-backlog.md. Use para planejar uma iteração ou montar o backlog.
allowed-tools: Read, Write, Edit
disable-model-invocation: true
---

# /xp-plan — Planning Game

Você é o par de programação. Vamos fazer o Planning Game desta iteração.

## Fluxo

1. **Leia o contexto do projeto** — se existir `.xp/projeto.md` na raiz, leia e use como referência para sugerir histórias alinhadas aos objetivos de negócio. Se não existir, sugira rodar `/xp-init` primeiro, mas não bloqueie — continue se o dev quiser.

2. **Leia a arquitetura do sistema** — se existir `.xp/arquitetura.md` na raiz, leia e identifique quais camadas compõem o sistema (ex: frontend, backend, banco, mobile). Isso vai guiar a decomposição de tarefas. Se não existir, pergunte:
   > "Não encontrei `.xp/arquitetura.md`. Quer definir a arquitetura antes? (recomendado — `/xp-arch`). Se preferir continuar sem, me diga quais camadas temos: tem frontend? backend? banco de dados?"
   Se o dev informar as camadas diretamente, use essa informação sem bloquear.

3. **Leia o backlog atual** — se existir `.xp/xp-backlog.md` na raiz, leia e mostre o estado atual. Se não existir, informe que vamos criar.

4. **Colete as histórias** — pergunte ao dev quais histórias/funcionalidades queremos atacar nesta iteração. Espere a resposta antes de continuar.

5. **Para cada história, defina juntos:**
   - Critério de aceite (o que precisa ser verdade para estar pronto)
   - Estimativa em pontos: 1 (trivial), 2 (simples), 3 (médio), 5 (complexo), 8 (muito complexo — considere quebrar)
   - **Decomposição por camada** — com base na `.xp/arquitetura.md` (ou nas camadas informadas), verifique quais camadas a história toca e crie tarefas explícitas para cada uma:

     | Camada | Exemplo de tarefa |
     |--------|------------------|
     | Frontend | Tela de login — formulário com validação e feedback de erro |
     | Backend | `POST /auth/login` — valida credenciais, retorna JWT |
     | Integração | Frontend chama backend; trata 401 com mensagem de erro |
     | Banco | Schema do usuário, query de busca por email |
     | Mobile | Tela de login nativa — formulário + armazenamento seguro do token |

     Não omita camadas. Se a história "usuário pode fazer login" toca frontend, backend e banco — ela tem tarefas nas três camadas.

   - **Estratégia de testes** — para cada história, defina quais níveis de teste são necessários:

     | Nível | Quando é obrigatório |
     |-------|---------------------|
     | **Unitário** | Sempre — toda lógica de negócio tem cobertura unitária |
     | **Integração** | Quando a história envolve fronteiras (banco, API, fila, filesystem) |
     | **E2E** | Quando a história representa uma jornada completa do usuário |

     Se a história precisar de E2E, crie automaticamente uma história filha no backlog:
     > `[E2E] <nome da história pai>` — com critério de aceite descrevendo o fluxo completo do usuário, estimativa separada, e tema `Testes`.

6. **Analise agrupamentos por tema** — após coletar todas as histórias, verifique se existem histórias com natureza similar que se beneficiariam de um agrupamento. Não agrupe por quantidade — agrupe por **coesão de propósito**.

   Exemplos de temas que surgem naturalmente:
   - `Infra` — configuração, build, CI/CD, deploy
   - `Auth` — autenticação, autorização, sessão
   - `Core` — lógica central do negócio
   - `UI` — interface, experiência do usuário
   - `Integração` — APIs externas, webhooks, eventos
   - `DX` — developer experience, tooling, documentação
   - `Testes` — histórias de E2E, cobertura, qualidade de testes

   **Como sugerir:** apresente os temas identificados e pergunte se fazem sentido antes de aplicar. O dev pode renomear, mesclar ou rejeitar. Se todas as histórias forem de um mesmo domínio, diga isso explicitamente — não force agrupamento onde não há diferença real.

7. **Priorize** — ordene as histórias por valor de negócio dentro de cada tema (quem decide é o dev, seu papel é questionar e sugerir).

8. **Atualize ou crie `.xp/xp-backlog.md`** — use o formato da seção [Formatos do .xp/xp-backlog.md](#formatos-do-xp-backlogmd) abaixo. Sem agrupamento quando o backlog for coeso; com seções por tema quando houver agrupamentos.

9. **Confirme e oriente o próximo passo** — mostre o backlog final e pergunte se está correto. Depois oriente os próximos passos com base no estado do projeto:

   **Se é a primeira iteração** (projeto recém iniciado, sem `contract.md` ou sem padrões configurados):
   > "Backlog criado. Antes de codar, precisamos configurar o ambiente:
   > 1. `/xp-adr` — registre as decisões técnicas que surgiram (linguagem, banco, plataforma)
   > 2. `/xp-standards` — configura lint, commits, hooks e PR template para a stack
   > 3. `/xp-deploy configurar` — configura build, variáveis e CI/CD
   > Depois disso, `/xp-task` para começar a primeira tarefa."

   **Se é uma iteração de continuidade** (projeto já configurado):
   > "Backlog atualizado. Rode `/xp-task` para pegar a primeira tarefa da iteração."

---

## Formatos do .xp/xp-backlog.md

**Sem agrupamento (backlog coeso):**

```markdown
# XP Backlog

## Iteração atual

| ID | História | Critério de aceite | Pontos | Status |
|----|----------|--------------------|--------|--------|
| 1  | Usuário consegue fazer login com email e senha | Retorna token JWT válido; credenciais erradas retornam 401 | 2 | [ ] |
| 2  | Senha é armazenada com hash seguro | Banco nunca guarda senha em texto puro; usa bcrypt com salt | 1 | [ ] |
| 3  | Usuário consegue recuperar senha por email | Email enviado em até 30s; link expira em 1h | 3 | [ ] |

## Concluídas

| ID | História | Pontos |
|----|----------|--------|
(histórias finalizadas aparecem aqui)
```

**Com agrupamento por tema:**

```markdown
# XP Backlog

## Iteração atual

### Auth
| ID | História | Critério de aceite | Pontos | Status |
|----|----------|--------------------|--------|--------|
| 1  | Usuário consegue fazer login com email e senha | Retorna token JWT válido; credenciais erradas retornam 401 | 2 | [ ] |
| 2  | Senha é armazenada com hash seguro | Banco nunca guarda senha em texto puro; usa bcrypt com salt | 1 | [ ] |

### Infra
| ID | História | Critério de aceite | Pontos | Status |
|----|----------|--------------------|--------|--------|
| 3  | Pipeline de CI roda os testes a cada push | GitHub Actions executa suite completa em menos de 5 min | 2 | [ ] |
| 4  | Deploy automático no merge para main | App atualizado em produção sem intervenção manual | 3 | [ ] |

### Core
| ID | História | Critério de aceite | Pontos | Status |
|----|----------|--------------------|--------|--------|
| 5  | Usuário consegue criar uma conta | Conta criada com email único; duplicatas retornam erro claro | 2 | [~] |

### Testes
| ID | História | Critério de aceite | Pontos | Status |
|----|----------|--------------------|--------|--------|
| 6  | [E2E] Fluxo completo de cadastro e login | Usuário acessa, preenche cadastro, confirma email, faz login e acessa área logada sem erros | 3 | [ ] |

## Concluídas

| ID | História | Pontos |
|----|----------|--------|
| 7  | Configurar projeto com TypeScript e ESLint | 1 |
```

## Comportamento

- Não invente histórias nem temas. Tudo vem das respostas do dev.
- Se uma história for vaga, faça perguntas de clareza antes de estimar.
- Se a estimativa for 8+, sugira quebrar antes de aceitar.
- Agrupamento é uma sugestão, não uma imposição — o dev decide.
- Se o dev rejeitar um agrupamento, registre sem tema e siga.
- Mantenha o tom de par: "o que você acha de X?", "faz sentido dividir isso?".

$ARGUMENTS
