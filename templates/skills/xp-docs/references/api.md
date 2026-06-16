# docs/doc_api.md

**Local:** docs/doc_api.md
**Propósito:** contrato da API — o que existe, como usar, o que esperar.

## Estrutura por endpoint

```markdown
# API Reference

## Base URL
`https://api.exemplo.com/v1`

## Autenticação
[Tipo: Bearer token / API Key / Basic Auth]
[Como obter o token]
[Header esperado: `Authorization: Bearer <token>`]

## Endpoints

### POST /auth/login

Autentica um usuário e retorna um token JWT.

**Request**
\`\`\`json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
\`\`\`

**Response 200**
\`\`\`json
{
  "data": {
    "token": "eyJhbGc...",
    "expiresAt": "2024-12-31T23:59:59Z"
  },
  "error": null
}
\`\`\`

**Response 401**
\`\`\`json
{
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou senha incorretos"
  }
}
\`\`\`

**Erros possíveis**

| Código | Status HTTP | Descrição |
|--------|-------------|-----------|
| INVALID_CREDENTIALS | 401 | Email ou senha incorretos |
| ACCOUNT_LOCKED | 403 | Conta bloqueada por tentativas excessivas |
| VALIDATION_ERROR | 422 | Campos obrigatórios ausentes ou inválidos |
```

## Boas práticas
- Documente **todos** os códigos de erro possíveis
- Inclua exemplos reais — copie de respostas reais do app
- Se existir OpenAPI/Swagger, gere o `api.md` a partir dele e mantenha os dois sincronizados
- Documente rate limits se existirem
- Indique campos obrigatórios vs opcionais

## Como construir
1. Liste todas as rotas do projeto (leia arquivos de rotas/controllers)
2. Para cada rota, leia o handler e identifique: input, validações, output, erros
3. Proponha a documentação e confirme com o dev antes de salvar
