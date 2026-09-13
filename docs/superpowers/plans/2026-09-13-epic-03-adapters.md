# EPIC-03 — Plano de implementação da camada de adaptação e sessão

> Execução: Inline Execution, low-HITL, branch `epic-03-adapters`.
> Spec: `docs/specs/EPIC-03-adaptacao-sessao.md`.
> Issue: #3.

## Objetivo técnico

Criar uma fronteira estável entre o legado DOOL e qualquer UI nova. Endpoints, formatos externos, redirects, sessão, parsing e autorização observada ficam encapsulados em `src/adapters/**`. A UI recebe apenas modelos internos e erros tipados.

## Princípios obrigatórios

- nenhuma UI conhece endpoint DOOL, cookie, token ou seletor legado;
- sessão reutiliza o contexto do navegador com `credentials: include`; não há cópia de cookie/token;
- `unknown` nunca equivale a autorização concedida;
- payload incompatível falha como `CONTRACT_UNEXPECTED`;
- 401/403 invalida capacidades protegidas;
- recursos ainda não comprovados, como autenticidade, retornam `UNSUPPORTED_OPERATION` e ficam feature-gated;
- sem cache persistente de documentos/sessão;
- fixtures e logs não contêm PII/segredos.

## Task 1 — Tipos, contratos e erros

**Arquivos:**
- criar `src/adapters/types.ts`
- criar `src/adapters/errors.ts`
- criar `src/adapters/contracts.ts`
- criar `tests/adapters/contracts.test.ts`

**RED:** testes exigem `AdapterErrorCode`, `AccessState`, capabilities tri-state e interfaces de repositório.

**GREEN:** definir:
- `EditionRepository`
- `SearchRepository`
- `HtmlPublicationRepository`
- `SessionProvider`
- `DocumentRepository`
- `AuthenticityRepository`
- `AdapterError` com códigos da spec.

**Gate:** nenhuma referência a endpoints nos tipos públicos.

## Task 2 — Transporte HTTP e normalização de falhas

**Arquivos:**
- criar `src/adapters/http.ts`
- criar `tests/adapters/http.test.ts`

**RED:** cobrir 200, 401, 403, 404, falha de rede, redirect/final URL e JSON inválido.

**GREEN:** implementar `DoolHttpClient` com `fetch` injetável, `credentials: 'include'`, timeout/cancelamento simples e mapeamento para erros tipados.

**Gate:** sem leitura direta de cookies/tokens; payload de erro não é logado.

## Task 3 — Edições e documentos

**Arquivos:**
- criar `src/adapters/validation.ts`
- criar `src/adapters/editions.ts`
- criar `src/adapters/documents.ts`
- criar `tests/adapters/editions.test.ts`
- criar `tests/adapters/documents.test.ts`
- criar fixtures sanitizadas em `tests/fixtures/editions/`

**Evidências-fonte:** schemas em `docs/discovery/fixtures/public/` e contratos em `docs/discovery/contracts.md`.

**RED:** campos ausentes, tipo incorreto, duplicidade, Principal+Suplemento e catálogo de páginas inválido.

**GREEN:** validar e mapear respostas externas para `Edition`, `EditionVariant`, `DocumentDescriptor` e páginas normalizadas.

**Gate:** schema inesperado nunca produz edição/documento aparentemente válido.

## Task 4 — Busca

**Arquivos:**
- criar `src/adapters/search.ts`
- criar `tests/adapters/search.test.ts`
- criar fixtures sanitizadas em `tests/fixtures/search/`

**Evidências-fonte:** `docs/discovery/contracts-auth-search.md` e `search-response.schema.json`.

**RED:** resultado positivo, zero resultados, highlight opcional, facetas, campo ausente/tipo divergente e HTTP 200 com corpo de erro.

**GREEN:** normalizar para `SearchQuery`, `SearchResultPage`, `SearchHit` e `SearchFacets`.

**Gate:** zero resultado é estado válido; corpo de erro 200 não é tratado como resultado.

## Task 5 — Publicação HTML

**Arquivos:**
- criar `src/adapters/html-publications.ts`
- criar `tests/adapters/html-publications.test.ts`
- criar fixtures em `tests/fixtures/html/`

**RED:** sumário vazio, IDs inválidos, HTML malformado, conteúdo vazio, caracteres incomuns e estrutura inesperada.

**GREEN:** encapsular os contratos de sumário e conteúdo individual, mantendo HTML editorial como conteúdo opaco/explicitamente marcado até o EPIC-07 realizar sanitização/renderização editorial.

**Gate:** nenhuma transformação editorial silenciosa neste épico.

## Task 6 — Sessão e capacidades

**Arquivos:**
- criar `src/adapters/session.ts`
- criar `tests/adapters/session.test.ts`

**RED:** anônimo, autenticado, unknown, 401/403, redirect para raiz/login, invalidação após troca de estado e capacidade não confirmada.

**GREEN:** implementar `SessionProvider` com estado em memória e capacidades tri-state (`available | unavailable | unknown`).

**Gate:** logout/401/403 remove imediatamente qualquer disponibilidade protegida anteriormente observada.

## Task 7 — Autenticidade e operações não comprovadas

**Arquivos:**
- criar `src/adapters/authenticity.ts`
- criar `tests/adapters/authenticity.test.ts`

**RED/GREEN:** enquanto o endpoint real não tiver evidência suficiente, `verify()` retorna/lança `UNSUPPORTED_OPERATION` sem inferir resultado.

**Gate:** nenhuma simulação de autenticidade é apresentada como validação real.

## Task 8 — Fronteira arquitetural e Gate G3

**Arquivos:**
- criar `scripts/audit-adapter-boundary.mjs`
- atualizar `.github/workflows/ci.yml`
- criar `docs/epic-03/gate-g3.md`
- criar `tests/adapters/architecture.test.ts` se necessário

**Auditoria:**
- proibir URLs/endpoints conhecidos do DOOL fora de `src/adapters/**` e documentação/fixtures;
- proibir acesso a `document.cookie`/`chrome.cookies`/`browser.cookies` na UI;
- proibir import da implementação HTTP diretamente em UI; somente contratos/facade apropriada.

**Verificação final:**
1. `npm test`
2. `npm run typecheck`
3. `npm run build`
4. `node scripts/audit-manifest.mjs .output/chrome-mv3/manifest.json`
5. `node scripts/audit-adapter-boundary.mjs`

## Revisão adversarial final

Executar cenários da spec: campo ausente/tipo divergente, duplicidade, redirect inesperado, HTML malformado, caracteres incomuns, sessão alterada, resposta obsoleta após logout, HTTP 200 com erro e coexistência de versões de contrato.

Pergunta de bloqueio do Gate G3: **uma falha do backend consegue chegar à UI parecendo dado válido ou autorização concedida?** Se a resposta for sim, o gate falha.

## Definition of Done

- contratos internos testados e independentes da UI;
- transport/sessão sem duplicar credenciais;
- adaptadores de edição, documentos, busca e HTML implementados sobre contratos comprovados;
- autenticidade permanece explicitamente não suportada até nova evidência;
- erros tipados e validação fail-closed;
- invalidação de capacidades comprovada por testes;
- auditoria arquitetural integrada ao CI;
- Gate G3 documentado e verde.
