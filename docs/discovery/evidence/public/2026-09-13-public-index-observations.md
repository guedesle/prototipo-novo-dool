# Evidência pública — snapshot de indexação

**Data:** 13/09/2026  
**Perfil:** anônimo  
**Natureza:** evidência passiva; nenhuma submissão mutante foi executada.

## URLs observadas

- `https://www.doe.ba.gov.br/`
- `https://doe.ba.gov.br/`
- `https://do.ba.gov.br/`
- `https://www.doe.ba.gov.br/buscanova/`
- `https://www.doe.ba.gov.br/ver-html/21882/`
- `https://www.doe.ba.gov.br/ver-html/22038/`
- `https://www.doe.ba.gov.br/ver-html/21207/`
- `https://doe.ba.gov.br/ver-html/21002/`
- `https://www.doe.ba.gov.br/cadastro`
- `https://www.doe.ba.gov.br/esqueci-senha`

## Observações reproduzíveis

1. A home apresenta edição principal, duas posições de edição extra, HTML, PDF, Jornal, edições anteriores, busca e consulta de autenticidade.
2. A busca indexada em `/buscanova/` expõe marcadores de template não resolvidos (`results.hits.total`, `queryTerm`, `doc._source.*`, `cliente.*`) e ações de download/visualização/compartilhamento.
3. `/ver-html/{id}/` expõe número/data da edição e distingue edição principal de suplemento em exemplos diferentes.
4. A leitura HTML declara acesso consultivo sem cadastro e diferencia PDF certificado/cadastrado e acervo de assinante.
5. `/cadastro` contém formulário com nome, sobrenome, e-mail, confirmação de e-mail, telefone, data de nascimento, login e senha.
6. `/esqueci-senha` contém fluxo público de recuperação por e-mail.
7. A rota de login, o endpoint da autenticidade e os destinos finais de PDF/Jornal não foram obtidos nesta rodada.

## Limitação técnica

Tentativas de fetch direto somente leitura falharam no ambiente de coleta:

- fetch web: `502 Bad Gateway`;
- ambiente local: falha de resolução DNS.

Consequentemente, esta evidência não demonstra cabeçalhos HTTP, cookies, CSP/CORS, redirects nem chamadas XHR/fetch.

## Sanitização

Este arquivo não contém cookie, token, senha, e-mail pessoal de usuário de teste ou conteúdo protegido.
