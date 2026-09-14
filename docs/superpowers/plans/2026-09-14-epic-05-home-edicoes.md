# EPIC-05 Home, Edições e Navegação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a home técnica do protótipo por uma home funcional do Novo DOOL que trate edição como entidade principal, apresente Principal/Suplementos/Extras, navegue pelas datas comprovadas no catálogo recente e respeite capacidades reais para HTML/PDF/Jornal.

**Architecture:** Manter WXT MV3 + Shadow DOM + vanilla DOM. `src/features/home/**` concentra modelo, controller, estado de navegação e view; a feature consome apenas contratos de `src/adapters/**`. Nenhum endpoint legado entra na camada de UI. O histórico deste épico é limitado às datas presentes em `EditionRepository.getLatest()`; `getByDate()` continua bloqueado para consulta arbitrária, pois esse contrato não foi comprovado.

**Tech Stack:** TypeScript, WXT 0.21.4, Vitest 4.1.11, happy-dom, CSS nativo, GitHub Actions.

**Spec:** `docs/specs/EPIC-05-home-edicoes-navegacao.md`

## Global Constraints

- A UI não chama endpoint DOOL diretamente; somente adapters podem conhecer contratos legados.
- Estado de capacidade `unknown` nunca é promovido a disponível.
- HTML consultivo deve ser distinguido de PDF/Jornal/documento oficial sem alarmismo.
- O seletor histórico usa somente datas efetivamente presentes no catálogo `getLatest()`; consulta arbitrária por data permanece fora deste incremento.
- A ordem de datas/edições preserva a ordem retornada pelo backend; não reordenar com timezone local.
- Principal/Suplemento/Extra são variações da entidade edição/data, não formatos independentes.
- Falha de feature não pode remover a ação “Interface original” nem reativar parcialmente o DOM legado.
- 320 px, 768 px, desktop, teclado e reduced motion continuam gates obrigatórios.
- Nenhuma nova dependência de runtime é necessária.

---

### Task 1: Modelo puro da home e gating de capacidades

**Files:**
- Create: `src/features/home/model.ts`
- Create: `tests/features/home/model.test.ts`

**Interfaces:**
- Consumes: `Edition`, `AccessState`, `CapabilityState` de `src/adapters/types.ts`.
- Produces:
  - `type HomeFormat = 'html' | 'pdf' | 'journal'`
  - `type HomeActionState = 'available' | 'unavailable' | 'unknown'`
  - `interface HomeEditionView`
  - `interface HomeDateOption`
  - `interface HomeViewModel`
  - `buildHomeViewModel(editions: Edition[], access: AccessState, selectedDate?: string): HomeViewModel`

- [ ] **Step 1: escrever testes RED para agrupamento e capacidades**

Criar casos com Principal + Suplemento na mesma data, múltiplas datas, lista vazia, data selecionada inexistente e combinações `available/unavailable/unknown`.

```ts
const access: AccessState = {
  identityState: 'anonymous',
  subscriptionState: 'unknown',
  capabilities: {
    readHtml: 'available',
    downloadPdf: 'unknown',
    openJournal: 'unavailable',
    accessCertifiedArchive: 'unknown',
  },
};

expect(buildHomeViewModel(editions, access)).toMatchObject({
  status: 'ready',
  selectedDate: '05/09/2026',
  editions: [
    {
      id: '22502',
      kind: 'principal',
      actions: {
        html: { state: 'available' },
        pdf: { state: 'unknown' },
        journal: { state: 'unavailable' },
      },
    },
  ],
});
```

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/features/home/model.test.ts`
Expected: FAIL por `src/features/home/model` ausente.

- [ ] **Step 3: implementar modelo mínimo**

Regras exatas:

```ts
function actionState(exists: boolean, capability: CapabilityState): HomeActionState {
  if (!exists || capability === 'unavailable') return 'unavailable';
  if (capability === 'available') return 'available';
  return 'unknown';
}
```

`selectedDate` padrão = `editions[0]?.date`; opções de data são deduplicadas preservando primeira ocorrência; seleção inexistente retorna `status: 'empty'`, mantendo `dateOptions` para recuperação.

- [ ] **Step 4: executar GREEN e suite completa**

Run: `npx vitest run tests/features/home/model.test.ts && npm test`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/features/home/model.ts tests/features/home/model.test.ts
git commit -m "feat: add home edition presentation model"
```

---

### Task 2: Estado de navegação histórica no hash da extensão

**Files:**
- Create: `src/features/home/navigation-state.ts`
- Create: `tests/features/home/navigation-state.test.ts`

**Interfaces:**
- Produces:
  - `parseHomeHash(hash: string): { selectedDate?: string }`
  - `formatHomeHash(selectedDate?: string): string`
  - prefixo estável `#novo-dool/date/`

- [ ] **Step 1: escrever testes RED**

Cobrir data backend `05/09/2026`, hash vazio, hash de outro produto, caracteres inválidos e round-trip codificado.

```ts
expect(formatHomeHash('05/09/2026')).toBe('#novo-dool/date/05%2F09%2F2026');
expect(parseHomeHash('#novo-dool/date/05%2F09%2F2026')).toEqual({ selectedDate: '05/09/2026' });
expect(parseHomeHash('#qualquer-coisa')).toEqual({});
```

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/features/home/navigation-state.test.ts`
Expected: FAIL por módulo ausente.

- [ ] **Step 3: implementar parser/formatter puro**

Não converter data, não aplicar timezone e não validar calendário; tratar o valor como identificador textual retornado pelo backend.

- [ ] **Step 4: executar GREEN**

Run: `npx vitest run tests/features/home/navigation-state.test.ts && npm test`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/features/home/navigation-state.ts tests/features/home/navigation-state.test.ts
git commit -m "feat: add extension-owned home navigation state"
```

---

### Task 3: Resolver de destinos oficiais dentro da fronteira de adapters

**Files:**
- Create: `src/adapters/navigation.ts`
- Create: `tests/adapters/navigation.test.ts`
- Modify: `src/adapters/contracts.ts`

**Interfaces:**
- Produces:
  - `type EditionTargetFormat = 'html' | 'pdf' | 'journal'`
  - `interface NavigationTargetResolver { resolveEditionTarget(editionId: string, format: EditionTargetFormat): Promise<string>; searchTarget(): string; }`
  - `class DoolNavigationTargetResolver implements NavigationTargetResolver`
- Consumes: `DocumentRepository.getByEdition(editionId)`.

- [ ] **Step 1: escrever testes RED**

```ts
await expect(resolver.resolveEditionTarget('22502', 'html'))
  .resolves.toBe('/ver-html/22502/');
await expect(resolver.resolveEditionTarget('22502', 'pdf'))
  .resolves.toBe('/portal/edicoes/download/22502');
await expect(resolver.resolveEditionTarget('22502', 'journal'))
  .resolves.toBe('/ver-flip/22502/');
expect(resolver.searchTarget()).toBe('/buscanova/');
```

Adicionar caso em que descriptor não possui URL pedida e exigir `AdapterError('NOT_FOUND')`.

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/adapters/navigation.test.ts`
Expected: FAIL por módulo ausente.

- [ ] **Step 3: implementar resolver**

O literal `/ver-html/` e os destinos oficiais permanecem em `src/adapters/**`, preservando o auditor de fronteira. PDF/Jornal reutilizam `DocumentRepository`; não reconstruir URLs de documento na UI.

- [ ] **Step 4: executar GREEN + auditor de fronteira**

Run: `npx vitest run tests/adapters/navigation.test.ts && node scripts/audit-adapter-boundary.mjs`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/adapters/navigation.ts src/adapters/contracts.ts tests/adapters/navigation.test.ts
git commit -m "feat: add official edition navigation resolver"
```

---

### Task 4: Controller da home

**Files:**
- Create: `src/features/home/controller.ts`
- Create: `tests/features/home/controller.test.ts`

**Interfaces:**
- Consumes: `EditionRepository`, `SessionProvider`, `NavigationTargetResolver`.
- Produces:
  - `class HomeController`
  - `load(selectedDate?: string): Promise<HomeViewModel>`
  - `refreshAccess(selectedDate?: string): Promise<HomeViewModel>`
  - `resolveAction(editionId: string, format: HomeFormat, view: HomeViewModel): Promise<string>`

- [ ] **Step 1: escrever testes RED**

Cobrir:
- `load()` chama `getLatest()` + `getAccessState()`;
- `refreshAccess()` chama `session.invalidate()` antes de recarregar;
- ação `unknown` ou `unavailable` é rejeitada com `UNSUPPORTED_OPERATION` sem resolver URL;
- ação `available` resolve destino correto;
- falha de adapter é propagada tipada para a view decidir o estado.

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/features/home/controller.test.ts`
Expected: FAIL por módulo ausente.

- [ ] **Step 3: implementar controller mínimo**

Não armazenar DOM, URL global ou cookie no controller. Ele é apenas orquestração de contratos e modelo puro.

- [ ] **Step 4: executar GREEN**

Run: `npx vitest run tests/features/home/controller.test.ts && npm test`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/features/home/controller.ts tests/features/home/controller.test.ts
git commit -m "feat: add home controller"
```

---

### Task 5: View funcional da home

**Files:**
- Create: `src/features/home/view.ts`
- Create: `src/features/home/home.css`
- Create: `tests/features/home/view.test.ts`
- Modify: `src/foundation/dool.css`

**Interfaces:**
- Produces:
  - `mountHomeView(main: HTMLElement, deps: HomeViewDependencies): { destroy(): void }`
- `HomeViewDependencies` contém `controller`, `location`, `history` e `navigate(target: string)` injetáveis para teste.

- [ ] **Step 1: escrever testes RED de DOM**

Usar `happy-dom`. Cobrir:
- loading inicial com texto;
- edição principal e suplemento na mesma data;
- um único `h1` de página continua pertencendo ao shell; a home usa `h2`/seções;
- HTML disponível gera botão/link operável;
- PDF `unknown` aparece como “Acesso a confirmar” e não é acionável;
- Jornal `unavailable` aparece como indisponível e não é acionável;
- ausência de extras não cria card vazio;
- data via hash seleciona grupo correto;
- deep link de data inexistente gera estado vazio com recuperação;
- mudança do `select` usa `history.pushState` e rerenderiza sem rede adicional;
- ação “Pesquisar no acervo” navega para o destino do resolver;
- erro de rede mostra estado de erro com ação “Tentar novamente”.

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/features/home/view.test.ts`
Expected: FAIL por módulos ausentes.

- [ ] **Step 3: implementar view e CSS**

Estrutura mínima:

```text
section.home-hero
  h2 "Diário Oficial do Estado da Bahia"
  resumo da edição selecionada
section.home-date-navigation
  label + select de datas comprovadas
section.home-editions
  article por Principal/Suplemento/Extra
    número + data + tipo
    ação primária HTML
    estados secundários PDF/Jornal
nav.home-secondary-navigation
  "Pesquisar no acervo"
```

Não inserir HTML de publicação. Não usar `innerHTML` para conteúdo vindo do backend.

- [ ] **Step 4: executar GREEN + auditoria de UI**

Run: `npx vitest run tests/features/home/view.test.ts && node scripts/audit-ui-accessibility.mjs && npm test`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/features/home/view.ts src/features/home/home.css src/foundation/dool.css tests/features/home/view.test.ts
git commit -m "feat: render functional Novo DOOL home"
```

---

### Task 6: Conteúdo plugável no shell e composição no entrypoint

**Files:**
- Modify: `src/foundation/shell.ts`
- Modify: `entrypoints/dool.content.ts`
- Modify: `tests/foundation/shell.test.ts`
- Modify: `tests/ui/shell-accessibility.test.ts`
- Modify: `tests/foundation/manifest.test.ts`
- Create: `tests/features/home/entrypoint-integration.test.ts`

**Interfaces:**
- `mountPrototypeShell(...)` recebe renderer opcional de conteúdo e continua retornando `MountedShell`.
- Para `route.kind === 'home'`, entrypoint cria `DoolHttpClient`, `DoolEditionRepository`, `DoolSessionProvider`, `DoolDocumentRepository`, `DoolNavigationTargetResolver`, `HomeController` e monta `mountHomeView`.
- Demais rotas mantêm placeholder técnico até seus épicos.

- [ ] **Step 1: escrever RED de integração**

Exigir que:
- home não renderize mais “Nova camada de interface isolada”;
- shell continue com skip link, header, `main` e “Interface original”;
- `destroy()` destrua também a feature montada;
- entrada `/` use adapters, sem backend literals na feature/entrypoint;
- isolamento legado aconteça somente após `ui.mount()` bem-sucedido;
- erro de home não remove o shell nem reativa o legado.

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/features/home/entrypoint-integration.test.ts tests/foundation/shell.test.ts tests/ui/shell-accessibility.test.ts`
Expected: FAIL pelas novas expectativas de composição.

- [ ] **Step 3: implementar composição**

O shell fornece estrutura; a home fornece conteúdo. Não duplicar header/skip link dentro da feature.

- [ ] **Step 4: executar GREEN + pipeline local disponível**

Run: `npm test && npm run typecheck && npm run build && node scripts/audit-manifest.mjs .output/chrome-mv3/manifest.json && node scripts/audit-adapter-boundary.mjs && node scripts/audit-ui-accessibility.mjs`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/foundation/shell.ts entrypoints/dool.content.ts tests/foundation/shell.test.ts tests/ui/shell-accessibility.test.ts tests/foundation/manifest.test.ts tests/features/home/entrypoint-integration.test.ts
git commit -m "feat: integrate functional home into prototype shell"
```

---

### Task 7: Navegação back/forward/refresh e atualização de sessão

**Files:**
- Modify: `src/features/home/view.ts`
- Modify: `tests/features/home/view.test.ts`

**Interfaces:**
- View escuta `hashchange`/`popstate` do `window` injetado e remove listeners em `destroy()`.
- Botão “Atualizar disponibilidade” chama `controller.refreshAccess(selectedDate)`.

- [ ] **Step 1: escrever testes RED**

Cobrir:
- hash de data persiste em refresh porque está na URL;
- `popstate/hashchange` restaura data sem nova leitura do catálogo quando o catálogo já está em memória;
- deep link inválido gera empty state, não exception;
- atualização de disponibilidade invalida sessão e preserva data selecionada;
- listeners são removidos em `destroy()`.

- [ ] **Step 2: executar RED**

Run: `npx vitest run tests/features/home/view.test.ts`
Expected: FAIL somente nas novas expectativas.

- [ ] **Step 3: implementar listeners e refresh de capacidade**

Nenhum polling e nenhuma leitura direta de cookie.

- [ ] **Step 4: executar GREEN**

Run: `npx vitest run tests/features/home/view.test.ts && npm test`
Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/features/home/view.ts tests/features/home/view.test.ts
git commit -m "feat: preserve home context across browser navigation"
```

---

### Task 8: Gate G5 e smoke test real

**Files:**
- Create: `docs/epic-05/gate-home.md`
- Create: `docs/epic-05/manual-smoke-result-template.md`
- Modify: `wxt.config.ts`

**Interfaces:**
- Bump de versão para `0.2.0` somente após pipeline funcional verde.

- [ ] **Step 1: bump version e executar pipeline completo**

Run:

```bash
npm test
npm run typecheck
npm run build
node scripts/audit-manifest.mjs .output/chrome-mv3/manifest.json
node scripts/audit-adapter-boundary.mjs
node scripts/audit-ui-accessibility.mjs
```

Expected: todos verdes no mesmo head.

- [ ] **Step 2: smoke manual em Chrome**

Registrar:
- H01 Principal atual abre HTML correto;
- H02 Principal + Suplemento/Extra aparecem sem ambiguidade quando presentes;
- H03 seletor troca entre datas do catálogo recente;
- H04 deep link de data inexistente mostra estado vazio recuperável;
- H05 PDF/Jornal não aparecem como liberados em capacidade `unknown`;
- H06 320 px sem perda de ações;
- H07 768 px sem perda de ações;
- H08 desktop sem sobreposição;
- H09 fluxo principal por teclado;
- H10 back/forward/refresh preservam contexto selecionado;
- H11 “Interface original” restaura integralmente o DOOL legado;
- H12 “Pesquisar no acervo” chega à rota correta sem conceder funcionalidade do EPIC-06 antecipadamente.

- [ ] **Step 3: revisão adversarial final**

Confirmar explicitamente:
- zero edições;
- somente Principal;
- Principal + 1 variação;
- múltiplas variações;
- metadado opcional ausente;
- formatos parciais;
- estado `unknown` nunca vira disponível;
- deep link inválido;
- erro de rede;
- destruição do shell durante request pendente não produz render tardio.

- [ ] **Step 4: CI do PR e merge somente com Gate G5 aprovado**

O PR permanece draft enquanto qualquer H01–H12 falhar.

---

## Self-review

### Spec coverage

- RF-05.1: Tasks 1, 4, 5.
- RF-05.2: Tasks 1 e 5.
- RF-05.3: Tasks 1, 4, 5.
- RF-05.4: Tasks 1, 2, 5; limitado deliberadamente ao catálogo recente comprovado.
- RF-05.5: Tasks 2 e 7.
- RF-05.6: Tasks 1 e 5.
- CA-05-A/B/C/D: Tasks 1–6.
- CA-05-E/F: Tasks 5 e 8.

### Limite técnico explícito

`EditionRepository.getByDate()` continua `UNSUPPORTED_OPERATION`. O EPIC-05 não inventará parâmetros de consulta arbitrária por data. A seleção anterior é construída sobre `getLatest()` e seus valores reais; acervo amplo pertence ao EPIC-06.

### Placeholder scan

O plano não contém TODO/TBD nem passos sem comando/resultado esperado.

### Type consistency

`HomeFormat`, `HomeViewModel`, `NavigationTargetResolver`, `HomeController` e `mountHomeView` são definidos antes de serem consumidos em tarefas posteriores.
