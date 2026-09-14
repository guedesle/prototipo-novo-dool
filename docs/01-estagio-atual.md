# Estágio atual

**Data de referência:** 14/09/2026  
**Fase:** arquitetura standalone aprovada; handoff de design em preparação  
**Modo principal:** aplicação web pública standalone  
**Modo secundário:** extensão Chromium  
**Gate atual:** arquitetura aprovada; design deve seguir `docs/design/HANDOFF-SITES.md`

## 1. O que já está concluído

### EPIC-01 — Discovery

Concluído e mergeado. Contratos observados cobrem edições, HTML, PDF, Flip, busca e estado básico de sessão.

### EPIC-02 — Fundação e isolamento da extensão

Concluído e mergeado. A extensão é reversível, fail-open e não é mais requisito para o modo principal.

### EPIC-03 — Camada de adaptação e sessão

Concluído e mergeado. Adaptadores internos existem para os contratos conhecidos do DOOL.

### EPIC-04 — Design system, shell e acessibilidade

Concluído e mergeado. Gate manual aprovado para teclado, 320 px, zoom 200%, reduced motion e reversibilidade.

## 2. Mudança arquitetural de 14/09/2026

A arquitetura principal foi alterada de “extensão como plataforma” para:

```text
Novo DOOL standalone / Hostinger
  -> Frontend público
  -> BFF / API
  -> Índice dimensional MySQL
  -> Ingestor
  -> DOOL oficial como fonte documental
```

A extensão permanece como modo secundário/experimental.

A especificação congelada é:

`docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## 3. Índice dimensional aprovado

O índice terá:

- backfill inicial de 90 dias;
- sincronização incremental a cada hora;
- reconciliação diária dos últimos 7 dias;
- retenção histórica cumulativa;
- dimensões de data, edição, caderno, organização e tipo de publicação;
- hierarquia organizacional temporal;
- canonicalização conservadora;
- busca textual por títulos;
- autocomplete;
- API pública somente leitura.

Grão:

```text
1 fact_publication = 1 publicationId em 1 cadeia editorial
```

## 4. Descoberta de página por publicationId

O sumário HTML fornece `publicationId` e página inicial. O modelo passa a tratar:

```text
publicationId + editionId + source_start_page
```

como coordenada editorial esperada.

A página é validada contra o catálogo da própria edição antes de habilitar PDF/Jornal por página.

Estados mínimos:

```text
VALIDATED
MISSING_PAGE_ATTRIBUTE
INVALID_PAGE_VALUE
PAGE_NOT_IN_CATALOG
PAGE_CATALOG_UNAVAILABLE
```

A ausência de página não elimina a publicação.

## 5. Fonte documental

O backend do Novo DOOL não deve armazenar permanentemente o corpo HTML das matérias.

Fluxo:

```text
resultado indexado
 -> publicationId
 -> BFF
 -> DOOL oficial
 -> HTML/PDF/Flip
 -> navegador
```

Cache de HTML é local no browser, com freshness de 24h e fallback explícito para última visualização.

## 6. Autenticação

Consulta pública não exige login próprio.

Identidade do Novo DOOL, se adicionada, é opcional e serve a recursos próprios.

Invariante:

```text
sessão_Novo_DOOL != sessão_DOOL
```

Qualquer integração de login oficial depende do Gate AUTH-DOOL.

## 7. Evidências técnicas ainda válidas

Continuam relevantes e confirmados no discovery:

- host `dool.egba.ba.gov.br`;
- edições por JSON estruturado;
- Principal/Suplemento no mesmo modelo;
- download de edição completa;
- catálogo de páginas por edição;
- PDF por página com Range/206;
- Flip por imagens/thumbnails;
- sumário HTML por edição;
- matéria HTML por `publicationId`;
- busca oficial estruturada;
- zero resultado como resposta válida;
- sessão autenticada comprovada por rota de perfil;
- ausência de prova suficiente para inferir assinatura.

## 8. Ressalvas conhecidas

Ainda precisam de discovery específico:

- contrato completo de autenticação oficial;
- eventual OAuth/OIDC/SSO do DOOL;
- sessão expirada/renovação;
- distinção cadastrados/assinantes;
- capacidades do acervo certificado;
- autenticidade executada;
- comportamento de recursos protegidos quando acessados pelo modo standalone.

## 9. EPIC-05 anterior

A branch `epic-05-home-edicoes` foi iniciada antes da mudança arquitetural e deve permanecer pausada.

Não continuar implementação baseada em “extensão como plataforma principal”.

O EPIC-05 foi reespecificado nesta branch para o modo standalone.

## 10. Próximos subsistemas

Foram formalizados:

```text
EPIC-04.5 — Índice Dimensional Público do DOOL
EPIC-04.6 — Plataforma Web Standalone + BFF
```

Eles precedem a retomada funcional de EPIC-05/06.

## 11. Design

O próximo trabalho autorizado é o handoff e design da aplicação standalone.

Ponto de entrada:

`docs/design/HANDOFF-SITES.md`

Plano:

`docs/superpowers/plans/2026-09-14-novo-dool-design-handoff.md`

Fixtures sintéticas de design:

`docs/fixtures/design/`

## 12. Gates atuais

- G0 — documentação inicial: concluído.
- G1 — discovery: aprovado com ressalvas por domínio.
- G2 — isolamento da extensão: concluído.
- G3 — adapters/sessão básica: concluído.
- G4 — design system/base UI: concluído.
- G4.5 — índice dimensional: especificado, não implementado.
- G4.6 — web standalone+BFF: especificado, não implementado.
- Design standalone: documentação/handoff pronto para revisão nesta branch.

## 13. Próxima ação

Revisar o pacote documental desta branch e executar o design no Sites/Work/Codex a partir de `docs/design/HANDOFF-SITES.md`. Após aprovação visual, produzir planos de engenharia separados para:

1. índice dimensional + ingestão;
2. plataforma standalone + BFF;
3. implementação do frontend aprovado.
