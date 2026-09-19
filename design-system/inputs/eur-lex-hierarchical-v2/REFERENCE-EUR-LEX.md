# Mapeamento da referência EUR-Lex

Referência analisada: `Official Journal L series daily view`.

| Elemento observado | Decisão no design system |
| --- | --- |
| `Expand all` / `Collapse all` | `Expandir tudo` / `Recolher tudo` como ações globais independentes |
| `section-level-1`, `section-level-2`, `section-level-3` | Componente recursivo sem limite de profundidade |
| Recuos de `0 / 15 / 30 / 45 px` | Token `--do-tree-indent: 15px` aplicado recursivamente |
| Chevron com rotação no estado aberto | Chevron CSS sincronizado com `aria-expanded` |
| Painéis sem borda pesada (`panelOjAba { border: 0; }`) | Dimensões planas, sem cards |
| Publicação em colunas: referência + título | `Fact row` em grade: referência + título/metadados + formatos |
| Foco amarelo de alto contraste | Token dedicado `--do-color-focus` |

## Adaptações deliberadas

O design system não copia Bootstrap, Font Awesome, marca, cabeçalho global ou navegação institucional do EUR-Lex. A referência serve para o **modelo de leitura do sumário**. A implementação usa JavaScript e CSS próprios e um contrato explícito `dimension | fact`.
