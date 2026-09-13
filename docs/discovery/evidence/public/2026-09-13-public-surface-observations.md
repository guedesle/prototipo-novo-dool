# Evidência pública — superfícies do DOOL

**Data:** 2026-09-13  
**Perfil:** anônimo  
**Natureza:** evidência sanitizada baseada em páginas públicas indexadas e tentativas de acesso automatizado somente leitura.

## EV-PUB-001 — Home

URL observada:

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

A página indexada expõe placeholders client-side. Isso não é suficiente para identificar endpoint, framework ou tecnologia do mecanismo de busca.

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

## Limitação da rodada

O cliente automatizado de navegação apresentou `502 Bad Gateway`/timeout ao tentar abrir diretamente algumas rotas já encontradas no índice, enquanto o ambiente de shell não conseguiu resolver DNS do host. Como consequência:

- não há captura confiável de headers HTTP nesta evidência;
- não há HAR;
- não há confirmação de redirects;
- não há confirmação de endpoint interno de busca;
- não há confirmação de APIs de edição, PDF, Jornal ou autenticidade.

Esses itens permanecem explicitamente pendentes para navegador real/DevTools.
