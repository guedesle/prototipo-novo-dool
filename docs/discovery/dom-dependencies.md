# Dependências de HTML e DOM

**Data:** 2026-09-13

Este documento separa aquisição de dados, parsing de documento e dependência real do DOM legado após a análise do HAR.

| Superfície/dado | Fonte observada | DOM legado necessário para adquirir? | Estado |
|---|---|---:|---|
| estrutura da home | documento HTML | não | observado |
| edição corrente/principal/suplemento | `edicoes_from_data.json` | não | demonstrado |
| últimas edições | `ultimas_edicoes.json` | não | demonstrado |
| capa | `imagem_diario/{editionId}/1/imagem` | não | demonstrado |
| formulário/navegação de busca | documento + `home.js` | não para construir parâmetros | observado |
| resultados da busca | contrato não capturado | desconhecido | pendente |
| shell `/ver-html/{editionId}/` | documento HTML | não para adquirir | demonstrado |
| disponibilidade HTML | `edicao_disponivel/{editionId}` | não | demonstrado |
| categorias/sumário | `/html/{editionId}.html` | **não**; requer parsing do documento retornado | demonstrado |
| matéria individual | `publicacoes_ver_conteudo/{publicationId}` | **não** | demonstrado |
| zoom do leitor | comportamento local no legado | não é fonte de dados | observado; pode ser refeito |
| catálogo de páginas PDF/Flip | `edicao_imagens/{editionId}` | não | demonstrado |
| PDF por página | `pdf_diario/{editionId}/{page}` | não | demonstrado |
| imagens do Flip | `imagem_diario/{editionId}/{page}` | não | demonstrado |
| thumbnails do Flip | `imagem_diario/{editionId}/{page}/thumb` | não | demonstrado |
| login | documento/formulário legado | reimplementação bloqueada; delegar | parcial |
| conta/assinatura | não adquirida no HAR | desconhecido | bloqueado |
| autenticidade | rota declarada em `home.js`, resposta não capturada | desconhecido | pendente |

## Conclusão

O HAR refutou a hipótese de que os principais dados públicos dependem do DOM já renderizado. **Edições, páginas, sumário e conteúdo das matérias possuem fontes adquiríveis separadamente.**

Para o novo protótipo:

1. não usar scraping do DOM da home para obter edições;
2. não usar a árvore já renderizada como fonte primária do sumário — parsear o documento `/html/{editionId}.html` em um adaptador dedicado;
3. carregar o conteúdo por `publicationId` diretamente;
4. usar DOM legado somente como fallback ou para fluxos ainda não mapeados;
5. manter parsing/sanitização de HTML isolado da camada visual para permitir testes e fallback por matéria.

O único domínio funcional importante ainda sem fonte de dados comprovada é a **busca de resultados**, além dos recursos autenticados.
