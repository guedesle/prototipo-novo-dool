# Gate G1 — Discovery e contratos do DOOL

**Data:** 13/09/2026  
**Estado global:** PARCIAL — discovery público avançado; contratos de rede/sessão ainda bloqueados por falta de captura em navegador real.

## Critério

Um domínio só é liberado quando existe evidência suficiente para escolher entre:

- `chamada-reutilizável`;
- `documento-html`;
- `dom-renderizado`;
- `fallback-legado`;
- `bloqueado-pendente-evidência`.

## Decisão por domínio

| Domínio | Estado G1 | Estratégia atual | Evidência/limite |
|---|---|---|---|
| Detecção de rota/home | LIBERADO PARCIALMENTE | `documento-html` + fallback | home e superfícies públicas repetidamente observadas; aliases HTTP ainda não confirmados |
| Navegação principal/edições | LIBERADO PARA PROTÓTIPO DE SHELL | `fallback-legado` até contrato real | recursos visíveis e rotas conhecidas; resolução de edição por data ainda desconhecida |
| Busca por palavra/período | BLOQUEADO | `bloqueado-pendente-evidência` | template client-side aparente conhecido; endpoint/parâmetros/resposta não observados |
| Resultados/paginação | BLOQUEADO | `bloqueado-pendente-evidência` | campos de template observados; contrato real não capturado |
| Leitura `/ver-html/{id}/` | LIBERADO SOMENTE COMO ROTA/FALLBACK | `fallback-legado` | rota e comportamento público conhecidos; origem de categorias/matérias não demonstrada |
| Leitor HTML reimplementado | BLOQUEADO | `bloqueado-pendente-evidência` | falta source/DOM/XHR do conteúdo editorial |
| PDF | BLOQUEADO PARA INTEGRAÇÃO | `fallback-legado` | capacidade existe; destino/autorização do DOE não demonstrados |
| Jornal/Flip | BLOQUEADO PARA INTEGRAÇÃO | `fallback-legado` | capacidade existe; destino/autorização do DOE não demonstrados |
| Autenticidade | BLOQUEADO PARA INTEGRAÇÃO | `fallback-legado` | formulário público existe; endpoint/resposta não capturados |
| Cadastro do DOOL | LIBERADO COMO FALLBACK | `fallback-legado` | rota pública observada; submissão e contrato de escrita não observados |
| Recuperação de senha do DOOL | LIBERADO COMO FALLBACK | `fallback-legado` | rota pública observada; submissão e contrato de escrita não observados |
| Login/sessão do consumidor DOOL | BLOQUEADO | `bloqueado-pendente-evidência` | rota final, cookies e capacidades por perfil não demonstrados |
| EGBANET 2.0 / backoffice | FORA DO MVP PÚBLICO | sistema relacionado | rotas atuais observadas, mas publicação não integra o protótipo nesta fase |
| CSP/CORS/cookies/redirects | BLOQUEADO | `bloqueado-pendente-evidência` | ferramentas atuais não retornaram cabeçalhos do DOOL |

## Ambientes

- `doe.ba.gov.br`, `www.doe.ba.gov.br`, `do.ba.gov.br` e `www2.egba.ba.gov.br`: superfícies DOOL observadas, equivalência de rede ainda não demonstrada.
- `egbanet.egba.ba.gov.br`: EGBANET 2.0 / IONEWS e portais relacionados; sistema relacionado, não o produto-alvo principal.
- `egba.autopage.inf.br`: forte pista de implantação Autopage/IONEWS; papel exato ainda não demonstrado.
- `dool.autopage.inf.br`: não canônico nesta fase; contém links do Amapá em uma interface com conteúdo Bahia, evidenciando template/parametrização multicliente.

## Riscos que bloqueiam aprovação total

1. implementar busca a partir de nomes de template sem saber a chamada real;
2. reescrever matéria HTML sem saber sua fonte e estrutura completa;
3. inferir autorização a partir de botões visíveis;
4. usar host Autopage/template como origem canônica sem comprovação;
5. misturar credenciais/sessão do EGBANET de publicação com conta de consulta DOOL;
6. escolher estratégia de iframe/Shadow DOM/rede sem conhecer CSP, CORS e cookies.

## Evidência necessária para completar G1

Captura de navegador real, preferencialmente HAR sanitizado e/ou DevTools, cobrindo:

1. abertura da home;
2. seleção de edição/data;
3. busca com resultado;
4. busca sem resultado;
5. abertura de resultado;
6. `/ver-html/{id}/` e abertura de categoria/matéria;
7. PDF;
8. Jornal/Flip;
9. autenticidade;
10. login e perfis somente depois, em sessão legítima.

A captura deve registrar URL, método, tipo de resposta e headers de política relevantes, removendo `Cookie`, `Set-Cookie`, `Authorization`, tokens e dados pessoais antes de versionamento.

## Decisão

**G1 não está aprovado globalmente.** Há evidência suficiente para iniciar futuramente apenas o shell reversível e a navegação/fallback baseada em rotas conhecidas, mas os domínios de maior valor funcional — busca, leitor HTML reimplementado, documentos protegidos e sessão — permanecem bloqueados até captura real de rede/DOM.
