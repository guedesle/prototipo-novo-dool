# Mapa de rotas e superfícies públicas do DOOL

**Data da observação:** 2026-09-13  
**Perfil:** anônimo  
**Método:** navegação/indexação pública e tentativa de acesso automatizado somente leitura.

## Rotas confirmadas publicamente

| Superfície | Rota/padrão observado | Evidência | Classificação inicial |
|---|---|---|---|
| Home | `https://doe.ba.gov.br/` e `https://www.doe.ba.gov.br/` | página pública indexada em ambos os hosts | documento/navegação |
| Busca | `/buscanova/` | página pública indexada com template de resultados | documento + UI client-side aparente |
| Leitura HTML | `/ver-html/{id}/` | múltiplas edições indexadas | documento |
| Cadastro | `/cadastro` | formulário público indexado | navegação; submissão é mutação |
| Recuperação de senha | `/esqueci-senha` | formulário público indexado | navegação; submissão é mutação |

## Home

A home pública apresenta:

- edição principal;
- Edição Extra 1;
- Edição Extra 2;
- ações de HTML sem cadastro, PDF e Versão Jornal;
- seleção de edições anteriores, com indicação de disponibilidade das últimas 30 edições nessa seleção;
- busca por palavra/nome e período;
- informação de acervo pesquisável a partir de 30/06/2007;
- consulta de autenticidade por código;
- conteúdo institucional e formulário de contato.

### Fonte pública

- https://doe.ba.gov.br/
- https://www.doe.ba.gov.br/

## Busca `/buscanova/`

A superfície pública indexada contém campos de busca, opção de busca exata, período, paginação e ações por resultado. O template exposto inclui expressões como `results.hits.total`, `queryTerm` e `doc._source.day/month/year`.

Ações visíveis no resultado:

- baixar diário completo;
- baixar apenas a página;
- adquirir edição;
- visualizar PDF;
- visualizar Flip;
- visualizar HTML;
- compartilhar por redes/e-mail.

**Importante:** essas expressões são evidência de uma camada client-side que trabalha com objetos estruturados, mas não comprovam por si só tecnologia, endpoint ou mecanismo de busca interno.

### Fonte pública

- https://www.doe.ba.gov.br/buscanova/

## Leitura HTML `/ver-html/{id}/`

O padrão de rota foi observado em diversas edições, inclusive:

- `/ver-html/22502/` — 05/09/2026, edição 24473, Principal;
- `/ver-html/22114/` — 26/06/2026, edição 24421, Principal;
- `/ver-html/21002/` — 19/11/2025, edição 24284, Suplemento.

A superfície informa:

- Versão PDF;
- Versão Jornal;
- zoom/tamanho de texto;
- categorias expansíveis/recolhíveis;
- matérias selecionáveis;
- opção de continuar sem cadastro;
- opção de login;
- opção de cadastro;
- HTML destinado à consulta;
- PDF certificado disponível conforme regra de cadastro;
- acervo completo de edições certificadas disponível para assinantes.

### Fontes públicas

- https://www.doe.ba.gov.br/ver-html/22502/
- https://doe.ba.gov.br/ver-html/22114/
- https://doe.ba.gov.br/ver-html/21002/

## Cadastro `/cadastro`

Campos publicamente observados:

- nome;
- sobrenome;
- e-mail e confirmação;
- telefone;
- data de nascimento;
- login;
- senha.

A submissão não foi executada neste discovery e permanece classificada como mutação.

### Fonte pública

- https://www.doe.ba.gov.br/cadastro

## Recuperação `/esqueci-senha`

A página solicita o e-mail cadastrado e oferece ação de envio para redefinição de senha. A submissão não foi executada.

### Fonte pública

- https://www.doe.ba.gov.br/esqueci-senha

## Hostnames e redirects

Foram encontradas páginas indexadas tanto em `doe.ba.gov.br` quanto em `www.doe.ba.gov.br`. O discovery atual **não comprova** que sejam aliases perfeitamente equivalentes nem qual é o hostname canônico em todos os fluxos.

Tentativas de acesso automatizado direto durante esta rodada retornaram intermitentemente `502 Bad Gateway`/timeout no mecanismo de navegação e falha de resolução DNS no ambiente de shell. Por isso, redirects, status HTTP finais e equivalência dos hosts permanecem pendentes de captura no navegador real.

## Fonte de verdade por superfície — estado atual

| Informação | Origem comprovada nesta rodada |
|---|---|
| estrutura e recursos da home | documento/indexação pública |
| estrutura do formulário de busca | documento/indexação pública |
| resultados efetivos da busca | desconhecida; requer execução/captura |
| metadados básicos de edição em `/ver-html/{id}/` | documento/indexação pública |
| categorias e matérias carregadas após continuar sem cadastro | desconhecida; requer navegador/DOM/rede |
| disponibilidade real de PDF/Jornal por perfil | regra textual observada; contrato técnico pendente |
| cadastro/recuperação | documento público; submissões não observadas |
| autenticidade | superfície confirmada na home; contrato técnico pendente |
