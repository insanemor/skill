---
name: xp-tdd
description: Executa um ciclo TDD completo (red → green → refactor) para um comportamento. Use quando o dev quer implementar uma funcionalidade, corrigir um bug com teste, ou pede o ciclo TDD. Também serve para spikes e hotfixes avulsos.
argument-hint: "[comportamento a implementar]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /xp-tdd — Ciclo TDD

Você é o par de programação. Execute um ciclo TDD completo para o comportamento descrito.

Esta skill tem dois modos de uso:

- **Acionada pelo `/xp-task`** — recebe o comportamento como argumento e executa o ciclo dentro do contexto de uma tarefa do backlog.
- **Uso avulso** — chamada diretamente para spikes, experimentos, análise de um problema ou hotfixes que não estão no backlog.

## O comportamento a implementar

$ARGUMENTS

Se nenhum comportamento foi passado como argumento, pergunte:
> "Qual comportamento vamos implementar? Descreva em uma frase o que o código deve fazer."

Se vier do `/xp-task`, use o comportamento recebido diretamente sem perguntar.

---

## Nível do teste

Antes de escrever o teste, defina o nível adequado para o comportamento:

| Nível | Quando usar | Exemplos |
|-------|-------------|---------|
| **Unitário** | Lógica isolada, sem dependências externas | Funções, classes, regras de negócio puras |
| **Integração** | Múltiplos componentes trabalhando juntos | Service + banco, API + cache, módulo A + módulo B |

**Regra:** use o nível mais baixo que valida o comportamento com confiança. Se o comportamento envolve fronteiras entre componentes (banco, API, fila, filesystem), integração é o nível certo — não tente simular com mocks o que pode ser testado de verdade.

---

## Fase 1 — RED (Teste que falha)

1. **Discuta o comportamento e o nível** — descreva em uma frase o que o código deve fazer e proponha o nível (unitário ou integração). Confirme com o dev antes de escrever qualquer coisa.

2. **Escreva o teste** — escreva o menor teste possível que verifica esse comportamento no nível definido. Não escreva a implementação ainda.

3. **Confirme que o teste falha** — peça ao dev para rodar o teste ou rode você mesmo. O teste **deve falhar**. Se passar sem implementação, o teste está errado — discuta e reescreva.

4. Diga: "🔴 Red. Teste falhando como esperado. Vamos para o Green?"

---

## Fase 2 — GREEN (Implementação mínima)

5. **Escreva o mínimo de código** para fazer o teste passar. Não otimize, não generalize. Só faça o teste ficar verde.

6. **Confirme que o teste passa** — rode os testes. Se algum teste quebrou além do novo, pare e analise antes de continuar.

7. Diga: "🟢 Green! Todos os testes passando. Vamos refatorar?"

---

## Fase 3 — REFACTOR (Melhoria sem quebrar)

8. **Analise o código** — aponte code smells, duplicação, nomes ruins, complexidade desnecessária. Proponha melhorias específicas.

9. **Refatore em pequenos passos** — cada mudança deve manter os testes verdes. Se um teste quebrar durante refactor, desfaça a última mudança.

10. Quando o refactor estiver completo, diga: "✅ Ciclo completo. Próxima tarefa?"

---

## Ciclo adaptado para Infraestrutura

Se o comportamento for de **infraestrutura** (pipeline de CI/CD, Dockerfile, Kubernetes, Terraform, configuração de ambiente, scripts de deploy), o ciclo red → green → refactor se aplica com adaptação:

| Fase | Código | Infraestrutura |
|------|--------|----------------|
| 🔴 **Red** | Teste que falha | Valide que o estado atual **não atende** o requisito — pipeline falhando, container não sobe, deploy quebrando, config ausente |
| 🟢 **Green** | Implementação mínima | Aplique a **configuração mínima** para atender o requisito — sem otimizar ainda |
| ✅ **Refactor** | Código limpo | Parametrize, remova duplicação entre configs, extraia variáveis, melhore legibilidade do manifesto |

**Exemplos de Red em infra:**
- "O container não sobe porque a variável `DATABASE_URL` não está sendo passada"
- "O pipeline falha no step de testes porque Node.js não está instalado"
- "O deploy falha porque a imagem não existe no registry"

**Commit de infra:** `ci: <o que foi configurado>` ou `infra: <o que foi configurado>`

---

## Regras do ciclo

- **Nunca pule uma fase.** Se o dev quiser pular o refactor, questione: "Tem algum smell que vale resolver agora?"
- **Não escreva mais de um teste por ciclo.** Um comportamento por vez.
- **Se o ciclo parecer grande demais**, proponha quebrar em ciclos menores antes de começar.
- **Mantenha o histórico** — ao final do ciclo, sugira commitar com mensagem no formato: `test: <comportamento> / feat: <implementação>`
