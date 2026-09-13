# EPIC-03 — Camada de adaptação e sessão

**Status:** especificado, não implementado  
**Prioridade:** alta/bloqueadora  
**Dependências:** EPIC-01, EPIC-02

## 1. Objetivo

Criar uma fronteira técnica entre o DOOL atual e a nova interface. A UI deverá consumir contratos internos estáveis, sem conhecer endpoints, cookies, seletores do DOM ou detalhes de parsing.

## 2. Resultado de negócio

Mudanças futuras no backend ou na interface legada poderão ser absorvidas nos adaptadores sem exigir reescrita das telas do protótipo.

## 3. Escopo

Adaptadores conceituais para:

- edições;
- busca;
- publicação HTML;
- sessão/capacidades;
- documentos PDF/Jornal;
- autenticidade;
- normalização de erros;
- validação de schema;
- fixtures de teste.

## 4. Fora de escopo

- regras novas de autorização;
- credenciais próprias da extensão;
- cache permanente de documentos;
- lógica visual;
- transformação do conteúdo com finalidade editorial além do necessário para normalização segura.

## 5. Contratos internos

Os nomes finais poderão ser ajustados durante a implementação, mas a separação deve corresponder a estas responsabilidades:

```text
EditionRepository
SearchRepository
HtmlPublicationRepository
SessionProvider
DocumentRepository
AuthenticityRepository
```

Cada contrato deve retornar tipos normalizados e erros tipados.

## 6. Modelo de acesso

A extensão não deve representar autorização apenas por um booleano genérico. O estado deve ser derivado de capacidades observáveis, por exemplo:

```text
AccessState
- identityState: anonymous | authenticated | unknown
- subscriptionState: subscriber | nonSubscriber | unknown
- capabilities:
  - readHtml
  - downloadPdf
  - openJournal
  - accessCertifiedArchive
```

Uma capacidade em estado desconhecido deve ser tratada como não confirmada, nunca como concedida.

## 7. Requisitos funcionais

### RF-03.1 — Normalização

Converter respostas externas em modelos internos com campos explícitos e opcionais controlados.

### RF-03.2 — Validação de contrato

Quando uma resposta não corresponder ao schema esperado, gerar `CONTRACT_UNEXPECTED` e permitir fallback, em vez de silenciosamente produzir dados parciais incorretos.

### RF-03.3 — Erros tipados

No mínimo:

- `NETWORK_FAILURE`;
- `AUTH_REQUIRED`;
- `FORBIDDEN`;
- `NOT_FOUND`;
- `CONTRACT_UNEXPECTED`;
- `PARSER_FAILURE`;
- `UNSUPPORTED_OPERATION`.

### RF-03.4 — Sessão gerenciada pelo navegador

A extensão deve reutilizar o contexto de sessão permitido pelo próprio navegador. Não deve copiar cookie/token para storage próprio sem justificativa excepcional e nova revisão de segurança.

### RF-03.5 — Invalidação

Mudanças detectáveis de sessão, logout, 401/403 ou troca de usuário devem invalidar estado de capacidades em cache.

### RF-03.6 — Parsing isolado

Quando um recurso depender de HTML/DOM, o parser deve ficar dentro do adaptador correspondente e possuir fixture/teste próprio.

## 8. Requisitos não funcionais

- adaptadores pequenos e coesos;
- contratos testáveis sem abrir o portal real;
- fixtures sanitizadas;
- ausência de efeito colateral em métodos de leitura;
- logs sem payload sensível;
- suporte a versionamento/feature detection quando um contrato variar.

## 9. Critérios de aceite

### CA-03-A

Nenhum componente visual realiza chamada direta a endpoint do DOOL.

### CA-03-B

Nenhum componente visual lê cookie/token ou seletor do DOM legado.

### CA-03-C

Resposta com schema incompatível é detectada e não vira conteúdo aparentemente válido.

### CA-03-D

Após logout ou 401/403, capacidades protegidas deixam de ser exibidas como disponíveis.

### CA-03-E

Fixtures permitem testar adaptadores sem credenciais reais.

## 10. Revisão adversarial

Testar:

- campos ausentes;
- campo com tipo diferente;
- conteúdo duplicado;
- redirect inesperado;
- HTML malformado;
- caracteres incomuns;
- mudança de sessão em aba paralela;
- resposta antiga em cache após logout;
- endpoint retornando 200 com mensagem de erro no corpo;
- duas versões de contrato coexistindo.

Pergunta crítica: **uma falha do backend pode chegar à UI parecendo um dado válido?** Se sim, a fronteira está insuficiente.

## 11. Estratégia de testes

- unitários de schema e mapeamento;
- testes de parser com fixtures;
- contract tests com respostas sanitizadas;
- integração com sessão real controlada;
- testes de invalidação;
- teste de proibição arquitetural de imports diretos de camada de rede pela UI, se o stack escolhido permitir.

## 12. Definition of Done

- contratos internos definidos e testados;
- normalização implementável sem decisões visuais;
- erros tipados;
- sessão não duplicada;
- mudanças de autorização invalidam estado;
- parsers ficam isolados;
- adaptadores possuem evidência do contrato externo que encapsulam.

## 13. Gate

**G3 aprovado:** módulos visuais podem evoluir sem acoplamento direto ao legado.
