# Roadmap e épicos

## Visão do roadmap

O roadmap reduz risco antes de acabamento visual e separa claramente **fonte oficial**, **índice dimensional**, **plataforma web standalone** e **experiência de usuário**.

A partir da decisão arquitetural de 2026-09-14, o modo principal do protótipo é uma **aplicação web pública standalone hospedada na Hostinger**. A extensão Chromium permanece como modo secundário/experimental de integração e não é requisito de uso.

Especificação arquitetural de referência:

`docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`

| Épico | Nome | Resultado principal | Dependências |
|---|---|---|---|
| EPIC-01 | Discovery e contratos do DOOL | Inventário verificável de rotas, chamadas, respostas, sessão e permissões | nenhuma |
| EPIC-02 | Fundação e isolamento da extensão | Modo secundário seguro, reversível e sem interferência | EPIC-01 parcial |
| EPIC-03 | Camada de adaptação e sessão | Contratos internos estáveis para dados do DOOL | EPIC-01, EPIC-02 |
| EPIC-04 | Design system, shell e acessibilidade | Base visual e interacional consistente | EPIC-02 |
| EPIC-04.5 | Índice Dimensional Público do DOOL | Histórico cumulativo consultável por dimensões, títulos e página inicial | EPIC-01, EPIC-03 |
| EPIC-04.6 | Plataforma Web Standalone + BFF | Novo DOOL público por URL, sem extensão obrigatória | EPIC-01, EPIC-03, EPIC-04, EPIC-04.5 |
| EPIC-05 | Home, edições e navegação | Porta de entrada pública e navegação entre edições | EPIC-03, EPIC-04, EPIC-04.5, EPIC-04.6 |
| EPIC-06 | Explorar publicações + acervo oficial | Consulta dimensional e acesso claramente separado à busca oficial | EPIC-03, EPIC-04, EPIC-04.5, EPIC-04.6 |
| EPIC-07 | Leitor HTML editorial | Experiência prioritária de leitura e navegação por matéria | EPIC-03, EPIC-04, EPIC-04.6 |
| EPIC-08 | Identidade, autenticação, PDF, Jornal e autenticidade | Recursos próprios opcionais e integração fiel com proteções oficiais | EPIC-03, EPIC-04, EPIC-04.6 |
| EPIC-09 | Segurança, qualidade, performance e observabilidade | Hardening e evidências de confiabilidade | EPIC-04.5 a 08 |
| EPIC-10 | Deploy, demonstração e handoff | Site demonstrável, roteiro e documentação de transição | EPIC-09 |

---

## EPIC-01 — Discovery e contratos do DOOL

### Propósito

Transformar observações visuais em conhecimento técnico verificável.

### Entregas

- mapa de páginas e rotas;
- captura de chamadas por fluxo;
- métodos, parâmetros, cabeçalhos relevantes e formatos de resposta;
- matriz anônimo/cadastrado/assinante;
- inventário de operações somente leitura e de mutações;
- CSP/CORS e restrições;
- mapa de dependências do DOM;
- corpus mínimo de respostas de teste com dados públicos ou sanitizados.

### Gate

Nenhum recurso prioritário avança baseado apenas em suposição de endpoint.

---

## EPIC-02 — Fundação e isolamento da extensão

### Propósito

Manter a extensão como modo secundário de demonstração/integração sem comprometer o portal original.

### Entregas

- Manifest V3 mínimo;
- detecção de rotas suportadas;
- toggle nova/original;
- shell isolado;
- fallback automático;
- feature flags;
- diagnóstico local seguro.

### Gate

Uma falha da extensão não pode bloquear o portal original, e nenhuma funcionalidade pública do modo standalone pode depender da extensão para existir.

---

## EPIC-03 — Camada de adaptação e sessão

### Propósito

Impedir que UI, BFF e ingestão fiquem acoplados a endpoints, seletores ou detalhes frágeis de autenticação.

### Entregas

- adaptadores por domínio;
- normalização de dados;
- detecção de estado de acesso;
- tratamento uniforme de erros;
- contratos versionáveis;
- fixtures de teste.

### Gate

Componentes de UI não acessam endpoints nem cookies diretamente.

---

## EPIC-04 — Design system, shell e acessibilidade

### Propósito

Criar a linguagem visual e estrutural que suportará todas as experiências.

### Entregas

- tokens;
- tipografia;
- grid e breakpoints;
- cabeçalho e navegação;
- componentes de formulário, lista, feedback e diálogo;
- foco, teclado, contraste e reduced motion;
- padrões de estados vazios, erro e carregamento.

### Gate

Componentes-base passam por validação de teclado e acessibilidade automatizada antes de serem usados em escala.

---

## EPIC-04.5 — Índice Dimensional Público do DOOL

### Propósito

Construir um índice histórico cumulativo de metadados das publicações para consulta por período, caderno, órgão, subordinados, tipo, edição e título.

### Entregas

- modelo dimensional;
- hierarquia organizacional temporal;
- canonicalização/aliases conservadores;
- `source_start_page` e validação com catálogo da edição;
- backfill inicial de 90 dias;
- sync horário;
- reconciliação diária dos últimos 7 dias;
- busca textual por títulos e autocomplete;
- API pública somente leitura;
- observabilidade de ingestão.

### Gate

Índice é idempotente, cumulativo, auditável e não inventa identidade, hierarquia ou página.

---

## EPIC-04.6 — Plataforma Web Standalone + BFF

### Propósito

Permitir que qualquer usuário acesse o Novo DOOL por URL, sem instalar extensão, preservando o DOOL oficial como fonte documental.

### Entregas

- frontend standalone;
- BFF server-to-server;
- contratos fechados para HTML/PDF/Flip;
- integração com índice dimensional;
- health/status;
- deploy Hostinger;
- limites claros entre sessão própria e autorização oficial.

### Gate

Fluxos públicos prioritários funcionam em navegador limpo sem extensão; recurso protegido nunca é liberado por sessão própria do Novo DOOL.

---

## EPIC-05 — Home, edições e navegação

### Propósito

Redesenhar a porta de entrada pública e a descoberta de edições.

### Entregas

- edição do dia;
- suplementos/extras;
- seletor de data/edição dentro dos contratos reais;
- estados de disponibilidade;
- ações HTML/PDF/Jornal conforme capacidade;
- entrada destacada para “Explorar publicações”;
- layout responsivo e teclado.

### Gate

Usuário consegue localizar e abrir uma edição suportada no site standalone sem depender da interface legada ou da extensão.

---

## EPIC-06 — Explorar publicações + acervo oficial

### Propósito

Oferecer uma experiência dimensional moderna sem confundir o índice próprio com a busca oficial.

### Entregas

- termo/título;
- período;
- caderno;
- árvore de órgão/subordinados;
- tipo de publicação;
- edição/tipo de edição;
- facetas/contagens;
- autocomplete e sugestão ortográfica transparente;
- resultados paginados;
- ações HTML/PDF/Jornal por resultado;
- entrada separada para acervo completo/busca oficial.

### Gate

A UI identifica claramente a origem/escopo da consulta e nunca apresenta dado inventado ou página inferida.

---

## EPIC-07 — Leitor HTML editorial

### Propósito

Transformar a leitura HTML em experiência editorial de primeira classe.

### Entregas

- sumário por categoria e matéria;
- leitura confortável;
- navegação anterior/próxima;
- preferências de texto;
- tratamento de tabelas, imagens e conteúdo longo;
- sanitização;
- cache local de 24h;
- fallback “última visualização”;
- modo móvel e teclado.

### Gate

Conteúdo não pode ser perdido, reordenado indevidamente ou alterado de forma que mude sentido jurídico/editorial; cache stale nunca é apresentado como atualizado.

---

## EPIC-08 — Identidade, autenticação, PDF, Jornal e autenticidade

### Propósito

Separar identidade própria opcional do Novo DOOL de autenticação/autorização oficial e modernizar a apresentação dos documentos.

### Entregas

- conta própria opcional para preferências/favoritos/buscas salvas/alertas;
- preferência por OAuth/OIDC quando identidade própria for ativada;
- Gate AUTH-DOOL antes de qualquer login oficial integrado;
- PDF/Jornal por página validada;
- mensagens claras de restrição;
- autenticidade quando contrato estiver demonstrado;
- encaminhamento/fallback para fluxo oficial quando necessário.

### Gate

O Novo DOOL não armazena senha do DOOL, não copia sessão oficial e não concede recurso negado pelo sistema oficial.

---

## EPIC-09 — Segurança, qualidade, performance e observabilidade

### Propósito

Submeter o sistema integrado a condições adversas e produzir evidências objetivas.

### Entregas

- threat model do site+BFF+ingestor e da extensão secundária;
- testes de contrato;
- testes E2E;
- acessibilidade;
- performance;
- conteúdo adversarial;
- falhas de rede;
- logs sanitizados;
- privacidade;
- observabilidade do sync;
- revisão de BFF contra SSRF e bypass de autorização.

### Gate

Zero problema crítico conhecido que comprometa segurança, fidelidade documental, autorização ou disponibilidade do modo principal.

---

## EPIC-10 — Deploy, demonstração e handoff

### Propósito

Converter o protótipo em aplicação pública demonstrável e artefato reproduzível para decisão e futura integração.

### Entregas

- build versionado do site standalone;
- deploy Hostinger;
- roteiro de demonstração;
- matriz de suporte;
- limitações conhecidas;
- evidências de QA;
- guia de arquitetura;
- documentação da extensão como modo secundário;
- plano de eventual integração oficial.

### Gate

Demonstração reproduzível por terceiro apenas com URL para os fluxos públicos e documentação suficiente para orientar decisão de implantação.

## Ordem de valor para demonstração

Primeiro recorte standalone recomendado:

**EPIC-01 + EPIC-03 + EPIC-04 + EPIC-04.5 + EPIC-04.6 + EPIC-05 + EPIC-07**.

O EPIC-06 agrega o principal ganho de descoberta dimensional e deve entrar na mesma sequência assim que o índice/API estiverem utilizáveis.

## Estado de execução após a decisão de 2026-09-14

- EPIC-04 concluído e reutilizável como base visual;
- execução anterior do EPIC-05 deve permanecer pausada;
- retomar EPIC-05 somente após revisão do novo plano baseado nos EPIC-04.5/04.6;
- design deve partir de `docs/design/HANDOFF-SITES.md`.
