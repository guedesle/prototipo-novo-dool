# EPIC-09 — Segurança, qualidade, performance e observabilidade

**Status:** especificado, não implementado  
**Prioridade:** bloqueadora para release demonstrável  
**Dependências:** EPIC-05 a EPIC-08, com fundamentos dos EPIC-01 a 04

## 1. Objetivo

Submeter o protótipo integrado a validação adversarial, medir sua robustez e produzir evidências reproduzíveis de segurança, acessibilidade, fidelidade editorial, performance e capacidade de diagnóstico.

## 2. Resultado de negócio

A demonstração deixa de ser apenas uma prova visual e passa a possuir evidências suficientes para discussão técnica e executiva sobre viabilidade de integração futura.

## 3. Escopo

- threat model da extensão;
- revisão de permissões Manifest;
- testes de contrato;
- testes E2E;
- testes de sessão/autorização;
- sanitização de HTML;
- regressão visual seletiva;
- acessibilidade automatizada e manual;
- testes responsivos;
- performance comparativa;
- comportamento com rede degradada;
- logs/diagnóstico sanitizados;
- corpus adversarial editorial;
- matriz de bugs/severidade;
- relatório de limitações conhecidas.

## 4. Fora de escopo

- pentest ofensivo no backend de produção;
- teste de carga no DOOL;
- exploração de vulnerabilidades do servidor;
- certificação formal de segurança;
- conformidade jurídica definitiva do produto final.

## 5. Modelo de ameaça mínimo

Ativos a proteger:

- credenciais e sessão do usuário;
- autorização;
- integridade percebida do conteúdo oficial;
- disponibilidade do portal original;
- privacidade de pesquisas e navegação;
- confiança na origem do documento.

Atores/causas de risco:

- conteúdo HTML malformado ou hostil;
- bug da extensão;
- mudança de contrato do DOOL;
- sessão obsoleta;
- dependência comprometida;
- configuração excessiva de permissões;
- vazamento por log/storage;
- erro humano na demonstração.

## 6. Requisitos funcionais

### RF-09.1 — Suite de contrato

Fixtures do EPIC-01/03 devem validar respostas esperadas e incompatibilidades previsíveis.

### RF-09.2 — Suite E2E

Cobrir, no mínimo:

- abrir home;
- selecionar edição;
- abrir HTML;
- navegar matéria;
- pesquisar;
- voltar aos resultados;
- alternar original/nova;
- fluxo protegido representativo quando conta legítima estiver disponível;
- falha de rede e fallback.

### RF-09.3 — Acessibilidade

Executar verificação automatizada e roteiro manual de teclado. Violações críticas/sérias bloqueiam o gate.

### RF-09.4 — Performance

Medir baseline do portal e nova view nas rotas prioritárias em ambiente controlado. A análise deve separar tempo do backend de custo adicional da extensão.

### RF-09.5 — Observabilidade local

Erros devem ter identificador, módulo e classe suficiente para diagnóstico sem registrar segredo ou corpo documental integral.

### RF-09.6 — SBOM/dependências

Registrar dependências de runtime e revisar vulnerabilidades conhecidas relevantes antes do pacote de demonstração.

### RF-09.7 — Regressão de permissões

Qualquer aumento de permissões do Manifest deve aparecer explicitamente na revisão e ser justificado.

## 7. Métricas e gates

### Segurança

- zero senha/token/cookie em storage/log;
- zero permissão sem justificativa;
- zero execução de script editorial no contexto privilegiado;
- zero bypass conhecido de autorização.

### Fidelidade

- zero caso conhecido de matéria truncada silenciosamente;
- zero reordenação conhecida que mude contexto;
- parser incompatível resulta em fallback explícito.

### Acessibilidade

- zero violação crítica ou séria nas rotas-alvo em ferramenta automatizada adotada;
- fluxo principal executável somente por teclado;
- foco e labels revisados manualmente;
- 200% de zoom sem perda de função.

### Robustez

- falha de módulo não elimina acesso ao original;
- 4xx/5xx/timeout possuem estado tratável;
- contrato inesperado não aparece como dado válido.

### Performance

Não há orçamento absoluto fixado antes da escolha do stack. O gate exige:

- métricas antes/depois registradas;
- custo da extensão identificado;
- nenhuma regressão severa sem justificativa;
- módulos pesados carregados apenas quando necessários;
- ausência de download duplicado de documentos grandes sem motivo técnico.

## 8. Classificação de defeitos

### Crítico

- vazamento de credencial/sessão;
- bypass de autorização;
- conteúdo oficial incorreto apresentado como válido;
- extensão torna portal original inutilizável;
- execução de conteúdo não confiável com privilégio.

### Alto

- fluxo principal indisponível sem fallback;
- acessibilidade crítica/séria;
- perda de conteúdo não jurídico mas relevante;
- sessão exibida incorretamente.

### Médio

- degradação importante com workaround claro;
- inconsistência visual que afeta compreensão;
- caso responsivo secundário defeituoso.

### Baixo

- cosmético sem perda funcional.

## 9. Revisão adversarial integrada

Executar uma rodada deliberadamente orientada a falsificar a tese de que o protótipo está pronto:

1. procurar caminhos em que a UI confia demais no backend;
2. procurar caminhos em que a UI confia demais no estado local;
3. tentar quebrar parser com conteúdo válido porém incomum;
4. trocar sessão em outra aba;
5. desabilitar/recarregar extensão durante navegação;
6. interromper rede em momentos diferentes;
7. testar zoom e teclado nos pontos mais complexos;
8. inspecionar logs/storage;
9. comparar conteúdo com origem;
10. revisar cada permissão do Manifest como se fosse excessiva.

A rodada só é concluída quando os achados possuem severidade, decisão e evidência.

## 10. Critérios de aceite

### CA-09-A

Todos os fluxos críticos possuem teste ou evidência manual reproduzível.

### CA-09-B

Não existem defeitos críticos abertos.

### CA-09-C

Defeitos altos estão resolvidos ou, se não bloquearem por razão excepcional, possuem decisão explícita antes da demonstração.

### CA-09-D

Relatório diferencia problema da extensão, limitação do backend e limitação conhecida da demonstração.

### CA-09-E

Logs/storage passam por inspeção de privacidade e segredo.

## 11. Definition of Done

- suites prioritárias executadas;
- threat model revisado;
- permissões revisadas;
- accessibility gate aprovado;
- conteúdo adversarial aprovado;
- performance medida;
- relatório de limitações produzido;
- bugs classificados;
- nenhuma falha crítica conhecida permanece aberta.

## 12. Gate

**G6 aprovado:** protótipo tecnicamente apto a ser empacotado para demonstração controlada.
