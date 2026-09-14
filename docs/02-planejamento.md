# Planejamento do projeto

## 1. Estratégia geral

O projeto será executado em etapas que reduzam risco técnico e preservem a fonte oficial. A ordem atual privilegia contratos comprovados, índice dimensional, plataforma standalone e só depois a implementação visual final.

A arquitetura principal aprovada em 14/09/2026 é uma aplicação web pública standalone hospedada na Hostinger. A extensão Chromium permanece como modo secundário.

## 2. Fases

### Fase 0 — Baseline documental

Objetivo: consolidar visão, escopo, estado, arquitetura, riscos, roadmap e specs.

**Estado:** concluída para a baseline inicial; revisada pela arquitetura standalone.

### Fase 1 — Discovery técnico do DOOL

Objetivo: identificar contratos e comportamentos reais usados pelo portal.

**Estado:** primeiro ciclo concluído; discovery adicional continua por domínio.

Gate:

> Nenhum recurso prioritário pode avançar baseado apenas em suposição de endpoint.

### Fase 2 — Fundação segura da extensão

Objetivo: manter um modo secundário de demonstração seguro, isolado e reversível.

**Estado:** concluída/mergeada.

A extensão deixa de ser pré-requisito do modo principal.

### Fase 3 — Camada de adaptação

Objetivo: encapsular interações com o DOOL em contratos internos estáveis.

**Estado:** primeiro conjunto concluído/mergeado.

### Fase 4 — Design system e base de acessibilidade

Objetivo: criar tokens, componentes, shell e padrões de interação reutilizáveis.

**Estado:** concluída/mergeada.

Gate validado para teclado, 320 px, zoom 200%, reduced motion e reversibilidade.

### Fase 4.5 — Índice Dimensional Público

Objetivo: criar histórico cumulativo consultável por metadados editoriais.

Entregas:

- modelo dimensional;
- temporalidade organizacional;
- aliases/canonicalização;
- `source_start_page`;
- catálogo de páginas;
- backfill 90 dias;
- sync horário;
- reconciliação diária dos últimos 7 dias;
- busca textual por títulos;
- autocomplete;
- API pública somente leitura;
- observabilidade.

**Gate G4.5:** índice idempotente, auditável, cumulativo e sem identidade/página inventada.

### Fase 4.6 — Plataforma Web Standalone + BFF

Objetivo: disponibilizar o Novo DOOL por URL, sem extensão obrigatória.

Entregas:

- frontend público;
- BFF server-to-server;
- integração com índice dimensional;
- consumo controlado de HTML/PDF/Flip oficiais;
- health/status;
- deploy Hostinger;
- separação entre identidade própria e autorização oficial.

**Gate G4.6:** fluxos públicos prioritários funcionam em navegador limpo e recurso protegido não é liberado por sessão própria.

### Fase 5 — Design da experiência standalone

Objetivo: criar e validar visualmente Home, Explorar publicações, acervo oficial e leitores antes de iniciar implementação funcional das novas superfícies.

Entrada:

`docs/design/HANDOFF-SITES.md`

Plano:

`docs/superpowers/plans/2026-09-14-novo-dool-design-handoff.md`

**Gate de design:** G-D1 a G-D10 aprovados, sem bloqueadores críticos/altos.

### Fase 6 — Implementação pública

Objetivo: implementar Home, exploração dimensional, leitores e integração conforme design aprovado.

Planos devem ser separados em:

1. índice + ingestão;
2. standalone + BFF;
3. frontend/design implementation.

Nenhum deles deve reabrir silenciosamente decisões arquiteturais.

### Fase 7 — Identidade e recursos protegidos

Objetivo: adicionar recursos pessoais opcionais e integrar capacidades oficiais somente quando houver contrato aprovado.

Regras:

- consulta pública permanece sem login;
- identidade própria não amplia autorização oficial;
- autenticação do DOOL depende do Gate AUTH-DOOL;
- não armazenar senha oficial sem contrato e revisão explícita.

### Fase 8 — Hardening e validação adversarial

Objetivo: segurança, acessibilidade, performance, falhas de rede, conteúdo adversarial, observabilidade e regressão.

Gate:

- zero falha crítica conhecida;
- zero bypass de autorização conhecido;
- zero violação crítica/séria de acessibilidade nas rotas-alvo;
- métricas e limitações documentadas.

### Fase 9 — Deploy, demonstração e handoff

Objetivo: tornar o site standalone reproduzível por terceiro.

Saída:

- deploy Hostinger;
- build/versionamento;
- roteiro de demonstração;
- matriz de suporte;
- limitações conhecidas;
- evidências de QA;
- documentação da extensão como modo secundário;
- plano de integração futura.

## 3. Sequência dos épicos

Ordem atual:

1. EPIC-01 — Discovery e contratos do DOOL
2. EPIC-02 — Fundação e isolamento da extensão
3. EPIC-03 — Camada de adaptação e sessão
4. EPIC-04 — Design system, shell e acessibilidade
5. EPIC-04.5 — Índice Dimensional Público do DOOL
6. EPIC-04.6 — Plataforma Web Standalone + BFF
7. EPIC-05 — Home, edições e navegação
8. EPIC-06 — Explorar publicações + acervo oficial
9. EPIC-07 — Leitor HTML editorial
10. EPIC-08 — Identidade, autenticação, PDF, Jornal e autenticidade
11. EPIC-09 — Segurança, qualidade, performance e observabilidade
12. EPIC-10 — Deploy, demonstração e handoff

## 4. Critérios de priorização

Em caso de conflito de prazo:

1. segurança e autorização;
2. fidelidade documental;
3. integridade/temporalidade do índice;
4. leitura HTML;
5. busca e descoberta;
6. acessibilidade;
7. responsividade;
8. consistência visual;
9. cosmética.

## 5. Política de decisões

Classificação:

- **confirmadas:** evidência real ou decisão explícita;
- **hipóteses:** precisam de experimento;
- **adiadas:** não bloqueiam fase atual;
- **bloqueadoras:** impedem avanço de gate.

Nenhum endpoint, formato de token, login, página ou identidade deve aparecer como fato se ainda estiver na categoria de hipótese.

## 6. Política de implementação

- cada subsistema parte de sua spec;
- tarefas pequenas e verificáveis;
- TDD quando houver comportamento de código;
- falhas reproduzidas antes de correção;
- mudança arquitetural atualiza spec/ADR/roadmap antes do código;
- mocks/fixtures nunca são apresentados como integração real;
- código do site não deve acoplar UI diretamente ao MySQL ou aos endpoints legados;
- BFF não pode ser proxy genérico.

## 7. Marco de decisão atual

A arquitetura standalone está aprovada.

O próximo marco é **aprovar o design produzido a partir do handoff**. Depois disso, produzir os planos de implementação separados e iniciar execução em branch/worktree apropriado.

A implementação anterior do EPIC-05 permanece pausada até esse marco.
