# EPIC-05 — Home, edições e navegação

**Status:** reespecificado, não implementado no modo standalone  
**Prioridade:** alta  
**Dependências:** EPIC-03, EPIC-04, EPIC-04.5, EPIC-04.6  
**Arquitetura de referência:** `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## 1. Objetivo

Redesenhar a porta de entrada do DOOL como aplicação web pública standalone, priorizando a edição atual, suplementos/extras, formatos disponíveis e uma entrada clara para “Explorar publicações”.

## 2. Resultado de negócio

O usuário abre o Novo DOOL por URL, sem extensão obrigatória, identifica rapidamente a edição desejada e chega ao conteúdo correspondente sem interpretar controles ambíguos ou depender da organização visual legada.

## 3. Escopo

- home standalone;
- edição principal do dia;
- suplementos/extras quando existirem;
- seletor de data/edição anterior dentro dos contratos confirmados;
- estados de disponibilidade;
- ações HTML, PDF e Jornal conforme capacidades reais;
- entrada destacada para “Explorar publicações”;
- acesso separado ao acervo completo/busca oficial;
- navegação com back/forward/refresh;
- responsividade, teclado e estados universais;
- integração com BFF/API sem chamadas diretas da UI ao DOOL.

## 4. Fora de escopo

- filtros dimensionais completos, cobertos pelo EPIC-06;
- implementação do índice, coberta pelo EPIC-04.5;
- implementação do BFF/base standalone, coberta pelo EPIC-04.6;
- leitura completa da matéria, coberta pelo EPIC-07;
- autenticação própria ou oficial, coberta pelo EPIC-08;
- criação de novas regras de disponibilidade.

## 5. Modelo de informação

A Home trata **edição** como entidade principal. Formatos são representações da mesma edição.

Exemplo:

```text
Edição 24473 — 05/09/2026
Tipo: Principal
Disponível em:
- HTML
- PDF
- Jornal
```

Suplementos/extras são variações explícitas da data/edição e não cards genéricos indistinguíveis.

## 6. Princípio de fonte

A Home pode usar o catálogo normalizado/índice para acelerar descoberta, mas número, data, tipo e disponibilidade não podem divergir da fonte oficial sem indicação explícita.

O corpo documental continua vindo do DOOL oficial.

## 7. Requisitos funcionais

### RF-05.1 — Edição atual

Exibir data, número, tipo e formatos disponíveis da edição atual.

### RF-05.2 — Suplementos e extras

Quando inexistentes, não exibir placeholders vazios. Quando existirem, diferenciar usando nomenclatura real do sistema.

### RF-05.3 — Ações por capacidade

A interface só apresenta ação como disponível quando a capacidade correspondente está confirmada.

Estado `unknown` nunca significa concedido.

### RF-05.4 — Edições anteriores

Permitir seleção de data/edição dentro das possibilidades reais da fonte. Estado sem edição é vazio informativo, não erro genérico.

### RF-05.5 — Explorar publicações

A Home deve possuir chamada clara para a experiência dimensional do EPIC-06.

Pode haver campo de entrada/autocomplete simplificado, mas filtros completos permanecem na tela de exploração.

### RF-05.6 — Acervo completo

Oferecer acesso separado à pesquisa oficial quando aplicável, sem sugerir que “Explorar publicações” cobre necessariamente todo o acervo desde o primeiro dia.

### RF-05.7 — Navegação reproduzível

Back, forward e refresh preservam contexto sempre que o estado puder ser representado com segurança na URL/estado da aplicação.

### RF-05.8 — Standalone

O fluxo principal funciona em navegador limpo sem extensão.

## 8. UX

Prioridade da Home:

```text
marca/instituição
edição do dia
ler edição
PDF/Jornal
suplementos/extras
explorar publicações
acervo completo
```

A Home não deve virar dashboard de métricas ou facetas.

Mobile preserva todas as ações essenciais.

## 9. Estados obrigatórios

```text
INITIAL
LOADING
SUCCESS
EMPTY
PARTIAL
ERROR_RECOVERABLE
ERROR_BLOCKING
```

## 10. Critérios de aceite

### CA-05-A

Usuário abre a edição principal atual em HTML a partir do site standalone.

### CA-05-B

Suplementos/extras são identificados sem ambiguidade e abrem o recurso correto.

### CA-05-C

Data sem edição produz estado vazio informativo.

### CA-05-D

Ação protegida ou desconhecida não aparece como liberada.

### CA-05-E

Home funciona a 320 px, 768 px e desktop sem perda de ações.

### CA-05-F

Fluxo principal funciona por teclado.

### CA-05-G

Home possui entrada inequívoca para “Explorar publicações”.

### CA-05-H

Nenhum fluxo público da Home depende da extensão Chromium.

## 11. Revisão adversarial

Testar:

- nenhuma edição no dia;
- apenas principal;
- principal + suplemento;
- principal + extra;
- múltiplas variações;
- número/data ausentes;
- formatos parcialmente disponíveis;
- índice temporariamente indisponível;
- DOOL indisponível;
- data fora do acervo;
- refresh em edição antiga;
- deep link inválido;
- rede lenta;
- 320 px;
- teclado;
- zoom 200%.

Pergunta crítica: **a Home continua útil como porta de entrada editorial mesmo quando o índice dimensional ou um formato está temporariamente indisponível?**

## 12. Estratégia de testes

- unitários de apresentação de combinações de edição/capacidade;
- integração com fixtures dos adaptadores e BFF;
- E2E atual/anterior/suplemento/extra/indisponível;
- teclado e responsividade;
- comparação com dados oficiais para número/data/tipo;
- teste sem extensão instalada.

## 13. Definition of Done

- home usa contratos tipados/BFF;
- edição atual e variações funcionam;
- seleção histórica funciona nos limites reais;
- capacidades são respeitadas;
- entrada para exploração está integrada;
- estados universais cobertos;
- responsividade e teclado validados;
- site standalone não depende da extensão.

## 14. Gate

**G5:** Home standalone pronta quando os fluxos públicos forem reproduzíveis por URL e a interface não inventar disponibilidade, edição ou autorização.
