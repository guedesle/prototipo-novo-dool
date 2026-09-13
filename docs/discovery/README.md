# Discovery técnico do DOOL

Este diretório registra evidências técnicas para o EPIC-01 — Discovery e contratos do DOOL.

## Objetivo

Descrever o comportamento observável do sistema atual sem transformar inferências em fatos, sem alterar o backend e sem versionar segredos.

## Regra de evidência

Toda conclusão deve ser classificada como uma das seguintes:

- **observado** — comportamento visto ao menos uma vez;
- **repetido** — comportamento visto novamente em condição equivalente;
- **hipótese** — interpretação ainda não demonstrada;
- **bloqueado** — não pôde ser validado com os meios e permissões atuais.

## Dados que não podem entrar no Git

É proibido versionar:

- senha;
- cabeçalho `Authorization`;
- valor de `Cookie` ou `Set-Cookie`;
- bearer token, CSRF token ou token equivalente;
- e-mail pessoal ou outro identificador do usuário de teste quando não for estritamente necessário;
- identificador de assinatura/cliente;
- documento protegido ou conteúdo oficial além do mínimo necessário para demonstrar estrutura.

Capturas HAR brutas, quando usadas, permanecem fora do Git. Somente versões sanitizadas podem ser incorporadas como evidência.

## Unidade de registro

Cada contrato técnico é identificado por `CONTRACT-XXX` e deve usar o template de `contracts.md`.

## Classificação de fonte de verdade

- `backend-estruturado` — dado entregue por resposta estruturada;
- `documento-html` — dado já presente no HTML recebido inicialmente;
- `dom-renderizado` — dado disponível somente após processamento/renderização no navegador;
- `derivado-local` — valor calculado pela interface;
- `desconhecida` — fonte ainda não demonstrada.

## Classificação de operação

- `leitura`;
- `mutação`;
- `navegação`;
- `documento`.

Qualquer POST/PUT/PATCH/DELETE, ou GET com efeito colateral conhecido, deve ser registrado também em `mutations.md` e permanece fora do protótipo até autorização específica.

## Sanitização

Antes de qualquer commit de evidência:

1. remover credenciais e tokens;
2. remover cookies e identificadores pessoais;
3. reduzir payloads ao mínimo estrutural necessário;
4. confirmar que URLs não carregam segredo em query string;
5. marcar claramente o perfil observado sem identificar a pessoa utilizada no teste.

## Data de início

13/09/2026.
