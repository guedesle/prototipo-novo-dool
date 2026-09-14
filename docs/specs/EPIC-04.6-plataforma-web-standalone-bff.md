# EPIC-04.6 — Plataforma Web Standalone + BFF

**Status:** especificado, não implementado  
**Prioridade:** bloqueadora para o modo público sem extensão  
**Dependências:** EPIC-01, EPIC-03, EPIC-04, EPIC-04.5

## 1. Objetivo

Transformar o protótipo em uma aplicação web pública standalone, hospedada na Hostinger, que funcione sem extensão e consuma o DOOL oficial por contratos server-to-server controlados.

## 2. Resultado de negócio

Qualquer usuário autorizado a acessar conteúdo público do DOOL pode utilizar a nova experiência diretamente por URL, sem instalar extensão ou criar conta no protótipo.

## 3. Arquitetura

```text
Browser
  -> Novo DOOL / Hostinger
       -> Frontend
       -> BFF/API
       -> MySQL dimensional
       -> DOOL oficial
```

O browser não deve depender de CORS do DOOL para os fluxos principais.

## 4. Escopo

- aplicação web pública;
- frontend institucional;
- BFF com rotas fechadas;
- API dimensional integrada;
- consumo server-to-server de recursos públicos do DOOL;
- sanitização/validação de HTML;
- proxy controlado de PDF por página quando necessário;
- preservação de `Range`/`206` quando aplicável;
- imagem de página/Flip;
- health endpoints;
- status sanitizado do índice;
- variáveis de ambiente para segredos;
- deploy em Hostinger;
- identidade própria opcional preparada, mas não obrigatória para consulta pública.

## 5. Fora de escopo

- proxy genérico por URL;
- bypass de autenticação/autorização do DOOL;
- compartilhamento de conta privilegiada do servidor com usuários anônimos;
- captura de senha oficial do DOOL sem contrato de autenticação aprovado;
- replicação permanente do corpo HTML de matérias;
- uso obrigatório da extensão Chromium.

## 6. BFF

Rotas conceituais permitidas:

```text
GET /api/dool/editions/:editionId
GET /api/dool/publications/:publicationId/content
GET /api/dool/editions/:editionId/pages/:page/pdf
GET /api/dool/editions/:editionId/pages/:page/image
```

O BFF deve usar allowlist de hosts/paths internos e parâmetros validados.

É proibido criar `/api/proxy?url=...`.

## 7. HTML

Fluxo:

```text
Browser -> BFF -> DOOL -> HTML -> sanitização/validação -> Browser
```

O backend não persiste corpo completo da matéria.

Cache local no browser pode usar IndexedDB com freshness de 24h e fallback stale claramente identificado.

## 8. PDF

Quando a UI abrir uma página de PDF por BFF, preservar comportamento de `Range` e `206 Partial Content` quando suportado/originado pelo DOOL.

Não baixar documento completo apenas para exibir uma página se o contrato oficial oferecer rota mais eficiente.

## 9. Flip/Jornal

Usar `editionId + source_start_page` para localizar imagem/página quando o mapeamento estiver `VALIDATED`.

Não inventar mecanismo de deep-link do shell legado sem contrato demonstrado.

## 10. Autenticação própria

Consulta pública não exige conta.

Se identidade do Novo DOOL for ativada, ela serve para preferências, favoritos, buscas salvas, alertas ou outros recursos próprios.

Recomendação:

```text
OAuth/OIDC -> callback server-side -> sessão -> cookie HttpOnly/Secure/SameSite
```

A sessão própria nunca amplia autorização no DOOL oficial.

## 11. Gate AUTH-DOOL

Antes de qualquer autenticação oficial integrada, descobrir e aprovar:

- OAuth/OIDC/SSO oficial, se existir;
- endpoint formal de sessão;
- mecanismo de autorização delegada;
- semântica de expiração/renovação;
- ou limitação a fluxo legado por cookie.

Até o gate, recursos protegidos encaminham para o fluxo oficial.

## 12. Segurança

- HTTPS;
- CORS explícito;
- cookies de sessão seguros quando aplicável;
- sem segredo no frontend;
- sem URL arbitrária no BFF;
- rate limiting;
- timeouts;
- validação de path/query;
- headers de segurança;
- logs sem cookies, tokens, senhas ou HTML integral;
- API dimensional pública somente leitura.

## 13. Operação

Endpoints:

```text
GET /health/live
GET /health/ready
GET /api/v1/status
```

`/api/v1/status` deve ser sanitizado para consumo público.

## 14. Critérios de aceite

### CA-04.6-A

Usuário abre o Novo DOOL por URL em navegador limpo e acessa fluxos públicos sem extensão.

### CA-04.6-B

Frontend não depende de CORS direto do DOOL para fluxos principais.

### CA-04.6-C

BFF não aceita host/URL arbitrário.

### CA-04.6-D

Conteúdo público do DOOL pode ser lido sem persistência de corpo HTML no backend.

### CA-04.6-E

Recurso protegido não é liberado apenas porque o usuário possui sessão própria do Novo DOOL.

### CA-04.6-F

Falha do DOOL produz estado tratável; não retorna conteúdo stale como se fosse atualizado.

### CA-04.6-G

PDF por página preserva eficiência do contrato oficial quando proxy for utilizado.

### CA-04.6-H

Desabilitar/remover a extensão não afeta o funcionamento do modo standalone.

## 15. Gate

**G4.6:** aplicação standalone apta a receber o design e os fluxos funcionais quando acesso público, BFF, limites de autorização e comportamento de documentos estiverem validados.
