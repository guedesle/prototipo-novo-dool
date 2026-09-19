# Design System — Novo DOOL

Esta pasta concentra os **insumos, referências, contratos e experimentos** usados na construção do design system da nova plataforma do Diário Oficial Online.

## Status

O conteúdo de `design-system/inputs/` é **material de entrada versionado**, não implementação de produção automaticamente aprovada.

Os insumos podem fornecer:
- padrões de interação;
- contratos de dados;
- tokens experimentais;
- componentes exploratórios;
- fixtures;
- schemas;
- testes;
- referências externas analisadas.

A implementação final deve ser consolidada no frontend da plataforma e cumprir a arquitetura, UX e gates definidos em `docs/rebuild-platform/`.

## Insumo atual: navegação hierárquica inspirada no EUR-Lex

Diretório:

`inputs/eur-lex-hierarchical-v2/`

O pacote documenta e demonstra um padrão modular para o sumário da edição baseado em disclosure hierárquico.

Princípios que entram na baseline do produto:
- todos os nós pais da perspectiva exibida são tratados como **dimensões**;
- publicações são **fatos/folhas terminais**;
- a profundidade da árvore é arbitrária;
- dimensões podem ser expandidas ou recolhidas individualmente;
- a interface oferece ações globais **Expandir tudo** e **Recolher tudo**;
- publicação permanece uma linha documental, não um card de navegação;
- a ordem documental e o contexto da edição devem ser preservados;
- a árvore visual é uma projeção para navegação e não deve reproduzir diretamente o modelo físico do banco.

## Estrutura do insumo

```text
inputs/eur-lex-hierarchical-v2/
├── DESIGN-SYSTEM.md
├── REFERENCE-EUR-LEX.md
├── README.md
├── src/
│   ├── tokens/
│   ├── foundations/
│   ├── components/
│   └── styles/
├── data/
├── schemas/
├── demo/
├── scripts/
└── tests/
```

## Relação com a arquitetura dimensional

O modelo de persistência pode organizar dimensões e fatos para consulta eficiente. O frontend, porém, recebe uma projeção hierárquica versionada e independente da estrutura física do banco.

Exemplo:

```text
Caderno (dimensão)
└── Órgão (dimensão)
    └── Hierarquia interna (dimensão)
        └── Tipo de publicação (dimensão)
            └── Publicação (fato)
```

A sequência de dimensões não deve ser hardcoded no componente.

## Regra de adoção

Nenhum estilo, token ou detalhe visual presente nos insumos é obrigatório apenas por estar nesta pasta. Para entrar na implementação da plataforma, o elemento deve:

1. atender uma jornada real;
2. respeitar acessibilidade e responsividade;
3. funcionar com contratos de domínio do Novo DOOL;
4. preservar fidelidade documental;
5. passar pelos gates de qualidade;
6. ser validado contra dados reais ou fixtures representativas.

## Validação do insumo atual

O pacote `eur-lex-hierarchical-v2` inclui testes unitários e smoke test HTTP. A baseline local foi validada com cinco testes aprovados antes de ser incorporada ao repositório.
