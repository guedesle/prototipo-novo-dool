# Gate G1 — Discovery e contratos do DOOL

**Data:** 2026-09-13  
**Branch:** `epic-01-discovery`  
**Decisão:** **APROVADO PARCIALMENTE POR DOMÍNIO**

O EPIC-01 define que a implementação pode começar apenas nos domínios cujo contrato ou estratégia de adaptação esteja demonstrado. A evidência atual atende esse critério para parte relevante do portal, mas não para autenticação/assinatura e busca completa.

## 1. Evidências disponíveis

- mapa de rotas públicas;
- HAR real do navegador analisado e sanitizado;
- catálogo com contratos de edição, PDF, Flip e leitor HTML;
- schemas sanitizados dos principais responses estruturados;
- matriz de acesso do estado capturado;
- análise de políticas HTTP observadas;
- dependências de documento/DOM;
- inventário de mutações;
- hipóteses atualizadas.

O HAR bruto permanece fora do Git.

## 2. Cobertura dos 14 itens da spec

| Item da spec | Estado | Decisão |
|---|---|---|
| home | demonstrado | liberado |
| edição principal e extras/suplementos | demonstrado estruturalmente | liberado |
| seleção de edição anterior | demonstrado via `ultimas_edicoes.json` | liberado |
| pesquisa por termo e período | navegação/hash demonstrados; request de resultados pendente | bloqueado para reimplementação completa |
| lista de resultados | não capturada | bloqueado |
| `/ver-html/{id}/` | demonstrado | liberado |
| categorias e matérias do HTML | demonstrado | liberado |
| PDF | demonstrado, inclusive por página/Range | liberado |
| versão Jornal/Flip | demonstrada | liberado |
| autenticidade | rota client-declared; resposta não exercitada | bloqueado |
| cadastro | abertura observada; submissão é mutação | somente delegação/fallback |
| login | formulário e redirect observados; sessão legítima não capturada | somente delegação/fallback |
| recuperação de senha | abertura observada; submissão é mutação | somente delegação/fallback |
| estado de usuário/assinatura | não demonstrado | bloqueado |

## 3. Domínios liberados para os épicos seguintes

### EPIC-02 — Fundação e isolamento da extensão

**LIBERADO**, desde que o primeiro incremento trabalhe somente com rotas públicas e preserve fallback integral. A prova técnica deve validar transporte same-origin/host permissions sem tocar autenticação.

### EPIC-03 — Camada de adaptação e sessão

**LIBERADO PARCIALMENTE** para adaptadores de:

- edições;
- páginas;
- PDF;
- Flip/imagens;
- leitura HTML.

O adaptador de sessão permanece como interface/estado abstrato, sem implementação de cookies ou capacidades até nova evidência.

### EPIC-04 — Design system, shell e acessibilidade

**LIBERADO**. Não depende de contrato autenticado.

### EPIC-05 — Home, edições e navegação

**LIBERADO** para edição do dia, suplemento/extra quando retornado, seleção de edições e ações dos formatos observados. Qualquer mensagem sobre assinatura deve continuar derivada de capacidade real, nunca presumida.

### EPIC-06 — Busca e acervo

**BLOQUEADO PARCIALMENTE**. Pode ser desenhado visualmente e ter navegação/fallback, mas o motor de resultados não deve ser reimplementado antes de captura da busca real.

### EPIC-07 — Leitor HTML editorial

**LIBERADO COM GATE DE FIDELIDADE**. A aquisição está demonstrada; implementação deve incluir sanitização conservadora, comparação com original e fallback para HTML incompatível.

### EPIC-08 — Autenticação, PDF, Jornal e autenticidade

**PARCIALMENTE LIBERADO** apenas para PDF/Jornal públicos observados e delegação de login/cadastro/recuperação ao legado. Conta, assinatura, acervo certificado e autenticidade permanecem bloqueados.

## 4. Restrições obrigatórias

1. Não versionar HAR bruto, cookies, tokens, credenciais ou PII.
2. Não reimplementar login neste estágio.
3. Não inferir perfil pela presença/ausência de elemento visual; usar capacidade comprovada.
4. Não assumir CORS aberto.
5. Não depender de iframe como única estratégia.
6. Tratar response HTML inesperado/redirect como possível mudança de sessão.
7. Preservar retorno imediato à interface original.
8. Não alterar conteúdo da matéria para “corrigir” HTML; sanitizar sem perda semântica ou aplicar fallback.

## 5. Pendências para G1 completo

Para promover o Gate G1 a completo, faltam:

1. nova captura HAR **após login legítimo**, comprovando uma rota de conta acessível;
2. captura de uma pesquisa real em `/buscanova/` com resultado e sem resultado;
3. execução de consulta de autenticidade com código público/permitido, sem expor dados pessoais;
4. quando disponível, comparação de capacidades de cadastrado versus assinante sem burlar assinatura;
5. estado de sessão expirada observado por logout/expiração normal, não por adulteração de token.

## 6. Decisão executiva do gate

A evidência atual é suficiente para iniciar com segurança a **fundação da extensão e o protótipo público de home + edições + leitor HTML**, que formam o recorte demonstrável de maior valor. Fluxos protegidos permanecem explicitamente fora do primeiro incremento até complementação do discovery.
