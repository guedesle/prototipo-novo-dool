# Roadmap e épicos

## Visão do roadmap

O roadmap foi desenhado para reduzir risco antes de investir em acabamento visual. Cada épico produz evidências necessárias ao seguinte e possui um gate próprio de qualidade.

| Épico | Nome | Resultado principal | Dependências |
|---|---|---|---|
| EPIC-01 | Discovery e contratos do DOOL | Inventário verificável de rotas, chamadas, respostas, sessão e permissões | nenhuma |
| EPIC-02 | Fundação e isolamento da extensão | Shell seguro, reversível e sem interferência quando desativado | EPIC-01 parcial |
| EPIC-03 | Camada de adaptação e sessão | Contratos internos estáveis para dados do DOOL | EPIC-01, EPIC-02 |
| EPIC-04 | Design system, shell e acessibilidade | Base visual e interacional consistente | EPIC-02 |
| EPIC-05 | Home, edições e navegação | Nova entrada do portal e navegação entre edições | EPIC-03, EPIC-04 |
| EPIC-06 | Busca e acervo | Pesquisa moderna, filtros, resultados e estados de erro | EPIC-03, EPIC-04 |
| EPIC-07 | Leitor HTML editorial | Experiência prioritária de leitura e navegação por matéria | EPIC-03, EPIC-04 |
| EPIC-08 | Autenticação, PDF, Jornal e autenticidade | Integração fiel com fluxos protegidos e documentos | EPIC-03, EPIC-04 |
| EPIC-09 | Segurança, qualidade, performance e observabilidade | Hardening e evidências de confiabilidade | EPIC-05 a 08 |
| EPIC-10 | Empacotamento, demonstração e handoff | Pacote demonstrável, roteiro e documentação de transição | EPIC-09 |

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
- CSP/CORS e restrições de extensão;
- mapa de dependências do DOM;
- corpus mínimo de respostas de teste com dados públicos ou sanitizados.

### Gate

Nenhum recurso prioritário pode avançar baseado apenas em suposição de endpoint.

---

## EPIC-02 — Fundação e isolamento da extensão

### Propósito

Garantir que a nova view possa coexistir com o DOOL sem comprometer a experiência original.

### Entregas

- Manifest V3 mínimo;
- detecção de rotas suportadas;
- toggle nova/original;
- shell isolado;
- fallback automático;
- feature flags;
- diagnóstico local seguro.

### Gate

Uma falha da extensão não pode bloquear o portal original.

---

## EPIC-03 — Camada de adaptação e sessão

### Propósito

Impedir que a UI fique acoplada a endpoints, seletores ou detalhes de autenticação.

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

## EPIC-05 — Home, edições e navegação

### Propósito

Redesenhar a porta de entrada e a descoberta de edições.

### Entregas

- edição do dia;
- extras;
- seletor de data;
- navegação entre edições;
- estados de disponibilidade;
- ações para HTML/PDF/Jornal conforme autorização;
- layout responsivo.

### Gate

Usuário consegue localizar e abrir uma edição suportada sem depender da interface legada.

---

## EPIC-06 — Busca e acervo

### Propósito

Tornar a localização de publicações mais clara, eficiente e interpretável.

### Entregas

- busca por termo;
- intervalo de datas;
- filtros suportados pelo backend;
- resultados paginados;
- destaque contextual sem adulterar o documento;
- estados de zero resultado, erro e consulta inválida;
- ações por resultado.

### Gate

A nova UI não pode produzir resultados semanticamente diferentes do backend para a mesma consulta sem deixar explícito o motivo.

---

## EPIC-07 — Leitor HTML editorial

### Propósito

Transformar a leitura HTML em experiência editorial de primeira classe.

### Entregas

- sumário por categoria e matéria;
- leitura confortável;
- navegação anterior/próxima;
- âncoras e deep-link quando viável;
- preferências de texto;
- tratamento de tabelas, imagens e conteúdo longo;
- preservação do conteúdo oficial;
- modo móvel e teclado.

### Gate

Conteúdo não pode ser perdido, reordenado indevidamente ou alterado de forma que mude sentido jurídico/editorial.

---

## EPIC-08 — Autenticação, PDF, Jornal e autenticidade

### Propósito

Modernizar a apresentação de recursos protegidos sem reimplementar autorização.

### Entregas

- estados de usuário;
- integração com login/cadastro/recuperação existentes;
- PDF e Jornal quando autorizados;
- mensagens claras de restrição;
- consulta de autenticidade;
- fallback para fluxos legados quando necessário.

### Gate

A extensão não armazena senha nem concede recurso negado pelo backend.

---

## EPIC-09 — Segurança, qualidade, performance e observabilidade

### Propósito

Submeter o protótipo a condições adversas e produzir evidências objetivas.

### Entregas

- ameaça e superfície de ataque revisadas;
- testes de contrato;
- testes E2E;
- acessibilidade;
- performance;
- conteúdo adversarial;
- falhas de rede;
- logs locais sanitizados;
- checklist de privacidade.

### Gate

Zero problema crítico conhecido que comprometa segurança, fidelidade documental ou acesso ao portal original.

---

## EPIC-10 — Empacotamento, demonstração e handoff

### Propósito

Converter o protótipo técnico em artefato reproduzível para decisão e futura integração.

### Entregas

- build versionado;
- pacote de instalação/distribuição;
- roteiro de demonstração;
- matriz de suporte;
- limitações conhecidas;
- evidências de QA;
- guia de arquitetura para integração oficial;
- plano de descontinuação da extensão após incorporação da UI ao produto.

### Gate

Demonstração reproduzível por terceiro e documentação suficiente para orientar decisão de implantação.

## Ordem de valor para demonstração

Se houver necessidade de uma entrega intermediária, o primeiro recorte demonstrável recomendado é:

**EPIC-01 + EPIC-02 + EPIC-03 + EPIC-04 + EPIC-05 + EPIC-07**.

Esse recorte permite mostrar a mudança visual com dados reais e destacar o leitor HTML, sem depender de completar todos os fluxos protegidos.
