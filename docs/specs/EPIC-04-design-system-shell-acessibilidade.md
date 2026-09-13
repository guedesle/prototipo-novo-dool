# EPIC-04 — Design system, shell e acessibilidade

**Status:** especificado, não implementado  
**Prioridade:** alta  
**Dependências:** EPIC-02; contratos de navegação do EPIC-03 quando aplicáveis

## 1. Objetivo

Criar a base visual, semântica e interacional da nova experiência do DOOL, de modo que os módulos seguintes reutilizem padrões consistentes e acessíveis em vez de criarem soluções isoladas por página.

## 2. Resultado de negócio

A nova interface deve parecer um produto único, contemporâneo e institucional, facilitar leitura e localização de informação e funcionar com teclado, zoom e tecnologias assistivas nos fluxos cobertos.

## 3. Escopo

- tokens de design;
- tipografia editorial e de interface;
- grid, espaçamento e breakpoints;
- shell global;
- cabeçalho e navegação;
- breadcrumbs quando necessários;
- botões, links, campos, selects, date inputs e filtros;
- cards/listas de edição e resultado;
- estados loading/empty/error/success;
- dialogs/drawers quando indispensáveis;
- feedback de foco;
- skip links e landmarks;
- padrões de navegação por teclado;
- reduced motion;
- preferências de leitura compartilhadas com o EPIC-07.

## 4. Fora de escopo

- identidade visual institucional definitiva sem insumos oficiais;
- animações decorativas complexas;
- componentes sem uso previsto nos épicos 5 a 8;
- redefinição de marca;
- implementação de recursos de negócio dentro dos componentes base.

## 5. Princípios de UX

1. O conteúdo oficial é protagonista; chrome de interface deve ser discreto.
2. A tarefa principal deve ser evidente sem tutorial.
3. Estados de acesso e validade documental precisam ser compreensíveis em linguagem comum.
4. A interface deve reduzir densidade visual sem esconder informação necessária.
5. Mobile não é versão reduzida: nenhuma ação essencial pode desaparecer.
6. Preferências de leitura não podem modificar o conteúdo semântico do ato.
7. Componentes devem priorizar HTML semântico nativo antes de ARIA customizada.

## 6. Requisitos funcionais

### RF-04.1 — Tokens

Definir tokens semânticos para cor, tipografia, espaçamento, borda, elevação, foco e motion. Valores não devem ser espalhados de forma arbitrária pelas telas.

### RF-04.2 — Shell responsivo

O shell deve suportar, no mínimo, larguras de 320 px, 768 px, desktop comum e tela ampla, sem scroll horizontal causado pela interface.

### RF-04.3 — Navegação por teclado

Todo controle interativo deve ser alcançável e operável por teclado; ordem de foco deve acompanhar a leitura visual.

### RF-04.4 — Foco visível

Não remover outline sem substituto equivalente. O foco deve ser perceptível em todos os fundos usados.

### RF-04.5 — Zoom e reflow

Em zoom de 200%, conteúdo e ações prioritárias devem permanecer disponíveis sem sobreposição destrutiva.

### RF-04.6 — Motion

Animações não essenciais devem respeitar `prefers-reduced-motion`. Nenhuma informação pode depender exclusivamente de animação.

### RF-04.7 — Estados universais

Todo padrão que dependa de dados deve possuir estados de carregamento, vazio, erro recuperável e sucesso quando aplicável.

### RF-04.8 — Mensagens de acesso

Mensagens sobre PDF, assinatura, login ou validade devem explicar o estado sem sugerir que a extensão controla a autorização.

## 7. Acessibilidade alvo

Meta: WCAG 2.2 AA nos fluxos implementados.

Critérios mínimos:

- contraste AA;
- landmarks corretos;
- heading hierarchy coerente;
- labels programáticos;
- mensagens de erro associadas aos campos;
- live region somente quando necessária;
- skip link para conteúdo principal;
- dialogs com foco gerenciado;
- conteúdo não dependente de cor;
- alvos de interação adequados;
- suporte a teclado completo.

## 8. Critérios de aceite

### CA-04-A

Biblioteca-base cobre os componentes efetivamente usados nos épicos 5 a 8 sem duplicações desnecessárias.

### CA-04-B

Fluxo do shell completo é navegável somente por teclado.

### CA-04-C

Verificação automatizada não encontra violações críticas ou sérias nos componentes-base e páginas de referência.

### CA-04-D

Zoom 200% e viewport de 320 px não removem conteúdo ou ação essencial.

### CA-04-E

Reduced motion desativa/reduz transições não essenciais.

### CA-04-F

Erros e estados vazios usam texto claro e ação de recuperação quando houver.

## 9. Revisão adversarial

Testar:

- título muito longo;
- número de edição longo/incomum;
- palavras sem espaço;
- viewport estreito;
- 200% e 400% de zoom como exploração;
- teclado sem mouse;
- leitor de tela em navegação estrutural;
- contraste em todos os estados;
- botão desabilitado e loading;
- formulário com múltiplos erros;
- conteúdo carregando lentamente;
- motion reduzido;
- CSS legado tentando afetar componentes.

Pergunta crítica: **a modernização está tornando a informação mais compreensível ou apenas trocando a estética?** Se a tarefa continuar tão difícil quanto antes, o épico falha como UX.

## 10. Estratégia de testes

- testes unitários de componentes quando úteis;
- acessibilidade automatizada;
- stories/sandbox ou equivalente para estados;
- E2E de teclado;
- matriz responsiva;
- revisão manual sem mouse;
- validação de contraste e semântica.

## 11. Definition of Done

- tokens e componentes-base existem apenas para necessidades reais;
- shell responsivo validado;
- padrões de loading/erro/vazio consistentes;
- acessibilidade base aprovada;
- documentação de uso suficiente para os épicos seguintes;
- nenhuma decisão visual cria dependência de backend.

## 12. Gate

**Gate de UI aprovado:** módulos funcionais podem ser construídos sobre uma base consistente sem retrabalho estrutural previsível.
