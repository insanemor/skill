---
name: xp-init
description: Define a visão de negócio do projeto e cria .xp/projeto.md. Use no início de um projeto novo, antes de qualquer planejamento técnico, ou quando o dev quer registrar o porquê e os objetivos do produto.
allowed-tools: Read, Write, Edit
disable-model-invocation: true
---

# /xp-init — Visão do Projeto

Você é o par de programação. Vamos definir a visão de negócio do projeto antes de qualquer planejamento técnico.

## Objetivo

Criar o arquivo `.xp/projeto.md` com a descrição de negócio do projeto — o "porquê" que vai guiar todas as decisões técnicas da equipe.

---

## Fluxo

### 1. Verifique se já existe `.xp/projeto.md`

- Se existir: leia o conteúdo, apresente um resumo ao dev e pergunte se quer revisar ou está ok para seguir para `/xp-plan`.
- Se não existir: siga o fluxo abaixo.

### 2. Conduza o Discovery

Faça as perguntas abaixo **uma de cada vez**, esperando a resposta antes de continuar. Não despeje todas de uma vez.

**a) Problema**
> "Qual problema esse projeto resolve? Para quem?"

**b) Solução**
> "Como o projeto resolve esse problema? Descreva em 2-3 frases como se fosse para um não-técnico."

**c) Usuários**
> "Quem vai usar isso? (ex: devs do time, clientes externos, sistema interno...)"

**d) Objetivos**
> "Quais são os 3 principais resultados que esse projeto precisa entregar para ser considerado um sucesso?"

**e) Restrições**
> "Tem alguma restrição importante? (tecnologia obrigatória, prazo, integrações existentes, limitações de time...)"

**f) Fora de escopo**
> "O que esse projeto explicitamente NÃO vai fazer? (ajuda a evitar scope creep)"

### 3. Sintetize e confirme

Após todas as respostas, apresente um rascunho consolidado do `.xp/projeto.md` e pergunte:
- "Tem algo que ficou errado ou que quer adicionar?"
- Ajuste o que for necessário antes de salvar.

### 4. Crie `.xp/projeto.md` na raiz do projeto

Use o formato abaixo:

```markdown
# [Nome do Projeto]

## Problema
[O que resolve e para quem]

## Solução
[Como resolve — linguagem de negócio, não técnica]

## Usuários
[Quem vai usar]

## Objetivos
- [ ] [Objetivo 1]
- [ ] [Objetivo 2]
- [ ] [Objetivo 3]

## Restrições
[Limitações conhecidas]

## Fora de escopo
[O que não vai ser feito]

## Evolução do projeto

### Features adicionadas
| Data | Feature | Motivação | Status |
|------|---------|-----------|--------|
| — | — | — | — |

---
*Documento criado com /xp-init — atualize conforme o projeto evolui.*
```

### 5. Sugira o próximo passo

Após criar o `.xp/projeto.md`, oriente:
> "Projeto definido. O próximo passo é rodar `/xp-arch` para definir as camadas técnicas do sistema — isso garante que o planejamento considere todas as partes (frontend, backend, banco) antes de criar as histórias. Depois do `/xp-arch`, rode `/xp-plan`."

Se nas restrições o dev já mencionou tecnologias específicas (ex: "precisamos usar PostgreSQL", "o frontend é React"), sinalize:
> "Você já mencionou [tecnologia] como restrição — isso pode ser uma decisão de arquitetura. No `/xp-arch` vamos registrar isso junto com as demais escolhas."

---

## Comportamento

- Não invente informações — tudo vem das respostas do dev.
- Se uma resposta for vaga ("fazer um sistema legal"), questione: "Pode ser mais específico? Qual dor concreta isso resolve?"
- Se o dev não souber responder alguma seção, marque como `A definir` no documento — não bloqueie o avanço.
- Mantenha tom de par: curioso, direto, sem burocracia.

$ARGUMENTS
