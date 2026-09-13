# Registro de hipóteses

Toda interpretação ainda não demonstrada deve permanecer aqui até ser confirmada, refutada ou substituída por uma limitação explícita.

## Regras de promoção

Uma hipótese só pode ser promovida a fato quando houver evidência técnica reproduzível suficiente para preencher um registro em `contracts.md` sem depender de suposição.

## Hipóteses atuais

### HYP-001 — A nova view pode reutilizar recursos do DOOL sem alteração do backend
- Estado: aberta
- Fundamentação: objetivo arquitetural do protótipo; as superfícies públicas foram identificadas, mas os contratos internos de rede e as políticas do navegador ainda não foram capturados.
- Evidência necessária: chamadas/dados de home, edição, busca, leitura HTML e sessão.

### HYP-002 — A leitura HTML pode ser reconstruída a partir de dados acessíveis à extensão
- Estado: aberta
- Fundamentação: `/ver-html/{id}/` é publicamente observável e expõe estrutura editorial, porém a origem real de categorias e matérias ainda é desconhecida.
- Evidência necessária: HTML inicial, chamadas posteriores e/ou DOM renderizado em navegador real.

### HYP-003 — A pesquisa possui um contrato reutilizável pela nova UI
- Estado: aberta
- Fundamentação: `/buscanova/` expõe um modelo de template com `results.hits.total`, `queryTerm`, paginação e `doc._source.*`, mas o endpoint e o mecanismo de busca não foram observados.
- Evidência necessária: requisição/resposta real ou, se não houver API separada, contrato de documento/DOM.

### HYP-004 — A sessão atual do navegador pode ser reaproveitada sem armazenamento adicional de credenciais
- Estado: aberta
- Fundamentação: requisito desejável, ainda dependente de cookies, redirects, políticas de origem e comportamento autenticado.
- Evidência necessária: discovery autenticado legítimo e análise das políticas do navegador.

### HYP-005 — A busca usa renderização client-side apoiada em um modelo estruturado
- Estado: parcialmente sustentada, não promovida a fato arquitetural
- Fundamentação: o índice público exibe marcadores não resolvidos como `results.hits.total`, `queryTerm`, `doc._source.day/month/year` e `cliente.*`.
- Limite: isso não comprova AngularJS, Elasticsearch ou qualquer endpoint específico.
- Evidência necessária: source/DOM e tráfego de rede em navegador real.

### HYP-006 — `www.doe.ba.gov.br`, `doe.ba.gov.br`, `do.ba.gov.br` e `www2.egba.ba.gov.br` são aliases operacionais equivalentes
- Estado: aberta
- Fundamentação: os hosts estão indexados com superfícies do DOOL equivalentes; `www2.egba.ba.gov.br` também expõe `/buscanova/` e `/ver-html/{id}/` no índice recente.
- Limite: não há evidência atual de redirects, cookies, CORS/CSP ou equivalência de sessão entre os hosts.
- Evidência necessária: inspeção HTTP e navegação real nos hosts.

### HYP-007 — O DOOL utiliza uma plataforma/template multicliente compartilhado por outros diários oficiais
- Estado: indício forte, contrato local não demonstrado
- Fundamentação: o mesmo conjunto incomum de marcadores e funções de `/buscanova/` (`results.hits.total`, `queryTerm`, `doc._source.*`, `isSuplemento(doc)`, `cliente.limiteAntigos`) aparece em portais de outros diários oficiais.
- Limite: sem source/tráfego do DOOL não é seguro inferir que todos os clientes usem a mesma versão, endpoints, autenticação ou infraestrutura.
- Uso permitido da hipótese: orientar investigação e busca de documentação pública; nunca reutilizar automaticamente contrato de outro cliente.
- Evidência necessária: identificar scripts/assinaturas técnicas no DOOL e comparar somente após captura local.
