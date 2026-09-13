# Planejamento do projeto

## 1. Estratégia geral

O projeto será executado em etapas que reduzam risco técnico e evitem transformar uma demonstração visual em um protótipo frágil. A ordem privilegia conhecimento do sistema atual, isolamento da extensão e contratos estáveis antes da construção das telas finais.

## 2. Fases

### Fase 0 — Baseline documental

Objetivo: consolidar visão, escopo, estado atual, arquitetura, riscos, roadmap e specs.

Saída:

- documentação-base;
- specs dos épicos;
- matriz de rastreabilidade;
- critérios de qualidade;
- autorização explícita para implementação.

**Gate G0:** nenhuma implementação antes da aprovação do conjunto documental.

### Fase 1 — Discovery técnico do DOOL

Objetivo: identificar, sem alterar o backend, os contratos e comportamentos reais usados pelo portal.

Atividades:

- inventário de páginas e rotas;
- captura controlada de `fetch`/XHR/documentos;
- mapeamento de parâmetros e respostas;
- identificação de cookies/sessão sem registrar segredos;
- matriz por perfil de acesso;
- identificação de CSP/CORS e dependências do DOM;
- catalogação de mutações e operações somente leitura.

**Gate G1:** os fluxos prioritários precisam ter contrato ou estratégia de adaptação comprovada.

### Fase 2 — Fundação segura da extensão

Objetivo: criar o shell técnico mínimo capaz de ativar/desativar a experiência, isolar estilos, registrar diagnósticos locais e voltar ao portal original.

**Gate G2:** extensão não pode degradar o DOOL quando desativada ou quando falhar.

### Fase 3 — Camada de adaptação

Objetivo: encapsular as interações com o sistema atual em contratos internos estáveis.

Princípio: componentes de UI não devem conhecer detalhes de endpoint, cookie ou DOM legado.

**Gate G3:** adaptadores testados para sucesso, erro, resposta incompleta, usuário não autorizado e mudança de contrato detectável.

### Fase 4 — Experiência pública

Objetivo: entregar nova navegação, home, edições, busca/acervo e leitor HTML para acesso público.

**Gate G4:** fluxos públicos completos, responsivos, utilizáveis por teclado e com fallback.

### Fase 5 — Experiência autenticada e documentos protegidos

Objetivo: integrar os estados de autenticação e acesso existentes sem reimplementar segurança do servidor.

**Gate G5:** nenhuma credencial armazenada pela extensão; permissões espelham o backend; cenários anônimo/cadastrado/assinante validados.

### Fase 6 — Hardening e validação adversarial

Objetivo: testar conteúdo incomum, erros de rede, contratos inesperados, segurança, acessibilidade, performance e regressão.

**Gate G6:** zero falha crítica conhecida; zero violação crítica/séria de acessibilidade automatizada nas rotas-alvo; cenários adversariais documentados.

### Fase 7 — Pacote de demonstração e handoff

Objetivo: tornar o protótipo reproduzível para apresentação e avaliação.

Saída:

- pacote instalável;
- roteiro de demonstração;
- matriz de funcionalidades suportadas;
- limitações conhecidas;
- evidências de QA;
- guia de integração futura.

**Gate G7:** outra pessoa consegue instalar e executar a demonstração seguindo apenas a documentação.

## 3. Sequência dos épicos

A ordem planejada é:

1. EPIC-01 — Discovery e contratos do DOOL
2. EPIC-02 — Fundação e isolamento da extensão
3. EPIC-03 — Camada de adaptação e sessão
4. EPIC-04 — Design system, shell e acessibilidade
5. EPIC-05 — Home, edições e navegação
6. EPIC-06 — Busca e acervo
7. EPIC-07 — Leitor HTML editorial
8. EPIC-08 — Autenticação, PDF, Jornal e autenticidade
9. EPIC-09 — Segurança, qualidade, performance e observabilidade
10. EPIC-10 — Empacotamento, demonstração e handoff

Os épicos 4 a 8 podem ter trabalho paralelo após os contratos fundamentais dos épicos 1 a 3 estarem estáveis, mas nenhum deve contornar um gate pendente.

## 4. Critérios de priorização

Em caso de conflito de prazo, priorizar nesta ordem:

1. segurança e preservação do ambiente oficial;
2. fidelidade das regras de negócio;
3. leitura HTML;
4. busca e localização de conteúdo;
5. acessibilidade;
6. responsividade;
7. consistência visual;
8. elementos cosméticos de demonstração.

## 5. Política de decisões

Decisões devem ser classificadas como:

- **confirmadas:** sustentadas por evidência do sistema atual ou decisão explícita;
- **hipóteses:** precisam de experimento;
- **adiadas:** não bloqueiam a fase atual;
- **bloqueadoras:** impedem avanço de um gate.

Nenhum endpoint, formato de token, biblioteca ou comportamento interno deverá aparecer como fato em código ou documentação se ainda estiver na categoria de hipótese.

## 6. Política de implementação

A fase de implementação ainda não está autorizada. Quando houver autorização:

- cada épico deve partir de sua spec;
- tarefas devem ser pequenas e verificáveis;
- comportamento novo deve vir acompanhado de teste compatível;
- falhas encontradas em produção devem ser reproduzidas antes de correção;
- alterações arquiteturais devem atualizar a documentação correspondente;
- nenhum “mock” pode ser apresentado como integração real.

## 7. Marco de decisão atual

O projeto está deliberadamente parado antes da implementação. O próximo marco de governança é a revisão humana das especificações completas e a decisão sobre iniciar ou não o desenvolvimento.
