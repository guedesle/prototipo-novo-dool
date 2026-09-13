# EPIC-02 — Fundação e isolamento da extensão — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma extensão Chromium Manifest V3 mínima, reversível e fail-open que monta um shell isolado apenas nas rotas autorizadas do DOOL, permite alternar nova/original e mantém diagnóstico local sanitizado.

**Architecture:** A extensão será construída com WXT e TypeScript, sem framework visual nesta etapa. Um content script restrito ao host `dool.egba.ba.gov.br` normaliza a rota e, apenas quando suportada e habilitada, monta um overlay dentro de Shadow Root; o DOM original não é removido nem reescrito. Preferências, kill switch e feature flags usam `browser.storage.local`; a lógica de estado e diagnóstico fica desacoplada da UI.

**Tech Stack:** Node.js >=22; WXT 0.21.4; Vite 7.3.6; TypeScript 7.0.2; Vitest 4.1.11; HTML/CSS/TypeScript vanilla; Manifest V3 para Chrome/Edge.

**Spec:** `docs/specs/EPIC-02-fundacao-isolamento-extensao.md`

## Global Constraints

- Não modificar backend do DOOL.
- Host inicial autorizado: `https://dool.egba.ba.gov.br/*`.
- Não interceptar rede por padrão.
- Não ler nem armazenar cookies, tokens, senhas ou PII.
- Não ocultar/remover o DOM original antes da confirmação de montagem.
- Preferir overlay Shadow Root a mutação do DOM legado.
- Em qualquer falha, a interface original deve permanecer utilizável.
- Rotas desconhecidas resultam em zero interferência funcional.
- Nenhuma feature flag pode simular autorização de backend.
- Login, cadastro, assinatura e conteúdo de negócio permanecem fora do EPIC-02.

---

## Estrutura de arquivos

```text
package.json
package-lock.json
tsconfig.json
wxt.config.ts
vitest.config.ts
entrypoints/
  dool.content.ts
  dool.content.css
  popup/
    index.html
    main.ts
    style.css
src/foundation/
  routes.ts
  settings.ts
  states.ts
  diagnostics.ts
  shell.ts
  bootstrap.ts
  version.ts
tests/foundation/
  routes.test.ts
  settings.test.ts
  states.test.ts
  diagnostics.test.ts
  bootstrap.test.ts
  manifest.test.ts
docs/epic-02/
  permissions.md
  manual-validation.md
  gate-g2.md
```

---

### Task 1: Scaffold WXT/MV3 e baseline de testes

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `wxt.config.ts`
- Create: `vitest.config.ts`
- Create: `tests/foundation/manifest.test.ts`
- Create: `docs/epic-02/permissions.md`

**Interfaces:**
- Produces: comandos `npm test`, `npm run typecheck`, `npm run build`, configuração MV3 e permissão mínima `storage`.

- [ ] **Step 1: Criar teste de manifesto/configuração**

O teste deve importar a configuração possível de validar e afirmar que o host suportado é somente `https://dool.egba.ba.gov.br/*`, que a versão alvo é MV3 no build Chromium e que não existem permissões de cookies, webRequest, downloads ou tabs.

- [ ] **Step 2: Executar o teste e confirmar falha pela ausência do projeto**

Run: `npm test -- tests/foundation/manifest.test.ts`
Expected: FAIL porque os arquivos/configuração ainda não existem.

- [ ] **Step 3: Criar package/toolchain mínimo**

Scripts obrigatórios:

```json
{
  "dev": "wxt --mv3",
  "build": "wxt build --mv3",
  "zip": "wxt zip --mv3",
  "test": "vitest run",
  "typecheck": "tsc --noEmit",
  "postinstall": "wxt prepare"
}
```

Dev dependencies fixadas no lockfile a partir de `wxt@0.21.4`, `vite@7.3.6`, `typescript@7.0.2` e `vitest@4.1.11`.

- [ ] **Step 4: Configurar WXT**

`wxt.config.ts` deve declarar nome `Novo DOOL — Protótipo`, descrição de protótipo, versão `0.1.0`, permissão `storage` e nenhuma host permission adicional além do match do content script.

- [ ] **Step 5: Documentar justificativa de permissões**

`permissions.md` deve justificar `storage` e registrar explicitamente permissões não solicitadas.

- [ ] **Step 6: Executar baseline**

Run: `npm install && npm test && npm run typecheck && npm run build`
Expected: todos exit 0.

- [ ] **Step 7: Commit**

`git commit -m "chore: scaffold Novo DOOL extension foundation"`

---

### Task 2: Normalização de host/rotas suportadas

**Files:**
- Create: `src/foundation/routes.ts`
- Create: `tests/foundation/routes.test.ts`

**Interfaces:**
- Produces: `normalizeRoute(url: URL): NormalizedRoute`; `isSupportedRoute(route): boolean`.

Rotas inicialmente suportadas:

```text
/
/buscanova/
/ver-html/{numericId}/
/ver-pdf/{numericId}/
/ver-flip/{numericId}/
/meus-dados
```

Explicitamente não suportadas: `/login`, `/cadastro`, `/esqueci-senha`, `/admin/*`, rotas desconhecidas e qualquer outro host.

- [ ] **Step 1: Escrever testes de matriz de rotas**

Cobrir host correto/incorreto, barra final, IDs não numéricos, query/hash e cada rota permitida/proibida.

- [ ] **Step 2: Executar e confirmar RED**

Run: `npm test -- tests/foundation/routes.test.ts`
Expected: FAIL por módulo ausente.

- [ ] **Step 3: Implementar normalizador puro**

Não acessar DOM nem APIs do navegador dentro de `routes.ts`.

- [ ] **Step 4: Executar GREEN + suite**

Run: `npm test -- tests/foundation/routes.test.ts && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

`git commit -m "feat: restrict extension to supported DOOL routes"`

---

### Task 3: Preferências persistentes, kill switch e feature flags

**Files:**
- Create: `src/foundation/settings.ts`
- Create: `tests/foundation/settings.test.ts`

**Interfaces:**

```ts
export type InterfaceMode = 'new' | 'original';
export interface FoundationSettings {
  globalEnabled: boolean;
  interfaceMode: InterfaceMode;
  flags: { foundationShell: boolean };
}
export async function loadSettings(): Promise<FoundationSettings>;
export async function saveSettings(patch: Partial<FoundationSettings>): Promise<FoundationSettings>;
export async function resetSettings(): Promise<FoundationSettings>;
```

Defaults: `globalEnabled=true`, `interfaceMode='new'`, `foundationShell=true`.

- [ ] **Step 1: Testar defaults, persistência e storage corrompido**

Corpo inválido, campos desconhecidos e tipos incorretos devem cair para defaults seguros sem lançar erro fatal.

- [ ] **Step 2: Confirmar RED**

Run: `npm test -- tests/foundation/settings.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar storage com `browser.storage.local`**

Persistir somente chaves do schema de configuração. Não criar mecanismo genérico de armazenamento de objetos arbitrários.

- [ ] **Step 4: Executar GREEN**

Run: `npm test -- tests/foundation/settings.test.ts && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

`git commit -m "feat: add local prototype settings and kill switch"`

---

### Task 4: Máquina de estados, diagnóstico sanitizado e bootstrap transacional

**Files:**
- Create: `src/foundation/states.ts`
- Create: `src/foundation/diagnostics.ts`
- Create: `src/foundation/bootstrap.ts`
- Create: `tests/foundation/states.test.ts`
- Create: `tests/foundation/diagnostics.test.ts`
- Create: `tests/foundation/bootstrap.test.ts`

**Interfaces:**

```ts
export type FoundationState =
  | 'UNSUPPORTED_ROUTE'
  | 'DISABLED'
  | 'BOOTING'
  | 'ACTIVE'
  | 'DEGRADED'
  | 'FAILED';

export interface DiagnosticEvent {
  timestamp: string;
  module: string;
  route: string;
  state: FoundationState;
  errorClass?: string;
  version: string;
}
```

`bootstrapFoundation` recebe dependências injetadas (`route`, `settings`, `mountShell`, `unmountShell`, `recordDiagnostic`) para ser testável sem página real.

- [ ] **Step 1: Escrever testes de transição**

Cobrir unsupported -> nenhuma montagem; disabled -> nenhuma montagem; sucesso -> ACTIVE; exceção antes/depois de mount -> FAILED + unmount seguro; mount parcial -> DEGRADED quando explicitamente retornado; múltiplas inicializações idempotentes.

- [ ] **Step 2: Testar sanitização do diagnóstico**

Garantir que URL é reduzida à rota normalizada e que mensagens/objetos arbitrários não são persistidos.

- [ ] **Step 3: Confirmar RED**

Run: `npm test -- tests/foundation/states.test.ts tests/foundation/diagnostics.test.ts tests/foundation/bootstrap.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implementar máquina de estados e bootstrap**

`BOOTING` nunca deve ocultar o original. Somente `ACTIVE` autoriza overlay visual ativo.

- [ ] **Step 5: Implementar ring buffer local de diagnóstico**

Máximo 50 eventos; schema fechado; sem request/response bodies.

- [ ] **Step 6: Executar GREEN**

Run: `npm test && npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

`git commit -m "feat: add fail-open foundation state machine"`

---

### Task 5: Shell Shadow Root, toggle e popup de controle

**Files:**
- Create: `src/foundation/shell.ts`
- Create: `src/foundation/version.ts`
- Create: `entrypoints/dool.content.ts`
- Create: `entrypoints/dool.content.css`
- Create: `entrypoints/popup/index.html`
- Create: `entrypoints/popup/main.ts`
- Create: `entrypoints/popup/style.css`
- Extend: `tests/foundation/bootstrap.test.ts`

**Interfaces:**
- Shadow host name: `novo-dool-prototype`.
- Shell expõe apenas: versão, rota normalizada, estado e botões `Interface original` / `Nova interface`.
- Popup expõe kill switch global, modo preferido e versão.

- [ ] **Step 1: Testar contrato de montagem/desmontagem**

Mockar `createShadowRootUi` ou a função de shell para provar que o DOM original não é removido e que unmount é idempotente.

- [ ] **Step 2: Implementar content script**

Match único: `https://dool.egba.ba.gov.br/*`; `cssInjectionMode='ui'`; usar `createShadowRootUi` com `isolateEvents=true`. Rotas não suportadas retornam antes da criação da UI.

- [ ] **Step 3: Implementar overlay isolado**

Usar `position: fixed`, `inset: 0`, fundo próprio e z-index alto dentro do Shadow Root. O portal original fica intacto por baixo. O botão “Interface original” desmonta/oculta o overlay e persiste `interfaceMode='original'`.

- [ ] **Step 4: Implementar popup/kill switch**

A mudança de configuração deve afetar refresh/reabertura. O popup não mostra nem lê dados do portal.

- [ ] **Step 5: Exibir versão**

Ler `browser.runtime.getManifest().version`; não duplicar string de versão em componentes.

- [ ] **Step 6: Testes + build**

Run: `npm test && npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

`git commit -m "feat: mount isolated reversible DOOL shell"`

---

### Task 6: Revisão adversarial e Gate G2

**Files:**
- Create: `docs/epic-02/manual-validation.md`
- Create: `docs/epic-02/gate-g2.md`
- Modify tests as necessário apenas para cenários já especificados.

**Interfaces:**
- Consumes: toda a fundação.
- Produces: decisão `G2 APROVADO | BLOQUEADO` baseada em evidência.

- [ ] **Step 1: Rodar suite completa**

Run: `npm test && npm run typecheck && npm run build`
Expected: 0 falhas.

- [ ] **Step 2: Auditar Manifest gerado**

Confirmar: MV3; match somente DOOL; permissão `storage`; ausência de `cookies`, `webRequest`, `<all_urls>`, `tabs`, `downloads` e scripts remotos.

- [ ] **Step 3: Inspecionar bundle por segredos/padrões proibidos**

Procurar `Authorization`, `Cookie`, `Set-Cookie`, senhas hardcoded, URLs externas executáveis e IDs pessoais.

- [ ] **Step 4: Executar matriz adversarial automatizável**

Cobrir DOM ausente, mount lançando exceção, storage corrompido, rota não suportada, inicialização duplicada e toggle persistente.

- [ ] **Step 5: Registrar validação manual necessária no Chrome/Edge**

Checklist: instalar unpacked; abrir home/HTML/PDF/Flip/busca; verificar overlay; alternar original/nova; refresh; back/forward; kill switch pelo popup; confirmar portal original utilizável após falha injetada.

- [ ] **Step 6: Gate G2**

Aprovar somente se testes/build/manifest passarem e nenhuma falha automatizada puder deixar o portal original inacessível. Se a validação manual de navegador não puder ser executada no ambiente atual, registrar `G2 técnico aprovado / validação visual pendente`, sem promover para demonstração executiva.

- [ ] **Step 7: Commit**

`git commit -m "test: harden extension foundation and record G2"`

---

## Self-review do plano

Cobertura: RF-02.1 a RF-02.7, modelo completo de estados, CA-02-A a CA-02-F, permissões, storage, CSS isolation, failure injection, múltiplas inicializações, refresh/back-forward e versionamento estão mapeados nas Tasks 1–6.

Ruling de arquitetura: **Shadow Root + overlay** foi escolhido para o EPIC-02 porque preserva o DOM original sem precisar conhecer seletores internos do portal; a decisão continua reversível. WXT fornece suporte nativo a Shadow Root UI e Vitest, reduzindo código de infraestrutura.

Não há placeholders `TODO`/`TBD` no plano.