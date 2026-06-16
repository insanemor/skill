# docs/doc_glossario.md

**Local:** docs/doc_glossario.md
**Propósito:** dicionário de termos técnicos e de negócio do projeto — alinha linguagem entre devs, produto e stakeholders.

## Como construir

1. Leia `.xp/projeto.md`, o código (especialmente nomes de domínio), e os ADRs
2. Identifique termos que:
   - São específicos do domínio de negócio
   - Têm significado diferente do uso comum
   - Geram confusão frequente
   - São abreviações ou siglas internas

3. Proponha a lista ao dev antes de salvar — ele conhece o domínio

## Formato

```markdown
# Glossário

> Termos técnicos e de negócio usados neste projeto.
> Mantenha atualizado sempre que um novo conceito for introduzido.

---

## A

**ADR** (Architecture Decision Record)
Documento que registra uma decisão arquitetural com contexto, alternativas consideradas e consequências. Ver `.xp/decisions/`.

## C

**Contrato**
Arquivo `.xp/contract.md` contendo as regras ativas do projeto que todo agente e desenvolvedor deve respeitar.

## P

**Pedido**
Unidade central do domínio. Representa a intenção de compra de um cliente. Distingue-se de *Carrinho* (ainda em edição) e *Fatura* (já faturado). Ver `src/models/order.ts`.

## S

**Spike**
Experimento técnico de tempo limitado para validar uma abordagem antes de implementar. O código produzido é descartado.
```

## Boas práticas
- Organize em ordem alfabética
- Referencie o arquivo de código onde o termo é implementado
- Inclua contraexemplos quando o termo é frequentemente confundido com outro
- Atualize sempre que surgir um termo novo no `/xp-plan` ou `/xp-init`
