# ADR-002 — Índice dimensional histórico cumulativo

**Status:** Aceita  
**Data:** 2026-09-14

## Contexto

A navegação edição por edição não oferece uma forma prática de responder consultas como “todas as publicações da Secretaria da Educação nos últimos 90 dias”, especialmente quando há órgãos subordinados e tipos editoriais variados.

O DOOL possui metadados suficientes para construir um índice próprio de referências sem copiar o corpo documental.

## Decisão

Criar um índice dimensional histórico em MySQL, público para leitura por API, com:

- backfill inicial de 90 dias;
- sincronização incremental por hora;
- reconciliação diária dos últimos 7 dias;
- retenção cumulativa;
- grão de uma publicação por `publicationId`;
- temporalidade organizacional;
- canonicalização conservadora;
- busca textual por títulos;
- facetas e autocomplete;
- `source_start_page` validada contra o catálogo da edição.

Os 90 dias são default inicial de consulta, não retenção.

## Grão

```text
1 fact_publication = 1 source_publication_id em 1 cadeia editorial
```

Cadeia:

```text
Edição -> Caderno -> Órgão -> subordinados -> Tipo -> Publicação
```

## Identidade

Consolidar automaticamente apenas por:

1. mesmo ID/código oficial;
2. relação explícita nome/sigla na fonte;
3. diferença gráfica inequívoca.

Equivalência semântica inferida não consolida automaticamente.

## Temporalidade

A publicação histórica deve permanecer associada à estrutura organizacional válida em sua data.

Mudanças atuais não reescrevem o passado.

## Página inicial

A publicação espera:

```text
publicationId + editionId + source_start_page
```

A página só habilita PDF/Jornal quando validada.

Estados:

```text
VALIDATED
MISSING_PAGE_ATTRIBUTE
INVALID_PAGE_VALUE
PAGE_NOT_IN_CATALOG
PAGE_CATALOG_UNAVAILABLE
```

## Consequências positivas

- exploração por múltiplas dimensões;
- histórico crescente;
- hierarquia administrativa consultável;
- ligação direta de resultado a HTML/PDF/Jornal;
- menor necessidade de percorrer edição por edição;
- possibilidade de autocomplete/contexto.

## Consequências negativas / custos

- necessidade de ingestão e reconciliação;
- necessidade de governança de aliases;
- manutenção de temporalidade;
- monitoramento de mudanças no DOOL;
- novas responsabilidades de backup/observabilidade.

## Alternativas rejeitadas

### JSON estático por período

Rejeitado por baixa adequação a histórico crescente, facetas, hierarquias temporais e combinações de filtros.

### Engine especializada de busca desde a v1

Adiada por complexidade operacional prematura. A API deve permanecer desacoplada do mecanismo para permitir evolução futura.

### Armazenar HTML completo

Rejeitado. O índice armazena metadados/referências; o DOOL continua sendo fonte documental.

## Relação com outros documentos

- `docs/specs/EPIC-04.5-indice-dimensional-publico.md`
- `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`
