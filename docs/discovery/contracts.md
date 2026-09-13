# Catálogo de contratos do DOOL

**Data de referência:** 2026-09-13  
**Evidência principal:** HAR sanitizado + superfícies públicas

Este arquivo registra contratos observados, repetidos, bloqueados ou hipóteses explicitamente identificadas. O HAR bruto não é versionado.

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

---

## CONTRACT-001 — Home do DOOL
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: desconhecido/não autenticado para rotas protegidas
- Ação do usuário: abrir o portal
- Rota/página de origem: `/`
- Requisição: `GET dool.egba.ba.gov.br/`
- Parâmetros/query/body relevantes: nenhum
- Cabeçalhos relevantes: sem credenciais versionadas
- Tipo de resposta: `200 text/html`
- Schema/estrutura sanitizada: shell da home, scripts e áreas de edição/busca/autenticidade
- Fonte de verdade: documento-html
- Classificação: documento
- Autorização observada: acesso público
- Efeito esperado na UI: montar shell e disparar carregamento de edições
- Erros observados: nenhum no HAR
- Fallback disponível: página original
- Dependência de DOM: parcial
- Evidência reproduzível: `evidence/public/2026-09-13-har-network-summary.md`
- Observações/limitações: a home obtém dados dinâmicos pelos contratos 002 e 003

## CONTRACT-002 — Edições da data corrente
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: carregar a home
- Rota/página de origem: `/`
- Requisição: `GET /apifront/portal/edicoes/edicoes_from_data.json?subtheme=<valor>`
- Parâmetros/query/body relevantes: `subtheme`
- Cabeçalhos relevantes: requisição XHR/jQuery; valores sensíveis não versionados
- Tipo de resposta: `200 application/json`
- Schema/estrutura sanitizada: raiz `erro,msg,data,itens`; item `id,data,suplemento,numero,tipo_edicao_id,tipo_edicao_nome,capa,paginas`
- Fonte de verdade: backend-estruturado
- Classificação: leitura
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: definir edição, data, número, capa e links de visualização
- Erros observados: nenhum
- Fallback disponível: home original
- Dependência de DOM: não para os dados; sim apenas no renderer legado
- Evidência reproduzível: `fixtures/public/edicoes-from-data.schema.json`
- Observações/limitações: endpoint também aparece no JavaScript público da home

## CONTRACT-003 — Últimas edições
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: carregar seletor de edições
- Rota/página de origem: `/`
- Requisição: `GET /apifront/portal/edicoes/ultimas_edicoes.json?subtheme=<valor>`
- Parâmetros/query/body relevantes: `subtheme`
- Cabeçalhos relevantes: XHR/jQuery
- Tipo de resposta: `200 application/json`
- Schema/estrutura sanitizada: raiz `erro,msg,itens`; item `id,data,suplemento,suplemento_nome,numero,tipo_edicao_id,tipo_edicao_nome,capa`
- Fonte de verdade: backend-estruturado
- Classificação: leitura
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: popular edições anteriores por data/tipo
- Erros observados: nenhum
- Fallback disponível: seletor original
- Dependência de DOM: não para os dados
- Evidência reproduzível: `fixtures/public/ultimas-edicoes.schema.json`
- Observações/limitações: 25 itens retornados na captura; não tratar esse número como limite contratual

## CONTRACT-004 — Imagem de capa/página
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: exibir capa ou página no modo Jornal
- Rota/página de origem: home/flip
- Requisição: `GET /apifront/portal/edicoes/imagem_diario/{editionId}/{page}` e variante `/imagem`
- Parâmetros/query/body relevantes: `editionId`, `page`, sufixo opcional `imagem`
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `image/jpeg`
- Schema/estrutura sanitizada: bytes de imagem
- Fonte de verdade: backend-estruturado
- Classificação: documento
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: renderizar capa/página
- Erros observados: nenhum funcional
- Fallback disponível: visualização original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: thumbnails possuem rota própria no contrato 009

## CONTRACT-005 — Download de edição completa
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: baixar/abrir PDF completo
- Rota/página de origem: home/PDF
- Requisição: `GET /portal/edicoes/download/{editionId}`
- Parâmetros/query/body relevantes: `editionId`
- Cabeçalhos relevantes: nenhum segredo versionado
- Tipo de resposta: `200 application/pdf`
- Schema/estrutura sanitizada: documento PDF
- Fonte de verdade: backend-estruturado
- Classificação: documento
- Autorização observada: funcionou para a edição capturada; não generalizar para todo acervo/perfis
- Efeito esperado na UI: abrir ou baixar edição completa
- Erros observados: nenhum
- Fallback disponível: link original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: regras de acesso históricas/assinante ainda precisam de perfil autenticado

## CONTRACT-006 — Shell do visualizador PDF
- Status: observado
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: abrir `/ver-pdf/{editionId}/`
- Rota/página de origem: home
- Requisição: `GET /ver-pdf/{editionId}/`
- Parâmetros/query/body relevantes: `editionId`; estado adicional via hash no cliente
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `200 text/html`
- Schema/estrutura sanitizada: shell do visualizador e scripts legados
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: disponível na captura
- Efeito esperado na UI: iniciar viewer e carregar catálogo de páginas
- Erros observados: nenhum
- Fallback disponível: viewer original
- Dependência de DOM: sim no legado; evitável na nova UI
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: dados das páginas vêm do contrato 007

## CONTRACT-007 — Catálogo de páginas da edição
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: abrir PDF ou Flip
- Rota/página de origem: `/ver-pdf/{id}/` e `/ver-flip/{id}/`
- Requisição: `GET /apifront/portal/edicoes/edicao_imagens/{editionId}`
- Parâmetros/query/body relevantes: `editionId`
- Cabeçalhos relevantes: XHR/jQuery
- Tipo de resposta: HTTP `200` com body JSON, embora MIME observado seja `text/html`
- Schema/estrutura sanitizada: raiz `erro,msg,itens`; item `id,pagina,link`
- Fonte de verdade: backend-estruturado
- Classificação: leitura
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: fornecer número e rotas de páginas
- Erros observados: nenhum
- Fallback disponível: viewer/flip original
- Dependência de DOM: não
- Evidência reproduzível: `fixtures/public/edicao-imagens.schema.json`
- Observações/limitações: edição da captura retornou 88 itens

## CONTRACT-008 — PDF por página
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: navegar pelas páginas do visualizador PDF
- Rota/página de origem: `/cleanpdf/`
- Requisição: `GET /apifront/portal/edicoes/pdf_diario/{editionId}/{page}?t=<cache-buster>`
- Parâmetros/query/body relevantes: `editionId`, `page`, `t`
- Cabeçalhos relevantes: `Range` aparece em requisições parciais
- Tipo de resposta: `application/pdf`, status `200` e `206`
- Schema/estrutura sanitizada: bytes PDF; suporte a ranges
- Fonte de verdade: backend-estruturado
- Classificação: documento
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: carregar página PDF sem exigir documento completo
- Erros observados: nenhum
- Fallback disponível: viewer original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: novo viewer deve preservar eficiência de Range

## CONTRACT-009 — Página/imagem e thumbnail do Flip
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: abrir/navegar no Jornal/Flip
- Rota/página de origem: `/ver-flip/{editionId}/`
- Requisição: `GET /apifront/portal/edicoes/imagem_diario/{editionId}/{page}` e `.../{page}/thumb`
- Parâmetros/query/body relevantes: `editionId`, `page`
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `image/jpeg`
- Schema/estrutura sanitizada: imagem integral ou thumbnail
- Fonte de verdade: backend-estruturado
- Classificação: documento
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: compor visualização em imagens
- Erros observados: nenhum
- Fallback disponível: Flip original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: catálogo de páginas é compartilhado com contrato 007

## CONTRACT-010 — Shell do leitor HTML
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: abrir edição em HTML
- Rota/página de origem: `/ver-html/{editionId}/`
- Requisição: `GET /ver-html/{editionId}/`
- Parâmetros/query/body relevantes: `editionId`; hash client-side também observado
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `200 text/html`
- Schema/estrutura sanitizada: shell, sumário e região de matéria
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: inicializar leitura HTML
- Erros observados: nenhum
- Fallback disponível: leitor original
- Dependência de DOM: sim no legado; dados reais vêm dos contratos 011–013
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: nova UI pode desacoplar o shell do DOM legado

## CONTRACT-011 — Verificação de disponibilidade da edição HTML
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: inicializar leitor HTML
- Rota/página de origem: `/ver-html/{editionId}/`
- Requisição: `GET /apifront/portal/edicoes/edicao_disponivel/{editionId}`
- Parâmetros/query/body relevantes: `editionId`
- Cabeçalhos relevantes: XHR/jQuery
- Tipo de resposta: HTTP `200`, body JSON com MIME `text/html`
- Schema/estrutura sanitizada: `erro,msg,itens`
- Fonte de verdade: backend-estruturado
- Classificação: leitura
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: permitir ou impedir sequência de carregamento do sumário
- Erros observados: nenhum
- Fallback disponível: leitor original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: comportamento de erro/edição inexistente ainda não exercitado

## CONTRACT-012 — Sumário hierárquico HTML
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: carregar sumário da edição
- Rota/página de origem: `/ver-html/{editionId}/`
- Requisição: `GET /html/{editionId}.html`
- Parâmetros/query/body relevantes: `editionId`
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `200 text/html`
- Schema/estrutura sanitizada: árvore `<ul>`; `span.folder`; `a.linkMateria` com identificadores e `pagina`
- Fonte de verdade: documento-html
- Classificação: leitura
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: construir categorias e lista de matérias
- Erros observados: nenhum
- Fallback disponível: sumário original
- Dependência de DOM: parcial — parsing de documento, não do DOM já renderizado
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: a amostra tinha 416 folders e 448 links de matéria; números são descritivos, não contratuais

## CONTRACT-013 — Conteúdo HTML de uma matéria
- Status: repetido
- Data da observação: 2026-09-13
- Perfil: estado capturado
- Ação do usuário: selecionar matéria no sumário
- Rota/página de origem: `/ver-html/{editionId}/`
- Requisição: `GET /apifront/portal/edicoes/publicacoes_ver_conteudo/{publicationId}`
- Parâmetros/query/body relevantes: `publicationId`
- Cabeçalhos relevantes: XHR/iframe no legado; sem segredo
- Tipo de resposta: `200 text/html`
- Schema/estrutura sanitizada: documento HTML da matéria, amostra gerada por Microsoft Word com CSS embutido
- Fonte de verdade: documento-html
- Classificação: leitura
- Autorização observada: disponível no estado capturado
- Efeito esperado na UI: renderizar matéria selecionada
- Erros observados: nenhum
- Fallback disponível: iframe/leitor original
- Dependência de DOM: não para aquisição; parsing/sanitização necessário na nova UI
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: na amostra não foram encontrados scripts, iframes, objetos, embeds, formulários ou event handlers inline; corpus maior ainda é obrigatório antes de confiar nessa característica

## CONTRACT-014 — Login (formulário)
- Status: observado
- Data da observação: 2026-09-13
- Perfil: não autenticado
- Ação do usuário: chegar à tela de login
- Rota/página de origem: redirect de `/admin/home`
- Requisição: `GET /login`
- Parâmetros/query/body relevantes: nenhum na abertura
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `200 text/html`
- Schema/estrutura sanitizada: formulário `POST /login` com campo de usuário e campo de senha
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: pública
- Efeito esperado na UI: solicitar autenticação
- Erros observados: nenhum
- Fallback disponível: login legado
- Dependência de DOM: sim se o protótipo apenas delegar; submissão não deve ser reimplementada antes de captura legítima
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: nenhuma submissão foi capturada; credenciais não foram extraídas

## CONTRACT-015 — Redirect de rota administrativa sem sessão
- Status: observado
- Data da observação: 2026-09-13
- Perfil: não autenticado/estado capturado
- Ação do usuário: abrir `/admin/home`
- Rota/página de origem: navegação direta
- Requisição: `GET /admin/home`
- Parâmetros/query/body relevantes: nenhum
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `302`
- Schema/estrutura sanitizada: `Location: /login`
- Fonte de verdade: backend-estruturado
- Classificação: navegação
- Autorização observada: acesso negado por redirect
- Efeito esperado na UI: tratar estado como autenticação necessária
- Erros observados: nenhum
- Fallback disponível: login original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: não inferir papel/assinatura a partir deste redirect

## CONTRACT-016 — Redirect de `/meus-dados` no estado capturado
- Status: observado
- Data da observação: 2026-09-13
- Perfil: não autenticado/estado capturado
- Ação do usuário: abrir `/meus-dados`
- Rota/página de origem: navegação direta
- Requisição: `GET /meus-dados`
- Parâmetros/query/body relevantes: nenhum
- Cabeçalhos relevantes: nenhum segredo
- Tipo de resposta: `302`
- Schema/estrutura sanitizada: `Location: /`
- Fonte de verdade: backend-estruturado
- Classificação: navegação
- Autorização observada: perfil não disponibilizado no estado capturado
- Efeito esperado na UI: não exibir capacidades de conta como se estivessem confirmadas
- Erros observados: nenhum
- Fallback disponível: home original
- Dependência de DOM: não
- Evidência reproduzível: HAR sanitizado
- Observações/limitações: captura autenticada continua necessária

## CONTRACT-017 — Consulta de autenticidade declarada pelo cliente
- Status: hipótese
- Data da observação: 2026-09-13
- Perfil: desconhecido
- Ação do usuário: consultar código de autenticidade
- Rota/página de origem: home
- Requisição: cliente constrói `GET /portal/edicoes/consulta_autenticidade/{hash}.json`
- Parâmetros/query/body relevantes: `hash` no path
- Cabeçalhos relevantes: não exercitados
- Tipo de resposta: JavaScript espera objeto com `msg`, `error` e, em sucesso, `Edicao.id`
- Fonte de verdade: desconhecida até execução real
- Classificação: leitura
- Autorização observada: não exercitada
- Efeito esperado na UI: informar validade e oferecer downloads
- Erros observados: não exercitados
- Fallback disponível: formulário original
- Dependência de DOM: não para o contrato esperado
- Evidência reproduzível: JavaScript público `theme/EGBA/js/home.js` presente no HAR
- Observações/limitações: não promover a contrato runtime até capturar resposta real

## CONTRACT-018 — Construção client-side da busca
- Status: observado
- Data da observação: 2026-09-13
- Perfil: público
- Ação do usuário: pesquisar por palavra ou data a partir da home
- Rota/página de origem: `/`
- Requisição: a home constrói parâmetros no hash (`p`, `q`, `di`, `df`) e submete para a action do formulário
- Parâmetros/query/body relevantes: termo e intervalo de datas no fragmento client-side
- Cabeçalhos relevantes: n/a
- Tipo de resposta: navegação client-side para a superfície de busca
- Fonte de verdade: derivado-local
- Classificação: navegação
- Autorização observada: pública
- Efeito esperado na UI: abrir busca com estado serializado no hash
- Erros observados: mecanismo de busca efetivo não capturado
- Fallback disponível: `/buscanova/`
- Dependência de DOM: parcial no legado
- Evidência reproduzível: JavaScript público `theme/EGBA/js/home.js`
- Observações/limitações: endpoint/índice que efetivamente consulta resultados continua pendente

## CONTRACT-019 — Cadastro (abertura)
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir cadastro
- Rota/página de origem: `/cadastro`
- Requisição: `GET /cadastro`
- Parâmetros/query/body relevantes: nenhum na abertura
- Cabeçalhos relevantes: não necessários
- Tipo de resposta: documento HTML/formulário
- Schema/estrutura sanitizada: dados pessoais e credenciais conforme formulário público
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: pública
- Efeito esperado na UI: exibir cadastro
- Erros observados: submissão não testada
- Fallback disponível: formulário original
- Dependência de DOM: sim se delegado
- Evidência reproduzível: observação pública anterior ao HAR
- Observações/limitações: submissão é mutação e permanece fora deste discovery

## CONTRACT-020 — Recuperação de senha (abertura)
- Status: observado
- Data da observação: 2026-09-13
- Perfil: anônimo
- Ação do usuário: abrir recuperação de senha
- Rota/página de origem: `/esqueci-senha`
- Requisição: `GET /esqueci-senha`
- Parâmetros/query/body relevantes: nenhum na abertura
- Cabeçalhos relevantes: não necessários
- Tipo de resposta: documento HTML/formulário
- Schema/estrutura sanitizada: campo de e-mail e ação de envio
- Fonte de verdade: documento-html
- Classificação: navegação
- Autorização observada: pública
- Efeito esperado na UI: exibir recuperação
- Erros observados: submissão não testada
- Fallback disponível: formulário original
- Dependência de DOM: sim se delegado
- Evidência reproduzível: observação pública anterior ao HAR
- Observações/limitações: submissão é mutação e permanece fora deste discovery

---

## Contratos ainda pendentes/bloqueados

1. request/resposta efetivos do mecanismo de busca em `/buscanova/`;
2. resolução de uma data arbitrária no endpoint usado pelos viewers (`edicoes_from_data/{YYYY-MM-DD}` aparece no JavaScript, mas não foi exercitado nesta captura);
3. resposta real de consulta de autenticidade;
4. submissão e resposta do login com sessão legítima;
5. estado/capacidades de usuário cadastrado;
6. estado/capacidades de assinante;
7. comportamento real de sessão expirada;
8. acesso a acervo certificado por perfil;
9. corpus ampliado de matérias HTML adversariais.
