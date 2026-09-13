# Gate G1 — Discovery e contratos do DOOL

**Data:** 2026-09-13  
**Branch:** `epic-01-discovery`  
**Decisão:** **APROVADO COM RESSALVAS POR DOMÍNIO**

O Gate G1 está aprovado para os domínios necessários ao primeiro ciclo de implementação. As lacunas restantes são conhecidas, estão isoladas e não devem ser preenchidas por inferência.

## 1. Evidências disponíveis

- mapa de rotas e superfícies;
- primeira captura HAR pública/não autenticada;
- segunda captura HAR com sessão autenticada e duas buscas reais;
- catálogo de contratos de edição, PDF, Flip e leitor HTML;
- suplemento de contratos de busca e sessão autenticada;
- schemas sanitizados dos principais responses estruturados;
- matriz de acesso comparando estados não autenticado e autenticado;
- análise de políticas HTTP observadas;
- dependências de documento/DOM;
- inventário de mutações;
- hipóteses e limitações explícitas.

Os HARs brutos permanecem fora do Git.

## 2. Cobertura dos 14 itens da spec

| Item da spec | Estado | Decisão |
|---|---|---|
| home | demonstrado | liberado |
| edição principal e extras/suplementos | demonstrado; Principal + Suplemento capturados no mesmo dia | liberado |
| seleção de edição anterior | demonstrado via `ultimas_edicoes.json` | liberado |
| pesquisa por termo e período | **demonstrada** | liberado |
| lista de resultados | **demonstrada**, incluindo highlight/facetas e zero resultado | liberado |
| `/ver-html/{id}/` | demonstrado | liberado |
| categorias e matérias do HTML | demonstrado | liberado |
| PDF | demonstrado, inclusive por página/Range | liberado |
| versão Jornal/Flip | demonstrada | liberado |
| autenticidade | rota client-declared; resposta não exercitada | bloqueado apenas neste subdomínio |
| cadastro | abertura observada; submissão é mutação | delegação/fallback |
| login | formulário observado + estado autenticado comprovado em captura posterior | delegação do login; detecção de sessão liberada |
| recuperação de senha | abertura observada; submissão é mutação | delegação/fallback |
| estado de usuário/assinatura | **usuário autenticado demonstrado**; assinatura não demonstrada | sessão básica liberada; capacidades de assinatura bloqueadas |

## 3. Domínios liberados

### EPIC-02 — Fundação e isolamento da extensão

**LIBERADO.** Deve provar montagem/desmontagem segura, transporte permitido e fallback, sem reimplementar autenticação.

### EPIC-03 — Camada de adaptação e sessão

**LIBERADO** para:

- edições e variantes Principal/Suplemento;
- catálogo de páginas;
- PDF;
- Flip/imagens;
- leitura HTML;
- busca e facetas;
- estado de sessão em nível `anonymous | authenticated | unknown/reauth-required`.

Não está liberada leitura direta de cookies nem inferência de assinatura.

### EPIC-04 — Design system, shell e acessibilidade

**LIBERADO.**

### EPIC-05 — Home, edições e navegação

**LIBERADO.**

### EPIC-06 — Busca e acervo

**LIBERADO** para busca por termo/período, resultados, zero resultados, destaque contextual e facetas observadas. Capacidades de acervo condicionado por assinatura permanecem feature-gated/fallback.

### EPIC-07 — Leitor HTML editorial

**LIBERADO COM GATE DE FIDELIDADE.** Aquisição é comprovada; sanitização/parsing não pode alterar sentido editorial ou jurídico.

### EPIC-08 — Autenticação, PDF, Jornal e autenticidade

**PARCIALMENTE LIBERADO** para:

- detecção básica de estado autenticado;
- delegação para login/perfil/logout legado;
- PDF/Jornal observados.

Permanecem bloqueados:

- inferência ou implementação de assinatura/acervo certificado;
- consulta de autenticidade até resposta real ser capturada;
- lógica específica de sessão expirada além de fallback seguro.

## 4. Restrições obrigatórias

1. Não versionar HAR bruto, cookies, tokens, credenciais, PII ou valores de formulário autenticado.
2. Não reimplementar coleta de senha/login no primeiro incremento.
3. Não inferir assinatura por perfil autenticado ou por presença de links.
4. Não assumir CORS aberto.
5. Não depender de iframe como única estratégia.
6. Tratar redirect, HTML inesperado ou resposta incompatível como possível mudança de sessão/contrato.
7. Preservar retorno imediato à interface original.
8. Não alterar conteúdo da matéria para “corrigir” HTML; sanitizar sem perda semântica ou aplicar fallback.
9. Tratar zero resultados da busca como estado normal, não erro.
10. Não acoplar a UI à tecnologia interna presumida do mecanismo de busca; depender apenas do contrato HTTP observado.

## 5. Ressalvas não bloqueantes para o primeiro ciclo

- resposta real da consulta de autenticidade;
- distinção cadastrado versus assinante;
- acervo certificado condicionado por assinatura;
- sessão expirada/logout observada até o estado posterior;
- autorização efetiva da área administrativa;
- corpus editorial adversarial ampliado.

Essas ressalvas devem permanecer feature-gated e não podem ser simuladas como concluídas.

## 6. Decisão do gate

O EPIC-01 produziu evidência suficiente para iniciar a implementação do **EPIC-02 — Fundação e isolamento da extensão** e para planejar os adaptadores públicos/autenticados básicos do EPIC-03. Busca e leitor HTML também possuem contratos suficientes para desenvolvimento posterior.

**G1 aprovado com ressalvas. Nenhuma ressalva atual bloqueia o EPIC-02.**