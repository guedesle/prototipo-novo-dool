# Protótipo Novo DOOL

Protótipo para modernização da experiência do **Diário Oficial On-Line do Estado da Bahia (DOOL)**, preservando as regras de negócio e os documentos oficiais do sistema de origem.

## Arquitetura alvo atual

A partir da decisão arquitetural de 2026-09-14, o modo principal do projeto é uma **aplicação web pública standalone hospedada na Hostinger**, acessível por URL e sem exigir extensão ou autenticação própria para consulta pública.

A extensão Chromium existente permanece como modo secundário/experimental de integração e demonstração.

Princípio central:

> **Nova experiência, mesmas regras de negócio.**

O Novo DOOL pode organizar e indexar metadados para melhorar a descoberta, mas o **DOOL oficial permanece a fonte documental e a autoridade sobre autenticação, autorização e recursos protegidos**.

## Estado do projeto

- EPIC-01 — discovery e contratos: concluído/mergeado.
- EPIC-02 — fundação e isolamento da extensão: concluído/mergeado.
- EPIC-03 — adapters e sessão: concluído/mergeado.
- EPIC-04 — design system, shell e acessibilidade: concluído/mergeado.
- EPIC-05 — execução anterior pausada após mudança arquitetural.
- EPIC-04.5 — índice dimensional público: especificado, não implementado.
- EPIC-04.6 — plataforma web standalone + BFF: especificado, não implementado.
- EPIC-05/06 — reespecificados para o modo standalone nesta branch de arquitetura.
- Design: handoff preparado em `docs/design/HANDOFF-SITES.md`.

## Arquitetura resumida

```text
Usuário
  -> Novo DOOL / Hostinger
       -> Frontend público
       -> BFF / API
       -> Índice dimensional MySQL
       -> Ingestor
       -> DOOL oficial
```

### Índice dimensional

O projeto prevê um índice histórico cumulativo com:

- backfill inicial de 90 dias;
- sincronização incremental a cada hora;
- reconciliação diária dos últimos 7 dias;
- retenção histórica contínua;
- período, caderno, órgão/subordinados, tipo, edição e título;
- `publicationId` ligado à página inicial validada da edição;
- autocomplete e busca textual por títulos;
- API pública somente leitura.

Os 90 dias são **janela inicial e default de consulta**, não prazo de retenção.

### Conteúdo documental

O backend do Novo DOOL não deve persistir o corpo HTML completo das matérias como acervo paralelo.

Fluxo preferido:

```text
resultado indexado
  -> publicationId
  -> BFF
  -> DOOL oficial
  -> HTML/PDF/Flip
  -> navegador
```

Cache de HTML, quando necessário, fica localmente no browser com freshness de 24h e fallback explícito para a última visualização.

## Autenticação

A consulta pública do Novo DOOL não exige login próprio.

Se identidade própria for adicionada, ela serve a recursos como preferências, favoritos, buscas salvas e alertas.

Invariante:

```text
sessão_Novo_DOOL != sessão_DOOL
```

Uma conta do Novo DOOL nunca amplia a autorização do usuário no DOOL oficial.

Qualquer integração futura com login oficial depende do **Gate AUTH-DOOL** e não deve capturar ou armazenar senha oficial sem contrato formalmente aprovado.

## Documentos principais

- [`docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`](docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md) — arquitetura aprovada do modo standalone.
- [`docs/design/HANDOFF-SITES.md`](docs/design/HANDOFF-SITES.md) — entrada única para Sites/Work/Codex.
- [`docs/design/design-qa-gates.md`](docs/design/design-qa-gates.md) — gates de qualidade para o design.
- [`docs/04-roadmap-epicos.md`](docs/04-roadmap-epicos.md) — roadmap revisado.
- [`docs/specs/EPIC-04.5-indice-dimensional-publico.md`](docs/specs/EPIC-04.5-indice-dimensional-publico.md) — índice dimensional.
- [`docs/specs/EPIC-04.6-plataforma-web-standalone-bff.md`](docs/specs/EPIC-04.6-plataforma-web-standalone-bff.md) — site standalone + BFF.
- [`docs/specs/EPIC-05-home-edicoes-navegacao.md`](docs/specs/EPIC-05-home-edicoes-navegacao.md) — Home standalone.
- [`docs/specs/EPIC-06-busca-acervo.md`](docs/specs/EPIC-06-busca-acervo.md) — Explorar publicações + acervo oficial.
- [`docs/discovery/contracts.md`](docs/discovery/contracts.md) — contratos observados do DOOL.
- [`docs/discovery/access-matrix.md`](docs/discovery/access-matrix.md) — matriz de acesso observada.

Fixtures sintéticas de design ficam em `docs/fixtures/design/` e não representam conteúdo oficial real.

## Governança

Nenhum design ou implementação deve alterar silenciosamente:

- regras de autorização do DOOL;
- identidade/canonicalização de órgãos e tipos;
- temporalidade histórica;
- relação `publicationId -> editionId -> source_start_page`;
- distinção entre índice próprio e busca oficial;
- origem documental do HTML/PDF/Flip.

A arquitetura aprovada deve ser revisada antes de qualquer decisão que mude essas invariantes.

## Design

O próximo estágio é o design da aplicação standalone no Sites/Work/Codex.

Antes de editar o projeto, o agente de design deve ler `docs/design/HANDOFF-SITES.md`, inspecionar o design system já implementado e apresentar mapa de telas/estados, arquitetura visual, componentes reutilizados/novos e estratégia responsiva.

A execução anterior do EPIC-05 permanece pausada até existir novo plano baseado na arquitetura standalone.
