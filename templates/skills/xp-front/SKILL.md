---
name: xp-front
description: Define convenções de frontend (estrutura de pastas, componentes, estado, estilo, integração) e cria .xp/frontend.md. Use quando o projeto tem frontend e o dev quer padronizar como escrever componentes. Requer .xp/arquitetura.md.
allowed-tools: Read, Write, Edit
disable-model-invocation: true
---

# /xp-front — Padrões de Frontend

Você é o par de programação. Vamos definir os padrões de desenvolvimento frontend do projeto — como escrevemos componentes, organizamos pastas, gerenciamos estado e integramos com o backend.

Esta skill **não escolhe tecnologias** — isso é responsabilidade do `/xp-arch`. Aqui definimos as **convenções de uso** para o framework e bibliotecas já escolhidos.

## Pré-requisito

Antes de rodar esta skill, deve existir `.xp/arquitetura.md` com o framework frontend definido. Se não existir, sugira `/xp-arch` primeiro.

Leia `.xp/arquitetura.md` e identifique o framework frontend (React, Vue, Angular, Next.js, etc.) para adaptar todas as perguntas e exemplos ao que foi escolhido.

---

## Fluxo

Conduza as perguntas **uma seção de cada vez**, esperando resposta antes de continuar. Apresente opções concretas quando possível — o dev escolhe, você não impõe.

### 1. Estrutura de pastas

Mostre as opções para o framework detectado e pergunte qual faz mais sentido para o projeto:

**React / Next.js — opções comuns:**

```
Opção A — Por tipo (simples, bom para projetos pequenos):
src/
  components/   ← componentes reutilizáveis
  pages/        ← ou app/ no Next.js App Router
  hooks/        ← custom hooks
  services/     ← chamadas de API
  utils/        ← funções puras
  types/        ← TypeScript types/interfaces

Opção B — Por feature (escala melhor em projetos grandes):
src/
  features/
    auth/
      components/
      hooks/
      services/
      types/
    orders/
      ...
  shared/
    components/
    hooks/
    utils/

Opção C — Híbrida (features para domínio, shared para UI):
src/
  features/     ← lógica de domínio por feature
  components/   ← componentes de UI genéricos (Design System)
  lib/          ← integrações externas (API client, auth, analytics)
```

**Vue / Nuxt — adapte a estrutura equivalente.**

Após a escolha, pergunte: "Tem alguma pasta que precisamos adicionar para esse projeto específico?" (ex: `store/`, `i18n/`, `workers/`).

---

### 2. Padrões de componentes

Defina as convenções de como criamos e organizamos componentes.

**a) Nomenclatura:**
> "Como vamos nomear os componentes? Exemplos: PascalCase para componentes, kebab-case para arquivos, ou ambos iguais?"

Sugestão padrão: arquivos em PascalCase (`UserCard.tsx`), diretórios em kebab-case (`user-card/`).

**b) Quando quebrar um componente:**
> "Qual o critério para extrair um sub-componente?"

Sugestão:
- Mais de ~150 linhas → candidato a quebrar
- Lógica reutilizada em 2+ lugares → extrai
- Responsabilidade dupla → extrai

**c) Co-location de arquivos:**
> "Componente e teste ficam juntos ou separados?"

```
Juntos (co-location — recomendado):
UserCard/
  UserCard.tsx
  UserCard.test.tsx
  UserCard.stories.tsx  (se usar Storybook)
  index.ts              (re-export)

Separados (pasta __tests__ centralizada):
components/UserCard.tsx
__tests__/UserCard.test.tsx
```

**d) Props e tipagem:**
> "Qual padrão para tipagem de props?" (TypeScript assumed)

Sugestão: interface para props de componentes (`interface UserCardProps`), type para unions e utilitários.

---

### 3. Gerenciamento de estado

Com base na complexidade do projeto, defina quando usar cada abordagem.

> "Como vamos gerenciar estado no projeto? (já sabemos o que está instalado pelo `/xp-arch` — aqui definimos quando usar cada nível)"

Apresente a hierarquia sugerida:

```
Nível 1 — Estado local (useState / useReducer)
  → Use para: estado de UI, formulários locais, toggle de modal
  → Regra: se só um componente usa, fica local

Nível 2 — Estado compartilhado leve (Context API / Zustand atom)
  → Use para: tema, auth, preferências do usuário, dados compartilhados entre 2-3 componentes
  → Regra: se 2+ componentes precisam do mesmo dado sem prop drilling

Nível 3 — Estado global / server state (Redux, Zustand store, React Query)
  → Use para: dados do servidor, cache, estado complexo com muitas ações
  → Regra: dados que vêm da API → React Query / SWR; estado complexo de app → Zustand/Redux
```

Pergunte: "Essa hierarquia faz sentido para o projeto? Quer ajustar algum nível?"

---

### 4. Integração com API (camada de serviço)

> "Como vamos organizar as chamadas de API?"

Sugestão de padrão:

```typescript
// services/auth.service.ts — funções puras de API
export const authService = {
  login: (credentials: LoginDTO) =>
    api.post<AuthResponse>('/auth/login', credentials),
  logout: () =>
    api.post('/auth/logout'),
}

// hooks/useAuth.ts — React Query wrapping o service
export function useLogin() {
  return useMutation({ mutationFn: authService.login })
}
```

**Regras a definir:**
- Centralizar a instância do cliente HTTP (Axios/fetch) em um único arquivo (`lib/api.ts`)
- Interceptors de auth (token no header) sempre no cliente central
- Tratamento de erro: centralizado no interceptor ou por chamada?
- Loading e error states: React Query / SWR vs manual?

---

### 5. Estilo e CSS

Com base no que foi escolhido no `/xp-arch`, defina as convenções de uso.

**Se Tailwind CSS:**
> "Vamos usar classes inline ou extrair componentes de estilo?"

Sugestão:
```tsx
// ✅ OK — classes inline para variações simples
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

// ✅ Melhor — variantes complexas com cva ou cn helper
const button = cva('px-4 py-2 rounded', {
  variants: {
    variant: { primary: 'bg-blue-500 text-white', ghost: 'border border-gray-300' }
  }
})
```

Defina: threshold de quando extrair para componente vs inline.

**Se CSS Modules:**
> "Convenção de nomenclatura de classes — camelCase ou kebab-case?"

**Se styled-components / Emotion:**
> "Componentes de estilo ficam no mesmo arquivo do componente ou em arquivo separado?"

---

### 6. Formulários

> "Como vamos tratar formulários no projeto?"

Sugestão (se React Hook Form estiver na stack):
```typescript
// Padrão: schema de validação separado do componente
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Componente usa o hook — sem estado manual
const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(loginSchema)
})
```

Defina: validação no cliente (Zod/Yup) ou só no backend? Feedback de erro: ao digitar ou só no submit?

---

### 7. Acessibilidade mínima

> "Qual o nível mínimo de acessibilidade que vamos garantir?"

Sugestão de baseline obrigatório:

| Requisito | Como verificar |
|-----------|---------------|
| Todos os botões/links têm label acessível | `aria-label` ou texto visível |
| Imagens têm `alt` descritivo | Regra de lint `jsx-a11y/alt-text` |
| Formulários têm `<label>` associado | `htmlFor` + `id` |
| Foco visível em elementos interativos | Sem `outline: none` sem substituto |
| Contraste mínimo de cores | WCAG AA (4.5:1 para texto) |

Pergunte: "Vamos adicionar `eslint-plugin-jsx-a11y` às regras de lint?"

---

### 8. i18n (internacionalização)

> "O projeto precisa suportar múltiplos idiomas agora ou no futuro previsível?"

- Se **sim**: defina a biblioteca (`react-i18next`, `next-intl`...) e o padrão de chaves (`feature.component.key`)
- Se **não agora mas talvez futuro**: defina que strings de interface ficam em arquivos de constantes, não hardcoded no JSX — facilita migração futura sem ser burocrático agora
- Se **não**: registre explicitamente que i18n está fora de escopo

---

### 9. Crie `.xp/frontend.md`

Após todas as respostas, crie o arquivo `.xp/frontend.md` com o seguinte formato:

```markdown
# Padrões de Frontend — [Nome do Projeto]

> Convenções de desenvolvimento frontend. Gerado e mantido via `/xp-front`.
> Framework: [detectado do .xp/arquitetura.md]

## Estrutura de pastas

[opção escolhida com diagrama de exemplo]

## Componentes

- **Nomenclatura:** [convenção]
- **Critério de extração:** [regra]
- **Co-location:** [sim/não — formato adotado]
- **Tipagem de props:** [interface/type + convenção]

## Gerenciamento de estado

- **Local (useState):** [quando usar]
- **Compartilhado ([biblioteca]):** [quando usar]
- **Server state ([biblioteca]):** [quando usar]

## Integração com API

- **Cliente HTTP central:** [arquivo — ex: src/lib/api.ts]
- **Camada de serviço:** [pasta — ex: src/services/]
- **Hooks de dados:** [abordagem]
- **Tratamento de erro:** [centralizado / por chamada]

## Estilo

- **Biblioteca:** [definida no /xp-arch]
- **Convenção:** [regras específicas para a biblioteca]

## Formulários

- **Biblioteca:** [definida no /xp-arch]
- **Validação:** [Zod/Yup/manual] — valida [ao digitar / no submit]

## Acessibilidade

- **Nível mínimo:** WCAG AA
- **Plugin de lint:** [jsx-a11y: sim/não]

## i18n

- [em uso com [biblioteca] / fora de escopo / preparado para migração futura]
```

Em seguida, adicione uma linha de referência no `.xp/arquitetura.md` na seção do frontend:

```markdown
- **Padrões de desenvolvimento:** ver `.xp/frontend.md`
```

### 10. Registre as decisões como ADR

Para cada decisão relevante definida nessa skill (estrutura de pastas, padrão de componentes, gerenciamento de estado, camada de serviço), proponha:
> "Vamos registrar os padrões de frontend como ADR para garantir que o agente sempre siga essas convenções?"

Se sim, rode `/xp-adr` com a decisão consolidada — uma ADR para os padrões de frontend, não uma por convenção.

### 11. Oriente o próximo passo

> "Padrões de frontend definidos. Agora rode `/xp-plan` — o backlog vai considerar esses padrões na decomposição das tarefas de frontend."

---

## Comportamento

- Adapte todas as perguntas e exemplos para o framework detectado no `.xp/arquitetura.md`.
- Não imponha padrões — apresente opções com prós/contras e deixe o dev decidir.
- Se o dev disser "pode deixar o padrão", sugira a convenção mais comum para o framework e siga.
- Se alguma decisão já estiver no `.xp/contract.md` (via ADR anterior), não questione — apenas informe e continue.
- Projetos simples não precisam de todas as seções — se o projeto é uma landing page ou dashboard interno, diga isso e pule as seções que não se aplicam.
- Mantenha o tom de par: "faz sentido para esse projeto?", "você já usou esse padrão antes?".

$ARGUMENTS
