# EPIC-06 — Explorar publicações + acervo oficial

**Status:** reespecificado, não implementado  
**Prioridade:** alta  
**Dependências:** EPIC-03, EPIC-04, EPIC-04.5, EPIC-04.6  
**Arquitetura de referência:** `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## 1. Objetivo

Criar a experiência “Explorar publicações” sobre o índice dimensional histórico do Novo DOOL e manter, de forma separada e transparente, acesso ao mecanismo oficial de busca/acervo quando necessário.

## 2. Resultado de negócio

O usuário localiza publicações por período, caderno, órgão, subordinados, tipo, edição e título com menos passos e consegue abrir a matéria em HTML ou sua página correspondente em PDF/Jornal quando o mapeamento estiver validado.

## 3. Duas superfícies de consulta

### 3.1 Explorar publicações

Usa o índice dimensional próprio do Novo DOOL.

### 3.2 Acervo completo

Usa o mecanismo oficial do DOOL quando aplicável e permitido.

A interface não pode confundir as duas origens.

Copy conceitual:

```text
Explorar publicações
Busca detalhada no período indexado

Pesquisar no acervo completo
Consulta ao acervo histórico do Diário Oficial
```

## 4. Escopo

- busca textual por títulos indexados;
- autocomplete;
- sugestão ortográfica transparente;
- período, com últimos 90 dias como default de UI;
- caderno;
- organização hierárquica temporal;
- inclusão/exclusão de subordinados;
- tipo de publicação;
- edição/tipo de edição;
- facetas e contagens;
- resultados paginados;
- ordenação por data/relevância quando contratada;
- ações HTML/PDF/Jornal por resultado;
- estados de carregamento, vazio, parcial, erro e cache quando aplicável;
- preservação de filtros/consulta em navegação;
- entrada para busca oficial do acervo completo.

## 5. Fora de escopo

- armazenar corpo HTML no índice;
- IA generativa para responder consultas;
- re-ranking semântico opaco;
- correção ortográfica silenciosa;
- macrogrupos de tipos inventados;
- achatamento de hierarquias;
- afirmar cobertura histórica que o índice ainda não possui;
- substituir autorização oficial.

## 6. Semântica de filtros

Dimensões diferentes combinam por AND.

Valores múltiplos dentro da mesma dimensão combinam por OR.

Seleção de órgão pai inclui descendentes por padrão.

Exclusões são aplicadas dentro do conjunto incluído.

Exemplo:

```text
Secretaria da Educação + descendentes
EXCETO Unidade X
AND
Contratos OR Convênios
AND
últimos 90 dias
```

## 7. Organizações

Árvore tri-state:

```text
selecionado
indeterminado
não selecionado
```

Ações rápidas:

```text
Selecionar todas
Somente órgão principal
Limpar
```

A árvore deve usar a hierarquia válida na data de cada publicação.

O cliente envia intenção; o backend resolve descendentes/temporalidade.

## 8. Tipos de publicação

Não criar macrogrupos artificiais.

Se a fonte demonstrar hierarquia real, o componente pode usar o mesmo padrão tri-state. Caso contrário, os tipos permanecem planos.

## 9. Busca textual

A v1 pesquisa títulos indexados.

Normalização tolera:

- acentos;
- caixa;
- espaços;
- pontuação trivial.

Não aplicar substituições semânticas agressivas.

## 10. Autocomplete

Endpoint:

```text
GET /api/v1/search/suggestions?q=...
```

Sugestões podem conter:

- termo;
- frase;
- título;
- contagem contextual.

Quando possível, sugestões respeitam os filtros ativos.

## 11. Sugestão ortográfica

Fuzzy matching é permitido somente na camada de sugestão e sobre conjunto reduzido de candidatos quando busca direta/prefixo for fraca ou vazia.

Exemplo:

```text
Você quis dizer: Licitação?
```

A consulta original não é alterada até ação explícita do usuário.

## 12. Resultado

Cada item deve trazer, quando disponível:

```text
publicationId
title
date
edition.id
edition.number
edition.kind
notebook
organization + lineage temporal
publicationType
startPage
pageMapping
actions
```

## 13. Ações por publicação

Se `page_mapping_status = VALIDATED`:

```text
[Ler em HTML]
[PDF · pág. N]
[Jornal · pág. N]
```

Se página não estiver validada:

```text
[Ler em HTML]
Página no PDF/Jornal não identificada
```

Nunca inferir página.

## 14. Paginação e ordenação

Paginação convencional é suficiente na v1.

Default recomendado:

```text
data DESC
+ edição
+ ordem editorial
```

Quando houver `q`, também podem existir opções explícitas:

```text
relevância
mais recentes
mais antigos
```

## 15. Estado reproduzível

Termo, período, filtros, ordenação e página devem sobreviver a back/forward/refresh quando representáveis com segurança.

Não guardar conteúdo documental ou histórico sensível desnecessário em storage permanente.

## 16. Estados universais

```text
INITIAL
LOADING
SUCCESS
EMPTY
PARTIAL
ERROR_RECOVERABLE
ERROR_BLOCKING
```

Erro de índice deve oferecer, quando pertinente:

```text
[Tentar novamente]
[Pesquisar no acervo completo]
```

## 17. UX

Desktop: filtros laterais + resultados.

Mobile: busca/período + botão de filtros ativos; árvore em drawer/dialog acessível.

Preferir lista estruturada a cards decorativos.

## 18. Critérios de aceite

### CA-06-A

Consulta dimensional combina filtros com semântica AND/OR definida e sem perda/duplicação de itens.

### CA-06-B

Selecionar órgão pai inclui descendentes corretos segundo temporalidade histórica.

### CA-06-C

Exclusão de subordinado produz pai indeterminado e resultado coerente.

### CA-06-D

Correção ortográfica nunca altera consulta sem ação explícita.

### CA-06-E

Resultado sem página validada não recebe ação PDF/Jornal inventada.

### CA-06-F

Zero resultado é distinguível de erro.

### CA-06-G

“Explorar publicações” e “Acervo completo” são distinguíveis em linguagem comum.

### CA-06-H

Fluxo pesquisar -> abrir -> voltar preserva consulta/filtros quando suportado.

### CA-06-I

Fluxo principal funciona a 320 px, zoom 200% e apenas teclado.

## 19. Revisão adversarial

Testar:

- termo vazio;
- 1 caractere;
- acentos/caixa;
- erro de digitação;
- termo inexistente;
- 0, 1 e 10.000 resultados;
- órgão com 6 níveis;
- 17 subordinados;
- seleção parcial profunda;
- tipo longo;
- página ausente;
- índice atrasado;
- API parcial;
- rede lenta;
- refresh com filtros;
- mobile;
- teclado;
- zoom 200%.

Pergunta crítica: **a UI melhora a descoberta sem apagar a diferença entre índice próprio, documento oficial e busca oficial?**

## 20. Estratégia de testes

- contract tests de API;
- unitários de semântica de filtros;
- fixtures com hierarquia temporal;
- testes de paginação;
- E2E de busca/filtros/abertura/retorno;
- acessibilidade da árvore tri-state;
- responsividade;
- testes de estados partial/error;
- comparação entre ações renderizadas e `page_mapping_status`.

## 21. Definition of Done

- exploração opera pela API dimensional;
- filtros e hierarquia são corretos;
- autocomplete/sugestão são transparentes;
- página/ações respeitam validação;
- acervo oficial permanece separado;
- estados universais cobertos;
- responsividade e teclado validados;
- nenhuma capability protegida é inferida.

## 22. Gate

**G6 funcional da exploração:** usuário consegue formular, refinar e abrir uma consulta dimensional reproduzível, com origem e limitações compreensíveis e sem divergência silenciosa das regras documentadas.
