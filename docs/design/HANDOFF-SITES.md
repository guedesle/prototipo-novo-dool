# Handoff de design — Novo DOOL standalone

**Status:** pronto para revisão de design  
**Data:** 2026-09-14  
**Fonte de verdade arquitetural:** `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

## 1. Missão do handoff

Projetar a experiência visual e interacional do **Novo Diário Oficial do Estado da Bahia** como uma aplicação web pública standalone, institucional e independente, hospedada na Hostinger, sem exigir extensão ou autenticação própria para consulta pública.

O design deve transformar capacidades técnicas complexas — índice histórico, hierarquia administrativa, busca textual, páginas PDF/Flip e leitura HTML — em uma experiência editorial simples, compreensível e acessível.

Não desenhar um dashboard de BI. Desenhar uma experiência de consulta editorial com capacidades dimensionais.

## 2. Leitura obrigatória antes de desenhar

O agente do Sites/Work/Codex deve ler, nesta ordem:

1. `docs/design/HANDOFF-SITES.md`
2. `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`
3. `docs/specs/EPIC-04-design-system-shell-acessibilidade.md`
4. `docs/epic-04/gate-ui.md`
5. `docs/discovery/contracts.md`
6. `docs/discovery/access-matrix.md`
7. `docs/specs/EPIC-05-home-edicoes-navegacao.md`
8. `docs/specs/EPIC-06-busca-acervo.md`

Os EPIC-05 e EPIC-06 antigos devem ser lidos como histórico e base de requisitos; a especificação standalone aprovada tem precedência quando houver conflito.

## 3. Arquitetura que o design não pode alterar

```text
Usuário
  -> Novo DOOL standalone
       -> frontend
       -> BFF/API
       -> índice dimensional MySQL
       -> ingestão
       -> DOOL oficial como fonte documental
```

A extensão Chromium não é requisito de uso do produto principal.

O DOOL oficial continua sendo autoridade para conteúdo documental, autenticação, autorização e recursos protegidos.

## 4. Princípios de UX

1. O conteúdo oficial é protagonista; o chrome da interface é discreto.
2. A edição do dia continua sendo a referência principal da Home.
3. “Explorar publicações” deve parecer pesquisa editorial, não OLAP.
4. Filtros devem reduzir complexidade sem esconder o modelo real.
5. Hierarquias administrativas precisam ser compreensíveis e operáveis.
6. Mobile preserva todas as ações essenciais.
7. Nenhuma ação pode sugerir disponibilidade que o backend não confirmou.
8. Estados de erro, cache, atualização e origem precisam ser honestos e claros.
9. Preferir listas editoriais densas a cards decorativos em resultados.
10. Não criar um segundo design system.

## 5. Arquitetura da informação

```text
Novo DOOL
  +-- Início
  |    +-- edição do dia
  |    +-- suplementos/extras
  |    +-- HTML / PDF / Jornal
  |    +-- entrada “Explorar publicações”
  |
  +-- Explorar publicações
  |    +-- busca textual
  |    +-- autocomplete
  |    +-- período
  |    +-- caderno
  |    +-- órgão/subordinados
  |    +-- tipo de publicação
  |    +-- edição
  |    +-- resultados
  |
  +-- Acervo completo
  |    +-- busca oficial do DOOL quando necessária
  |
  +-- Leitores
       +-- HTML
       +-- PDF
       +-- Jornal/Flip
```

## 6. Inventário mínimo de telas/estados

O design precisa cobrir, no mínimo:

1. Home — edição do dia.
2. Home — principal + suplemento/extra.
3. Explorar publicações — estado inicial.
4. Explorar publicações — resultados.
5. Explorar publicações — filtros hierárquicos parcialmente selecionados.
6. Autocomplete com termo, frase, título e “Você quis dizer?”.
7. Zero resultados.
8. Erro recuperável do índice.
9. Índice parcialmente indisponível.
10. Resultado com `page_mapping_status=VALIDATED`.
11. Resultado sem página validada.
12. Leitor HTML — conteúdo atualizado.
13. Leitor HTML — conteúdo salvo na última visualização.
14. PDF na página correspondente.
15. Jornal/Flip na página correspondente.
16. Acervo completo / busca oficial.
17. Estados móveis dos fluxos acima.

Esses itens podem compartilhar rotas; distinguir rota, view, componente e estado.

## 7. Home

A Home não deve virar um dashboard analítico.

Prioridade visual recomendada:

```text
Diário Oficial do Estado da Bahia
Data

Edição nº X
Tipo da edição

[Ler edição em HTML]
[PDF] [Jornal]

Explorar publicações
[buscar por título, órgão ou tipo...]
[Explorar publicações]

Últimos 90 dias por padrão
```

Suplementos/extras devem ser inequívocos e não competir com a edição principal.

## 8. Explorar publicações

### Desktop

Recomendação:

```text
Busca + período + total
----------------------------------------------
Filtros laterais | Lista de resultados
```

### Mobile

Recomendação:

```text
Busca
Período
[Filtros · N ativos]
Lista de resultados
```

Filtros abrem em drawer/dialog acessível. Nenhuma dimensão desaparece no mobile.

## 9. Filtro de órgãos

O componente deve suportar profundidade variável.

Estados:

```text
selecionado
indeterminado
não selecionado
```

Regra:

- selecionar pai inclui descendentes por padrão;
- excluir descendente torna pai indeterminado;
- “Somente órgão principal” mantém o pai e exclui descendentes;
- mudança de período pode alterar hierarquia e contagens.

Ações rápidas:

```text
Selecionar todas
Somente órgão principal
Limpar
```

Mostrar contagem contextual, por exemplo: `12 de 17 órgãos incluídos`.

Não depender apenas de cor ou indentação para comunicar estado/hierarquia.

## 10. Filtro de tipos de publicação

Usar o mesmo padrão mental de seleção quando houver hierarquia real.

Na v1, não inventar macrogrupos. Preservar categorias oficiais observadas, por exemplo Portarias, Despachos, Convênios, Resoluções, Decretos Simples, Decretos Numerados, Leis, Decretos Financeiros, Avisos de Licitação, Resultados e Homologações, Recursos, Contratos, Dispensas e Inexigibilidades, Outros Expedientes.

## 11. Busca e autocomplete

O autocomplete deve diferenciar visualmente:

- termo;
- frase;
- título completo;
- sugestão ortográfica.

Correção ortográfica nunca é aplicada silenciosamente.

Exemplo:

```text
Entrada: educacoa

Você quis dizer: Educação?

Termos
Educação                         438

Títulos
...
```

Sugestões devem respeitar filtros já selecionados quando o backend fornecer esse contexto.

## 12. Resultados

Preferir linha/lista estruturada.

Hierarquia recomendada:

```text
TÍTULO DA PUBLICAÇÃO

Órgão principal › subordinada › unidade

Data · Edição · Caderno · pág. N
Tipo de publicação

[Ler em HTML] [PDF · pág. N] [Jornal · pág. N]
```

Quando a página não estiver validada:

```text
[Ler em HTML]
Página no PDF/Jornal não identificada
```

Não mostrar botão inativo que pareça disponível, nem inferir página.

## 13. Vínculo entre formatos

A publicação mantém identidade ao trocar de formato:

```text
publicationId -> HTML
editionId + source_start_page -> PDF
editionId + source_start_page -> Jornal/Flip
```

O design deve transmitir continuidade: o usuário não deve “perder o lugar” ao trocar de representação.

## 14. Cache HTML

Estados de leitura:

```text
DOOL disponível -> conteúdo atualizado
cache fresco <24h -> conteúdo local válido
cache stale + DOOL disponível -> atualização transparente
cache stale + DOOL indisponível -> última visualização
```

Copy recomendada para fallback stale:

> Conteúdo salvo na última visualização. Não foi possível atualizar o conteúdo agora.

Exibir data/hora da última obtenção quando disponível.

Não usar “atualizado” para cópia stale.

## 15. Dois mecanismos de busca

A interface deve distinguir sem jargão técnico:

```text
Explorar publicações
Busca detalhada no período indexado

Pesquisar no acervo completo
Consulta ao acervo histórico do Diário Oficial
```

Nunca afirmar que o índice próprio é a busca oficial.

## 16. Identidade e autenticação

Consulta pública não exige login.

Conta do Novo DOOL, se desenhada, é opcional e serve somente para recursos pessoais futuros.

Recursos protegidos do DOOL devem usar copy do tipo:

> Este recurso exige acesso pelo Diário Oficial.

Até o gate AUTH-DOOL existir, não desenhar formulário próprio pedindo credenciais do DOOL.

## 17. Estados universais

Toda superfície dependente de dados deve ter:

```text
INITIAL
LOADING
SUCCESS
EMPTY
PARTIAL
ERROR_RECOVERABLE
ERROR_BLOCKING
OFFLINE/CACHED quando aplicável
```

Exemplo de erro recuperável:

> Não foi possível consultar o índice agora.

Ações possíveis:

```text
[Tentar novamente]
[Pesquisar no acervo completo]
```

## 18. Responsividade

Validar explicitamente:

```text
320–767 px
768–1199 px
>=1200 px
```

Requisitos:

- sem scroll horizontal causado pela interface;
- nenhuma ação essencial escondida;
- resultados legíveis sem truncamento destrutivo;
- drawers/dialogs com foco gerenciado;
- filtros ativos claramente indicados.

## 19. Acessibilidade

Meta: WCAG 2.2 AA nos fluxos implementados.

O design deve prever:

- teclado integral;
- foco visível;
- skip link/landmarks quando aplicável;
- labels programáticos;
- headings coerentes;
- contraste AA;
- zoom 200%;
- reduced motion;
- tri-state anunciado corretamente;
- mensagens não dependentes de cor;
- alvos de interação adequados.

## 20. Sistema visual existente

O Sites deve inspecionar e reutilizar o design system existente antes de criar novos padrões.

Pode evoluir tokens e componentes quando necessário, mas deve registrar:

```text
reutilizado
estendido
novo
```

para cada componente relevante.

Não duplicar botões, campos, listas, estados ou navegação com variantes incompatíveis.

## 21. Invariantes bloqueadoras

O design **não pode**:

- mudar cadeia editorial;
- inventar dimensão “Seção” separada;
- achatar hierarquia administrativa;
- inventar macrogrupos de tipos;
- reescrever temporalidade histórica;
- alterar semântica dos filtros;
- transformar cache em conteúdo atual;
- tratar índice como busca oficial;
- construir página PDF/Flip sem validação;
- tratar capacidade desconhecida como disponível;
- sugerir que login do Novo DOOL concede acesso oficial;
- armazenar corpo HTML no backend como parte do design;
- redesenhar APIs para acomodar um layout.

## 22. Casos adversariais obrigatórios

Testar protótipos com:

- órgão com 6 níveis;
- nome institucional muito longo;
- tipo de publicação muito longo;
- 0 resultados;
- 1 resultado;
- 10.000 resultados;
- 17 subordinados;
- seleção parcial profunda;
- página desconhecida;
- índice atrasado;
- DOOL indisponível;
- cache stale;
- principal + suplemento + extra;
- rede lenta;
- 320 px;
- tablet;
- tela ampla;
- zoom 200%;
- teclado;
- reduced motion.

## 23. Entregáveis esperados do Sites/Work/Codex

Antes de editar código, apresentar:

1. mapa de telas/estados;
2. arquitetura visual;
3. componentes existentes a reutilizar;
4. componentes novos necessários;
5. estratégia responsiva;
6. comportamento das árvores hierárquicas;
7. tratamento de loading/empty/partial/error/cache;
8. riscos de UX encontrados.

Depois da aprovação do desenho:

- aplicar o design no projeto;
- manter contratos tipados/fixtures;
- validar desktop/tablet/mobile;
- executar revisão adversarial;
- registrar divergências da spec antes de alterar comportamento.

## 24. Prompt operacional pronto para o Sites/Work/Codex

```text
Use o repositório guedesle/prototipo-novo-dool como fonte de verdade.

Leia primeiro docs/design/HANDOFF-SITES.md e todos os documentos marcados nele como obrigatórios. Depois inspecione o design system existente e os componentes do projeto antes de propor qualquer novo padrão.

Projete o Novo Diário Oficial como uma aplicação web pública standalone, institucional e independente. A consulta pública não exige extensão nem autenticação própria. O DOOL oficial permanece a fonte documental e a autoridade sobre recursos protegidos. O Novo DOOL possui um índice dimensional histórico próprio para “Explorar publicações”, mas esse índice não deve ser apresentado como a busca oficial.

Não altere arquitetura, APIs, semântica dos dados, regras de negócio, hierarquias, canonicalização, temporalidade ou disponibilidade de recursos para acomodar o layout. Não invente campos, páginas PDF/Flip, agrupamentos de tipos ou estados de autorização. Não crie um segundo design system.

Antes de modificar o projeto, apresente: mapa de telas e estados, arquitetura visual, componentes existentes a reutilizar, componentes novos, estratégia responsiva, tratamento das hierarquias, estados críticos e riscos encontrados.

Trabalhe adversarialmente sobre desktop, tablet e mobile. Priorize consulta editorial, clareza, acessibilidade, rastreabilidade da origem e continuidade entre HTML, PDF e Jornal/Flip.
```

## 25. Gate para iniciar design

O design pode começar quando:

- esta documentação estiver revisada;
- as fixtures mínimas estiverem disponíveis;
- a arquitetura standalone tiver precedência explicitada no roadmap;
- nenhuma implementação funcional do EPIC-05 anterior estiver sendo confundida com a arquitetura alvo.
