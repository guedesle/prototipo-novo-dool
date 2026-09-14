# Novo DOOL standalone + índice dimensional histórico — especificação de arquitetura

**Status:** APROVADO para handoff de design  
**Data:** 2026-09-14  
**Repositório:** `guedesle/prototipo-novo-dool`  
**Escopo:** arquitetura, dados, ingestão, BFF/API, UX, segurança, operação e gates de design  
**Substitui como premissa principal:** extensão Chromium como plataforma de uso do protótipo

## 1. Decisão arquitetural

O modo principal do Novo DOOL passa a ser uma **aplicação web pública standalone**, hospedada na Hostinger, sem exigir extensão ou autenticação própria para consulta pública.

A extensão Chromium existente permanece como artefato secundário de integração/demonstração e não deve orientar o desenho principal do produto.

Princípio de produto:

> Nova experiência, mesmas regras de negócio.

Princípio de fonte:

> O Novo DOOL pode indexar e organizar metadados, mas o DOOL oficial permanece a fonte documental e a autoridade sobre autenticação, autorização e validade dos recursos oficiais.

## 2. Arquitetura de alto nível

```text
Usuário
  |
  v
Novo DOOL — Hostinger
  |
  +-- Frontend público
  |    +-- Home
  |    +-- Explorar publicações
  |    +-- Acervo completo
  |    +-- Leitor HTML
  |    +-- PDF
  |    +-- Jornal/Flip
  |
  +-- BFF / API pública
  |    +-- /api/v1/publications
  |    +-- /api/v1/search/suggestions
  |    +-- /api/v1/organizations
  |    +-- /api/v1/status
  |    +-- contratos fechados de acesso a recursos públicos do DOOL
  |
  +-- MySQL — índice dimensional histórico
  |
  +-- Ingestor
  |    +-- backfill inicial: 90 dias
  |    +-- sincronização incremental: 1h
  |    +-- reconciliação: últimos 7 dias / 1x ao dia
  |
  +-- Identidade própria opcional
       +-- preferências
       +-- favoritos
       +-- buscas salvas
       +-- alertas

                 | server-to-server
                 v
DOOL oficial
  +-- edições
  +-- sumário HTML
  +-- conteúdo HTML de matérias
  +-- PDF
  +-- Flip/imagens
  +-- regras de acesso
  +-- autenticação/autorização oficial
```

## 3. Limites de confiança

### 3.1 Recursos públicos

Recursos efetivamente públicos no DOOL podem ser consumidos pelo BFF e apresentados de forma transparente no Novo DOOL.

### 3.2 Recursos protegidos

O Novo DOOL **não pode transformar em público** um recurso que o DOOL oficial protege.

É proibido usar uma conta privilegiada no servidor como proxy universal para distribuir conteúdo restrito a visitantes anônimos.

### 3.3 Sessão

Uma sessão do Novo DOOL não concede capacidade no DOOL oficial.

Invariante:

```text
sessão_Novo_DOOL != sessão_DOOL
```

A existência de uma sessão no Novo DOOL nunca amplia a autorização do usuário no DOOL oficial.

## 4. Identidade e autenticação

A consulta pública não exige login próprio.

Três níveis de acesso são tratados separadamente:

1. **Anônimo no Novo DOOL** — consulta pública, exploração, filtros e documentos públicos.
2. **Autenticado no Novo DOOL** — recursos pessoais futuros, sem ampliar autorização oficial.
3. **Autorizado no DOOL** — somente para recursos que o DOOL proteger.

Se autenticação própria for ativada, preferir OAuth/OIDC com sessão server-side e cookie `HttpOnly`, `Secure` e `SameSite`; evitar JWT persistido em `localStorage` como padrão.

O fluxo oficial de login do DOOL permanece sob gate de discovery próprio. Até existir contrato suportado, o Novo DOOL não captura nem armazena senha do DOOL e não reimplementa login por scraping.

## 5. BFF: contratos fechados, não proxy genérico

O browser deve consumir a mesma origem do Novo DOOL. O BFF conversa server-to-server com o DOOL e elimina dependência de CORS no frontend.

São permitidas rotas fechadas por recurso, por exemplo:

```text
GET /api/dool/editions/:editionId
GET /api/dool/publications/:publicationId/content
GET /api/dool/editions/:editionId/pages/:page/pdf
GET /api/dool/editions/:editionId/pages/:page/image
```

É proibido criar endpoint genérico do tipo:

```text
/api/proxy?url=https://...
```

Essa proibição existe para evitar SSRF, bypass de allowlist e acoplamento opaco.

## 6. Índice dimensional histórico

### 6.1 Objetivo

Criar uma superfície pública de consulta denominada **Explorar publicações**, capaz de responder perguntas como:

- publicações da Secretaria da Educação nos últimos 90 dias;
- publicações de uma subordinada específica;
- apenas determinados tipos de publicação;
- combinações de período, caderno, órgão, tipo e edição;
- busca textual por títulos.

A linguagem de UI não deve usar jargão OLAP/cubo.

### 6.2 Retenção

Os 90 dias representam **janela inicial de backfill e default de consulta**, não retenção.

O histórico é cumulativo e persistente.

## 7. Grão e cadeia editorial

Invariante central:

> Uma linha em `fact_publication` representa uma publicação identificada por um único `publicationId` em uma única cadeia editorial.

Cadeia conceitual:

```text
Edição
  -> Caderno
     -> Órgão
        -> Órgão subordinado (recursivo)
           -> Tipo de publicação
              -> Publicação
```

“Seção” não é dimensão separada: neste domínio, corresponde a **Tipo de publicação**.

Cada `publicationId` pertence a uma única cadeia editorial. Se a origem indicar cadeias incompatíveis para o mesmo ID, isso é violação de integridade, não caso para escolha heurística.

## 8. Modelo dimensional

### 8.1 Fato

```text
fact_publication
--------------------------------
publication_key
source_publication_id UNIQUE
published_at
date_key FK
edition_key FK
notebook_key FK
organization_version_key FK
publication_type_key FK
title
normalized_title
display_order
source_start_page NULLABLE
edition_page_key NULLABLE FK
page_mapping_status NOT NULL
first_seen_at
last_seen_at
last_verified_at
source_fingerprint
```

`source_start_page` é **obrigatório no contrato esperado**, mas nullable fisicamente para que uma anomalia da fonte não provoque perda da publicação inteira.

### 8.2 Dimensões

```text
dim_date
dim_edition
dim_notebook
dim_organization / dim_organization_version
dim_publication_type
```

`dim_notebook` permanece plana na v1, salvo evidência de hierarquia real no DOOL.

`dim_publication_type` só possui relação pai/filho quando a fonte oficial demonstrar hierarquia. Não criar macrogrupos artificiais.

### 8.3 Páginas por edição

```text
edition_page
--------------------------------
edition_page_key
edition_key
source_page_id
page_number
image_available
pdf_available
first_seen_at
last_verified_at

UNIQUE (edition_key, page_number)
```

## 9. Identidade e canonicalização

A ordem de precedência para consolidação automática é:

1. mesmo ID/código oficial do DOOL;
2. relação explícita nome <-> sigla/abreviação informada pelo DOOL;
3. diferença apenas gráfica, de caixa, espaços ou pontuação trivial;
4. equivalência apenas semântica/inferida — **não consolidar automaticamente**.

Valores de origem nunca são descartados.

Estruturas de alias devem preservar:

```text
source_name
normalized_source_name
source_identifier
first_seen_at
last_seen_at
```

O mesmo princípio vale para organizações, tipos e demais entidades em que canonicalização seja necessária.

## 10. Temporalidade organizacional

Consultas históricas usam a hierarquia válida na data da publicação.

A ocorrência histórica não é retroativamente reescrita quando há mudança administrativa.

Modelo recomendado:

```text
dim_organization_version
--------------------------------
organization_version_key
organization_entity_key
canonical_name
valid_from
valid_to
is_current
```

Relação temporal:

```text
organization_hierarchy
--------------------------------
parent_entity_key
child_entity_key
valid_from
valid_to
source_evidence
```

Para consultas rápidas de ancestral/descendente, derivar closure temporal:

```text
organization_hierarchy_closure
--------------------------------
ancestor_entity_key
descendant_entity_key
depth
valid_from
valid_to
```

A publicação aponta para a versão de organização válida em sua data.

## 11. Mapeamento publicationId -> página

Descoberta incorporada ao modelo:

```text
publicationId
  + editionId
  + source_start_page
  -> página correspondente da edição
```

PDF e Flip usam a mesma coordenada de página da edição.

Estados mínimos:

```text
VALIDATED
MISSING_PAGE_ATTRIBUTE
INVALID_PAGE_VALUE
PAGE_NOT_IN_CATALOG
PAGE_CATALOG_UNAVAILABLE
```

Invariante de `VALIDATED`:

```text
page_mapping_status = VALIDATED
=> source_start_page IS NOT NULL
=> edition_page_key IS NOT NULL
=> edition_page.edition_key = fact_publication.edition_key
```

A ausência/invalidade de página não elimina a publicação; reduz apenas as ações disponíveis.

Não inferir página a partir da posição no sumário, ordem do título ou heurística textual.

## 12. HTML, PDF e Flip

### 12.1 HTML

O backend do Novo DOOL não persiste o corpo completo das matérias.

Fluxo:

```text
resultado indexado
 -> publicationId
 -> BFF
 -> DOOL oficial
 -> HTML sanitizado/validado
 -> browser
```

### 12.2 Cache local de HTML

Cache somente no browser, preferencialmente IndexedDB.

Freshness: 24h.

Estados:

```text
< 24h -> usa cache fresco
>= 24h -> tenta DOOL
sucesso -> substitui cache
falha -> exibe última visualização com aviso e timestamp
```

Mensagem recomendada:

> Conteúdo salvo na última visualização.

Não chamar conteúdo stale de “atualizado”.

### 12.3 PDF

Ação derivada de `editionId + source_start_page`.

Se houver proxy/BFF para PDF, preservar `Range` e respostas `206 Partial Content` quando exigido pelo recurso oficial.

### 12.4 Flip

A página deriva de `editionId + source_start_page`. Não inventar hash/parâmetro de inicialização do shell se o contrato exato não estiver demonstrado; imagem da página pode ser consumida quando o endpoint oficial a sustentar.

## 13. Ingestão e reconciliação

Pipeline:

```text
DOOL
 -> descoberta da edição
 -> catálogo de páginas
 -> sumário HTML
 -> extração da cadeia editorial
 -> publicationId + source_start_page
 -> normalização/canonicalização
 -> resolução de identidade
 -> validação publicationId <-> editionId <-> página
 -> UPSERT transacional
 -> índices derivados
 -> sync_run + anomalias
```

Cadência:

```text
BACKFILL_INITIAL: últimos 90 dias
SYNC_INCREMENTAL: a cada 1 hora
RECONCILE_RECENT: últimos 7 dias, 1x ao dia
```

Retenção histórica é permanente.

A escrita deve ser idempotente.

Unidade transacional preferida: **edição**, não o corpus inteiro.

## 14. Fingerprint e alterações

```text
source_fingerprint = hash(
  publicationId
  + editionId
  + notebook
  + organization lineage
  + publication type
  + title
  + source_start_page
  + display_order
)
```

Comportamento:

```text
novo publicationId -> INSERT
mesmo ID + mesmo fingerprint -> last_verified_at
mesmo ID + fingerprint diferente -> update controlado + change log
```

Mudanças relevantes preservam evidência de delta.

## 15. Falhas parciais e anomalias

Uma matéria problemática não invalida a edição inteira quando as demais são interpretáveis.

Estados de execução:

```text
RUNNING
SUCCESS
PARTIAL_SUCCESS
FAILED
```

Tabela de anomalias deve permitir, no mínimo:

```text
anomaly_id
sync_run_id
edition_key
publication_key
anomaly_type
severity
source_payload_excerpt sanitizado
detected_at
resolved_at
resolution_status
```

Severidades recomendadas:

- INFO: alias novo confirmado, normalização trivial;
- WARNING: página ausente, página fora do catálogo, estrutura incomum mas interpretável;
- ERROR: ID duplicado em cadeia incompatível, parser incapaz de interpretar estrutura, contrato corrompido/incompatível.

## 16. API pública de leitura

A extensão/site nunca acessa MySQL diretamente.

Base versionada:

```text
/api/v1/...
```

A API pública não possui endpoints administrativos de escrita.

### 16.1 Publicações

```text
GET /api/v1/publications
```

Filtros combináveis:

```text
q
from / to
notebook
organization
excludeOrganization
publicationType
excludePublicationType
edition
editionKind
page
pageSize
sort
```

Semântica:

- dimensões diferentes: AND;
- múltiplos valores dentro da mesma dimensão: OR;
- seleção de órgão pai inclui descendentes por padrão;
- exclusões são aplicadas dentro do conjunto incluído.

### 16.2 Hierarquia

```text
GET /api/v1/organizations/tree
GET /api/v1/organizations/:id/children
```

O backend resolve hierarquia temporal; o cliente não precisa expandir IDs manualmente.

### 16.3 Autocomplete

```text
GET /api/v1/search/suggestions?q=...
```

Sugestões podem conter termo, frase e título, com contagem quando eficiente.

Busca textual v1 atua em títulos indexados, com normalização de acentos/caixa/espaços/pontuação.

Correção ortográfica é somente sugestão; nunca reescrever consulta silenciosamente.

### 16.4 Status

```text
GET /api/v1/status
```

Resposta sanitizada pode informar:

```text
indexLastUpdatedAt
indexedFrom
indexedThrough
status
```

## 17. Busca oficial versus Explorar publicações

Dois mecanismos permanecem distintos:

### Explorar publicações

Usa o índice dimensional histórico do Novo DOOL.

### Acervo completo

Usa o mecanismo oficial do DOOL quando necessário e permitido.

A UI deve explicar a diferença em linguagem comum, sem jargão técnico.

Exemplo:

```text
Explorar publicações
Busca detalhada no período indexado

Pesquisar no acervo completo
Consulta ao acervo histórico do Diário Oficial
```

## 18. UX e arquitetura da informação

Estrutura principal:

```text
Novo DOOL
  +-- Início
  +-- Explorar publicações
  +-- Acervo completo
  +-- Leitores
       +-- HTML
       +-- PDF
       +-- Jornal/Flip
```

A Home não vira dashboard analítico. A edição do dia continua protagonista, com entrada destacada para “Explorar publicações”.

### 18.1 Explorar publicações

Desktop: filtros laterais + lista estruturada de resultados.

Mobile: busca + período + botão de filtros; filtros em drawer/dialog acessível.

### 18.2 Organizações

Componente hierárquico tri-state:

```text
selecionado
indeterminado
não selecionado
```

Selecionar pai inclui descendentes por padrão.

Ações rápidas:

```text
Selecionar todas
Somente órgão principal
Limpar
```

Não assumir profundidade fixa.

### 18.3 Tipos de publicação

Mesmo padrão mental, sem criar macrogrupos inexistentes.

### 18.4 Resultados

Preferir lista editorial densa a cards excessivamente visuais.

Exibir, quando disponível:

```text
título
linhagem do órgão
data
edição
caderno
tipo
página inicial
```

Ações:

```text
Ler em HTML
PDF · pág. N
Jornal · pág. N
```

Só mostrar PDF/Flip quando `page_mapping_status = VALIDATED` e a capacidade correspondente estiver disponível.

## 19. Design system e acessibilidade

Não criar segundo design system.

Reutilizar/evoluir tokens e componentes existentes do EPIC-04.

Alvos mínimos:

- WCAG 2.2 AA nos fluxos implementados;
- teclado integral;
- foco visível;
- labels programáticos;
- contraste AA;
- 320 px sem perda de função;
- zoom 200%;
- reduced motion;
- informação não dependente somente de cor;
- tri-state compreensível por tecnologia assistiva.

## 20. Estados obrigatórios de UI

Toda superfície dependente de dados deve prever:

```text
INITIAL
LOADING
SUCCESS
EMPTY
PARTIAL
ERROR_RECOVERABLE
ERROR_BLOCKING
OFFLINE/CACHED (quando aplicável)
```

Não desenhar apenas happy path.

## 21. Infraestrutura Hostinger

Arquitetura operacional:

```text
HTTPS
 -> Frontend
 -> API/BFF Node.js
 -> MySQL
 -> Ingestor/Scheduler
```

Responsabilidades separadas:

```text
apps/api
apps/ingestor
packages/domain
packages/dool-client
packages/database
packages/normalization
packages/search
```

A separação é conceitual; a estrutura final deve respeitar o padrão real do repositório no plano de implementação.

Usuários de banco recomendados:

```text
dool_api: SELECT
dool_ingestor: SELECT/INSERT/UPDATE mínimos necessários
```

Credenciais somente em variáveis de ambiente/secret store do ambiente de execução.

## 22. Segurança

Mínimos:

- HTTPS;
- API pública somente leitura;
- queries parametrizadas;
- validação de input;
- pageSize máximo;
- limites de tamanho de `q` e intervalo;
- rate limiting;
- timeouts;
- CORS explícito;
- logs sanitizados;
- sem credenciais MySQL no cliente;
- sem cookies/tokens DOOL em logs/storage próprio;
- sem proxy genérico;
- sem execução de script editorial em contexto privilegiado.

## 23. Performance

Metas iniciais de engenharia, não resultados medidos:

```text
consulta comum indexada: P95 <= 500 ms backend
autocomplete: P95 <= 300 ms backend
árvore/facetas: P95 <= 500 ms backend
```

Validar com dados reais e `EXPLAIN` antes de otimizações prematuras.

No cliente, autocomplete deve usar debounce (~200–300 ms), cancelamento de requisição anterior e mínimo de 3 caracteres, com eventual exceção documentada para siglas úteis.

## 24. Observabilidade

`sync_run` deve registrar, no mínimo:

```text
run_id
run_type
started_at
finished_at
status
editions_scanned
publications_discovered
publications_inserted
publications_updated
publications_unchanged
page_mappings_validated
page_mappings_missing
page_mappings_invalid
page_mappings_not_in_catalog
warnings
errors
```

Logs estruturados devem evitar corpo documental, credenciais, cookies, tokens e connection strings.

Health checks:

```text
GET /health/live
GET /health/ready
```

## 25. Backup e recuperação

Prever:

- migrations versionadas;
- backup do MySQL;
- restore testado;
- backfill reexecutável;
- idempotência do ingestor.

O índice pode ser reconstruído parcialmente, mas aliases, temporalidade e auditoria acumulada justificam backup próprio.

## 26. Roadmap revisado

Criar dois subsistemas explícitos antes da retomada funcional:

```text
EPIC-04.5 — Índice Dimensional Público do DOOL
EPIC-04.6 — Plataforma Web Standalone + BFF
```

Depois:

```text
EPIC-05 — Home e navegação
EPIC-06 — Explorar publicações + acervo oficial
EPIC-07 — Leitor HTML
EPIC-08 — Identidade, autenticação e recursos protegidos
EPIC-09 — Segurança, qualidade, performance e observabilidade
EPIC-10 — Deploy, demonstração e handoff
```

A branch/execução do EPIC-05 iniciada antes desta decisão deve permanecer pausada até que o novo plano seja revisado.

## 27. Gate AUTH-DOOL

Antes de reimplementar qualquer login oficial, descobrir e documentar se existe:

1. OAuth/OIDC/SSO oficial;
2. endpoint formal de sessão;
3. mecanismo de autorização delegada;
4. contrato seguro compatível com BFF;
5. ou apenas formulário legado baseado em cookie.

Até esse gate ser aprovado, recursos protegidos devem encaminhar o usuário ao fluxo oficial, sem formulário falso de login.

## 28. Gates de design

O design falha se:

- inventar campos ou regras de negócio;
- transformar cache em “conteúdo atualizado”;
- tratar índice próprio como busca oficial;
- apresentar resultado indexado como documento certificado;
- inventar página PDF/Flip;
- tratar capacidade `unknown` como disponível;
- ocultar ações essenciais no mobile;
- criar macrogrupos de tipos não existentes;
- achatar hierarquia administrativa;
- criar um segundo design system incompatível.

## 29. Revisão adversarial obrigatória

Testar o design com:

- órgão com 6 níveis;
- nomes institucionais longos;
- zero resultado;
- milhares de resultados;
- seleção parcial de hierarquia;
- página desconhecida;
- índice atrasado;
- DOOL indisponível;
- cache stale;
- edição principal + suplementos/extras;
- rede lenta;
- teclado;
- zoom 200%;
- 320 px;
- reduced motion.

## 30. Handoff

O documento de entrada para design é:

```text
docs/design/HANDOFF-SITES.md
```

O agente de design deve ler esta especificação e os documentos vinculados antes de propor telas.

Nenhum código funcional deve ser implementado com base nesta especificação antes da revisão do plano de implementação correspondente.
