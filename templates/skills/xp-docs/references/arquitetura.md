# docs/doc_arquitetura.md

**Local:** docs/doc_arquitetura.md
**Propósito:** visão geral do sistema para onboarding rápido e decisões futuras.

## Estrutura

```markdown
# Arquitetura do Sistema

## Visão geral
[Diagrama ou descrição de alto nível — o que é o sistema e como suas partes se relacionam]

## Diagrama de componentes
[Diagrama em Mermaid ou ASCII mostrando os principais módulos e suas dependências]

## Camadas da aplicação

| Camada | Responsabilidade | Pasta |
|--------|-----------------|-------|
| API / Controllers | Receber requisições, validar input | src/controllers/ |
| Services | Lógica de negócio | src/services/ |
| Repositories | Acesso a dados | src/repositories/ |
| Models | Entidades do domínio | src/models/ |

## Fluxo de uma requisição
[Descreva o caminho típico de uma requisição da entrada até a resposta]

## Integrações externas
[Lista de APIs, serviços e sistemas externos com os quais o projeto se comunica]

## Decisões arquiteturais
[Referência aos ADRs em .xp/decisions/ — liste os principais com link]

## O que NÃO pertence a cada camada
[Regras explícitas para evitar violações de arquitetura]
```

## Boas práticas
- Use Mermaid para diagramas — ficam versionados junto ao código
- Referencie os ADRs em vez de repetir o raciocínio
- Atualize sempre que uma decisão estrutural mudar
- Foque no "porquê" das escolhas, não só no "o quê"
