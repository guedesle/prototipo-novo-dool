# EPIC-01 — Discovery e contratos do DOOL — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir um catálogo verificável e sanitizado dos contratos técnicos do DOOL necessários aos épicos seguintes, sem alterar o backend, contornar autorização ou versionar segredos.

**Architecture:** O discovery será tratado como uma cadeia de evidências: cada fluxo observado gera um registro de contrato, uma classificação de fonte de verdade, uma classificação leitura/mutação/documento/navegação e uma evidência reproduzível. O trabalho começa pelos fluxos públicos; fluxos autenticados entram somente quando houver sessão legítima, e os artefatos versionados passam por sanitização antes do commit.

**Tech Stack:** navegador Chromium/DevTools quando disponível; inspeção HTTP somente leitura; Markdown/JSON para catálogo e fixtures; Git/GitHub para rastreabilidade; ferramentas de linha de comando apenas para validação e sanitização, sem automação ofensiva.

**Spec:** `docs/specs/EPIC-01-discovery-contratos-dool.md`

## Global Constraints

- Não modificar o backend de produção.
- Não executar bypass de pagamento, assinatura ou autorização.
- Não realizar testes de carga, fuzzing ofensivo ou exploração de vulnerabilidades.
- Não versionar senha, cookie, token, identificador pessoal ou documento protegido.
- Tratar toda inferência não comprovada como hipótese.
- Marcar POST/PUT/PATCH/DELETE e GET com efeito colateral conhecido como mutação.
- Só declarar um endpoint estável após observação repetida ou evidência equivalente.
- Separar claramente evidência pública, evidência autenticada e hipótese.
- O Gate G1 só pode ser aprovado para domínios cujos contratos ou estratégias de adaptação estejam demonstrados.

---

## Estrutura de arquivos prevista

```text
docs/
  discovery/
    README.md                       # método, convenções e estado do discovery
    routes.md                       # mapa de páginas e rotas observadas
    contracts.md                    # catálogo canônico dos contratos
    access-matrix.md                # comparação anônimo/cadastrado/assinante/etc.
    browser-policies.md             # CSP, CORS, cookies, redirects e frame restrictions
    dom-dependencies.md             # dependências de HTML inicial e DOM renderizado
    mutations.md                    # inventário explícito de operações com efeito colateral
    hypotheses.md                   # hipóteses ainda não demonstradas
    gate-g1.md                      # checklist e decisão final do Gate G1
  discovery/evidence/
    public/                         # evidências públicas sanitizadas
    authenticated/                  # apenas metadados sanitizados de evidências autenticadas
  discovery/fixtures/
    public/                         # respostas públicas sanitizadas necessárias a testes futuros
    authenticated/                  # somente fixtures permitidas, sem segredos ou documentos protegidos
```

Nenhum arquivo de evidência bruto com cabeçalhos de autenticação será versionado. Se uma captura HAR for necessária, a versão bruta permanece fora do Git; apenas uma cópia sanitizada poderá entrar em `docs/discovery/evidence/`.

---

### Task 1: Criar o esqueleto do catálogo e as regras de evidência

**Files:**
- Create: `docs/discovery/README.md`
- Create: `docs/discovery/contracts.md`
- Create: `docs/discovery/hypotheses.md`
- Create: `docs/discovery/mutations.md`

**Interfaces:**
- Consumes: `docs/specs/EPIC-01-discovery-contratos-dool.md`
- Produces: template `CONTRACT-*` usado por todas as tarefas seguintes.

- [ ] **Step 1: Criar o template canônico de contrato**

Cada registro em `contracts.md` deve conter exatamente:

```markdown
## CONTRACT-XXX — <nome>
- Status: observado | repetido | hipótese | bloqueado
- Data da observação: YYYY-MM-DD
- Perfil: anônimo | cadastrado | assinante | sessão-expirada | desconhecido
- Ação do usuário:
- Rota/página de origem:
- Requisição: <método> <host><path>
- Parâmetros/query/body relevantes:
- Cabeçalhos relevantes: <somente nomes/valores não sensíveis>
- Tipo de resposta:
- Schema/estrutura sanitizada:
- Fonte de verdade: backend-estruturado | documento-html | dom-renderizado | derivado-local | desconhecida
- Classificação: leitura | mutação | navegação | documento
- Autorização observada:
- Efeito esperado na UI:
- Erros observados:
- Fallback disponível:
- Dependência de DOM: sim | não | parcial
- Evidência reproduzível:
- Observações/limitações:
```

- [ ] **Step 2: Definir convenções de evidência**

Em `README.md`, registrar que nenhuma URL com token, cabeçalho `Authorization`, `Cookie`, `Set-Cookie`, senha, e-mail pessoal ou identificador de assinatura pode ser versionado.

- [ ] **Step 3: Definir política de hipóteses e mutações**

`hypotheses.md` deve exigir evidência antes de promover uma hipótese a fato. `mutations.md` deve registrar qualquer ação com efeito colateral e marcá-la como fora do protótipo até autorização específica.

- [ ] **Step 4: Verificar os arquivos**

Executar busca no diretório para confirmar ausência dos marcadores `TBD`, `TODO` e campos de segredo preenchidos.

- [ ] **Step 5: Commit**

```bash
git add docs/discovery
git commit -m "docs: scaffold DOOL contract discovery"
```

---

### Task 2: Mapear rotas e superfícies públicas prioritárias

**Files:**
- Create: `docs/discovery/routes.md`
- Create/Modify: `docs/discovery/evidence/public/*`
- Modify: `docs/discovery/contracts.md`
- Modify: `docs/discovery/hypotheses.md`

**Interfaces:**
- Consumes: template `CONTRACT-*` da Task 1.
- Produces: mapa público de home, edições, busca, resultados, `/ver-html/{id}/`, PDF/Jornal, autenticidade, cadastro e recuperação de senha.

- [ ] **Step 1: Registrar a rota inicial e redirects**

Para cada hostname observado, registrar URL inicial, status/redirect quando observável e hostname final. Não declarar aliases equivalentes sem evidência.

- [ ] **Step 2: Mapear links e formulários públicos**

Registrar somente rotas e ações visíveis/consultáveis, distinguindo navegação de chamadas de dados.

- [ ] **Step 3: Classificar fonte de verdade por superfície**

Para cada item exibido, marcar `backend-estruturado`, `documento-html`, `dom-renderizado`, `derivado-local` ou `desconhecida`.

- [ ] **Step 4: Repetir ao menos um fluxo de cada domínio público**

Domínios mínimos: edição, busca, leitura HTML, documento, autenticidade e conta pública (cadastro/recuperação sem submissão mutante).

- [ ] **Step 5: Commit**

```bash
git add docs/discovery/routes.md docs/discovery/contracts.md docs/discovery/hypotheses.md docs/discovery/evidence/public
git commit -m "docs: map public DOOL surfaces"
```

---

### Task 3: Identificar contratos de rede e de documento nos fluxos públicos

**Files:**
- Modify: `docs/discovery/contracts.md`
- Create/Modify: `docs/discovery/fixtures/public/*`
- Modify: `docs/discovery/dom-dependencies.md`

**Interfaces:**
- Consumes: rotas da Task 2.
- Produces: contratos observados de requisição/resposta ou, quando não houver chamada separada, contratos de documento/DOM.

- [ ] **Step 1: Inspecionar home e seleção de edição**

Registrar método, host/path, parâmetros, tipo de resposta e fonte de verdade. Se o dado já vier no HTML inicial, registrar explicitamente `documento-html`.

- [ ] **Step 2: Inspecionar busca e paginação**

Executar consultas públicas benignas, incluindo uma com resultado e outra sem resultado, e registrar os contratos sem inferir mecanismo de busca interno.

- [ ] **Step 3: Inspecionar `/ver-html/{id}/`**

Determinar se categorias/matérias chegam no documento inicial, em chamada posterior ou somente no DOM renderizado. Registrar ordem e identificadores observáveis sem copiar documento protegido.

- [ ] **Step 4: Inspecionar PDF/Jornal/autenticidade**

Registrar navegação/documento ou chamada somente quando acessível legitimamente ao perfil anônimo. Não contornar gate de acesso.

- [ ] **Step 5: Criar fixtures públicas mínimas**

Salvar apenas estruturas necessárias aos testes futuros, removendo conteúdo pessoal ou trechos desnecessários de publicação.

- [ ] **Step 6: Repetir contratos centrais**

Repetir ao menos home/edição, busca e leitura HTML em uma segunda observação para elevar o status de `observado` para `repetido` quando consistente.

- [ ] **Step 7: Commit**

```bash
git add docs/discovery/contracts.md docs/discovery/dom-dependencies.md docs/discovery/fixtures/public
git commit -m "docs: catalog public DOOL contracts"
```

---

### Task 4: Mapear políticas do navegador e restrições relevantes à extensão

**Files:**
- Create: `docs/discovery/browser-policies.md`
- Modify: `docs/discovery/contracts.md`
- Modify: `docs/discovery/hypotheses.md`

**Interfaces:**
- Consumes: hosts e fluxos das Tasks 2 e 3.
- Produces: conclusão por política `compatível | exige-adaptação-permitida | bloqueia-estratégia-atual | desconhecida`.

- [ ] **Step 1: Registrar cabeçalhos de política observáveis**

Cobrir, quando presentes: CSP, CORS, `X-Frame-Options`, `frame-ancestors`, HSTS, `Referrer-Policy`, `Permissions-Policy` e redirects.

- [ ] **Step 2: Registrar comportamento de cookies sem copiar valores**

Documentar apenas atributos relevantes observáveis, como `SameSite`, `Secure`, `HttpOnly`, domínio/path e impacto esperado.

- [ ] **Step 3: Avaliar impacto na estratégia de view**

Para cada política, classificar se uma extensão MV3 com UI isolada pode operar sem quebrar a sessão e sem ampliar permissões.

- [ ] **Step 4: Registrar restrições não demonstráveis**

Qualquer aspecto que dependa de DevTools autenticado ou execução da extensão deve permanecer `desconhecida`, nunca presumido.

- [ ] **Step 5: Commit**

```bash
git add docs/discovery/browser-policies.md docs/discovery/contracts.md docs/discovery/hypotheses.md
git commit -m "docs: assess DOOL browser policies"
```

---

### Task 5: Construir a matriz pública de acesso e cenários adversariais não destrutivos

**Files:**
- Create: `docs/discovery/access-matrix.md`
- Modify: `docs/discovery/contracts.md`
- Modify: `docs/discovery/hypotheses.md`

**Interfaces:**
- Consumes: contratos das Tasks 2–4.
- Produces: baseline do perfil anônimo e casos controlados para 401/403/404/5xx/redirect quando observados naturalmente ou reproduzíveis sem ataque.

- [ ] **Step 1: Preencher baseline anônimo**

Cobrir: home, edição, busca, resultado, HTML, PDF, Jornal, autenticidade, cadastro e recuperação de senha.

- [ ] **Step 2: Registrar edição inexistente e busca sem resultado**

Usar somente entradas benignas e rotas normais; não enumerar IDs em massa.

- [ ] **Step 3: Registrar falhas naturais**

Se ocorrer 401/403/5xx/timeout/redirect, documentar a resposta e o fallback. Não provocar indisponibilidade nem explorar o serviço para gerar erro.

- [ ] **Step 4: Marcar perfis ainda não testados**

Cadastrado, assinante e sessão expirada permanecem como `não observado` até existir sessão legítima.

- [ ] **Step 5: Commit**

```bash
git add docs/discovery/access-matrix.md docs/discovery/contracts.md docs/discovery/hypotheses.md
git commit -m "docs: establish anonymous DOOL access baseline"
```

---

### Task 6: Executar discovery autenticado com sessão legítima

**Files:**
- Modify: `docs/discovery/access-matrix.md`
- Modify: `docs/discovery/contracts.md`
- Create/Modify: `docs/discovery/evidence/authenticated/*`
- Create/Modify: `docs/discovery/fixtures/authenticated/*`

**Interfaces:**
- Consumes: baseline público e sessão autenticada fornecida legitimamente pelo usuário no navegador.
- Produces: diferenças verificadas por perfil sem registrar segredos.

- [ ] **Step 1: Registrar apenas o estado lógico da sessão**

Não copiar senha, cookie, token, e-mail ou ID pessoal. Registrar apenas `autenticado`, `perfil observado` e capacidades demonstradas.

- [ ] **Step 2: Repetir fluxos prioritários**

Comparar home/edições, busca, HTML, PDF, Jornal, autenticidade e perfil/assinatura quando acessíveis legitimamente.

- [ ] **Step 3: Verificar expiração/redirect somente por meios normais**

Se a sessão expirar naturalmente ou houver logout normal, registrar o comportamento. Não adulterar tokens para forçar estados inválidos.

- [ ] **Step 4: Sanitizar evidências antes de versionar**

Toda evidência deve remover identificadores pessoais, valores de cookie/token e conteúdo protegido desnecessário.

- [ ] **Step 5: Commit**

```bash
git add docs/discovery/access-matrix.md docs/discovery/contracts.md docs/discovery/evidence/authenticated docs/discovery/fixtures/authenticated
git commit -m "docs: map authenticated DOOL capabilities"
```

---

### Task 7: Revisar contratos, dependências dos épicos seguintes e Gate G1

**Files:**
- Create: `docs/discovery/dom-dependencies.md` if not already created
- Create: `docs/discovery/gate-g1.md`
- Modify: `docs/discovery/contracts.md`
- Modify: `docs/discovery/hypotheses.md`
- Modify: `docs/01-estagio-atual.md`

**Interfaces:**
- Consumes: todas as evidências e contratos das Tasks 1–6.
- Produces: decisão explícita por domínio para EPIC-02 a EPIC-08.

- [ ] **Step 1: Revisar cobertura da spec**

Confirmar que os 14 itens de escopo possuem contrato demonstrado ou limitação explícita.

- [ ] **Step 2: Executar varredura de segredos e PII**

Verificar repositório por padrões de `Authorization`, `Cookie`, `Set-Cookie`, `Bearer`, senhas e identificadores pessoais usados no teste. Qualquer ocorrência real bloqueia G1 até remoção.

- [ ] **Step 3: Classificar estratégia por recurso**

Para cada domínio, escolher exatamente uma conclusão: `chamada-reutilizável`, `documento-html`, `dom-renderizado`, `fallback-legado` ou `bloqueado-pendente-evidência`.

- [ ] **Step 4: Mapear dependências posteriores**

Registrar quais contratos mínimos liberam EPIC-02, EPIC-03, EPIC-05, EPIC-06, EPIC-07 e EPIC-08.

- [ ] **Step 5: Decidir Gate G1 por domínio**

`gate-g1.md` deve permitir aprovação parcial: um domínio pode ser liberado mesmo que outro permaneça bloqueado, desde que suas evidências sejam suficientes.

- [ ] **Step 6: Atualizar estágio atual**

`docs/01-estagio-atual.md` deve substituir hipóteses resolvidas por fatos observados e manter lacunas restantes explícitas.

- [ ] **Step 7: Commit**

```bash
git add docs/discovery docs/01-estagio-atual.md
git commit -m "docs: close EPIC-01 discovery gate"
```

---

## Self-review checklist

- [ ] Os 14 itens de escopo da spec aparecem em pelo menos uma tarefa.
- [ ] Nenhum passo exige bypass, carga, fuzzing ou mutação não autorizada.
- [ ] O plano diferencia HTML inicial, DOM renderizado e backend estruturado.
- [ ] A matriz de perfis não exige armazenamento de credenciais.
- [ ] Políticas de navegador possuem conclusão objetiva ou estado desconhecido.
- [ ] Fixtures são mínimas e sanitizadas.
- [ ] O Gate G1 pode ser aprovado parcialmente por domínio sem fingir completude global.
- [ ] Não há `TBD`, `TODO`, “implementar depois” ou instruções vagas no plano.
