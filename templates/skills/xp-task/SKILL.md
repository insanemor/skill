---
name: xp-task
description: Pega a próxima tarefa pendente de .xp/xp-backlog.md, marca em andamento e dispara o ciclo TDD. Use quando o dev quer começar a trabalhar, pegar a próxima tarefa ou pergunta o que fazer agora.
argument-hint: "[id da tarefa (opcional)]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Skill
---

# /xp-task — Próxima Tarefa

Você é o par de programação. Vamos pegar a próxima tarefa do backlog e começar o trabalho.

## Fluxo

1. **Leia `.xp/xp-backlog.md`** — se não existir, oriente a rodar `/xp-plan` primeiro.

2. **Identifique a próxima tarefa** — a primeira com status `[ ]` (pendente) na iteração atual.
   - Se foi passado um ID como argumento (`$ARGUMENTS`), use essa tarefa específica.
   - Se não há tarefas pendentes, parabenize e pergunte se quer planejar a próxima iteração.

3. **Apresente a tarefa ao par:**
   ```
   📋 Tarefa #ID: <descrição>
   Critério de aceite: <critério>
   Estimativa: <pontos> pontos
   ```

4. **Marque como em andamento** — atualize `.xp/xp-backlog.md` trocando `[ ]` por `[~]` nessa tarefa.

5. **Acione a skill `xp-tdd`** — diga ao dev qual comportamento vamos atacar primeiro e então **invoque a skill `xp-tdd` pela ferramenta Skill**, passando esse comportamento como argumento. Não basta escrever `/xp-tdd ...` no texto da resposta — isso não dispara a skill; use a ferramenta Skill de fato. Exemplo:

   > "Vou iniciar o ciclo TDD para: *usuário não pode se registrar com email já existente*"

   (em seguida, invoque a skill `xp-tdd` com `usuário não pode se registrar com email já existente`)

   Se a tarefa tiver múltiplos comportamentos, invoque `xp-tdd` uma vez por comportamento, em sequência.

## Ao concluir a tarefa

Quando todos os testes da tarefa estiverem passando e o refactor feito:

1. Atualize `.xp/xp-backlog.md` trocando `[~]` por `[x]`.
2. Mostre o progresso da iteração (quantas tarefas concluídas / total).
3. Pergunte: "Próxima tarefa? Posso rodar `/xp-task` de novo."

## Comportamento

- Uma tarefa por vez. Se o dev quiser pular para outra, atualize o backlog corretamente antes.
- Se a tarefa estiver muito grande para um ciclo TDD, proponha quebrar antes de começar.
- Mantenha o foco: se surgir escopo novo durante a tarefa, anote em `.xp/xp-backlog.md` como nova história e volte ao foco atual.

$ARGUMENTS
