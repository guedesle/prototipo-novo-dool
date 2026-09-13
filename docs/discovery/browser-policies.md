# Políticas do navegador e restrições relevantes à extensão

**Data:** 13/09/2026

## Estado atual

A inspeção direta de cabeçalhos HTTP ainda não foi possível com as ferramentas desta sessão. Portanto, nenhuma política abaixo será inferida pela aparência do portal.

| Política | Estado | Conclusão atual |
|---|---|---|
| Content-Security-Policy | desconhecida | bloqueado-pendente-evidência |
| CORS / Access-Control-Allow-Origin | desconhecida | bloqueado-pendente-evidência |
| X-Frame-Options | desconhecida | bloqueado-pendente-evidência |
| CSP `frame-ancestors` | desconhecida | bloqueado-pendente-evidência |
| HSTS | desconhecida | bloqueado-pendente-evidência |
| Referrer-Policy | desconhecida | bloqueado-pendente-evidência |
| Permissions-Policy | desconhecida | bloqueado-pendente-evidência |
| Cookies SameSite | desconhecida | bloqueado-pendente-evidência |
| Cookies Secure/HttpOnly | desconhecida | bloqueado-pendente-evidência |
| Política de redirects entre hosts | desconhecida | bloqueado-pendente-evidência |

## Evidência de limitação da coleta

- fetch web direto: `502 Bad Gateway`;
- ambiente local de inspeção: falha de resolução DNS para `www.doe.ba.gov.br`.

Esses resultados não são usados para caracterizar o servidor do DOOL; apenas explicam por que a política permanece desconhecida.

## Implicação arquitetural

Ainda não é possível aprovar, com base em evidência, nenhuma das seguintes escolhas:

- Shadow DOM versus iframe por restrição do portal;
- necessidade de permissões de host adicionais na extensão;
- uso de requests cross-origin pela extensão;
- reutilização direta de cookies em contextos distintos;
- equivalência de sessão entre `www.doe.ba.gov.br`, `doe.ba.gov.br` e `do.ba.gov.br`.

A fundação do EPIC-02 pode projetar fallback e isolamento, mas qualquer integração de rede dependente dessas políticas permanece bloqueada até captura em navegador real.
