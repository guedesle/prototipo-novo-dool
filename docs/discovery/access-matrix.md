# Matriz de acesso do DOOL

**Data:** 2026-09-13

Legenda:

- `observado`: resposta/fluxo capturado no navegador.
- `client-declared`: rota/ação encontrada no JavaScript, sem resposta exercitada.
- `anunciado`: regra textual da interface sem contrato técnico suficiente.
- `não observado`: fluxo não percorrido ou perfil não demonstrado.
- `bloqueado`: não há evidência suficiente para concluir.

| Recurso/fluxo | Anônimo / captura 1 | Cadastrado/autenticado / captura 2 | Assinante | Sessão expirada | Evidência/observação |
|---|---|---|---|---|---|
| abrir home | observado | observado | não determinado | não observado | `GET /` 200 |
| edição Principal/Suplemento | observado | observado | não determinado | não observado | `edicoes_from_data.json`; captura 2 confirmou Principal + Suplemento no mesmo dia |
| edições anteriores | observado | observado | não determinado | não observado | `ultimas_edicoes.json` |
| busca por termo | não percorrida | **observado** | não determinado | não observado | `GET /busca/busca/buscar/query/{page}/?…&q=…` |
| busca por período | não percorrida | **observado** | não determinado | não observado | filtros `di`/`df` capturados |
| busca com resultados | não percorrida | **observado** | não determinado | não observado | JSON com `hits`, `highlight`, `aggregations` |
| busca sem resultado | não percorrida | **observado** | não determinado | não observado | `hits.total=0`, lista e buckets vazios |
| HTML `/ver-html/{id}/` | observado | observado | não determinado | não observado | shell + disponibilidade + sumário + conteúdo por matéria |
| categorias/matérias do HTML | observado | observado | não determinado | não observado | `/html/{editionId}.html` + `publicacoes_ver_conteudo/{publicationId}` |
| PDF completo | observado na edição capturada | observado | não determinado | não observado | `/portal/edicoes/download/{editionId}` |
| PDF por página/viewer | observado | observado | não determinado | não observado | catálogo + `pdf_diario`; Range 206 |
| Versão Jornal/Flip | observado | observado | não determinado | não observado | catálogo + imagens/thumbnails |
| acervo completo certificado | não determinado | não determinado | anunciado para assinantes | não observado | diferença por assinatura ainda pendente |
| consulta de autenticidade | client-declared | client-declared | não determinado | n/a | rota presente no JS; resposta não exercitada |
| abrir cadastro | observado publicamente | n/a | n/a | n/a | `/cadastro` |
| submeter cadastro | não executado; mutação | n/a | n/a | n/a | delegado ao legado |
| abrir recuperação de senha | observado publicamente | n/a | n/a | n/a | `/esqueci-senha` |
| submeter recuperação | não executado; mutação | n/a | n/a | n/a | delegado ao legado |
| login | formulário observado | sessão já estabelecida; submissão não capturada | não determinado | não observado | não reimplementar credenciais |
| `/admin/home` | `302 -> /login` na captura 1 | não exercitado na captura 2 | não determinado | compatível com sessão ausente na captura 1 | presença de link não prova permissão |
| `/meus-dados` | `302 -> /` na captura 1 | **`200` observado duas vezes** | não determinado | não observado | prova de sessão autenticada |
| atualização de perfil | indisponível | formulário observado; **mutação não executada** | não determinado | n/a | `POST /usuarios/meus_dados/{userId}` sanitizado como padrão |
| logout | não exercitado | link presente | não determinado | estado posterior não observado | não executado no discovery |

## Cenários adversariais benignos

### Transição não autenticado → autenticado

As duas capturas demonstram estados distintos sem expor credenciais: na primeira, `/meus-dados` não permaneceu acessível; na segunda, a mesma rota respondeu `200`. Isso é suficiente para modelar `anonymous/authenticated/unknown` como estado de capacidade sem ler cookies diretamente.

### Busca sem resultado

A segunda captura comprova zero resultado como resposta de domínio válida: HTTP `200`, `hits.total = 0`, `hits.hits = []` e buckets vazios. A nova UI não deve apresentar isso como erro.

### Sessão expirada

Não foi provocada nem observada. A estratégia deve tratar redirect/HTML inesperado como estado `unknown/reauth-required` e usar fallback, sem adulteração de token.

### Assinatura

A sessão autenticada não comprova assinatura. Nenhuma capacidade de acervo certificado deve ser inferida apenas porque o perfil está acessível.

## Conclusão

Com a segunda captura, estão suficientemente demonstrados os domínios de **edições, busca, PDF/Flip, leitor HTML e detecção básica de sessão autenticada**. Permanecem pendentes apenas capacidades específicas de assinatura, consulta de autenticidade e transição de sessão expirada/logout.