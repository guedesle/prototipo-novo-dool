# Arquitetura de referência do Novo DOOL

**Data:** 14/09/2026  
**Status:** arquitetura standalone aprovada para handoff de design

## 1. Objetivo arquitetural

Permitir que o Novo DOOL seja utilizado como uma aplicação web pública independente, hospedada na Hostinger, sem exigir extensão e sem modificar o backend oficial do DOOL.

A solução deve:

- preservar o DOOL como fonte documental;
- respeitar autenticação/autorização oficiais;
- acrescentar um índice dimensional histórico de metadados;
- usar BFF/API para desacoplar frontend de endpoints legados;
- suportar Home, Explorar publicações, acervo completo e leitores;
- manter a extensão Chromium apenas como modo secundário.

Especificação detalhada:

`docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## 2. Visão em camadas

```text
+--------------------------------------------------+
| Browser / Novo DOOL                              |
| - Home                                           |
| - Explorar publicações                           |
| - Acervo completo                                |
| - Leitor HTML                                    |
| - PDF / Jornal                                   |
+----------------------+---------------------------+
                       |
                       | mesma origem / HTTPS
                       v
+--------------------------------------------------+
| BFF / API pública                                |
| - /api/v1/publications                           |
| - /api/v1/search/suggestions                     |
| - /api/v1/organizations                          |
| - /api/v1/status                                 |
| - contratos fechados para HTML/PDF/Flip          |
+-------------+---------------------+--------------+
              |                     |
              |                     | server-to-server
              v                     v
+--------------------------+   +--------------------+
| Índice dimensional      |   | DOOL oficial       |
| MySQL                    |   | - documentos       |
| - fatos                  |   | - HTML             |
| - dimensões              |   | - PDF              |
| - hierarquias temporais  |   | - Flip             |
| - aliases                |   | - autorização      |
+------------+-------------+   +--------------------+
             ^
             |
+------------+-------------+
| Ingestor                 |
| - backfill 90 dias       |
| - sync horário           |
| - reconcile 7 dias       |
| - anomalias/auditoria    |
+--------------------------+
```

## 3. Princípio de desacoplamento

A UI não deve conhecer:

- credenciais MySQL;
- detalhes de conexão do banco;
- URLs arbitrárias do DOOL;
- cookies oficiais;
- lógica de temporalidade;
- heurísticas de canonicalização.

A UI consome contratos tipados da API/BFF.

## 4. Frontend standalone

Responsabilidades:

- apresentar dados normalizados;
- manter estado de navegação/filtros;
- renderizar estados universais;
- aplicar design system;
- armazenar apenas cache local permitido e preferências não sensíveis;
- preservar contexto entre HTML/PDF/Jornal.

Não deve:

- acessar MySQL;
- montar SQL;
- chamar endpoint legado arbitrário;
- decidir autorização;
- inferir página;
- persistir credencial oficial.

## 5. BFF / API

Responsabilidades:

- fornecer API pública somente leitura para o índice;
- aplicar validação/limites/rate limiting;
- consumir recursos públicos do DOOL server-to-server;
- sanitizar/validar HTML antes de entregar ao browser;
- preservar Range/206 em PDF quando aplicável;
- ocultar detalhes frágeis de endpoints do frontend;
- representar falhas de forma contratual.

Rotas de proxy devem ser específicas por recurso.

Proibido:

```text
/api/proxy?url=...
```

## 6. Índice dimensional

Grão:

```text
1 fact_publication = 1 source_publication_id em 1 cadeia editorial
```

Cadeia:

```text
Edição
 -> Caderno
 -> Órgão
 -> subordinados recursivos
 -> Tipo de publicação
 -> Publicação
```

Dimensões principais:

- data;
- edição;
- caderno;
- organização/versionamento temporal;
- tipo de publicação.

## 7. Temporalidade

Organizações possuem identidade canônica e versões temporais.

A publicação histórica aponta para a versão vigente na data de publicação.

Hierarquia pai/filho também possui intervalo de validade.

Consulta histórica não deve reescrever o passado segundo a estrutura administrativa atual.

## 8. Canonicalização

Consolidação automática somente por:

1. ID/código oficial igual;
2. nome/sigla explicitamente relacionados pela fonte;
3. diferença gráfica inequívoca.

Equivalência apenas semântica não consolida automaticamente.

Valores originais permanecem auditáveis.

## 9. Relação publicationId -> página

Cada publicação espera:

```text
source_publication_id
editionId
source_start_page
```

A página é validada contra o catálogo `edition_page`.

Estados:

```text
VALIDATED
MISSING_PAGE_ATTRIBUTE
INVALID_PAGE_VALUE
PAGE_NOT_IN_CATALOG
PAGE_CATALOG_UNAVAILABLE
```

Somente `VALIDATED` permite ação direta para PDF/Jornal por página.

## 10. Ingestor

Cadência:

```text
backfill: 90 dias
incremental: 1 hora
reconciliação: últimos 7 dias / diário
```

Características:

- idempotente;
- transacional por edição;
- falha parcial não elimina registros válidos;
- fingerprint detecta mudanças relevantes;
- anomalias são registradas;
- histórico é cumulativo.

## 11. HTML documental

O backend do Novo DOOL não mantém acervo paralelo de HTML completo.

Fluxo:

```text
Browser -> BFF -> DOOL -> sanitização -> Browser
```

Cache local:

- IndexedDB recomendado;
- freshness 24h;
- stale pode permanecer como contingência;
- fallback deve dizer “Conteúdo salvo na última visualização”.

## 12. PDF e Flip

PDF:

```text
editionId + source_start_page
```

Preservar Range/206 quando proxy for usado.

Flip/Jornal:

```text
editionId + source_start_page
```

Não inventar mecanismo de deep-link do viewer legado quando o contrato não estiver demonstrado.

## 13. Busca

### Explorar publicações

Índice próprio, busca de títulos, filtros dimensionais e autocomplete.

### Acervo completo

Mecanismo oficial do DOOL quando necessário e permitido.

A UI deve distinguir as duas superfícies.

## 14. Identidade

Consulta pública não exige login.

Identidade própria opcional pode suportar:

- favoritos;
- preferências;
- buscas salvas;
- alertas.

Invariante:

```text
sessão_Novo_DOOL != sessão_DOOL
```

Autenticação oficial só pode ser integrada após Gate AUTH-DOOL.

## 15. Segurança

Invariantes:

- HTTPS;
- sem senha/token/cookie oficial em logs/storage próprio;
- sem proxy arbitrário;
- queries parametrizadas;
- API pública somente leitura;
- usuário MySQL da API sem escrita;
- rate limiting;
- validação de parâmetros;
- CORS explícito;
- conteúdo editorial sem execução privilegiada de scripts;
- sessão própria não amplia autorização oficial.

## 16. Design system

O EPIC-04 permanece válido como base.

O design standalone deve reutilizar/evoluir:

- tokens;
- tipografia;
- espaçamento;
- foco;
- componentes de campo/botão/lista/feedback;
- padrões responsivos;
- reduced motion.

Não criar segundo design system.

## 17. Acessibilidade

Meta: WCAG 2.2 AA nos fluxos implementados.

Validar:

- teclado;
- foco visível;
- 320 px;
- zoom 200%;
- contraste;
- tri-state;
- drawer/dialog;
- reduced motion;
- headings/landmarks.

## 18. Hostinger

A arquitetura de implantação prevista é:

```text
HTTPS
 -> Frontend
 -> Node.js BFF/API
 -> MySQL
 -> Scheduler/Ingestor
```

Segredos ficam em variáveis de ambiente/secret store.

Usuários de banco separados:

```text
dool_api -> SELECT
dool_ingestor -> permissões mínimas de escrita
```

## 19. Extensão Chromium

A extensão já construída não é descartada.

Passa a servir como:

- demonstração alternativa;
- integração experimental sobre o DOOL;
- fonte de aprendizados/adaptadores reaproveitáveis.

Ela não deve limitar o desenho do site standalone nem ser pré-condição de acesso público.

## 20. Decisões adiadas

Ainda não estão congelados nesta etapa de design:

- framework frontend standalone;
- framework HTTP/BFF específico;
- ORM/query builder;
- estratégia final de deploy automatizado;
- provedor de identidade próprio;
- mecanismo oficial de login do DOOL.

Essas decisões devem ser tomadas em planos de engenharia posteriores, sem alterar as invariantes desta arquitetura.

## 21. Handoff

Ponto de entrada para design:

`docs/design/HANDOFF-SITES.md`

Plano de design:

`docs/superpowers/plans/2026-09-14-novo-dool-design-handoff.md`
