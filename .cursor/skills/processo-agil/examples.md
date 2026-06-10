# Exemplos de uso no chat

## Criar épico (V1 padrão)

**Usuário:** criar épico: plataforma de e-commerce

**Resultado:**
- `Epicos/V1/E01-plataforma-de-e-commerce/E01.md`
- Pastas vazias: `FEAT/`, `STORY/`, `BUG/`, `TASK/`

---

## Criar épico em versão específica

**Usuário:** criar épico na V2: relatórios avançados

**Resultado:**
- `Epicos/V2/E01-relatorios-avancados/E01.md`

---

## Criar feature

**Usuário:** criar feat no E01: carrinho de compras

**Resultado:**
- `Epicos/V1/E01-.../FEAT/FEAT01-carrinho-de-compras.md`
- Linha na tabela de `E01.md`

---

## Criar story na feature

**Usuário:** criar story no E01 para FEAT01: adicionar item ao carrinho

**Resultado:**
- `Epicos/V1/E01-.../STORY/S01-adicionar-item-ao-carrinho.md`
- `pai: FEAT01`

---

## Criar story direto no épico

**Usuário:** criar story no E01: checkout como visitante

**Resultado:**
- `Epicos/V1/E01-.../STORY/S02-checkout-como-visitante.md`
- `pai: E01`

---

## Criar task

**Usuário:** criar task na S03 do E01: validar API

**Resultado:**
- `Epicos/V1/E01-.../TASK/T01-validar-api.md`
- `pai: S03`

---

## Criar bug

**Usuário:** criar bug no E01: total calcula errado

**Resultado:**
- `Epicos/V1/E01-.../BUG/F01-total-calcula-errado.md`
- ID no frontmatter: `E01-F01`

---

## Mover para progresso

**Usuário:** mover S03 do E01 para progresso

**Resultado:** `STORY/S03-....md` → `em-progresso` + tabela atualizada

---

## Fechar com filhos abertos

**Usuário:** fechar E01

**Agente:** lista filhos em aberto em `FEAT/`, `STORY/`, `TASK/`, `BUG/` e pede confirmação.

---

## Implementar épico

**Usuário:** implementar E01

**Agente:**
1. `E01` → em-progresso
2. `FEAT01` → stories/tasks vinculadas → concluido
3. `S01`, `S02`… → concluido
4. `T01`… → concluido
5. `F01`… → concluido
6. `E01` → concluido

---

## Investigar problema (sem corrigir)

**Usuário:** investigar por que o script listar-diretorios falha no caminho X

**Agente:**
1. Detecta versão mais nova: `V1`
2. Cria `Epicos/V1/TROUBLESHOOTING/INV01-script-falha-no-caminho-x.md`
3. Lê código, reproduz erro, analisa — **não edita arquivos**
4. Append registro com evidências e solução proposta
5. `status: em-investigacao`

---

## Continuar investigação

**Usuário:** continuar INV01 — testei com outro caminho e deu o mesmo erro

**Agente:** append novo **Registro** no final de `INV01-....md`, atualiza **Resumo atual** e `atualizado`.

---

## Finalizar diagnóstico

**Usuário:** acho que já sabemos a causa da INV01

**Agente:** preenche **Solução proposta**, `status: aguardando-resolucao`. Ainda **sem** alterar código.

---

## Resolver investigação

**Usuário:** resolver investigação INV01

**Agente:**
1. Lê **Solução proposta** em `INV01-....md`
2. `status: resolvendo`
3. Implementa a correção documentada
4. Append **Registro de resolução**
5. `status: concluido`
