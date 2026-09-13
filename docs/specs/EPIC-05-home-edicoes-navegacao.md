# EPIC-05 — Home, edições e navegação

**Status:** especificado, não implementado  
**Prioridade:** alta  
**Dependências:** EPIC-03, EPIC-04

## 1. Objetivo

Redesenhar a porta de entrada do DOOL e a navegação entre edições, priorizando clareza sobre edição atual, extras, formatos disponíveis e acesso ao histórico.

## 2. Resultado de negócio

O usuário deve conseguir identificar rapidamente a edição desejada e chegar ao conteúdo correspondente sem interpretar controles ambíguos ou depender da organização visual atual.

## 3. Escopo

- home nova;
- edição principal do dia;
- edições extras quando existirem;
- seletor de data/edição anterior;
- estados de disponibilidade;
- ações para HTML, PDF e Jornal conforme capacidades reais;
- navegação para busca/acervo;
- indicação clara de formato e restrição de acesso;
- back/forward/refresh coerentes;
- responsividade e teclado.

## 4. Fora de escopo

- pesquisa detalhada, coberta pelo EPIC-06;
- leitura completa da matéria, coberta pelo EPIC-07;
- implementação de login, coberta pelo EPIC-08;
- criação de novas regras de disponibilidade.

## 5. Modelo de informação

A home deve tratar **edição** como entidade principal, evitando que cada formato pareça uma edição diferente.

Exemplo conceitual:

```text
Edição 24473 — 05/09/2026
Tipo: Principal
Disponível em:
- HTML [público]
- PDF [capacidade informada pelo backend]
- Jornal [capacidade informada pelo backend]
```

Edições extras devem ser apresentadas como variações da mesma data com identificação inequívoca.

## 6. Requisitos funcionais

### RF-05.1 — Edição atual

Exibir data, número, tipo e formatos disponíveis da edição atual retornada pelo adaptador.

### RF-05.2 — Extras

Quando não houver edição extra, não exibir placeholders vazios que sugiram conteúdo indisponível. Quando houver, diferenciar Extra 1, Extra 2 ou nomenclatura real retornada pelo sistema.

### RF-05.3 — Ações por capacidade

A interface só deve apresentar ação como disponível quando a capacidade estiver confirmada. Estado desconhecido deve provocar consulta/fallback, não concessão otimista.

### RF-05.4 — Edições anteriores

Permitir selecionar data dentro das possibilidades reais do backend e comunicar quando não houver edição/resultado para a data.

### RF-05.5 — Navegação histórica

Back, forward e refresh devem restaurar o contexto da edição selecionada quando a URL/estado do portal suportar isso. Se não suportar, a estratégia deve ser explicitada no design de implementação.

### RF-05.6 — Origem e validade

Quando houver diferença entre HTML consultivo e documento certificado, a interface deve comunicar isso de forma concisa e não alarmista.

## 7. Requisitos de UX

- ação primária de leitura em HTML deve ser evidente quando disponível;
- PDF/Jornal não devem competir visualmente com a tarefa principal de consulta;
- data e número da edição devem ser fáceis de escanear;
- seletores de data precisam de label e alternativa acessível;
- estado sem edição deve explicar o que aconteceu e oferecer retorno/busca;
- mobile deve preservar as mesmas ações essenciais.

## 8. Critérios de aceite

### CA-05-A

Usuário consegue abrir a edição principal atual em HTML a partir da nova home.

### CA-05-B

Quando existem extras, são identificados sem ambiguidade e abrem o recurso correto.

### CA-05-C

Uma data sem edição gera estado vazio informativo, não erro genérico.

### CA-05-D

Ação protegida não aparece como liberada para estado de acesso não confirmado.

### CA-05-E

A home funciona a 320 px, 768 px e desktop sem perda de ações.

### CA-05-F

O fluxo principal funciona somente por teclado.

## 9. Revisão adversarial

Testar:

- nenhuma edição no dia;
- apenas principal;
- principal + um extra;
- múltiplos extras;
- número/data ausentes na resposta;
- formatos parcialmente disponíveis;
- sessão muda enquanto home está aberta;
- data fora do acervo;
- timezone/fronteira de dia;
- refresh em edição antiga;
- deep link inválido;
- rede lenta ao trocar data.

Pergunta crítica: **a home continua correta se a combinação de formatos e extras for diferente do caso mais comum?** Se o layout depender de um cenário fixo, não está pronto.

## 10. Estratégia de testes

- unitários para apresentação de combinações de edição/capacidade;
- integração com fixtures do EPIC-03;
- E2E para atual, anterior, extra e indisponível;
- teclado e responsividade;
- comparação com backend para garantir que número/data/tipo não foram reinterpretados.

## 11. Definition of Done

- home usa apenas adaptadores;
- edição atual e extras funcionam;
- seleção histórica funciona nos limites reais;
- capacidades protegidas são respeitadas;
- estados de erro/vazio estão cobertos;
- responsividade e teclado validados;
- retorno à interface original permanece disponível.

## 12. Gate

**G4 parcial aprovado:** descoberta de edições pode ser demonstrada independentemente da interface legada.
