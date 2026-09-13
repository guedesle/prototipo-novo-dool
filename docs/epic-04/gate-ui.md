# EPIC-04 — Gate de UI, shell e acessibilidade

**Branch:** `epic-04-design-system`  
**Head automatizado verificado:** `e4508cbe40be5fa4bf57c3ddbcaa8fcbf4ed56a6`  
**CI:** run `34787173158`  
**Status:** correção da primeira rodada manual aplicada; CI aprovado; reteste real M01–M05 pendente antes do merge.

## 1. Evidência automatizada

No head acima, o pipeline completo terminou com sucesso:

- `npm install --legacy-peer-deps` — sucesso;
- `npm test` — **111/111 testes aprovados**;
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

## 3. Revisão adversarial automatizada

Coberto por testes/auditorias:

- palavras e valores longos não devem forçar overflow por falta de quebra;
- foco não pode ser removido globalmente;
- `tabindex` positivo é proibido;
- skip link e landmarks são invariantes do shell;
- motion reduzido é obrigatório;
- cores estruturais do shell permanecem em tokens;
- controles base preservam alvo mínimo;
- erro de formulário não depende apenas de cor;
- loading/erro possuem semântica textual;
- contratos de backend continuam confinados à camada de adapters.

A revisão adversarial encontrou e corrigiu uma falha antes do primeiro gate: em Shadow DOM, o skip link não podia depender somente de `href="#novo-dool-main"`. Foi adicionado foco explícito e um teste RED→GREEN para esse comportamento.

## 4. Rodada manual 1 — falha e causa raiz

A primeira rodada M01–M05 falhou em Chrome real. A captura mostrou o cabeçalho legado do DOOL permanecendo acima do protótipo e ocultando os controles do shell.

A investigação apontou uma divergência entre a intenção arquitetural e a API do WXT:

- o projeto usava `createShadowRootUi(..., { position: 'overlay' })`;
- no WXT, `overlay` cria uma UI posicionada sobre o ponto de ancoragem com área-base `0×0`, não uma camada de viewport inteira;
- apenas `position: 'modal'` posiciona o container interno como `fixed` com `top/right/bottom/left: 0`;
- portanto, o shell de substituição visual integral do DOOL estava usando o modo de posicionamento errado.

Foi criado primeiro um teste de regressão exigindo `position: 'modal'`. O teste falhou isoladamente no CI (110 testes passavam e somente a expectativa do modo de posicionamento falhava). Em seguida, o entrypoint foi alterado para `position: 'modal'` e o pipeline completo voltou a ficar verde com **111/111 testes** e todas as auditorias aprovadas.

Essa correção trata a causa raiz observada na captura, não apenas o sintoma visual.

## 5. Smoke test manual obrigatório antes do merge

Executar em Chrome/Chromium com a extensão da branch `epic-04-design-system` atualizada e recarregada como unpacked.

### Preparação

```bash
git checkout epic-04-design-system
git pull
npm install --legacy-peer-deps
npm run build
```

Em `chrome://extensions`, clicar **Recarregar** na extensão já instalada ou remover e carregar novamente `.output/chrome-mv3` em **Modo do desenvolvedor → Carregar sem compactação**. Depois abrir/recarregar `https://dool.egba.ba.gov.br/`.

### M01 — Teclado e skip link

1. Não usar o mouse.
2. Pressionar `Tab` a partir do início da página.
3. Confirmar que “Ir para o conteúdo principal” fica visível.
4. Pressionar `Enter`.
5. Confirmar que o foco salta para o conteúdo principal e que a sequência posterior de `Tab` permanece lógica.

**Esperado:** nenhuma armadilha de teclado; foco perceptível; conteúdo principal alcançável.

### M02 — Viewport de 320 px

1. DevTools → modo responsivo.
2. Definir largura em `320 px`.
3. Percorrer o shell.

**Esperado:** nenhum scroll horizontal causado pela interface; nenhum texto essencial cortado; botões “Nova interface” e “Interface original” continuam presentes e operáveis.

### M03 — Zoom de 200%

1. Voltar a uma janela desktop comum.
2. Aplicar zoom do navegador em `200%`.
3. Percorrer o shell com teclado e visualmente.

**Esperado:** nenhum conteúdo/ação prioritária desaparece; sem sobreposição destrutiva; leitura e controles continuam utilizáveis.

### M04 — Reversibilidade

1. Acionar “Interface original”.

**Esperado:** a camada do protótipo é removida e a interface original do DOOL fica disponível, preservando o mecanismo validado no EPIC-02.

### M05 — Reduced motion

1. DevTools → Rendering → emular `prefers-reduced-motion: reduce`.
2. Repetir navegação do skip link e controles.

**Esperado:** nenhuma informação depende de animação; transições/animações não essenciais permanecem neutralizadas.

## 6. Decisão de gate

- **Automação:** APROVADA no head `e4508cbe40be5fa4bf57c3ddbcaa8fcbf4ed56a6`.
- **Primeira rodada manual:** FALHOU; causa raiz identificada e corrigida por RED→GREEN.
- **Reteste real de navegador:** PENDENTE.
- **Merge do EPIC-04:** BLOQUEADO somente pelo reteste M01–M05 e por eventual correção decorrente dele.

O gate só será marcado como integralmente aprovado após registrar os novos resultados M01–M05. Não declarar conformidade WCAG 2.2 AA integral com base apenas neste épico; a meta é aplicada aos fluxos cobertos e continuará sendo revalidada conforme as telas funcionais forem adicionadas.
