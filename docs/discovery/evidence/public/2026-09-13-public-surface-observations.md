# Evidência pública — superfícies do DOOL

**Data:** 2026-09-13  
**Perfil:** anônimo  
**Natureza:** evidência sanitizada baseada em páginas públicas indexadas e tentativas de acesso automatizado somente leitura.  
**Status:** **registro histórico pré-HAR**. Para contratos de rede, redirects e headers, prevalece `2026-09-13-har-network-summary.md`.

## EV-PUB-001 — Home

URLs encontradas publicamente:

- `https://doe.ba.gov.br/`
- `https://www.doe.ba.gov.br/`

Elementos confirmados publicamente:

- edição principal;
- Extra 1;
- Extra 2;
- HTML sem cadastro;
- PDF;
- Versão Jornal;
- edições anteriores;
- últimas 30 edições na seleção direta;
- busca por palavra e período;
- acervo a partir de 30/06/2007;
- consulta de autenticidade.

A captura HAR posterior demonstrou o host `dool.egba.ba.gov.br` para os fluxos efetivamente navegados. Este documento não afirma equivalência entre os hosts.

## EV-PUB-002 — Busca

URL observada:

- `https://www.doe.ba.gov.br/buscanova/`

Trechos estruturais publicamente visíveis:

- contador de resultados;
- paginação;
- busca exata;
- período;
- metadados de data em objeto de resultado;
- baixar diário completo;
- baixar página;
- visualizar PDF, Flip e HTML;
- compartilhar por e-mail/redes.

A página indexada expõe placeholders client-side. Isso não é suficiente para identificar endpoint, framework ou tecnologia do mecanismo de busca. O HAR posterior não percorreu `/buscanova/`, portanto esta limitação continua válida.

## EV-PUB-003 — Leitura HTML principal

URL observada:

- `https://www.doe.ba.gov.br/ver-html/22502/`

Metadados públicos observados:

- data 05/09/2026;
- edição 24473;
- Edição Principal;
- opções PDF e Jornal;
- controle de tamanho/zoom;
- categorias e matérias;
- escolha entre continuar sem cadastro, login e cadastro;
- indicação de que HTML é consulta e que PDF certificado segue regra de acesso.

## EV-PUB-004 — Leitura HTML suplemento

URL observada:

- `https://doe.ba.gov.br/ver-html/21002/`

Metadados públicos observados:

- data 19/11/2025;
- edição 24284;
- Edição Suplemento;
- mesma diferenciação entre HTML público e recursos protegidos.

## EV-PUB-005 — Cadastro

URL observada:

- `https://www.doe.ba.gov.br/cadastro`

Campos estruturais observados: nome, sobrenome, e-mail, confirmação, telefone, data de nascimento, login e senha. Nenhuma submissão foi realizada.

## EV-PUB-006 — Recuperação de senha

URL observada:

- `https://www.doe.ba.gov.br/esqueci-senha`

A página solicita e-mail cadastrado para envio de instruções. Nenhuma submissão foi realizada.

## Limitação desta evidência histórica

Na primeira rodada, antes do HAR, o cliente automatizado apresentou `502 Bad Gateway`/timeout e o ambiente de shell não conseguiu resolver o host. Por isso, esta evidência **não deve mais ser usada para concluir ausência de contratos de rede**.

A captura HAR posterior passou a ser a fonte prioritária para:

- `dool.egba.ba.gov.br` nas rotas navegadas;
- status e redirects observados;
- endpoints de edição, PDF, Flip e HTML;
- headers HTTP observados;
- initiators JavaScript.

Continuam pendentes mesmo após o HAR: busca real, sessão autenticada, capacidades de assinante e resposta da consulta de autenticidade.
