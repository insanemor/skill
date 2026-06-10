---
name: sem-gambiarra
description: >-
  Impede workarounds e gambiarras na implementação de código. Exige corrigir a
  causa raiz, seguir padrões do projeto e recusar atalhos frágeis. Use ao
  implementar, codar, corrigir bug, refatorar, revisar código ou quando o
  usuário mencionar gambiarra, guabiarra, workaround, hack, fix rápido,
  solução temporária, sem gambiarra ou código limpo.
---

# Sem Gambiarra

Durante **qualquer** implementação ou correção, priorize solução correta e sustentável — não atalho que "funciona por agora".

## O que é gambiarra (proibido)

| Gambiarra | Por que evitar |
|-----------|----------------|
| `try/catch` vazio ou que engole erro | Esconde falha real |
| `@ts-ignore`, `eslint-disable`, `noqa` sem corrigir | Mascara problema de tipo ou lint |
| `sleep`, retry cego ou polling sem entender a causa | Mascara race condition ou timing |
| Copiar/colar lógica em vez de reutilizar o que já existe | Duplicação e divergência futura |
| Flag, `if` ou env var só para contornar bug | Não corrige a origem |
| Hardcode mágico (timeout, ID, URL, chave) sem justificativa | Quebra em outro ambiente |
| Wrapper ou camada extra só para não mexer no código certo | Aumenta complexidade sem valor |
| Comentário "TODO: arrumar depois" como entrega | Dívida técnica imediata |
| Mudança em arquivo/pasta errado para "não quebrar outra coisa" | Sintoma de design ou escopo mal entendido |
| Dependência nova para resolver o que o stack já resolve | Bloat e manutenção |

## Princípios (sempre)

1. **Entender antes de codar** — leia código adjacente, contratos, testes e o fluxo real. Não chute.
2. **Causa raiz** — trate o sintoma só se a causa já estiver identificada e corrigida, ou se for mitigação documentada e temporária com critério de saída.
3. **Padrão do projeto** — nome, estrutura, libs e abstrações já usadas no repositório vencem "minha preferência".
4. **Escopo mínimo correto** — a menor mudança que resolve bem; não over-engineer, mas também não empurrar complexidade para depois.
5. **Falhar de forma honesta** — erro claro e mensagem útil > comportamento silencioso ou aleatório.
6. **Testar o que mudou** — rode testes, lint ou reprodução manual pertinente antes de considerar pronto.

## Fluxo antes de implementar

```
1. Qual é o problema real? (não só o erro na tela)
2. Onde está a origem no código ou na arquitetura?
3. Existe solução já usada neste repo para caso parecido?
4. A mudança proposta resolve a causa ou só o sintoma?
5. Alguém daqui entenderia em 6 meses sem contexto do chat?
```

Se a resposta de (4) for "só o sintoma", **pare** e busque a correção adequada ou explique ao usuário o trade-off antes de seguir.

## Quando pausar e avisar o usuário

Avise explicitamente (não implemente gambiarra em silêncio) se:

- a correção correta exige mudança maior que o pedido original;
- falta contexto (API, regra de negócio, ambiente);
- há duas abordagens válidas com custo bem diferente;
- o prazo implícito conflita com solução sustentável.

Formato sugerido:

```markdown
**Risco de gambiarra:** [o atalho tentador]
**Causa raiz:** [o que realmente precisa mudar]
**Proposta:** [solução correta, escopo e impacto]
```

## Exceções aceitáveis (raras)

Só use atalho quando **todas** forem verdadeiras:

- [ ] Causa raiz conhecida e issue/tarefa de follow-up criada (ou combinada com o usuário)
- [ ] Comentário curto explica **por que** é temporário e **o que** falta fazer
- [ ] Escopo limitado e reversível
- [ ] Usuário optou conscientemente pelo trade-off após você apresentar a alternativa correta

Sem esses critérios, **não** entregue workaround como solução final.

## Checklist antes de concluir

- [ ] Nenhum suppress de lint/type/test sem justificativa documentada
- [ ] Nenhum código morto ou caminho "só por garantia" sem uso real
- [ ] Reutilizei funções/componentes/módulos existentes quando coube
- [ ] Nomes e tipos refletem o domínio, não o hack (`tempFix`, `hackTimeout`)
- [ ] A mudança não aumenta acoplamento só para evitar editar outro arquivo
- [ ] Validei com teste, lint ou reprodução do cenário original

## Exemplos

**Gambiarra — não fazer:**
```typescript
// @ts-ignore
await fetch(url);
```

**Correto:**
```typescript
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`fetch failed: ${response.status}`);
}
```

**Gambiarra — não fazer:**
```python
time.sleep(2)  # às vezes funciona
result = api.get_status()
```

**Correto:** entender por que a API não está pronta (evento, webhook, estado) e sincronizar pelo mecanismo adequado (retry com backoff + condição de saída, fila, etc.).

**Gambiarra — não fazer:** duplicar validação de email em três handlers.

**Correto:** extrair ou chamar validador já existente no projeto, no lugar certo da camada.

## Relação com outras orientações

- Escopo mínimo **não** autoriza gambiarra — significa não refatorar o universo, mas fazer **certo** no trecho necessário.
- Se o usuário pedir explicitamente "só um workaround rápido", apresente o risco e a alternativa correta; só siga o atalho após confirmação e com exceção documentada acima.
