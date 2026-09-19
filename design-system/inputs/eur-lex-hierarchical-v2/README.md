# Design System — Sumário Hierárquico do Diário Oficial

Versão 2.0, modular.

A implementação traduz o padrão funcional do **Official Journal daily view do EUR-Lex** para um componente reutilizável de Diário Oficial: dimensões são nós colapsáveis e publicações são folhas terminais. A interface deliberadamente evita transformar cada publicação em card; a leitura permanece documental, compacta e hierárquica.

## Executar a demo

### Windows

Dê duplo clique em `start-demo.bat`.

### Terminal

```bash
npm run dev
```

Abra `http://127.0.0.1:4173/demo/`.

> A demo é modular e, portanto, deve ser executada por HTTP. Não foi desenhada para `file://` nem possui CSS/JS embutidos no HTML.

## Estrutura

```text
src/
  tokens/                         tokens independentes
  foundations/                    reset e foco
  components/
    edition-header/               cabeçalho da edição
    tree-toolbar/                 expandir/recolher/ordenação
    publication-tree/             árvore, nós e folhas
  styles/index.css                ponto de entrada CSS
  index.js                        ponto de entrada JS
data/
  edition.sample.js               fixture executável
  edition.sample.json             contrato serializado
schemas/
  publication-tree.schema.json    JSON Schema
demo/
  index.html                      markup da demo
  demo.css                        estilos exclusivos da página de demonstração
  demo.js                         composição dos módulos
scripts/
  serve.mjs                       servidor local sem dependências
```

## API mínima

```js
import { PublicationTree } from './src/index.js';

const tree = new PublicationTree(element, data, {
  defaultExpandedDepth: 2
});

tree.expandAll();
tree.collapseAll();
tree.setExpanded('id-do-no', true);
tree.sortFacts('asc');
```

## Testes

```bash
npm test
```

Os testes verificam contagem recursiva, validação estrutural e ordenação das folhas.

## Validação executada

- testes unitários do modelo recursivo;
- smoke test HTTP para a demo e todos os módulos importados;
- validação sintática dos módulos JavaScript;
- parsing dos arquivos CSS;
- fixture com profundidade superior aos três níveis visíveis na referência EUR-Lex.
