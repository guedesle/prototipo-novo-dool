# EPIC-04 Design System, Shell e Acessibilidade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a base visual, semântica e interacional reutilizável do Novo DOOL com shell responsivo, componentes essenciais e WCAG 2.2 AA como alvo nos fluxos cobertos.

**Architecture:** Manter o WXT MV3 e o Shadow DOM do EPIC-02 como fronteira de isolamento. `src/ui/**` passa a concentrar tokens, componentes e utilitários de acessibilidade; `src/foundation/shell.ts` compõe esses elementos sem incorporar regras de negócio ou endpoints. O CSS legado permanece fora do Shadow DOM e o CSS do protótipo utiliza tokens semânticos em vez de valores arbitrários nas telas.

**Tech Stack:** TypeScript 7, WXT 0.21, Manifest V3, DOM nativo, CSS custom properties, Vitest 4, happy-dom.

**Spec:** `docs/specs/EPIC-04-design-system-shell-acessibilidade.md`

## Global Constraints

- Meta: WCAG 2.2 AA nos fluxos implementados.
- HTML semântico nativo tem precedência sobre ARIA customizada.
- Viewport mínimo coberto: 320 px; validar também 768 px, desktop comum e tela ampla.
- Zoom de 200% não pode remover conteúdo ou ações prioritárias.
- `prefers-reduced-motion` deve reduzir/desativar motion não essencial.
- Nenhuma ação essencial pode desaparecer em mobile.
- Preferências de leitura não podem alterar o conteúdo semântico do ato.
- Não criar identidade visual institucional definitiva sem insumos oficiais.
- Não introduzir framework visual; a base atual permanece vanilla + Shadow DOM.
- Componentes deste épico não conhecem endpoints, cookies, sessão ou regras de negócio.

---

### Task 1: Tokens semânticos e contrato de contraste

**Files:**
- Create: `src/ui/tokens.css`
- Create: `src/ui/contrast.ts`
- Create: `tests/ui/tokens.test.ts`
- Modify: `src/foundation/dool.css`

**Interfaces:**
- Produces: CSS custom properties `--dool-*` para cor, tipografia, espaço, borda, elevação, foco e motion.
- Produces: `contrastRatio(foreground: string, background: string): number` para testes dos pares críticos.

- [ ] **Step 1: Write failing tests** que exigem os tokens essenciais, proíbem cores hexadecimais arbitrárias no CSS do shell e validam contraste >= 4.5:1 para texto normal e >= 3:1 para foco/componentes gráficos.
- [ ] **Step 2: Run `npm test -- tests/ui/tokens.test.ts`** e confirmar RED por ausência de `src/ui/tokens.css`/`contrast.ts`.
- [ ] **Step 3: Implement minimal tokens and contrast utility** sem criar temas ou variantes não usadas.
- [ ] **Step 4: Refactor `dool.css`** para consumir tokens.
- [ ] **Step 5: Run tests, typecheck and build** e confirmar GREEN.
- [ ] **Step 6: Commit** `feat: establish accessible semantic design tokens`.

### Task 2: Primitivos semânticos reutilizáveis

**Files:**
- Create: `src/ui/elements.ts`
- Create: `src/ui/states.ts`
- Create: `tests/ui/elements.test.ts`
- Create: `tests/ui/states.test.ts`

**Interfaces:**
- Produces: `createButton(options)`, `createLink(options)`, `createField(options)` e `createStatusView(options)` usando DOM nativo.
- Consumes: tokens do Task 1 somente por classes CSS, sem regras de negócio.

- [ ] **Step 1: Write failing tests** para `button` real, `a` real, associação `label`/campo, `aria-describedby` em erro e estados loading/empty/error/success com texto e ação de recuperação quando aplicável.
- [ ] **Step 2: Run focused tests** e confirmar RED por módulos ausentes.
- [ ] **Step 3: Implement minimal native DOM primitives** sem abstrações genéricas além das necessidades dos épicos 5–8.
- [ ] **Step 4: Run focused and full tests** e confirmar GREEN.
- [ ] **Step 5: Commit** `feat: add semantic UI primitives and universal states`.

### Task 3: Shell global, landmarks e skip link

**Files:**
- Modify: `src/foundation/shell.ts`
- Modify: `src/foundation/dool.css`
- Modify: `tests/foundation/shell.test.ts`
- Create: `tests/ui/shell-accessibility.test.ts`

**Interfaces:**
- Consumes: primitivos do Task 2.
- Produces: shell com `header`, `nav`, `main`, skip link e região de status estrutural.

- [ ] **Step 1: Write failing tests** que montam o shell em happy-dom e exigem exatamente um `main`, skip link apontando para o conteúdo, `nav` rotulado, hierarquia de heading coerente, botão de interface original operável e ausência de `tabindex` positivo.
- [ ] **Step 2: Run tests** e confirmar RED no shell técnico atual.
- [ ] **Step 3: Implement semantic shell** preservando `switchToOriginal()` e o contrato do EPIC-02.
- [ ] **Step 4: Run tests/typecheck/build** e confirmar GREEN.
- [ ] **Step 5: Commit** `feat: make prototype shell semantic and keyboard-first`.

### Task 4: Responsividade, reflow, foco e reduced motion

**Files:**
- Modify: `src/foundation/dool.css`
- Create: `tests/ui/responsive-css.test.ts`

**Interfaces:**
- Produces: regras de CSS para 320 px, reflow 200%, foco visível e reduced motion.

- [ ] **Step 1: Write failing source-contract tests** exigindo `overflow-wrap`, containers fluidos, ausência de larguras mínimas destrutivas, alvos mínimos, `:focus-visible` e media query `prefers-reduced-motion`.
- [ ] **Step 2: Run test** e confirmar RED nos requisitos ausentes.
- [ ] **Step 3: Implement minimal responsive/focus CSS** com layout fluido, sem esconder ações em mobile.
- [ ] **Step 4: Run full verification** e confirmar GREEN.
- [ ] **Step 5: Commit** `feat: harden shell reflow focus and reduced motion`.

### Task 5: Preferências de leitura compartilháveis

**Files:**
- Create: `src/ui/reading-preferences.ts`
- Create: `tests/ui/reading-preferences.test.ts`

**Interfaces:**
- Produces: `ReadingPreferences`, `DEFAULT_READING_PREFERENCES`, `normalizeReadingPreferences(input)` e `readingPreferenceClassNames(preferences)`.
- Não persiste configuração; o EPIC-07 decidirá integração/persistência usando este contrato.

- [ ] **Step 1: Write failing tests** para escala tipográfica limitada, largura de leitura limitada e preferência de espaçamento sem transformação do texto editorial.
- [ ] **Step 2: Confirm RED** por módulo ausente.
- [ ] **Step 3: Implement pure preference normalization** sem tocar em HTML de atos.
- [ ] **Step 4: Run tests/typecheck** e confirmar GREEN.
- [ ] **Step 5: Commit** `feat: define safe shared reading preferences`.

### Task 6: Auditoria automatizada de acessibilidade estrutural

**Files:**
- Create: `scripts/audit-ui-accessibility.mjs`
- Create: `tests/ui/accessibility-audit.test.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: gate CI que falha quando invariantes críticos do shell/base são removidos.

- [ ] **Step 1: Write failing test** exigindo script e passo de CI.
- [ ] **Step 2: Confirm RED** por script/passo ausente.
- [ ] **Step 3: Implement auditor** para detectar: outline global removido sem substituição, `tabindex` positivo no runtime, controles sem texto/nome nos templates do shell, ausência de skip link/landmarks, motion não protegido e cores arbitrárias fora de tokens.
- [ ] **Step 4: Add CI step** após build/auditorias existentes.
- [ ] **Step 5: Run complete pipeline** e confirmar GREEN.
- [ ] **Step 6: Commit** `ci: enforce base UI accessibility contracts`.

### Task 7: Gate de UI e revisão adversarial

**Files:**
- Create: `docs/epic-04/gate-ui.md`
- Modify: issue `#4` with evidence comment.

**Interfaces:**
- Consumes: resultados de todos os testes e auditores anteriores.

- [ ] **Step 1: Review adversarial cases**: texto/título longo, palavra sem espaço, 320 px, reflow, teclado, foco, loading/disabled, múltiplos erros e reduced motion.
- [ ] **Step 2: Run final pipeline**: `npm test`, `npm run typecheck`, `npm run build`, manifest audit, adapter-boundary audit e UI-accessibility audit.
- [ ] **Step 3: Compare branch against `main`** e confirmar que nenhum endpoint/regra de negócio entrou em `src/ui/**`.
- [ ] **Step 4: Document evidence and known limitations** em `docs/epic-04/gate-ui.md`.
- [ ] **Step 5: Open PR, require PR CI, then merge only if green**.
