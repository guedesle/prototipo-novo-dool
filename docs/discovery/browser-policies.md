# Políticas do navegador e restrições para a extensão

**Data:** 2026-09-13

## Estado da coleta

O HAR do navegador permitiu observar headers reais nas rotas percorridas. As conclusões abaixo são limitadas à captura e não devem ser extrapoladas para toda a infraestrutura.

## Matriz de políticas

| Política | Evidência no HAR | Conclusão atual | Impacto |
|---|---|---|---|
| Content-Security-Policy | não observado nos responses capturados | `desconhecida` fora da amostra; sem bloqueio demonstrado nas páginas percorridas | validar novamente quando a extensão existir |
| CORS / ACAO | contratos de negócio não exibiram CORS permissivo; `/cleanpdf/` tinha headers `Access-Control-Allow-*` sem origem útil registrada | `exige-adaptação-permitida` | preferir same-origin/bridge ou host permissions validadas; não assumir CORS aberto |
| `X-Frame-Options` | não observado nas respostas capturadas | `desconhecida` fora da amostra | iframe continua não sendo estratégia obrigatória |
| `frame-ancestors` | CSP não observada na amostra | `desconhecida` | idem |
| HSTS | não observado na amostra | `desconhecida` | sem decisão funcional |
| `Referrer-Policy` | não observada | `desconhecida` | revisar no hardening |
| `Permissions-Policy` | não observada | `desconhecida` | revisar no hardening |
| cookies `SameSite` / `Secure` / `HttpOnly` | o HAR não contém cookies utilizáveis como evidência | `desconhecida` | captura autenticada necessária; UI não deve depender de leitura direta de cookie |
| redirects de autenticação | `/admin/home -> /login`; `/meus-dados -> /` | `compatível` com fallback por redirect | adaptador deve reconhecer redirect/HTML inesperado como estado de sessão, sem inferir permissão |
| Range requests PDF | respostas `206` observadas | `compatível` | viewer pode preservar carregamento parcial do PDF |

## Origem das chamadas

As chamadas funcionais capturadas são same-origin em `dool.egba.ba.gov.br` e são iniciadas por JavaScript público baseado em jQuery. Isso favorece uma arquitetura em que a extensão mantém um adaptador de transporte isolado da UI e escolhe, após prova no EPIC-02, entre:

1. chamada same-origin no contexto adequado;
2. bridge controlada entre content script e página;
3. `host_permissions` do Manifest V3 quando necessário e compatível com sessão.

Nenhuma dessas opções deve ser fechada antes do teste da fundação.

## Ruling arquitetural atualizado

1. **Não depender de iframe** como mecanismo principal de isolamento.
2. **Não acessar cookies diretamente** pela UI.
3. **Não presumir CORS aberto**; os contratos capturados funcionam no contexto same-origin legado.
4. A lista inicial de host permissions pode ser restrita ao domínio do DOOL durante o protótipo, mas aliases adicionais só entram após evidência.
5. Preservar fallback imediato para a página original quando transporte, sessão ou parsing falharem.
6. PDF deve preservar suporte a Range e não baixar necessariamente o documento inteiro para cada navegação.

## Nota de segurança

O HAR expõe fingerprint de infraestrutura em headers comuns. O valor detalhado foi deliberadamente omitido dos artefatos versionados porque não é necessário à modernização da interface.
