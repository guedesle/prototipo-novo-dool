# EPIC-04.5 — Índice Dimensional Público do DOOL

**Status:** especificado, não implementado  
**Prioridade:** bloqueadora para a retomada do EPIC-05/06  
**Dependências:** EPIC-01, EPIC-03; integra-se ao EPIC-04

## 1. Objetivo

Criar um índice dimensional histórico, público e cumulativo de metadados das publicações do DOOL, com backfill inicial de 90 dias, sincronização horária e reconciliação diária, capaz de sustentar a experiência “Explorar publicações”.

## 2. Resultado de negócio

O usuário consegue consultar publicações por período, caderno, órgão, subordinados, tipo e título sem percorrer edição por edição, preservando a fonte documental oficial no DOOL.

## 3. Escopo

- MySQL dimensional;
- `fact_publication` com grão por `publicationId`;
- dimensões de data, edição, caderno, organização e tipo;
- hierarquia organizacional temporal;
- aliases/canonicalização conservadora;
- `source_start_page` e validação publicationId -> página;
- catálogo `edition_page`;
- backfill de 90 dias;
- sync incremental por hora;
- reconciliação dos últimos 7 dias diariamente;
- histórico cumulativo sem expiração por idade;
- busca textual por títulos;
- autocomplete/sugestões;
- facetas e contagens;
- observabilidade de ingestão;
- API pública somente leitura.

## 4. Fora de escopo

- armazenar corpo HTML das matérias no backend;
- criar macrogrupos de tipos de publicação;
- inferir equivalência semântica de entidades automaticamente;
- alterar documentos oficiais;
- substituir autenticação/autorização do DOOL;
- motor semântico generativo;
- re-ranking opaco.

## 5. Grão

Uma linha em `fact_publication` representa um único `publicationId` em uma única cadeia editorial.

```text
Edição -> Caderno -> Órgão -> subordinados -> Tipo -> Publicação
```

## 6. Página inicial

`source_start_page` é obrigatório no contrato esperado, mas nullable fisicamente para preservar publicações anômalas.

Estados:

```text
VALIDATED
MISSING_PAGE_ATTRIBUTE
INVALID_PAGE_VALUE
PAGE_NOT_IN_CATALOG
PAGE_CATALOG_UNAVAILABLE
```

Somente `VALIDATED` habilita ações diretas de PDF/Jornal por página.

## 7. Canonicalização

Consolidação automática apenas quando houver:

1. mesmo ID oficial;
2. relação explícita nome/sigla no DOOL;
3. diferença gráfica trivial.

Equivalência semântica inferida não consolida automaticamente.

Valores originais devem permanecer auditáveis.

## 8. Temporalidade

Publicações históricas usam a estrutura organizacional válida na data da publicação.

Mudança de nome, subordinação ou secretaria não reescreve o passado.

## 9. Ingestão

```text
BACKFILL_INITIAL: últimos 90 dias
SYNC_INCREMENTAL: 1h
RECONCILE_RECENT: últimos 7 dias / 1x por dia
```

Escrita idempotente e transacional por edição.

Falha parcial de matéria não elimina dados válidos da edição.

## 10. API

Base versionada:

```text
/api/v1
```

Endpoints mínimos:

```text
GET /publications
GET /search/suggestions
GET /organizations/tree
GET /organizations/:id/children
GET /status
```

A API pública é somente leitura.

## 11. Busca

Busca textual v1 atua sobre títulos indexados.

Normalização tolera caixa, acentos, espaços e pontuação trivial.

Sugestão ortográfica não reescreve silenciosamente a consulta.

## 12. Segurança

- nenhum usuário MySQL de escrita no cliente/API pública;
- queries parametrizadas;
- rate limiting;
- limites de consulta;
- logs sanitizados;
- sem corpo HTML persistido;
- sem credenciais DOOL armazenadas.

## 13. Critérios de aceite

### CA-04.5-A

Carga inicial indexa os 90 dias definidos sem duplicar `publicationId`.

### CA-04.5-B

Consulta por órgão pai retorna descendentes segundo a hierarquia válida na data de cada publicação.

### CA-04.5-C

Exclusão de subordinado não altera registros fora do conjunto selecionado.

### CA-04.5-D

Tipos não são agrupados artificialmente.

### CA-04.5-E

Publicação sem página válida permanece consultável em HTML e não recebe ação PDF/Flip inventada.

### CA-04.5-F

Sync horário é idempotente e reconciliação diária detecta alterações reais.

### CA-04.5-G

API expõe apenas leitura pública e não contém credencial de banco no cliente.

### CA-04.5-H

Histórico anterior a 90 dias não é apagado à medida que o índice cresce.

## 14. Gate

**G4.5:** índice dimensional apto a alimentar Home/Explorar quando contratos, ingestão, temporalidade, página e API passarem pelos critérios acima.
