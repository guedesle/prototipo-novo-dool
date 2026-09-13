# Suplemento do catálogo — busca e sessão autenticada

**Data:** 2026-09-13  
**Relaciona-se a:** `contracts.md`  
**Evidência:** segunda captura HAR sanitizada

Este suplemento registra contratos que não existiam na primeira captura. Ele deve ser lido junto ao catálogo canônico até a consolidação documental final do EPIC-01.

## CONTRACT-021 — Busca de resultados

- Status: repetido
- Perfil: sessão autenticada, embora a rota de busca seja pública
- Ação do usuário: executar pesquisa por termo/período
- Rota/página de origem: `/buscanova/`
- Requisição: `GET /busca/busca/buscar/query/{page}{filters}/?1=1&q=<term>`
- Parâmetros relevantes: página; `q`; filtros `di`, `df`, `y`; flags opcionais `materias`, `calendario`, `subtheme`
- Tipo de resposta: `200 application/json`
- Fonte de verdade: backend-estruturado
- Classificação: leitura
- Schema sanitizado: `fixtures/authenticated/search-response.schema.json`
- Efeito esperado na UI: renderizar resultados, destaques e facetas
- Zero resultado: `hits.total = 0`, `hits.hits = []`, buckets vazios
- Erros observados: nenhum nas duas capturas
- Fallback disponível: `/buscanova/` original
- Dependência de DOM: não para aquisição dos resultados
- Evidência: `evidence/authenticated/2026-09-13-har-auth-search-summary.md`

### Observação

O response expõe terminologia compatível com Elasticsearch (`_shards`, `_index`, `_score`, `aggregations` etc.), mas o protótipo deve depender apenas do **contrato HTTP observado**, não da tecnologia interna presumida.

## CONTRACT-022 — Estado autenticado por acesso ao perfil

- Status: repetido
- Perfil: cadastrado/autenticado
- Ação do usuário: abrir área de perfil
- Rota/página de origem: navegação de conta
- Requisição: `GET /meus-dados`
- Tipo de resposta: `200 text/html`
- Fonte de verdade: backend/documento autenticado
- Classificação: leitura/navegação
- Autorização observada: sessão autenticada comprovada para a rota
- Efeito esperado na UI: reconhecer que existe sessão autenticada e delegar operações de conta ao legado
- Erros observados: nenhum nesta captura
- Fallback disponível: perfil original
- Dependência de DOM: não para detectar o status HTTP; documento necessário apenas se quisermos apresentar links/capacidades existentes
- Evidência: `evidence/authenticated/2026-09-13-har-auth-search-summary.md`

### Limites

Este contrato **não prova assinatura** nem autorização administrativa. O documento autenticado contém links para diferentes áreas, mas a presença de um link não equivale a permissão efetiva sobre o destino.

## CONTRACT-023 — Atualização de perfil (mutação delegada)

- Status: observado estruturalmente, não executado
- Perfil: cadastrado/autenticado
- Ação do usuário: atualizar dados cadastrais/credenciais/endereço
- Rota/página de origem: `/meus-dados`
- Requisição: formulário `POST /usuarios/meus_dados/{userId}`
- Parâmetros relevantes: dados de conta e endereço; valores não versionados
- Classificação: mutação
- Autorização observada: formulário disponível na sessão capturada
- Estado no protótipo: **não reimplementar no primeiro incremento; delegar ao fluxo original**
- Evidência: documento autenticado sanitizado

## CONTRACT-024 — Principal e suplemento como variantes do mesmo modelo

- Status: repetido
- Perfil: estado autenticado capturado
- Ação do usuário: consultar edição do dia e abrir formatos
- Fonte: `edicoes_from_data.json`
- Resultado observado: duas variantes para a mesma data/número, com `editionId` e quantidade de páginas próprios
- Fonte de verdade: backend-estruturado
- Classificação: leitura
- Efeito esperado na UI: representar edição como entidade base + variante/tipo, reutilizando os mesmos adaptadores de PDF/Flip/HTML
- Dependência de DOM: não
- Evidência: segunda captura HAR sanitizada

## Pendências ainda não fechadas

- consulta de autenticidade executada;
- assinatura/acervo certificado por perfil;
- sessão expirada ou logout observado até o estado posterior;
- autorização efetiva da área administrativa.
