# Catálogo de contratos do DOOL

Este é o catálogo canônico do EPIC-01. Cada entrada deve ser baseada em evidência observável ou marcada explicitamente como hipótese/bloqueio.

## Template

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

## Regras

1. Não preencher campos desconhecidos por inferência.
2. Não registrar valores de cookie, token, senha ou credencial.
3. Não copiar conteúdo protegido além do mínimo estrutural indispensável.
4. Uma entrada só muda de `observado` para `repetido` após nova observação equivalente.
5. Toda operação classificada como `mutação` deve constar também em `mutations.md`.
6. Quando não existir chamada separada e o dado vier no documento inicial, registrar `documento-html` em vez de inventar uma API.

---

## CONTRACT-001 — Documento público da home
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir o portal
- Rota/página de origem: `/`
- Requisição: `GET https://www.doe.ba.gov.br/` (destino público indexado; trace HTTP direto pendente)
- Parâmetros/query/body relevantes: nenhum observado
- Cabeçalhos relevantes: desconhecidos nesta rodada
- Tipo de resposta: página web pública
- Schema/estrutura sanitizada: edição principal; Extra 1; Extra 2; HTML; PDF; Jornal; edições anteriores; busca; autenticidade
- Fonte de verdade: desconhecida
- Classificação: documento
- Autorização observada: acesso anônimo à superfície pública
- Efeito esperado na UI: apresentar as principais entradas do DOOL
- Erros observados: fetch direto indisponível nas ferramentas de coleta; indexação pública permaneceu acessível
- Fallback disponível: portal original em navegador real
- Dependência de DOM: desconhecida
- Evidência reproduzível: `docs/discovery/evidence/public/2026-09-13-public-index-observations.md`
- Observações/limitações: `www.doe.ba.gov.br`, `doe.ba.gov.br` e `do.ba.gov.br` exibem superfície equivalente no índice; equivalência HTTP ainda não demonstrada.

## CONTRACT-002 — Documento/template da busca
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: acessar a superfície de busca/acervo
- Rota/página de origem: `/buscanova/`
- Requisição: `GET https://www.doe.ba.gov.br/buscanova/` (destino público indexado; trace HTTP direto pendente)
- Parâmetros/query/body relevantes: desconhecidos
- Cabeçalhos relevantes: desconhecidos
- Tipo de resposta: página web com template client-side aparente
- Schema/estrutura sanitizada: `results.hits.total`, `queryTerm`, paginação, `doc._source.day/month/year`, `cliente.name`, `cliente.limiteAntigos`, ações de download/visualização/compartilhamento
- Fonte de verdade: desconhecida
- Classificação: documento
- Autorização observada: superfície publicamente indexada
- Efeito esperado na UI: permitir consulta por termo/período e renderizar resultados
- Erros observados: estado textual para zero resultado aparece no template; requisição real da busca ainda não observada
- Fallback disponível: busca original
- Dependência de DOM: desconhecida
- Evidência reproduzível: `docs/discovery/evidence/public/2026-09-13-public-index-observations.md`
- Observações/limitações: os nomes dos campos não comprovam Elasticsearch, framework específico nem endpoint.

## CONTRACT-003 — Documento de leitura HTML por edição
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir uma edição em HTML
- Rota/página de origem: `/ver-html/{id}/`
- Requisição: `GET https://www.doe.ba.gov.br/ver-html/{id}/` (destino público indexado; trace HTTP direto pendente)
- Parâmetros/query/body relevantes: identificador numérico no path
- Cabeçalhos relevantes: desconhecidos
- Tipo de resposta: página web de visualização
- Schema/estrutura sanitizada: data da edição; número; principal/suplemento; controle de texto/zoom; categorias/matérias; gate de acesso; ações PDF/Jornal
- Fonte de verdade: desconhecida
- Classificação: documento
- Autorização observada: consulta HTML declarada como disponível sem cadastro; PDF certificado associado a cadastro; acervo certificado ampliado associado a assinatura
- Efeito esperado na UI: permitir leitura consultiva do conteúdo da edição
- Erros observados: nenhum erro funcional reproduzido; fetch direto indisponível no ambiente de coleta
- Fallback disponível: página original de leitura HTML
- Dependência de DOM: desconhecida
- Evidência reproduzível: exemplos `/ver-html/21882/`, `/22038/`, `/21207/`, `/21002/` listados na evidência pública
- Observações/limitações: origem real de categorias/matérias ainda não determinada.

## CONTRACT-004 — Documento público de cadastro
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir formulário de cadastro
- Rota/página de origem: `/cadastro`
- Requisição: `GET https://www.doe.ba.gov.br/cadastro` (destino público indexado; submissão não executada)
- Parâmetros/query/body relevantes: nenhum na abertura
- Cabeçalhos relevantes: desconhecidos
- Tipo de resposta: formulário web público
- Schema/estrutura sanitizada: nome; sobrenome; e-mail; confirmação de e-mail; telefone; data de nascimento; login; senha
- Fonte de verdade: desconhecida
- Classificação: documento
- Autorização observada: anônimo
- Efeito esperado na UI: apresentar criação de conta
- Erros observados: não testados
- Fallback disponível: formulário original
- Dependência de DOM: desconhecida
- Evidência reproduzível: `docs/discovery/evidence/public/2026-09-13-public-index-observations.md`
- Observações/limitações: método e endpoint de submissão são desconhecidos; nenhuma mutação foi executada.

## CONTRACT-005 — Documento público de recuperação de senha
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir recuperação de senha
- Rota/página de origem: `/esqueci-senha`
- Requisição: `GET https://www.doe.ba.gov.br/esqueci-senha` (destino público indexado; submissão não executada)
- Parâmetros/query/body relevantes: nenhum na abertura
- Cabeçalhos relevantes: desconhecidos
- Tipo de resposta: formulário web público
- Schema/estrutura sanitizada: campo de e-mail e ação de envio
- Fonte de verdade: desconhecida
- Classificação: documento
- Autorização observada: anônimo
- Efeito esperado na UI: iniciar recuperação de conta
- Erros observados: não testados
- Fallback disponível: formulário original
- Dependência de DOM: desconhecida
- Evidência reproduzível: `docs/discovery/evidence/public/2026-09-13-public-index-observations.md`
- Observações/limitações: método e endpoint de submissão são desconhecidos; nenhuma mutação foi executada.
