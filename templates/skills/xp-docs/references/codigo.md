# JSDoc / Docstrings (código inline)

**Propósito:** documentar funções, classes e módulos públicos diretamente no código.

## Quando documentar

- **Sempre:** funções públicas de serviços, utilitários e helpers
- **Sempre:** classes e seus métodos públicos
- **Sempre:** tipos e interfaces complexas
- **Nunca:** funções óbvias (`getById`, `formatDate` sem lógica especial)
- **Nunca:** código privado/interno que só uma função usa

## Formato TypeScript / JavaScript (JSDoc)

```typescript
/**
 * Autentica um usuário e retorna um token JWT.
 *
 * @param email - Email do usuário cadastrado
 * @param password - Senha em texto puro (será verificada contra o hash)
 * @returns Token JWT com expiração configurada em JWT_EXPIRES_IN
 * @throws {InvalidCredentialsError} Se email ou senha estiverem incorretos
 * @throws {AccountLockedError} Se a conta estiver bloqueada por tentativas excessivas
 *
 * @example
 * const token = await authService.login('user@example.com', 'senha123')
 */
async function login(email: string, password: string): Promise<string> {
```

## Formato Python (docstring)

```python
def login(email: str, password: str) -> str:
    """
    Autentica um usuário e retorna um token JWT.

    Args:
        email: Email do usuário cadastrado.
        password: Senha em texto puro (verificada contra o hash).

    Returns:
        Token JWT com expiração configurada em JWT_EXPIRES_IN.

    Raises:
        InvalidCredentialsError: Se email ou senha estiverem incorretos.
        AccountLockedError: Se a conta estiver bloqueada.

    Example:
        token = auth_service.login('user@example.com', 'senha123')
    """
```

## Fluxo de revisão

1. Leia os arquivos de serviços, utilitários e helpers públicos
2. Identifique funções sem documentação ou com documentação desatualizada
3. Para cada função, proponha o JSDoc/docstring ao dev antes de adicionar
4. Priorize: funções complexas, funções com múltiplos parâmetros, funções que lançam erros

## Boas práticas
- Documente o **porquê** quando não for óbvio, não o **o quê** (o código já diz o quê)
- Mantenha `@example` com casos reais — ajuda mais do que descrições longas
- Atualize o doc sempre que o comportamento da função mudar
- Use a ferramenta de geração de docs da stack (TypeDoc, Sphinx, GoDoc) se disponível
