# Matriz de acesso do DOOL

**Data:** 2026-09-13

Legenda:

- `observado`: resposta/fluxo capturado no navegador.
- `client-declared`: rota/ação encontrada no JavaScript público, ainda sem resposta exercitada.
- `anunciado`: regra textual da interface sem contrato técnico capturado.
- `não observado`: exige sessão legítima ou fluxo não percorrido.
- `bloqueado`: não há evidência suficiente para concluir.

| Recurso/fluxo | Anônimo / estado capturado | Cadastrado | Assinante | Sessão expirada | Evidência/observação |
|---|---|---|---|---|---|
| abrir home | observado | não observado | não observado | não observado | `GET /` 200 no HAR |
| edição Principal/Suplemento | observado | não observado | não observado | não observado | `edicoes_from_data.json` e `ultimas_edicoes.json` |
| edições anteriores | observado estruturalmente | não observado | não observado | não observado | lista estruturada em `ultimas_edicoes.json` |
| busca por termo/período | formulário e hash client-side observados | não observado | não observado | não observado | JavaScript da home; request do mecanismo de busca não capturado |
| HTML `/ver-html/{id}/` | observado | não observado | não observado | não observado | shell + disponibilidade + sumário + conteúdo por matéria |
| categorias/matérias do HTML | observado | não observado | não observado | não observado | `/html/{editionId}.html` + `publicacoes_ver_conteudo/{publicationId}` |
| PDF completo | observado para a edição capturada | não observado | não observado | não observado | `/portal/edicoes/download/{editionId}` 200 PDF |
| PDF por página/viewer | observado | não observado | não observado | não observado | `edicao_imagens`, `cleanpdf`, `pdf_diario`; Range 206 |
| Versão Jornal/Flip | observado | não observado | não observado | não observado | shell + catálogo + imagens/thumbnails |
| acervo completo certificado | não determinado | não determinado | anunciado para assinantes | não observado | contrato autenticado pendente |
| consulta de autenticidade | client-declared | não observado | não observado | não observado | rota construída em `home.js`, resposta não exercitada |
| abrir cadastro | observado publicamente | n/a | n/a | n/a | `/cadastro` |
| submeter cadastro | não executado; mutação | n/a | n/a | n/a | fora do discovery automático |
| abrir recuperação de senha | observado publicamente | n/a | n/a | n/a | `/esqueci-senha` |
| submeter recuperação | não executado; mutação | n/a | n/a | n/a | fora do discovery automático |
| login | formulário observado | **não capturado** | **não capturado** | não observado | `/login` usa `POST /login`, sem submissão no HAR |
| `/admin/home` | redirect para `/login` | não observado | não observado | compatível com sessão ausente | `302 Location: /login` |
| `/meus-dados` | redirect para `/` | não observado | não observado | compatível com sessão ausente | `302 Location: /` |
| perfil/assinatura | não acessível no estado capturado | não observado | não observado | não observado | nova captura autenticada necessária |

## Cenários adversariais benignos

### Estado não autenticado em rota protegida

A captura fornece evidência real de redirect para duas superfícies protegidas: `/admin/home` e `/meus-dados`. Isso é suficiente para projetar fallback e tratamento de `redirect-to-login` sem inferir o mecanismo interno de sessão.

### Busca sem resultado

O template/JavaScript contém a navegação da busca, mas o HAR enviado não percorreu `/buscanova/`. O request real do mecanismo de busca permanece pendente.

### Edição inexistente

Não foi realizada enumeração de IDs. O caso continua reservado a teste benigno posterior.

### 401/403/5xx

Nenhum 401/403/5xx funcional do DOOL foi produzido nesta captura. Não serão provocados artificialmente por exploração. A estratégia da UI deve tratar esses estados genericamente quando surgirem em testes normais.

## Conclusão

A evidência do HAR é suficiente para liberar o desenho técnico dos domínios **edições, PDF/Flip e leitor HTML**, incluindo fontes de dados e fallbacks. Busca, autenticação/assinatura e consulta de autenticidade ainda exigem captura específica. O estado capturado não deve ser rotulado como cadastrado ou assinante porque as rotas de perfil redirecionaram para superfícies públicas/login.
