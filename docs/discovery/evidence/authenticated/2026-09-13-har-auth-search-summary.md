# Evidência sanitizada — HAR autenticado + busca

**Data da captura:** 2026-09-13  
**Origem:** navegador do usuário, exportação HAR com conteúdo  
**Arquivo bruto:** deliberadamente não versionado  
**Classificação:** evidência autenticada sanitizada

## 1. Escopo

A segunda captura contém 662 requisições, das quais 612 para `dool.egba.ba.gov.br`.

Fluxos relevantes observados:

1. duas pesquisas reais em `/buscanova/`;
2. home;
3. leitura HTML;
4. PDF de edição principal;
5. PDF de suplemento da mesma edição/data;
6. PDF por página;
7. Jornal/Flip;
8. `/meus-dados` em sessão autenticada.

## 2. Sessão autenticada comprovada

Nesta captura, `GET /meus-dados` respondeu `200 text/html` em duas ocasiões. O documento exibiu controles de conta autenticada e formulário de atualização de dados.

A evidência sanitizada registra apenas capacidades e nomes de campos. Não são versionados:

- nome do usuário;
- e-mail;
- CPF/CNPJ;
- endereço;
- identificador interno da conta;
- senha;
- cookie;
- token;
- valores preenchidos em formulário.

O formulário autenticado permite atualização de credenciais/dados cadastrais e endereço. A submissão é uma **mutação** e permanece delegada ao sistema original.

Rotas de navegação autenticada observáveis no documento incluem perfil, logout, clipping e área administrativa. A presença de link não é tratada como prova de autorização de cada destino.

## 3. Busca real — contrato observado

O cliente executou requisições `GET` no padrão:

```text
/busca/busca/buscar/query/{page}{dateFilters}{yearFilters}/?1=1&q=<term>&...
```

Foram capturados dois cenários:

- consulta com resultados;
- consulta sem resultados, com intervalo de datas.

As duas respostas foram `200 application/json`.

### Estrutura raiz observada

```text
took
timed_out
_shards
hits
aggregations
loggedCredit
```

### Estrutura de `hits`

```text
hits.total
hits.max_score
hits.hits[]
```

Cada hit observado contém metadados do mecanismo e uma `_source` com campos editoriais suficientes para montar o resultado, incluindo:

```text
conteudo
data
paginas
pagina
pdf_id
year
month
day
diario_id
tipo_edicao
```

Também foram observados:

- `highlight.conteudo`;
- ordenação (`sort`);
- identificação textual da edição/suplemento.

### Agregações/facetas

Foram observadas as agregações:

- `TipoEdicao`;
- `Edicoes`;
- `FileYear`.

Cada uma fornece buckets com chave e contagem. O cliente também possui compatibilidade com uma estrutura legada de `facets`, mas a captura atual retornou `aggregations`.

### Zero resultados

A consulta sem resultados retornou:

- `hits.total = 0`;
- `hits.hits = []`;
- agregações com buckets vazios;
- sem erro HTTP.

Isso permite tratar **zero resultado como estado normal de domínio**, separado de erro de transporte ou erro do mecanismo.

## 4. Construção da consulta no cliente

O JavaScript da busca valida termo mínimo de 3 caracteres quando não está em modo calendário. A requisição é montada com:

- página corrente;
- termo `q`;
- data inicial `di`;
- data final `df`;
- anos ativos `y`, quando aplicável;
- flag `materias=1`, conforme modo;
- flag `calendario=1`, no modo calendário;
- `subtheme`, quando aplicável.

A busca exata é implementada no cliente por normalização/uso de aspas no termo antes do request.

## 5. Principal + suplemento no mesmo dia

O endpoint `edicoes_from_data.json` retornou, repetidamente na captura, duas edições para a mesma data/número:

- edição principal;
- suplemento.

Ambas usam os mesmos contratos de catálogo de páginas e visualização PDF, com `editionId` distinto. Isso valida um modelo normalizado de edição com variante/tipo em vez de fluxos técnicos separados.

## 6. Segurança

O HAR bruto não foi versionado. Valores pessoais encontrados no HTML autenticado foram deliberadamente descartados da evidência.

Não houve submissão de atualização da conta, alteração de senha, logout, cadastro ou recuperação de senha durante o trecho analisado.

## 7. Limitações restantes

Esta captura ainda não demonstra:

- consulta de autenticidade executada;
- diferença entre usuário cadastrado e assinante;
- expiração de sessão ou logout concluído;
- acesso a acervo certificado condicionado por assinatura.

Essas lacunas não bloqueiam a fundação, a busca pública, o leitor HTML, PDF/Flip ou a detecção básica de estado autenticado; continuam bloqueando apenas capacidades específicas de assinatura/autenticidade.