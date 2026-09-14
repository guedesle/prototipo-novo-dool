# EPIC-08 — Identidade, autenticação, PDF, Jornal e autenticidade

**Status:** reespecificado, não implementado no modo standalone  
**Prioridade:** alta  
**Dependências:** EPIC-03, EPIC-04, EPIC-04.6; evidências autenticadas do EPIC-01  
**Arquitetura de referência:** `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## 1. Objetivo

Separar claramente identidade opcional do Novo DOOL de autenticação/autorização oficial e integrar PDF, Jornal/Flip e autenticidade sem reimplementar ou contornar a segurança do DOOL.

## 2. Resultado de negócio

A consulta pública continua sem login próprio. Quando recursos pessoais forem úteis, o usuário pode autenticar-se no Novo DOOL sem que essa sessão amplie permissões oficiais. Recursos protegidos permanecem sob controle do DOOL e só são integrados após contrato seguro demonstrado.

## 3. Modelo de identidade

Existem três contextos independentes:

```text
1. usuário anônimo no Novo DOOL
2. usuário autenticado no Novo DOOL
3. usuário autorizado no DOOL oficial
```

Invariante:

```text
sessão_Novo_DOOL != sessão_DOOL
```

A sessão própria nunca concede acesso protegido no DOOL.

## 4. Escopo

- consulta pública sem autenticação própria;
- identidade opcional para preferências/favoritos/buscas salvas/alertas;
- preferência por OAuth/OIDC para identidade própria quando ativada;
- sessão server-side com cookie seguro;
- Gate AUTH-DOOL antes de integração de login oficial;
- apresentação de estados de capacidade oficial;
- PDF por página validada;
- Jornal/Flip por página validada;
- recursos/documentos protegidos somente quando autorizados;
- consulta de autenticidade quando contrato estiver exercitado;
- mensagens de restrição claras;
- encaminhamento para fluxo oficial quando integração não estiver aprovada.

## 5. Fora de escopo

- exigir login próprio para consulta pública;
- capturar senha oficial do DOOL sem contrato aprovado;
- armazenar cookie/token oficial;
- criar token paralelo para simular autorização oficial;
- usar conta privilegiada do servidor para distribuir conteúdo protegido;
- bypass de assinatura;
- redefinir mecanismo jurídico/criptográfico de autenticidade;
- inferir assinatura a partir de simples estado autenticado.

## 6. Identidade própria do Novo DOOL

Quando ativada, deve servir apenas a recursos próprios.

Recomendação:

```text
OAuth/OIDC
 -> callback server-side
 -> sessão própria
 -> cookie HttpOnly + Secure + SameSite
```

Evitar JWT persistido em `localStorage` como padrão.

Possíveis entidades próprias:

```text
auth_user
user_session
user_preferences
saved_search
favorite_publication
alert_subscription
```

Essas entidades não alteram fatos/dimensões do índice.

## 7. Gate AUTH-DOOL

Antes de integrar login oficial, descobrir e documentar:

1. OAuth/OIDC/SSO oficial, se existir;
2. endpoint formal de criação/renovação de sessão;
3. mecanismo de autorização delegada;
4. comportamento de expiração/logout;
5. ou limitação a formulário legado baseado em cookie.

Até o gate ser aprovado:

```text
Este recurso exige acesso pelo Diário Oficial.
[Acessar pelo Diário Oficial]
```

Não desenhar nem implementar formulário próprio pedindo credenciais oficiais.

## 8. Capacidades oficiais

A UI deve representar pelo menos:

```text
available
unavailable
unknown
```

`unknown` nunca significa concedido.

Motivos como “assinante”, “cadastro necessário” ou “sessão expirada” só aparecem quando confirmados por contrato/evidência. Caso contrário, usar mensagem neutra.

## 9. PDF

Para publicações indexadas, ação direta por página exige:

```text
page_mapping_status = VALIDATED
```

Coordenada:

```text
editionId + source_start_page
```

Se o BFF fizer proxy, preservar Range/206 quando aplicável.

Autorização do documento continua oficial.

## 10. Jornal/Flip

Mesma regra de página:

```text
editionId + source_start_page
```

Não inventar deep-link do shell legado se o contrato exato não estiver demonstrado.

Quando a imagem oficial da página for o contrato comprovado, ela pode ser usada pela experiência nova.

## 11. Autenticidade

A consulta só entra como integrada quando o contrato real estiver exercitado e documentado.

A UI deve reproduzir o status retornado sem reinterpretar valor jurídico.

Estados mínimos:

```text
valid
invalid
unknown/falha técnica
```

## 12. Mudança de estado de sessão oficial

Quando uma integração oficial vier a existir, 401/403/redirects/expiração devem invalidar capacidades protegidas.

Nunca manter ação protegida como disponível com base apenas em estado local antigo.

## 13. Segurança

- senha oficial nunca entra em storage/log do Novo DOOL;
- cookies/tokens oficiais não entram em logs ou documentação;
- sessão própria usa cookie seguro;
- nenhuma enumeração de endpoints protegidos por tentativa;
- nenhum recurso oficial é liberado por usuário próprio do Novo DOOL;
- BFF não é proxy genérico;
- downloads preservam origem/metadados quando fornecidos pela fonte;
- logs diferenciam falha própria de negação oficial sem registrar segredo.

## 14. Critérios de aceite

### CA-08-A

Usuário anônimo acessa todas as funções públicas do Novo DOOL sem conta própria.

### CA-08-B

Conta própria, se habilitada, não altera capacidades oficiais.

### CA-08-C

Nenhuma senha/cookie/token oficial é persistido pelo Novo DOOL.

### CA-08-D

PDF/Jornal por página só aparece quando o mapeamento de página estiver validado e a capacidade correspondente estiver disponível.

### CA-08-E

Recurso protegido não é liberado por proxy com conta privilegiada do servidor.

### CA-08-F

Antes do Gate AUTH-DOOL, recursos protegidos encaminham ao fluxo oficial em vez de solicitar credenciais no Novo DOOL.

### CA-08-G

Autenticidade só é apresentada como integrada após contrato real exercitado.

### CA-08-H

Após expiração/negação oficial, capacidades protegidas são invalidadas quando houver integração de sessão.

## 15. Revisão adversarial

Testar:

- usuário anônimo;
- usuário com conta própria e sem sessão oficial;
- usuário oficial autenticado sem capacidade específica;
- estado oficial desconhecido;
- 401/403;
- redirect para login;
- sessão expirada;
- logout em outra aba quando tecnicamente observável;
- página PDF ausente;
- `page_mapping_status` diferente de VALIDATED;
- PDF interrompido;
- recurso protegido tentado por BFF;
- código de autenticidade inválido/ausente;
- storage/logs contendo segredos;
- cache com capacidade antiga.

Pergunta crítica:

> O Novo DOOL conseguiria mostrar ou abrir algo que o DOOL oficial negaria ao mesmo usuário?

Se sim, a implementação é inaceitável.

## 16. Estratégia de testes

- matriz anônimo / identidade própria / sessão oficial quando legitimamente disponível;
- contract tests de capacidades;
- inspeção de cookies/storage/logs;
- testes de 401/403/redirect;
- testes de página validada/não validada;
- E2E de encaminhamento para fluxo oficial;
- casos de autenticidade após contrato aprovado;
- testes de sessão própria sem efeito em autorização oficial.

## 17. Definition of Done

- consulta pública permanece sem login;
- identidade própria, se implementada, está isolada dos dados oficiais;
- Gate AUTH-DOOL documentado antes de login oficial integrado;
- PDF/Jornal respeitam página e capacidades reais;
- autenticidade usa contrato oficial exercitado;
- nenhuma credencial oficial é persistida;
- mudança de estado oficial invalida capacidades quando aplicável;
- fallback/encaminhamento oficial existe para fluxos não seguros de substituir.

## 18. Gate

**G8:** identidade própria e recursos protegidos podem ser demonstrados somente sem alterar o modelo de segurança do DOOL e sem criar equivalência entre conta do Novo DOOL e autorização oficial.
