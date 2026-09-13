# Políticas do navegador e restrições para a extensão

**Data:** 2026-09-13

## Estado da coleta

Nesta execução remota, as superfícies públicas foram encontradas e indexadas, porém as tentativas de abertura automatizada direta do host apresentaram `502 Bad Gateway`/timeout e o ambiente de shell não resolveu o DNS do domínio. Portanto, **não foi possível capturar de forma confiável os headers HTTP reais**.

Nenhum header abaixo deve ser presumido ausente apenas porque não pôde ser coletado.

## Matriz de políticas

| Política | Evidência nesta rodada | Conclusão atual | Impacto |
|---|---|---|---|
| Content-Security-Policy | não capturada | desconhecida | precisa ser medida antes de decidir isolamento/injeção |
| CORS / Access-Control-Allow-Origin | não capturado | desconhecida | chamadas cross-origin não devem ser presumidas permitidas |
| `X-Frame-Options` | não capturado | desconhecida | iframe não pode ser assumido como estratégia válida |
| `frame-ancestors` | não capturado | desconhecida | idem |
| HSTS | não capturado | desconhecida | sem impacto funcional concluído nesta rodada |
| `Referrer-Policy` | não capturada | desconhecida | avaliar no navegador real |
| `Permissions-Policy` | não capturada | desconhecida | avaliar no navegador real |
| cookies `SameSite` | valores/atributos não capturados | desconhecida | necessário para fluxos autenticados |
| cookies `Secure`/`HttpOnly` | não capturados | desconhecida | não acessar diretamente pela UI; observar apenas atributos permitidos |
| redirects entre `doe.ba.gov.br` e `www.doe.ba.gov.br` | não comprovados | desconhecida | manifesto não deve assumir host único ainda |

## Ruling arquitetural provisório

Até a captura em navegador real:

1. Não escolher iframe como mecanismo principal de isolamento.
2. Não pressupor acesso direto a cookies pela extensão.
3. Não pressupor CORS para chamadas cross-origin.
4. Não fechar lista final de `host_permissions` do Manifest V3.
5. Tratar a estratégia preferida como **UI isolada no contexto permitido pela extensão + adaptadores que reutilizam o mesmo fluxo de origem**, mantendo fallback para a página original.

## Critério para promoção

Cada item deverá ser atualizado para um destes estados quando houver captura legítima:

- `compatível`;
- `exige-adaptação-permitida`;
- `bloqueia-estratégia-atual`;
- `desconhecida`.

Nesta rodada, todos os headers e atributos de sessão permanecem `desconhecida` por ausência de evidência direta, e não por ausência da política no servidor.
