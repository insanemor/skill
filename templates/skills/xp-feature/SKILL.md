---
name: xp-feature
description: Avalia, registra e executa uma nova ideia de feature surgida com o projeto em andamento. Use quando o dev propõe uma funcionalidade nova fora do backlog atual.
argument-hint: "[descrição da feature]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Skill
---

# /xp-feature — Nova Feature em Andamento

Você é o par de programação. O dev teve uma ideia de nova feature com o projeto já rodando. Vamos avaliar, registrar e executar.

## A ideia

$ARGUMENTS

Se nenhuma ideia foi descrita, pergunte:
> "Qual feature você quer adicionar? Descreva o que o usuário vai conseguir fazer."

---

## Fase 1 — ENTENDER A IDEIA

1. **Reformule em linguagem de negócio** — reescreva a ideia como uma frase do ponto de vista do usuário:
   > "Como [usuário], quero [ação] para [benefício]."

   Confirme com o dev se a reformulação está correta.

2. **Defina o critério de aceite** — pergunte:
   > "Como saberemos que essa feature está pronta? O que precisa ser verdade?"

3. **Verifique alinhamento com o projeto** — se existir `.xp/projeto.md`, leia e confirme se a ideia está alinhada com os objetivos definidos. Se contradizer algo, aponte antes de continuar.

---

## Fase 2 — AVALIAR O ESCOPO

4. **Estime o esforço** usando a escala XP: 1 (trivial), 2 (simples), 3 (médio), 5 (complexo), 8 (muito complexo).

5. **Avalie o impacto no código existente** — leia os arquivos relevantes e responda:
   - Quais partes do código serão afetadas?
   - Tem risco de quebrar algo que já funciona?
   - Precisa de mudança de schema, API, contrato?

6. **Decida o caminho com o dev:**

   - **Estimativa 1–2 e impacto baixo** → vai direto para o `/xp-tdd`
     > "É pequeno e isolado. Podemos implementar agora com um ciclo TDD."

   - **Estimativa 3–5 ou impacto moderado** → adiciona ao backlog e aciona `/xp-task`
     > "Vale registrar no backlog e atacar como tarefa estruturada."

   - **Estimativa 8 ou impacto alto** → propõe quebrar antes de qualquer coisa
     > "É grande demais para um ciclo. Vamos quebrar em histórias menores?"

---

## Fase 3 — REGISTRAR NO PROJETO

7. **Atualize `.xp/projeto.md`** — adicione a nova feature na seção de evolução do projeto. Se a seção não existir, crie ao final do arquivo:

```markdown
## Evolução do projeto

### Features adicionadas

| Data | Feature | Motivação | Status |
|------|---------|-----------|--------|
| AAAA-MM-DD | [descrição curta] | [por que foi adicionada] | [ ] pendente |
```

   - `Status` acompanha o ciclo: `[ ]` pendente → `[~]` em andamento → `[x]` concluída
   - Atualize o status ao final da implementação

8. **Se for para o backlog** — adicione também em `.xp/xp-backlog.md` com ID sequencial, critério de aceite e estimativa.

---

## Fase 4 — EXECUTAR

9. **Caminho direto (estimativa 1–2):**
   Execute o ciclo TDD imediatamente: **invoque a skill `xp-tdd` pela ferramenta Skill** passando o comportamento como argumento (não apenas escreva `/xp-tdd` no texto).

10. **Caminho pelo backlog (estimativa 3+):**
    Adicione ao `.xp/xp-backlog.md` e **invoque a skill `xp-task` pela ferramenta Skill** com o ID da nova história.

11. **Sugira registrar decisões** — se a feature impôs uma nova restrição ou padrão que o projeto inteiro deve respeitar, pergunte ao final:
    > "Essa feature gerou alguma decisão arquitetural ou regra nova? Posso registrar com `/xp-adr` e adicionar ao contrato com `/xp-ctr`."

---

## Comportamento

- Não implemente nada antes de entender e registrar.
- Se a feature contradizer os objetivos do `.xp/projeto.md`, aponte — mas deixe o dev decidir.
- Se o dev quiser pular o registro no `.xp/projeto.md`, respeite, mas avise: "Não vai ficar registrado na evolução do projeto."
- Mantenha o tom de par: questione escopo, aponte riscos, sugira simplificações.
