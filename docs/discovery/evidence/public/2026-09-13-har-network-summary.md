# Evidência sanitizada — HAR do DOOL

**Data da captura:** 2026-09-13  
**Origem:** navegador do usuário, exportação HAR com conteúdo  
**Arquivo bruto:** deliberadamente não versionado  
**Classificação:** evidência de rede sanitizada

## 1. Escopo da captura

O HAR contém 420 requisições, das quais 387 têm `dool.egba.ba.gov.br` como host. A sequência de navegação registrada foi:

1. `/`
2. `/ver-pdf/22535/`
3. `/ver-flip/22535/`
4. `/ver-html/22535/`
5. `/admin/home` -> redirect para `/login`
6. `/ver-html/22535/`
7. `/meus-dados` -> redirect para `/`

Não há operação mutante direcionada ao host DOOL nesta captura. Os `POST` observados pertencem a serviços externos de analytics e não integram o contrato funcional do protótipo.

## 2. Sessão observada

A captura **não comprova uma sessão autenticada**:

- `GET /admin/home` respondeu `302` e redirecionou para `/login`;
- `GET /meus-dados` respondeu `302` e redirecionou para `/`;
- o HAR exportado não contém campos `Cookie`, `Authorization` ou `Set-Cookie` utilizáveis como evidência de sessão.

A ausência desses campos no HAR não deve ser interpretada isoladamente como prova de inexistência de cookies, pois ferramentas de exportação podem sanitizar headers sensíveis. O comportamento dos redirects, porém, é compatível com estado não autenticado para as rotas visitadas.

## 3. Contratos de edição observados

### Última edição por data

`GET /apifront/portal/edicoes/edicoes_from_data.json?subtheme=<valor>`

- resposta: `200 application/json`;
- observado duas vezes;
- estrutura raiz: `erro`, `msg`, `data`, `itens`;
- item observado: `id`, `data`, `suplemento`, `numero`, `tipo_edicao_id`, `tipo_edicao_nome`, `capa`, `paginas`.

### Últimas edições

`GET /apifront/portal/edicoes/ultimas_edicoes.json?subtheme=<valor>`

- resposta: `200 application/json`;
- observado duas vezes;
- estrutura raiz: `erro`, `msg`, `itens`;
- item observado: `id`, `data`, `suplemento`, `suplemento_nome`, `numero`, `tipo_edicao_id`, `tipo_edicao_nome`, `capa`.

O JavaScript público `theme/EGBA/js/home.js` usa esses contratos via jQuery para preencher data, número, capa, seleção de edições e URLs de HTML/PDF/Jornal.

## 4. PDF

Fluxo observado:

- `GET /ver-pdf/{editionId}/` -> shell HTML;
- `GET /apifront/portal/edicoes/edicao_imagens/{editionId}` -> corpo JSON entregue com MIME `text/html`;
- itens do catálogo de páginas: `id`, `pagina`, `link`;
- a edição capturada retornou 88 páginas;
- `GET /cleanpdf/?file=<redacted>` -> viewer HTML baseado em PDF.js;
- `GET /apifront/portal/edicoes/pdf_diario/{editionId}/{page}?t=<redacted>` -> `application/pdf`;
- respostas parciais `206` foram observadas para requisições Range;
- `GET /portal/edicoes/download/{editionId}` -> documento PDF completo;
- `GET /portal/edicoes/download/{editionId}/{page}` também foi observado na navegação.

## 5. Jornal / Flip

Fluxo observado:

- `GET /ver-flip/{editionId}/` -> shell HTML;
- `GET /apifront/portal/edicoes/edicao_imagens/{editionId}` -> catálogo de páginas;
- imagens de página: `/apifront/portal/edicoes/imagem_diario/{editionId}/{page}`;
- thumbnails: `/apifront/portal/edicoes/imagem_diario/{editionId}/{page}/thumb`.

Isso demonstra que o flip utiliza recursos de imagem por página e não exige que a nova interface reproduza o componente visual legado para reutilizar a fonte de dados.

## 6. Leitor HTML

Fluxo observado:

1. `GET /ver-html/{editionId}/` -> shell HTML;
2. `GET /apifront/portal/edicoes/edicao_disponivel/{editionId}` -> estrutura JSON entregue com MIME `text/html`;
3. `GET /html/{editionId}.html` -> sumário hierárquico da edição;
4. clique em uma matéria -> `GET /apifront/portal/edicoes/publicacoes_ver_conteudo/{publicationId}`;
5. resposta -> HTML integral da matéria.

Na edição capturada, o sumário continha elementos `span.folder` e links `a.linkMateria`. Os links carregam identificadores estruturais, incluindo identificador de matéria e número de página. O conteúdo individual observado foi HTML gerado a partir de Microsoft Word, com CSS embutido e sem `<script>`, `<iframe>`, `<object>`, `<embed>`, formulários ou event handlers inline na amostra inspecionada.

Esse resultado sustenta a arquitetura de **sumário normalizado + conteúdo de matéria carregado sob demanda** para o novo leitor.

## 7. Login e rotas protegidas

A página `/login` foi carregada após redirect de `/admin/home`. O documento contém formulário `POST /login` com campos de usuário e senha. Nenhuma submissão de login foi capturada e nenhum valor de credencial foi extraído ou versionado.

A rota `/meus-dados` não ficou acessível no estado capturado e redirecionou para `/`.

## 8. Políticas HTTP observadas

Nos responses do DOOL inspecionados no HAR não foram observados headers `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy` ou `Permissions-Policy`. Isto significa apenas **não observados nesta captura**, não inexistentes em toda a infraestrutura.

`/cleanpdf/` apresentou headers `Access-Control-Allow-*`, porém sem origem permissiva útil registrada. Não há evidência suficiente para considerar CORS cross-origin liberado para os contratos de negócio.

O header de servidor está presente na captura, mas seu fingerprint detalhado é omitido desta documentação por não ser necessário para o protótipo.

## 9. JavaScript público e origem das chamadas

Os initiators registrados no HAR confirmam uso de jQuery nas superfícies capturadas:

- home: `theme/EGBA/js/home.js`;
- HTML: `theme/EGBA/js/visualizacoes/html.js`;
- PDF: `theme/EGBA/js/visualizacoes/pdf.js`.

O leitor HTML constrói o endpoint de disponibilidade, carrega `/html/{editionId}.html` e, ao selecionar uma matéria, carrega `publicacoes_ver_conteudo/{publicationId}`.

O JavaScript da home também declara uma consulta de autenticidade em `/portal/edicoes/consulta_autenticidade/{hash}.json`, mas esse fluxo **não foi executado no HAR** e deve permanecer como contrato client-declared até haver resposta observada.

## 10. Segurança e sanitização

Não foram versionados:

- conteúdo bruto do HAR;
- valores de headers sensíveis;
- credenciais;
- cookies ou tokens;
- identificadores pessoais de conta;
- conteúdo integral das publicações.

Os IDs de edição e de publicação usados para descrever rotas são identificadores públicos observáveis no próprio portal, mas os fixtures de teste devem preferir valores sintéticos.
