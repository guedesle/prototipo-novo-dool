# Mapa de rotas e superfícies públicas do DOOL

**Data da observação:** 13/09/2026  
**Perfil:** anônimo  
**Método de evidência nesta rodada:** indexação pública recente e tentativa de fetch direto somente leitura.

## Hostnames observados

| Host | Evidência pública | Estado |
|---|---|---|
| `www.doe.ba.gov.br` | home e rotas internas indexadas | observado |
| `doe.ba.gov.br` | home e rotas internas indexadas | observado |
| `do.ba.gov.br` | home indexada com superfície equivalente | observado |

**Importante:** a presença do mesmo conteúdo no índice público não demonstra, por si só, que os três hosts sejam aliases HTTP equivalentes ou que compartilhem exatamente cookies, redirects, CSP e CORS. A equivalência permanece pendente de inspeção de rede.

## Rotas públicas observadas

| Superfície | Rota/padrão observado | Estado | Observação |
|---|---|---|---|
| Home | `/` | observado | edição principal, Extra 1, Extra 2, edições anteriores, busca e autenticidade |
| Busca/acervo | `/buscanova/` | observado | template indexado expõe paginação, resultados, ações de download/visualização/compartilhamento |
| Leitura HTML | `/ver-html/{id}/` | repetido | observadas edições principal e suplemento |
| Cadastro | `/cadastro` | observado | formulário público de cadastro |
| Recuperação de senha | `/esqueci-senha` | observado | formulário público por e-mail |
| Login | rota final desconhecida | bloqueado | botão `FAZER LOGIN` é visível em `/ver-html/{id}/`, mas a rota/contrato não foi obtida |
| PDF | destino final desconhecido | bloqueado | ação existe na home, leitura HTML e busca; contrato final ainda não obtido |
| Versão Jornal/Flip | destino final desconhecido | bloqueado | ação existe na home, leitura HTML e busca; contrato final ainda não obtido |
| Autenticidade | endpoint desconhecido | bloqueado | formulário existe na home; chamada não observada |

## Capacidades visíveis por superfície

### `/`

A home publica:

- edição principal;
- Extra 1;
- Extra 2;
- HTML sem cadastro;
- versão PDF;
- versão Jornal;
- seleção de edições anteriores;
- busca por palavra;
- informação de acervo a partir de 30/06/2007;
- consulta de autenticidade.

### `/buscanova/`

O conteúdo indexado contém marcadores de template não resolvidos, entre eles:

- `results.hits.total`;
- `queryTerm`;
- `current+1` / `pages`;
- `doc._source.day`, `month` e `year`;
- `cliente.name` e `cliente.limiteAntigos`.

Também são exibidas ações para:

- baixar diário completo;
- baixar apenas a página;
- adquirir edição;
- visualizar PDF;
- visualizar Flip;
- visualizar HTML;
- compartilhar por redes e e-mail.

Esses marcadores são evidência de um modelo de renderização client-side aparente. **Não** constituem evidência suficiente para afirmar framework, mecanismo de busca ou endpoint.

### `/ver-html/{id}/`

Foram observados exemplos de:

- edição principal;
- edição suplemento;
- número e data da edição;
- controle de tamanho/zoom;
- instrução para expandir categorias e selecionar matérias;
- acesso HTML sem cadastro;
- ação de login;
- ação de cadastro;
- indicação de PDF com validade jurídica/autenticação digital para usuários cadastrados;
- indicação de acervo certificado ampliado para assinantes.

Exemplos públicos observados incluem `/ver-html/21882/`, `/ver-html/22038/`, `/ver-html/21207/` e `/ver-html/21002/`.

## Limitação da coleta automatizada nesta rodada

O fetch direto pelas ferramentas disponíveis não conseguiu obter o documento vivo:

- o fetch web direto retornou `502 Bad Gateway`;
- o ambiente local de inspeção não conseguiu resolver o domínio por DNS.

Isso é uma limitação do ambiente de coleta e **não deve ser interpretado como indisponibilidade do DOOL para usuários reais**. Por esse motivo, cabeçalhos HTTP, redirects, scripts e chamadas XHR/fetch permanecem não confirmados.
