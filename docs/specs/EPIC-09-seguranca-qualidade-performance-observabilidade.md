# EPIC-09 — Segurança, qualidade, performance e observabilidade

**Status:** reespecificado, não implementado no modo standalone  
**Prioridade:** bloqueadora para release demonstrável  
**Dependências:** EPIC-04.5 a EPIC-08, com fundamentos dos EPIC-01 a 04

## 1. Objetivo

Submeter a aplicação standalone, BFF, índice dimensional, ingestor, leitores e extensão secundária a validação adversarial, produzindo evidências reproduzíveis de segurança, acessibilidade, fidelidade editorial, performance e capacidade de diagnóstico.

## 2. Resultado de negócio

A demonstração deixa de ser apenas visual e passa a sustentar uma decisão técnica sobre viabilidade do Novo DOOL público sem ocultar limites, dependências da fonte oficial ou riscos operacionais.

## 3. Escopo

- threat model do site standalone;
- threat model do BFF;
- threat model do ingestor/MySQL;
- revisão da extensão como modo secundário;
- testes de contrato;
- testes E2E;
- segurança de autenticação própria quando existir;
- Gate AUTH-DOOL e autorização oficial;
- sanitização de HTML;
- regressão visual seletiva;
- acessibilidade automatizada e manual;
- testes responsivos;
- performance de API/BFF/índice;
- comportamento com rede degradada e DOOL indisponível;
- logs/diagnóstico sanitizados;
- corpus adversarial editorial;
- integridade de `source_start_page`;
- observabilidade de sync/reconciliação;
- revisão contra SSRF/proxy aberto;
- matriz de bugs/severidade;
- relatório de limitações conhecidas.

## 4. Fora de escopo

- pentest ofensivo não autorizado no backend do DOOL;
- teste de carga agressivo no DOOL;
- exploração de vulnerabilidades do servidor oficial;
- certificação formal de segurança;
- conformidade jurídica definitiva do produto final.

## 5. Modelo de ameaça mínimo

Ativos:

- credenciais e sessões próprias;
- credenciais/sessões oficiais quando houver integração suportada;
- autorização;
- integridade percebida do conteúdo oficial;
- disponibilidade do site e do portal oficial;
- privacidade de pesquisas/favoritos/preferências;
- integridade do índice dimensional;
- temporalidade de hierarquia;
- evidência de página inicial;
- origem do documento.

Riscos:

- conteúdo HTML malformado/hostil;
- bug do frontend/BFF;
- SSRF;
- mudança de contrato do DOOL;
- sessão obsoleta;
- dependência comprometida;
- credencial de banco exposta;
- API pública com permissão de escrita;
- vazamento por log/storage;
- canonicalização incorreta;
- página inferida;
- cache stale apresentado como atual;
- falha do scheduler;
- erro humano na demonstração.

## 6. Requisitos funcionais

### RF-09.1 — Suite de contrato

Fixtures do discovery e contratos novos da API dimensional devem validar respostas esperadas e incompatibilidades previsíveis.

### RF-09.2 — Suite E2E

Cobrir, no mínimo:

- abrir Home standalone;
- selecionar edição;
- explorar publicações;
- filtrar órgão/subordinados/tipo/período;
- abrir HTML;
- abrir PDF/Jornal na página validada;
- retornar preservando contexto;
- acessar acervo oficial;
- falha de índice;
- falha do DOOL;
- cache stale;
- recurso protegido;
- extensão secundária representativa quando necessário.

### RF-09.3 — Acessibilidade

Executar verificação automatizada e roteiro manual de teclado. Violações críticas/sérias bloqueiam o gate.

### RF-09.4 — Performance

Medir separadamente:

- frontend;
- BFF;
- API dimensional;
- banco;
- tempo de origem DOOL;
- custo adicional de proxy/sanitização.

Metas iniciais da arquitetura são objetivos de engenharia, não resultados garantidos:

```text
consulta indexada P95 <= 500 ms backend
autocomplete P95 <= 300 ms backend
árvore/facetas P95 <= 500 ms backend
```

### RF-09.5 — Observabilidade

Erros devem ter identificador, módulo e classe suficiente para diagnóstico sem registrar segredo ou corpo documental integral.

### RF-09.6 — Sync

Validar:

- idempotência;
- lock de concorrência;
- partial success;
- reconciliação;
- contagens por `page_mapping_status`;
- alteração por fingerprint;
- falha sem falsa atualização do `indexLastUpdatedAt`.

### RF-09.7 — BFF

Verificar:

- nenhuma URL arbitrária aceita;
- allowlist de host/path;
- validação de parâmetros;
- timeouts;
- rate limiting;
- CORS explícito;
- Range/206 de PDF quando aplicável.

### RF-09.8 — Banco

Verificar usuário da API como somente leitura e segregação do usuário de ingestão.

### RF-09.9 — SBOM/dependências

Registrar dependências runtime e vulnerabilidades conhecidas relevantes.

## 7. Métricas e gates

### Segurança

- zero senha/token/cookie oficial em storage/log;
- zero credencial MySQL no frontend;
- zero endpoint público de escrita dimensional;
- zero proxy aberto/SSRF conhecido;
- zero execução privilegiada de script editorial;
- zero bypass conhecido de autorização.

### Fidelidade

- zero truncamento silencioso conhecido;
- zero reordenação que mude contexto;
- zero página inferida como válida;
- parser incompatível produz falha explícita/fallback;
- hierarquia histórica respeita período.

### Acessibilidade

- zero violação crítica/séria nas rotas-alvo da ferramenta adotada;
- fluxo principal somente por teclado;
- foco/labels revisados;
- 200% de zoom sem perda de função;
- 320 px funcional.

### Robustez

- falha do índice não destrói acesso à edição/recursos oficiais que possam continuar funcionando;
- 4xx/5xx/timeout têm estado tratável;
- contrato inesperado não aparece como dado válido;
- falha do sync não marca o índice como atualizado.

### Performance

- métricas registradas;
- origem e custo próprio separados;
- nenhuma regressão severa sem decisão explícita;
- documentos grandes não são baixados duplicadamente sem necessidade.

## 8. Classificação de defeitos

### Crítico

- vazamento de credencial/sessão;
- bypass de autorização;
- conteúdo oficial incorreto apresentado como válido;
- página errada apresentada como correspondente;
- proxy aberto/SSRF explorável;
- escrita não autorizada no índice;
- execução de conteúdo não confiável com privilégio.

### Alto

- fluxo principal indisponível sem fallback;
- acessibilidade crítica/séria;
- hierarquia temporal incorreta;
- cache stale apresentado como atual;
- sessão/capacidade oficial exibida incorretamente.

### Médio

- degradação importante com workaround;
- inconsistência visual que afeta compreensão;
- caso responsivo secundário defeituoso.

### Baixo

- cosmético sem perda funcional.

## 9. Revisão adversarial integrada

Executar rodada orientada a falsificar a tese de prontidão:

1. tentar fazer a UI confiar demais no índice;
2. tentar fazer o BFF aceitar destino arbitrário;
3. tentar obter recurso oficial protegido usando apenas sessão própria;
4. quebrar parser com HTML válido incomum;
5. alterar hierarquia administrativa entre períodos;
6. enviar publicação com página ausente/fora do catálogo;
7. interromper rede em momentos diferentes;
8. atrasar/falhar sync;
9. testar zoom/teclado/320 px;
10. inspecionar logs/storage;
11. comparar conteúdo com origem;
12. revisar permissões da extensão secundária.

A rodada termina apenas quando cada achado possui severidade, decisão e evidência.

## 10. Critérios de aceite

### CA-09-A

Fluxos críticos possuem teste ou evidência manual reproduzível.

### CA-09-B

Não existem defeitos críticos abertos.

### CA-09-C

Defeitos altos estão resolvidos ou possuem decisão excepcional explícita antes da demonstração.

### CA-09-D

Relatório diferencia problema do Novo DOOL, limitação da Hostinger/configuração, limitação do DOOL oficial e limitação de demonstração.

### CA-09-E

Logs/storage passam por inspeção de privacidade e segredo.

### CA-09-F

API/BFF/ingestor possuem observabilidade suficiente para explicar falha sem expor dados sensíveis.

## 11. Definition of Done

- suites prioritárias executadas;
- threat model revisado;
- BFF revisado contra SSRF;
- banco revisado por privilégio mínimo;
- accessibility gate aprovado;
- conteúdo adversarial aprovado;
- temporalidade/página validadas;
- performance medida;
- relatório de limitações produzido;
- bugs classificados;
- nenhuma falha crítica conhecida aberta.

## 12. Gate

**G9 aprovado:** aplicação standalone tecnicamente apta a deploy/demonstração controlada, sem alterar a autoridade ou o modelo de segurança do DOOL.
