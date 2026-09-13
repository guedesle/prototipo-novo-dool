# Catálogo de contratos do DOOL

Este arquivo registra apenas contratos observados, repetidos, bloqueados ou hipóteses explicitamente identificadas.

## Template canônico

```markdown
## CONTRACT-XXX — <nome>
- Status: observado | repetido | hipótese | bloqueado
- Data da observação: YYYY-MM-DD
- Perfil: anônimo | cadastrado | assinante | sessão-expirada | desconhecido
- Ação do usuário:
- Rota/página de origem:
- Requisição: <método> <host><path>
- Parâmetros/query/body relevantes:
- Cabeçalhos relevantes: <somente nomes/valores não sensíveis>
- Tipo de resposta:
- Schema/estrutura sanitizada:
- Fonte de verdade: backend-estruturado | documento-html | dom-renderizado | derivado-local | desconhecida
- Classificação: leitura | mutação | navegação | documento
- Autorização observada:
- Efeito esperado na UI:
- Erros observados:
- Fallback disponível:
- Dependência de DOM: sim | não | parcial
- Evidência reproduzível:
- Observações/limitações:
```

## Contratos observados

## CONTRACT-001 — Documento público da home
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir o portal do Diário Oficial
- Rota/página de origem: `/`
- Requisição: `GET doe.ba.gov.br/` ou `GET www.doe.ba.gov.br/`
- Parâmetros/query/body relevantes: nenhum observado
- Cabeçalhos relevantes: não capturados nesta rodada
- Tipo de resposta: documento HTML/indexação pública
- Schema/estrutura sanitizada: edição principal; Extra 1; Extra 2; HTML; PDF; Jornal; seletor de data; busca; autenticidade
- Fonte de verdade: documento-html
- Classificação: documento
- Autorização observada: pública/anônima
- Efeito esperado na UI: apresentar as principais portas de entrada do DOOL
- Erros observados: acesso automatizado direto apresentou timeout/502 em parte das tentativas
- Fallback disponível: interface pública original
- Dependência de DOM: parcial
- Evidência reproduzível: `evidence/public/2026-09-13-public-surface-observations.md#ev-pub-001--home`
- Observações/limitações: host canônico e redirects ainda não comprovados

## CONTRACT-002 — Documento da busca `/buscanova/`
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: acessar a superfície de pesquisa
- Rota/página de origem: `/buscanova/`
- Requisição: `GET www.doe.ba.gov.br/buscanova/`
- Parâmetros/query/body relevantes: não capturados; a página contém controles de termo, busca exata e período
- Cabeçalhos relevantes: não capturados nesta rodada
- Tipo de resposta: documento HTML com placeholders client-side
- Schema/estrutura sanitizada: contador; paginação; objeto de resultado; ações de download/visualização/compartilhamento
- Fonte de verdade: documento-html
- Classificação: documento
- Autorização observada: superfície pública
- Efeito esperado na UI: disponibilizar pesquisa e renderização de resultados
- Erros observados: acesso automatizado direto apresentou 502; resultados efetivos não foram executados nesta ferramenta
- Fallback disponível: interface original
- Dependência de DOM: parcial
- Evidência reproduzível: `evidence/public/2026-09-13-public-surface-observations.md#ev-pub-002--busca`
- Observações/limitações: endpoint, método e tecnologia do mecanismo de busca permanecem desconhecidos

## CONTRACT-003 — Documento de leitura HTML `/ver-html/{id}/`
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir uma edição em HTML
- Rota/página de origem: `/ver-html/{id}/`
- Requisição: `GET <host>/ver-html/{id}/`
- Parâmetros/query/body relevantes: identificador numérico no path
- Cabeçalhos relevantes: não capturados nesta rodada
- Tipo de resposta: documento HTML
- Schema/estrutura sanitizada: data; número da edição; tipo Principal/Suplemento; PDF; Jornal; zoom; categorias/matérias; gate de acesso
- Fonte de verdade: documento-html
- Classificação: documento
- Autorização observada: página e consulta HTML anunciadas como públicas; PDF segue regras de acesso
- Efeito esperado na UI: apresentar metadados da edição e permitir consulta do conteúdo HTML
- Erros observados: acesso automatizado direto apresentou 502 em parte das tentativas
- Fallback disponível: leitor original
- Dependência de DOM: parcial
- Evidência reproduzível: `evidence/public/2026-09-13-public-surface-observations.md#ev-pub-003--leitura-html-principal`
- Observações/limitações: origem técnica de categorias/matérias após interação ainda não capturada

## CONTRACT-004 — Navegação pública para cadastro
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir cadastro
- Rota/página de origem: `/cadastro`
- Requisição: `GET www.doe.ba.gov.br/cadastro`
- Parâmetros/query/body relevantes: nenhum observado na abertura
- Cabeçalhos relevantes: não capturados
- Tipo de resposta: documento HTML/formulário
- Schema/estrutura sanitizada: nome; sobrenome; e-mail; confirmação; telefone; nascimento; login; senha
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: pública
- Efeito esperado na UI: exibir formulário de cadastro
- Erros observados: nenhum no índice; acesso direto automatizado intermitente
- Fallback disponível: formulário original
- Dependência de DOM: sim
- Evidência reproduzível: `evidence/public/2026-09-13-public-surface-observations.md#ev-pub-005--cadastro`
- Observações/limitações: submissão não observada; tratada como mutação

## CONTRACT-005 — Navegação pública para recuperação de senha
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir recuperação de senha
- Rota/página de origem: `/esqueci-senha`
- Requisição: `GET www.doe.ba.gov.br/esqueci-senha`
- Parâmetros/query/body relevantes: nenhum observado na abertura
- Cabeçalhos relevantes: não capturados
- Tipo de resposta: documento HTML/formulário
- Schema/estrutura sanitizada: campo e-mail; ação enviar
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: pública
- Efeito esperado na UI: exibir formulário de recuperação
- Erros observados: nenhum no índice; acesso direto automatizado intermitente
- Fallback disponível: formulário original
- Dependência de DOM: sim
- Evidência reproduzível: `evidence/public/2026-09-13-public-surface-observations.md#ev-pub-006--recuperação-de-senha`
- Observações/limitações: submissão não observada; tratada como mutação

## CONTRATOS AINDA BLOQUEADOS/PENDENTES

- endpoint/resposta efetivos da busca;
- resolução de edição por data;
- origem de categorias/matérias após continuar sem cadastro;
- PDF completo e PDF por página;
- Versão Jornal/Flip;
- consulta de autenticidade;
- login e sessão;
- perfil/assinatura;
- diferenças cadastrados/assinantes;
- headers de CSP/CORS/cookies e redirects reais.
