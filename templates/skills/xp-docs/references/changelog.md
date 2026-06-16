# CHANGELOG.md

**Local:** raiz do projeto
**Propósito:** histórico legível de mudanças — para usuários e desenvolvedores.

## Formato (Keep a Changelog)

```markdown
# Changelog

Todas as mudanças notáveis serão documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Não lançado]
### Adicionado
- [feature em desenvolvimento]

## [1.2.0] — AAAA-MM-DD
### Adicionado
- Login com Google OAuth

### Alterado
- Timeout de sessão aumentado para 24h

### Corrigido
- Validação de email duplicado no cadastro

### Removido
- Suporte a autenticação por SMS (depreciado)

## [1.1.0] — AAAA-MM-DD
...
```

## Categorias de mudança
- `Adicionado` — novas features
- `Alterado` — mudanças em features existentes
- `Depreciado` — features que serão removidas em breve
- `Removido` — features removidas
- `Corrigido` — bug fixes
- `Segurança` — correções de vulnerabilidades

## Boas práticas
- Escreva para o usuário final, não para o dev
- Cada item em uma linha, começando com verbo no passado
- Relacione versões com tags do git quando possível
- Mantenha a seção `[Não lançado]` sempre atualizada

## Como atualizar
1. Leia os commits desde a última versão (`git log vX.X.X..HEAD --oneline`)
2. Agrupe por categoria
3. Reescreva em linguagem de usuário (não "fix: null pointer" → "Corrigido erro ao acessar perfil sem foto")
