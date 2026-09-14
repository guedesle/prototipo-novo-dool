# EPIC-04 — Gate de UI, shell e acessibilidade

**Branch:** `epic-04-design-system`  
**Head funcional verificado:** `a7c7bc32110d92bc5bd93b189e92294196117d72`  
**CI funcional:** run `34792253332`  
**Head documental/integrável verificado:** `6d7eb7a3d0aa9dd00a717166336f825e97471d2f`  
**CI final de integração:** run `34792673047`  
**Versão validada em Chrome:** `0.1.1`  
**Status:** **GATE G4 APROVADO** — automação, smoke test manual e CI de integração concluídos.

## 1. Evidência automatizada

No head funcional, o pipeline completo terminou com sucesso; depois do registro documental do gate, o pipeline foi repetido no head integrável e terminou novamente com sucesso.

- `npm install --legacy-peer-deps` — sucesso;
- `npm test` — **115/115 testes aprovados**;
- `npm run typecheck` — sucesso;
- `npm run build` — WXT/Chrome MV3 gerado com sucesso;
- `node scripts/audit-manifest.mjs .output/chrome-mv3/manifest.json` — sucesso;
- `node scripts/audit-adapter-boundary.mjs` — sucesso;
- `node scripts/audit-ui-accessibility.mjs` — sucesso, sem violações estruturais críticas/sérias no escopo coberto.

O auditor de UI é deliberadamente estático/estrutural. Ele não equivale a certificação WCAG nem substitui validação em navegador ou tecnologia assistiva.

## 2. Base entregue

### Tokens e contraste

- tokens semânticos centralizados em `src/ui/tokens.css`;
- CSS do shell sem cores hexadecimais arbitrárias;
- utilitário de contraste baseado em luminância relativa;
- pares críticos testados para os limiares usados no EPIC-04.

### Primitivos semânticos

- botão nativo;
- link nativo;
- campo de texto/busca/data/e-mail com `label` associado;
- `select` nativo;
- associação de erro com `aria-invalid` e `aria-describedby`;
- estados `loading`, `empty`, `error` e `success`, com ação de recuperação quando aplicável.

### Shell e teclado

- skip link para o conteúdo principal;
- `header`, `nav` e `main` nativos;
- único `h1` de página no shell de referência;
- ausência de `tabindex` positivo;
- ação “Interface original” preservada;
- skip link com foco explícito no `main`, necessário porque o shell é renderizado em Shadow DOM.

### Reflow, foco e motion

- layout fluido e regras específicas para viewport estreito;
- quebra de conteúdo/palavras longas;
- ações essenciais não são ocultadas no breakpoint móvel;
- controles-base com altura mínima robusta;
- `:focus-visible` para skip link, botões, links e campos;
- `prefers-reduced-motion: reduce` neutraliza transições/animações não essenciais.

### Preferências de leitura

Contrato puro e limitado a apresentação:

- escala: `default`, `large`, `extra-large`;
- largura: `narrow`, `standard`, `wide`;
- espaçamento: `comfortable`, `relaxed`;
- valores inválidos retornam ao padrão por campo;
- chaves com conteúdo editorial são ignoradas;
- nenhum HTML/texto de publicação é transformado por esse contrato.

## 3. Revisão adversarial e correções de integração

A revisão encontrou e corrigiu três riscos relevantes antes do gate final:

1. **Skip link dentro de Shadow DOM:** depender apenas de `href="#novo-dool-main"` não garantia foco real. Foi adicionado foco explícito no `main`, coberto por teste RED→GREEN.
2. **Modo de posicionamento do WXT:** `position: 'overlay'` não representava uma substituição integral da viewport. O entrypoint foi migrado para `position: 'modal'` após teste de regressão RED→GREEN.
3. **DOM legado ativo sob o protótipo:** mesmo com modal, o portal original continuava visual/interativamente ativo em paralelo. Foi criado `suspendLegacyDom(...)`, que torna o legado invisível/inert/`aria-hidden` apenas depois da montagem bem-sucedida e restaura exatamente o estado anterior em `onRemove`, preservando fail-open.

A terceira correção foi coberta por testes de isolamento, restauração exata e restauração idempotente.

## 4. Validação real em Chrome

### Sanity check após as correções

**PASS**:

- cabeçalho legado do DOOL deixou de aparecer;
- cabeçalho próprio do Novo DOOL ficou visível;
- controles “Nova interface” e “Interface original” ficaram disponíveis;
- versão `0.1.1` foi confirmada visualmente.

### Smoke test M01–M05

Resultado informado pelo validador humano em 2026-09-14:

- M01 — Teclado e skip link: **PASS**;
- M02 — Viewport 320 px: **PASS**;
- M03 — Zoom 200%: **PASS**;
- M04 — Reversibilidade / Interface original: **PASS**;
- M05 — Reduced motion: **PASS**.

O registro detalhado está em `docs/epic-04/manual-smoke-result-template.md`.

## 5. Decisão de gate

- **Automação funcional:** APROVADA;
- **Sanity check real:** APROVADO;
- **Smoke M01–M05:** APROVADO;
- **CI final de integração:** APROVADO;
- **Gate G4:** **APROVADO**;
- **Merge do EPIC-04:** LIBERADO, sujeito apenas à mergeabilidade do PR #14 no momento da integração.

A aprovação do G4 significa que a base visual, semântica, responsiva e reversível definida para este épico atingiu seus critérios de aceite. Ela não deve ser comunicada como certificação integral de WCAG 2.2 AA para todo o Novo DOOL; os fluxos funcionais adicionados nos próximos épicos devem continuar sendo revalidados.
