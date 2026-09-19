# Design System — Navegação hierárquica de publicações

## 1. Decisão de interface

O design não usa “cards de árvore”. A referência do EUR-Lex funciona como um **índice documental**: títulos intermediários colapsáveis criam a hierarquia; os documentos aparecem em linhas terminais. Esse comportamento foi preservado porque oferece alta densidade informacional e leitura rápida.

A adaptação para o Diário Oficial utiliza dois tipos semânticos:

- `dimension`: qualquer nó pai da estrutura editorial ou dimensional;
- `fact`: a publicação, sempre folha.

O componente não conhece uma sequência fixa de níveis. `Caderno → Órgão → Unidade → Diretoria → Tipo → Publicação` e outras estruturas usam o mesmo renderizador.

## 2. O que foi preservado do EUR-Lex

Observado no daily view do Official Journal:

- comandos globais para expandir e recolher todos os níveis;
- disclosure por nível com chevron rotativo;
- recuo progressivo de aproximadamente 15 px;
- hierarquia sem cartões pesados ou containers concorrentes;
- documento terminal com referência curta à esquerda e título longo à direita;
- foco de teclado fortemente visível.

Esses são padrões funcionais. Cores, tipografia e marca não são copiadas literalmente.

## 3. Anatomia

### Cabeçalho de edição

Contém navegação estrutural, nome da publicação, título da tela, data e identificador da edição. O cabeçalho não participa da árvore.

### Toolbar

Contém ações globais `Expandir tudo` e `Recolher tudo`, contagem de folhas e, quando necessário, ordenação. As ações são links visuais com semântica de botão — discretas como no EUR-Lex, mas com alvo de interação adequado.

### Dimension node

Composto por:

1. chevron;
2. tipo da dimensão, em texto auxiliar curto;
3. rótulo da dimensão;
4. contagem agregada de publicações descendentes.

A diferença de nível é expressa por recuo, escala tipográfica nos três níveis superiores e um guia vertical sutil. O rótulo `dimension` nunca é exibido ao usuário.

### Fact row

A publicação é uma linha editorial, não um card. A linha contém:

1. referência/código;
2. título integral clicável;
3. metadados secundários;
4. formatos/ações, como HTML e PDF.

## 4. Regras de hierarquia

- Qualquer nó com descendentes é `dimension`.
- Publicações são `fact` e não possuem `children`.
- A profundidade é arbitrária.
- O front-end não pressupõe que o segundo nível seja “Órgão” ou que o quarto seja “Tipo”.
- A sequência de dimensões vem dos dados ou da consulta dimensional.
- O incremento visual padrão entre níveis é `15 px`, seguindo a proporção observada no EUR-Lex.

## 5. Estados de disclosure

Cada dimensão possui apenas dois estados obrigatórios: `expanded` e `collapsed`. O estado é refletido simultaneamente em:

- `aria-expanded` do botão;
- atributo `hidden` do grupo descendente;
- rotação do chevron.

`Expandir tudo` e `Recolher tudo` percorrem todas as dimensões já materializadas no DOM.

## 6. Acessibilidade

A implementação usa o padrão **disclosure hierárquico**, não ARIA Tree View. Isso permite navegação documental convencional com Tab/Shift+Tab sem exigir gerenciamento de foco por setas.

Requisitos:

- cada disclosure é um `button` real;
- `aria-expanded` e `aria-controls` ficam sincronizados;
- links de publicação são `a` reais;
- ordem visual e DOM são idênticas;
- foco visível usa contorno de alto contraste;
- a interface respeita `prefers-reduced-motion`.

## 7. Tokens

Os tokens são separados por responsabilidade:

- `colors.css` — marca, texto, bordas, superfície e foco;
- `typography.css` — família, escala e line-height;
- `spacing.css` — grid espacial, raios e indentação;
- `motion.css` — durações e redução de movimento.

O componente pode ser rebrandado trocando tokens sem alterar sua estrutura ou JavaScript.

## 8. Contrato de dados

### Dimensão

```json
{
  "id": "saeb",
  "type": "dimension",
  "dimension": "Órgão",
  "label": "Secretaria da Administração",
  "children": []
}
```

### Fato

```json
{
  "id": "ato-001",
  "type": "fact",
  "ref": "Portaria 123/2026",
  "title": "Título integral da publicação",
  "href": "/publicacoes/ato-001",
  "meta": ["p. 12", "18/09/2026"],
  "formats": [
    { "label": "HTML", "href": "/publicacoes/ato-001" }
  ]
}
```

## 9. Integração com o modelo dimensional

A UI não é o banco e não deve reproduzir tabelas estrela diretamente. A API materializa a perspectiva solicitada como uma árvore:

```text
DIM_CADERNO
  DIM_ORGAO
    DIM_HIERARQUIA
      DIM_TIPO_PUBLICACAO
        FATO_PUBLICACAO
```

Outra consulta pode reorganizar a perspectiva sem reescrever o componente. O único contrato do front-end é receber nós `dimension` até alcançar nós `fact`.

## 10. Responsividade

Em telas largas, a folha usa três colunas: referência, título e formato. Em telas estreitas, os campos empilham, a contagem agregada é omitida e a indentação é reduzida sem desaparecer.

## 11. Gates de qualidade

Uma versão é aceitável somente quando:

- roda por HTTP sem dependências externas;
- os imports CSS e JS resolvem a partir do entrypoint modular;
- há teste com pelo menos cinco níveis de dimensão;
- expandir/recolher individual funciona em todos os níveis;
- expandir/recolher global sincroniza `aria-expanded` e `hidden`;
- nenhuma publicação recebe disclosure;
- nenhuma dimensão é renderizada como publicação;
- teclado alcança todos os controles e links;
- mobile preserva a percepção de hierarquia;
- validação do contrato rejeita `fact` com `children` e IDs duplicados.
