# Mapa de rotas e superfícies do DOOL

**Data da observação:** 2026-09-13  
**Método:** observação pública + HAR real do navegador, somente leitura.

## 1. Host efetivamente capturado

O HAR confirma navegação e chamadas funcionais em:

- `https://dool.egba.ba.gov.br`

Também existem páginas públicas indexadas em `doe.ba.gov.br` e `www.doe.ba.gov.br`, mas a equivalência/canonicalização entre esses hosts e o host capturado não está comprovada. O Manifest V3 inicial não deve solicitar permissões para aliases adicionais sem necessidade demonstrada.

## 2. Rotas de navegação observadas no HAR

| Superfície | Rota/padrão | Resultado observado |
|---|---|---|
| Home | `/` | `200 text/html` |
| PDF | `/ver-pdf/{editionId}/` | `200 text/html` |
| Jornal/Flip | `/ver-flip/{editionId}/` | `200 text/html` |
| Leitura HTML | `/ver-html/{editionId}/` | `200 text/html` |
| Login | `/login` | `200 text/html`, após redirect de `/admin/home` |
| Área administrativa | `/admin/home` | `302 -> /login` no estado capturado |
| Meus dados | `/meus-dados` | `302 -> /` no estado capturado |

Rotas públicas observadas anteriormente e não exercitadas no HAR:

- `/buscanova/`;
- `/cadastro`;
- `/esqueci-senha`.

## 3. Contratos estruturados da home

### Edição corrente/data

`GET /apifront/portal/edicoes/edicoes_from_data.json?subtheme=<valor>`

Retorna JSON com metadados de uma ou mais edições, incluindo identificador, data, suplemento, número, tipo, capa e quantidade de páginas.

### Últimas edições

`GET /apifront/portal/edicoes/ultimas_edicoes.json?subtheme=<valor>`

Retorna lista estruturada utilizada pelo seletor da home.

### Capa

`GET /apifront/portal/edicoes/imagem_diario/{editionId}/1/imagem`

Retorna imagem JPEG da capa/página.

### Download completo

`GET /portal/edicoes/download/{editionId}`

Retorna PDF da edição para o caso capturado. Regras de acervo/perfil não devem ser inferidas a partir de uma edição atual.

## 4. PDF

Fluxo:

```text
/ver-pdf/{editionId}/
  -> /apifront/portal/edicoes/edicao_imagens/{editionId}
  -> /cleanpdf/?file=<...>
  -> /apifront/portal/edicoes/pdf_diario/{editionId}/{page}?t=<...>
```

O catálogo de páginas retorna body JSON com MIME `text/html`. O endpoint de PDF por página respondeu `200` e `206` conforme carregamento/Range.

Também foi observado:

`/portal/edicoes/download/{editionId}/{page}`

## 5. Jornal / Flip

Fluxo:

```text
/ver-flip/{editionId}/
  -> /apifront/portal/edicoes/edicao_imagens/{editionId}
  -> /apifront/portal/edicoes/imagem_diario/{editionId}/{page}
  -> /apifront/portal/edicoes/imagem_diario/{editionId}/{page}/thumb
```

A fonte de dados é independente do componente visual legado.

## 6. Leitura HTML

Fluxo:

```text
/ver-html/{editionId}/
  -> /apifront/portal/edicoes/edicao_disponivel/{editionId}
  -> /html/{editionId}.html
  -> /apifront/portal/edicoes/publicacoes_ver_conteudo/{publicationId}
```

`/html/{editionId}.html` entrega o sumário hierárquico. Cada `a.linkMateria` contém identificadores estruturais e número de página. O conteúdo individual é solicitado apenas quando a matéria é selecionada.

## 7. Busca

A superfície `/buscanova/` está confirmada publicamente. O JavaScript da home constrói estado no fragmento com parâmetros como:

- `p` — página;
- `q` — termo;
- `di` — data inicial;
- `df` — data final.

O HAR enviado não percorreu a busca, portanto **nenhum endpoint de resultados é considerado contrato** ainda.

## 8. Autenticidade

O JavaScript público da home constrói a rota:

`GET /portal/edicoes/consulta_autenticidade/{hash}.json`

O fluxo não foi executado na captura. A rota é client-declared e a estrutura de resposta esperada pelo cliente foi documentada como hipótese, não como contrato runtime fechado.

## 9. Cadastro, login e recuperação

- `/cadastro` — abertura pública observada anteriormente; submissão é mutação.
- `/login` — formulário real capturado; action `POST /login`; submissão não capturada.
- `/esqueci-senha` — abertura pública observada anteriormente; submissão é mutação.
- `/admin/home` e `/meus-dados` — redirects reais observados no estado não autenticado da captura.

## 10. Fonte de verdade por domínio

| Domínio | Fonte comprovada |
|---|---|
| edição corrente | JSON estruturado |
| últimas edições | JSON estruturado |
| capa | imagem por endpoint |
| PDF completo | documento PDF |
| páginas da edição | JSON-in-text/html estruturado |
| PDF por página | documento PDF/Range |
| Flip | imagens por página + catálogo |
| sumário HTML | documento HTML estruturável |
| matéria HTML | documento HTML por `publicationId` |
| busca | navegação client-side conhecida; resultados pendentes |
| sessão/conta | redirects conhecidos; sessão autenticada pendente |
| autenticidade | rota declarada pelo cliente; resposta pendente |

## 11. Implicação para a extensão

O EPIC-02 pode trabalhar inicialmente apenas com `dool.egba.ba.gov.br` e com os contratos públicos comprovados. Adaptadores devem tratar inconsistência de MIME, redirects e falhas de parsing explicitamente. Scraping do DOM deve ser fallback, não mecanismo primário, nos domínios em que a captura já revelou fonte direta.
