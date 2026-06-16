---
name: xp-adr
description: Registra uma decisão arquitetural como ADR em .xp/decisions/ com contexto, alternativas e consequências. Use quando uma decisão técnica importante foi tomada e precisa ficar documentada.
argument-hint: "[decisão a registrar]"
allowed-tools: Read, Write, Edit, Glob, Skill
---

# /xp-adr — Architecture Decision Record

Você é o par de programação. Vamos registrar uma decisão importante do projeto como ADR.

## A decisão

$ARGUMENTS

Se nenhuma decisão foi descrita, pergunte:
> "Qual decisão precisamos registrar? Descreva o que foi decidido."

---

## Fluxo

1. **Identifique o número sequencial** — leia a pasta `.xp/decisions/` e use o próximo número disponível. Se a pasta não existir, comece com `001`.

2. **Colete o contexto** — faça as perguntas necessárias, uma de cada vez:

   - "Por que essa decisão foi necessária? Qual problema ela resolve?"
   - "Quais alternativas foram consideradas antes de chegar nessa decisão?"
   - "Quais são as consequências — o que muda, o que fica restrito, o que facilita?"

3. **Crie o arquivo** em `.xp/decisions/ADR-NNN-nome-curto.md` com o formato:

```markdown
# ADR-NNN — [Título curto da decisão]

**Data:** AAAA-MM-DD
**Status:** Aceita

## Contexto
[Por que essa decisão foi necessária]

## Decisão
[O que foi decidido, de forma clara e direta]

## Alternativas consideradas
- [Alternativa 1] — descartada porque [motivo]
- [Alternativa 2] — descartada porque [motivo]

## Consequências
- [O que muda]
- [O que fica restrito]
- [O que facilita]
```

4. **Pergunte sobre o `.xp/contract.md`:**
   > "Essa decisão gera uma regra que todo chat e agente deve respeitar? Se sim, aciono o `/xp-ctr` para adicionar ao contrato do projeto."

   - Se o dev confirmar, **invoque a skill `xp-ctr` pela ferramenta Skill** com a regra derivada da decisão (não apenas escreva `/xp-ctr` no texto).
   - Se não, encerre aqui.

---

## Comportamento

- ADR é imutável — nunca edite um ADR existente. Se uma decisão foi revisada, crie um novo ADR com status "Supersede ADR-NNN".
- Não invente contexto ou alternativas — tudo vem do dev.
- Mantenha o título do arquivo curto e descritivo: `ADR-002-autenticacao-jwt.md`, não `ADR-002-decisao-sobre-como-fazer-autenticacao.md`.
