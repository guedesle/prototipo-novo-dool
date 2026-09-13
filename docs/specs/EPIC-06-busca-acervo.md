# EPIC-06 — Busca e acervo

**Status:** especificado, não implementado  
**Prioridade:** alta  
**Dependências:** EPIC-03, EPIC-04

## 1. Objetivo

Modernizar a experiência de pesquisa do DOOL sem alterar a semântica dos resultados produzidos pelo backend atual. A nova interface deve facilitar formulação da consulta, leitura dos resultados, refinamento e abertura do conteúdo correspondente.

## 2. Resultado de negócio

O usuário consegue pesquisar atos/publicações com menos ambiguidade, compreender por que determinado resultado apareceu e chegar ao documento/matéria correspondente com menos passos.

## 3. Escopo

- campo de termo/palavra-chave;
- intervalo de datas quando suportado;
- filtros adicionais somente se confirmados no backend;
- validação de consulta;
- paginação ou mecanismo equivalente do sistema atual;
- total de resultados quando fornecido pelo contrato;
- cards/linhas de resultado;
- trecho contextual quando fornecido pelo backend;
- ações de abrir HTML, PDF, página ou outros formatos realmente suportados;
- estados loading, zero resultado, erro, consulta inválida e sessão insuficiente;
- preservação da consulta na navegação quando tecnicamente suportável;
- responsividade e teclado.

## 4. Fora de escopo

- motor de busca novo;
- re-ranking semântico;
- correção ortográfica própria;
- IA generativa para responder consultas;
- indexação local do acervo;
- inferência de resultados que o backend não devolveu.

## 5. Princípio de fidelidade

A interface pode reorganizar, explicar e facilitar a leitura dos resultados, mas não pode apresentar como resultado oficial algo que não tenha sido retornado pelo mecanismo atual.

Se o protótipo aplicar transformação local — por exemplo, destaque visual do termo — essa transformação deve ser puramente de apresentação e não alterar a ordem ou o conteúdo de origem sem indicação explícita.

## 6. Requisitos funcionais

### RF-06.1 — Consulta

Enviar ao adaptador somente parâmetros suportados pelo contrato catalogado no EPIC-01.

### RF-06.2 — Datas

Validar coerência do intervalo antes da chamada. Limites reais do acervo devem ser comunicados conforme o comportamento do backend.

### RF-06.3 — Resultados

Cada resultado deve exibir apenas metadados confirmados, como data, edição, suplemento/caderno, título/trecho ou outros campos efetivamente retornados.

### RF-06.4 — Paginação

A UI deve respeitar o mecanismo real de paginação e não assumir que o total cabe em uma única resposta.

### RF-06.5 — Estado reproduzível

Quando possível, termo, datas, página e filtros devem sobreviver a back/forward/refresh sem guardar histórico sensível desnecessário em storage permanente.

### RF-06.6 — Ações por resultado

Ações para HTML/PDF/página devem ser derivadas das capacidades e URLs do adaptador. Nenhuma URL protegida deve ser construída por tentativa.

### RF-06.7 — Zero resultado

Diferenciar claramente “nenhum resultado” de “falha na pesquisa”.

## 7. UX

A tela deve ajudar o usuário a responder quatro perguntas rapidamente:

1. O que estou pesquisando?
2. Em qual período?
3. Quantos resultados encontrei ou por que não encontrei?
4. Como abro a publicação/documento correspondente?

Filtros avançados não devem ser criados apenas porque cabem visualmente; só entram no protótipo se o backend os sustentar e tiverem valor de uso.

## 8. Critérios de aceite

### CA-06-A

Para uma consulta de referência, a nova interface representa o mesmo conjunto/ordem de resultados entregues pelo backend, salvo diferença explicitamente documentada.

### CA-06-B

Consulta vazia/inválida é tratada antes ou de acordo com o contrato real, sem gerar comportamento confuso.

### CA-06-C

Zero resultado é distinguível de erro de rede/servidor.

### CA-06-D

Paginação não duplica, omite nem mistura itens entre páginas.

### CA-06-E

Ações protegidas respeitam capacidades do usuário.

### CA-06-F

Fluxo pesquisar -> abrir resultado -> voltar preserva a consulta dentro das possibilidades do portal.

## 9. Revisão adversarial

Testar:

- termo vazio;
- termo de um caractere;
- termo muito longo;
- aspas e caracteres especiais;
- acentos;
- datas invertidas;
- data anterior ao limite do acervo;
- intervalo muito amplo;
- zero resultados;
- milhares de resultados;
- resultado sem trecho;
- campos ausentes;
- itens duplicados;
- página além do total;
- timeout ao paginar;
- sessão muda durante navegação;
- backend retorna HTML de erro com status 200;
- conteúdo do trecho contém marcação inesperada.

Pergunta crítica: **a nova UI está melhorando a pesquisa ou está criando uma camada de interpretação que pode divergir do índice oficial?** A segunda hipótese é bloqueadora.

## 10. Estratégia de testes

- fixtures com zero, um, muitos e milhares de resultados simulados a partir do schema real;
- contract tests;
- comparação automática de IDs/metadados entre adaptador e UI;
- E2E de busca e retorno;
- teclado;
- responsividade;
- testes de sanitização de trechos.

## 11. Definition of Done

- pesquisa opera exclusivamente pelos adaptadores;
- parâmetros correspondem a contratos confirmados;
- paginação está correta;
- estados de erro/zero resultado estão distintos;
- resultados não são semanticamente inventados;
- segurança do conteúdo de trecho está validada;
- fluxo principal é responsivo e acessível.

## 12. Gate

**G4 parcial aprovado:** busca e acervo podem ser demonstrados com fidelidade ao sistema atual.
