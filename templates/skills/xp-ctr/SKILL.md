---
name: xp-ctr
description: Gerencia o contrato do projeto (.xp/contract.md) — as regras ativas que todo chat e agente deve respeitar. Use para adicionar, listar ou remover regras do projeto.
argument-hint: "[adicionar|listar|remover]"
allowed-tools: Read, Write, Edit
disable-model-invocation: true
---

# /xp-ctr — Contrato do Projeto

Você é o par de programação. Esta skill gerencia o `.xp/contract.md` — o conjunto de regras ativas que todo chat e agente deve respeitar neste projeto.

## Argumento

$ARGUMENTS

---

## Modos de uso

### Sem argumento — abre o menu

Se nenhum argumento foi passado, apresente as opções:

> "O que você quer fazer com o contrato do projeto?"
> 1. **Adicionar** uma nova regra
> 2. **Listar** as regras ativas
> 3. **Remover** uma regra que não se aplica mais
> 4. **Revisar** o contrato completo

---

### Adicionar regra

Colete as informações necessárias:

- **Categoria** da regra — pergunte ou infira pelo contexto:
  - `Negócio` — regra do domínio ("pedido cancelado não pode ser reativado")
  - `Infra` — ambiente, deploy, banco ("nunca conectar direto no banco de produção")
  - `Arquitetura` — decisões estruturais ("toda API retorna envelope `{ data, error }`")
  - `Convenção` — padrões do time ("nomes de arquivos em kebab-case")
  - `Segurança` — restrições de segurança ("nunca logar dados sensíveis do usuário")

- **A regra em si** — uma frase direta, no imperativo. Deve ser clara o suficiente para que um agente entenda sem contexto adicional.

- **Origem** — de onde veio essa regra (ADR, incidente, decisão de negócio). Se vier do `/xp-adr`, registre o número do ADR.

Adicione no `.xp/contract.md` no formato da seção correspondente.

---

### Remover regra

Mostre as regras da categoria relevante e confirme com o dev antes de remover. Regras removidas não somem — são movidas para a seção `## Revogadas` com a data e motivo.

---

## Formato do `.xp/contract.md`

Se o arquivo não existir, crie com esta estrutura:

```markdown
# Contrato do Projeto

> Regras ativas que todo chat e agente deve respeitar.
> Gerado e mantido pelo par via `/xp-ctr`.

## Negócio
<!-- Regras do domínio -->

## Infra
<!-- Ambiente, deploy, banco -->

## Arquitetura
<!-- Decisões estruturais -->

## Convenção
<!-- Padrões do time -->

## Segurança
<!-- Restrições de segurança -->

## Revogadas
<!-- Regras que não se aplicam mais — mantidas para histórico -->
```

Cada regra dentro de uma seção segue o formato:

```markdown
- **[regra direta no imperativo]**
  _Origem: [ADR-NNN / decisão de negócio / incidente / etc]_
```

Exemplo:

```markdown
## Negócio
- **Pedido cancelado não pode ser reativado.**
  _Origem: ADR-003-ciclo-de-vida-do-pedido_

## Infra
- **Nunca conectar diretamente no banco de produção — use sempre a réplica de leitura.**
  _Origem: Incidente 2024-03-15_
```

---

## Comportamento

- O `.xp/contract.md` deve ser legível por um agente sem contexto adicional — escreva regras autoexplicativas.
- Se uma regra for vaga demais ("fazer certo"), peça para o dev ser mais específico antes de adicionar.
- Nunca remova uma regra sem mover para `## Revogadas` — o histórico importa.
- Se identificar regras duplicadas ou conflitantes durante uma adição, aponte antes de salvar.
