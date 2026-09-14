# Novo DOOL Standalone Design Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir e validar o design completo do Novo DOOL standalone no Sites/Work/Codex sem alterar regras de negócio, arquitetura, contratos ou semântica dos dados.

**Architecture:** O design parte de uma aplicação web pública standalone na Hostinger, com BFF/API, índice dimensional histórico e DOOL oficial como fonte documental. A extensão Chromium é secundária. Esta etapa entrega arquitetura visual, telas, estados e decisões de UX; implementação funcional de backend/ingestão fica para planos separados após aprovação visual.

**Tech Stack:** Sites/Work/Codex para design; design system existente do EPIC-04; fixtures JSON em `docs/fixtures/design`; TypeScript/WXT existente apenas como referência visual durante esta etapa; alvo futuro web standalone ainda sem framework frontend congelado neste plano.

**Spec:** `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## Global Constraints

- Consulta pública não exige extensão nem autenticação própria.
- DOOL oficial permanece fonte documental e autoridade sobre recursos protegidos.
- “Explorar publicações” usa índice dimensional próprio e não pode ser apresentado como busca oficial.
- `source_start_page` só habilita PDF/Jornal quando `page_mapping_status = VALIDATED`.
- Não inventar macrogrupos de tipos de publicação.
- Não achatar hierarquia administrativa nem reescrever temporalidade histórica.
- Não criar segundo design system.
- Meta de acessibilidade: WCAG 2.2 AA nos fluxos implementados.
- Validar 320 px, 768 px, desktop e zoom 200%.
- Todo componente dependente de dados deve considerar estados INITIAL, LOADING, SUCCESS, EMPTY, PARTIAL, ERROR_RECOVERABLE, ERROR_BLOCKING e OFFLINE/CACHED quando aplicável.
- Nenhum código funcional de backend, ingestão ou autenticação deve ser implementado durante esta etapa de design.

---

## File Structure

### Arquivos de referência

- `docs/design/HANDOFF-SITES.md` — porta de entrada para o agente de design.
- `docs/design/design-qa-gates.md` — gates de aceite visual/UX.
- `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md` — arquitetura congelada.
- `docs/specs/EPIC-04-design-system-shell-acessibilidade.md` — design system base.
- `docs/epic-04/gate-ui.md` — evidências do gate visual existente.
- `docs/fixtures/design/publications.json` — resultados sintéticos.
- `docs/fixtures/design/organizations.json` — árvore sintética/adversarial.
- `docs/fixtures/design/suggestions.json` — autocomplete/correção.
- `docs/fixtures/design/facets.json` — facetas/contagens.
- `docs/fixtures/design/states.json` — estados universais.

### Entregáveis a criar durante execução do design

- `docs/design/sites-screen-map.md` — mapa final de telas, rotas, views e estados.
- `docs/design/sites-component-inventory.md` — componentes reutilizados/estendidos/novos.
- `docs/design/sites-interaction-decisions.md` — decisões de interação e comportamentos críticos.
- `docs/design/sites-adversarial-review.md` — matriz dos gates G-D1 a G-D10 e evidências.

---

### Task 1: Carregar contexto e congelar invariantes de design

**Files:**
- Read: `docs/design/HANDOFF-SITES.md`
- Read: `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`
- Read: `docs/specs/EPIC-04-design-system-shell-acessibilidade.md`
- Read: `docs/epic-04/gate-ui.md`
- Create: `docs/design/sites-component-inventory.md`

**Interfaces:**
- Consumes: arquitetura aprovada, design system existente, gates do EPIC-04.
- Produces: inventário classificado em `reutilizado`, `estendido`, `novo`, sem duplicações de padrões existentes.

- [ ] **Step 1: Ler integralmente os quatro documentos obrigatórios**

Confirmar por escrito no artefato de trabalho estas invariantes:

```text
standalone é modo principal
extensão é secundária
DOOL é fonte documental
índice próprio != busca oficial
página não validada != ação PDF/Flip
sessão Novo DOOL != sessão DOOL
```

- [ ] **Step 2: Inspecionar os componentes/tokens reais do EPIC-04**

Classificar cada necessidade do novo design como:

```text
reutilizado
estendido
novo
```

- [ ] **Step 3: Criar `docs/design/sites-component-inventory.md`**

O documento deve conter pelo menos:

```text
shell/header/nav
botão/link
campo de busca
select/data
lista de edição
lista de resultado
checkbox/tri-state
árvore hierárquica
drawer/dialog
feedback loading/empty/error/partial
badge/status
reader chrome
```

- [ ] **Step 4: Verificar duplicações**

Falha do task se um componente novo reproduzir função já atendida pelo design system sem justificativa funcional.

- [ ] **Step 5: Commit**

```bash
git add docs/design/sites-component-inventory.md
git commit -m "docs: inventory components for standalone design"
```

---

### Task 2: Mapear telas, rotas, views e estados

**Files:**
- Create: `docs/design/sites-screen-map.md`
- Read: `docs/fixtures/design/states.json`

**Interfaces:**
- Consumes: inventário de componentes e arquitetura da informação.
- Produces: mapa que separa rota, view, componente e estado.

- [ ] **Step 1: Registrar as superfícies mínimas**

Incluir explicitamente:

```text
Home
Explorar publicações
Acervo completo
Leitor HTML
PDF
Jornal/Flip
```

- [ ] **Step 2: Mapear estados por superfície**

Para cada superfície dependente de dados, registrar quais destes estados se aplicam:

```text
INITIAL
LOADING
SUCCESS
EMPTY
PARTIAL
ERROR_RECOVERABLE
ERROR_BLOCKING
OFFLINE/CACHED
```

- [ ] **Step 3: Separar rota de estado**

Não criar uma URL diferente apenas para loading, empty ou partial quando o comportamento for estado da mesma view.

- [ ] **Step 4: Incluir deep-links funcionais conceituais**

Registrar os parâmetros necessários para preservar contexto de exploração e edição sem expor segredos.

- [ ] **Step 5: Commit**

```bash
git add docs/design/sites-screen-map.md
git commit -m "docs: map standalone screens and states"
```

---

### Task 3: Projetar a Home editorial

**Files:**
- Modify: artefato visual do Sites correspondente à Home.
- Update: `docs/design/sites-interaction-decisions.md`

**Interfaces:**
- Consumes: EPIC-05 reespecificado e fixtures de edição disponíveis no projeto.
- Produces: Home que prioriza edição do dia e entrada para exploração.

- [ ] **Step 1: Criar composição desktop da Home**

Ordem de importância:

```text
marca/instituição
edição do dia
ler HTML
PDF/Jornal
suplementos/extras
Explorar publicações
Acervo completo
```

- [ ] **Step 2: Criar estados principal/suplemento/extra**

Garantir que as variações sejam inequívocas e não pareçam edições distintas sem relação.

- [ ] **Step 3: Criar estado sem edição e erro de índice**

Erro do índice não pode inutilizar a edição do dia.

- [ ] **Step 4: Criar composição mobile**

Nenhuma ação essencial pode desaparecer.

- [ ] **Step 5: Registrar decisões em `sites-interaction-decisions.md`**

Incluir hierarquia visual, ações primária/secundárias e tratamento de falhas.

- [ ] **Step 6: Revisar contra G-D2 e G-D8**

Esperado: PASS antes de seguir.

---

### Task 4: Projetar “Explorar publicações” e resultados

**Files:**
- Modify: artefatos visuais do Sites para exploração.
- Read: `docs/fixtures/design/publications.json`
- Read: `docs/fixtures/design/facets.json`
- Update: `docs/design/sites-interaction-decisions.md`

**Interfaces:**
- Consumes: contrato da API dimensional e fixtures de resultados/facetas.
- Produces: experiência de pesquisa editorial, não dashboard BI.

- [ ] **Step 1: Criar layout desktop**

Estrutura mínima:

```text
busca + período + total
filtros laterais | resultados
```

- [ ] **Step 2: Criar lista estruturada de resultados**

Exibir título como primário; linhagem, data, edição, caderno, tipo e página como informação secundária.

- [ ] **Step 3: Representar resultado VALIDATED**

Ações:

```text
Ler em HTML
PDF · pág. N
Jornal · pág. N
```

- [ ] **Step 4: Representar resultado sem página validada**

Exibir somente HTML e mensagem “Página no PDF/Jornal não identificada”.

- [ ] **Step 5: Criar zero resultado, partial e error recoverable**

Erro recuperável deve oferecer `Tentar novamente` e, quando aplicável, `Pesquisar no acervo completo`.

- [ ] **Step 6: Criar layout mobile**

Filtros devem abrir por botão com quantidade ativa em drawer/dialog acessível.

- [ ] **Step 7: Revisar contra G-D3, G-D4 e G-D6**

Esperado: PASS.

---

### Task 5: Projetar filtros hierárquicos e autocomplete

**Files:**
- Read: `docs/fixtures/design/organizations.json`
- Read: `docs/fixtures/design/suggestions.json`
- Modify: artefatos do Sites para árvore/autocomplete.
- Update: `docs/design/sites-interaction-decisions.md`

**Interfaces:**
- Consumes: árvore recursiva, tri-state e contrato de sugestão.
- Produces: controles compreensíveis em teclado, touch e leitor de tela.

- [ ] **Step 1: Projetar árvore de órgãos com tri-state**

Cobrir:

```text
pai selecionado
descendente excluído
pai indeterminado
Somente órgão principal
Selecionar todas
Limpar
```

- [ ] **Step 2: Testar visualmente profundidade >= 6**

O layout não pode depender de indentação ilimitada ou largura fixa.

- [ ] **Step 3: Projetar tipos de publicação**

Manter lista plana na v1 quando a fonte não demonstrar hierarquia.

- [ ] **Step 4: Projetar autocomplete**

Diferenciar termo, frase, título e “Você quis dizer?”.

- [ ] **Step 5: Garantir ação explícita na correção ortográfica**

Nenhuma sugestão deve parecer consulta já alterada.

- [ ] **Step 6: Revisar contra G-D3, G-D5 e G-D9**

Esperado: PASS.

---

### Task 6: Projetar leitores, continuidade de formato e cache

**Files:**
- Read: `docs/fixtures/design/states.json`
- Modify: artefatos do Sites para HTML/PDF/Jornal.
- Update: `docs/design/sites-interaction-decisions.md`

**Interfaces:**
- Consumes: `publicationId`, `editionId`, `source_start_page`, cache 24h.
- Produces: experiência contínua entre representações sem alterar fonte documental.

- [ ] **Step 1: Projetar leitor HTML atualizado**

Conteúdo oficial deve ser protagonista e chrome discreto.

- [ ] **Step 2: Projetar fallback stale**

Copy obrigatória em essência:

```text
Conteúdo salvo na última visualização.
Não foi possível atualizar o conteúdo agora.
```

Exibir timestamp quando disponível.

- [ ] **Step 3: Projetar transição HTML -> PDF -> Jornal**

Manter contexto da publicação/página.

- [ ] **Step 4: Projetar estado de recurso protegido**

Copy:

```text
Este recurso exige acesso pelo Diário Oficial.
[Acessar pelo Diário Oficial]
```

Não desenhar login oficial próprio nesta etapa.

- [ ] **Step 5: Revisar contra G-D4 e G-D7**

Esperado: PASS.

---

### Task 7: Validar responsividade e acessibilidade

**Files:**
- Update: `docs/design/sites-adversarial-review.md`

**Interfaces:**
- Consumes: todas as telas aprovadas provisoriamente.
- Produces: evidência de G-D8/G-D9.

- [ ] **Step 1: Validar 320–767 px**

Checar scroll horizontal, ações essenciais, árvore e drawers.

- [ ] **Step 2: Validar 768–1199 px**

Checar reorganização de filtros/resultados e densidade.

- [ ] **Step 3: Validar >=1200 px**

Checar aproveitamento de largura sem linhas excessivamente longas.

- [ ] **Step 4: Validar zoom 200%**

Nenhuma ação ou conteúdo essencial pode ficar sobreposto/inacessível.

- [ ] **Step 5: Validar teclado**

Cobrir navegação global, busca, árvore tri-state, drawer/dialog e ações dos resultados.

- [ ] **Step 6: Validar reduced motion e contraste**

Informação não pode depender de animação ou cor.

- [ ] **Step 7: Registrar evidências em `sites-adversarial-review.md`**

Usar PASS/FAIL e link/captura de evidência por gate.

---

### Task 8: Executar revisão adversarial final do design

**Files:**
- Update: `docs/design/sites-adversarial-review.md`
- Read: `docs/design/design-qa-gates.md`

**Interfaces:**
- Consumes: design completo.
- Produces: decisão de pronto/não pronto para implementação.

- [ ] **Step 1: Executar os casos adversariais obrigatórios**

Cobrir pelo menos:

```text
órgão com 6 níveis
nome muito longo
0 resultados
10.000 resultados
seleção parcial profunda
página ausente
índice atrasado
DOOL indisponível
cache stale
principal + suplemento + extra
rede lenta
320 px
zoom 200%
teclado
reduced motion
```

- [ ] **Step 2: Classificar cada achado**

Usar:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

- [ ] **Step 3: Resolver todos os bloqueadores**

CRITICAL e HIGH incompatíveis com os gates devem ser corrigidos antes do freeze.

- [ ] **Step 4: Preencher matriz G-D1 a G-D10**

Todos devem estar PASS para aprovação final do design.

- [ ] **Step 5: Commit documental do gate**

```bash
git add docs/design/sites-adversarial-review.md docs/design/sites-interaction-decisions.md docs/design/sites-screen-map.md docs/design/sites-component-inventory.md
git commit -m "docs: freeze standalone Novo DOOL design decisions"
```

---

### Task 9: Abrir o próximo planejamento de engenharia

**Files:**
- Create em etapa futura: planos separados para EPIC-04.5, EPIC-04.6 e integração visual.

**Interfaces:**
- Consumes: design aprovado e arquitetura congelada.
- Produces: planos de implementação independentes e testáveis.

- [ ] **Step 1: Confirmar design aprovado**

Não iniciar plano de código se algum G-D1..G-D10 estiver FAIL.

- [ ] **Step 2: Criar três planos separados**

```text
1. índice dimensional + ingestão
2. plataforma standalone + BFF
3. frontend/design implementation
```

- [ ] **Step 3: Cada plano deve seguir TDD, commits pequenos e contratos desta spec**

Nenhum plano pode alterar as invariantes arquiteturais sem reabrir brainstorming/revisão de arquitetura.

## Self-Review

### Spec coverage

Cobertura explícita incluída para:

- modo standalone;
- Home;
- exploração dimensional;
- hierarquia;
- autocomplete;
- `source_start_page`;
- HTML/PDF/Flip;
- cache stale;
- busca oficial separada;
- responsividade;
- acessibilidade;
- estados universais;
- revisão adversarial.

### Placeholder scan

O plano não contém `TBD`, `TODO`, “implementar depois” ou passos sem saída verificável. Framework de implementação não é escolhido porque este plano encerra no design; a escolha pertence ao plano de engenharia posterior.

### Consistência

Os nomes de estados, `page_mapping_status`, “Explorar publicações”, `source_start_page` e a separação entre sessão própria/oficial seguem a especificação aprovada.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-14-novo-dool-design-handoff.md`.

Duas opções de execução após revisão:

1. **Subagent-Driven (recommended)** — tarefas de design executadas com revisão entre etapas.
2. **Inline Execution** — execução no Work/Codex em lotes com checkpoints.

Para esta fase, o ponto de entrada do agente permanece `docs/design/HANDOFF-SITES.md`.
