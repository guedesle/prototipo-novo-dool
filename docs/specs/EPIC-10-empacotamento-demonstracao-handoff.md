# EPIC-10 — Deploy, demonstração e handoff

**Status:** reespecificado, não implementado no modo standalone  
**Prioridade:** alta para encerramento da fase  
**Dependências:** EPIC-09 aprovado

## 1. Objetivo

Transformar o Novo DOOL validado em uma aplicação pública demonstrável, reproduzível e compreensível por terceiros, com deploy standalone, documentação arquitetural e evidências suficientes para avaliação executiva/técnica.

## 2. Resultado de negócio

Uma pessoa que não participou do desenvolvimento deve conseguir abrir o protótipo por URL, executar o roteiro principal, diferenciar índice próprio de fonte oficial, compreender limitações e avaliar quais componentes podem ser aproveitados em uma implementação definitiva.

## 3. Escopo

- deploy Hostinger versionado;
- identificação de build/commit;
- checksum/identificação de artefatos quando aplicável;
- documentação de configuração/deploy;
- roteiro de demonstração;
- matriz de funcionalidades suportadas;
- matriz público/identidade própria/recurso oficial protegido;
- limitações conhecidas;
- evidências de QA;
- changelog;
- troubleshooting;
- guia de arquitetura/handoff;
- guia de operação do índice/ingestor;
- plano de backup/restore;
- plano de integração futura;
- documentação da extensão como modo secundário;
- plano de retirada/reuso da extensão se o standalone evoluir para produto oficial.

## 4. Fora de escopo

- implantação no backend oficial do DOOL;
- suporte operacional permanente;
- compatibilidade garantida com contratos futuros não testados;
- transformar o protótipo em produto final sem nova avaliação arquitetural;
- distribuição de recurso oficial protegido além das regras do DOOL.

## 5. Requisitos funcionais

### RF-10.1 — Build identificável

A interface deve permitir consultar versão, commit/build de origem e data sem expor segredos.

### RF-10.2 — Acesso reproduzível

Fluxos públicos da demonstração devem funcionar apenas com a URL do site, sem instalação de extensão.

### RF-10.3 — Roteiro principal

Demonstrar, no mínimo:

1. Home/edição do dia;
2. suplementos/extras quando existirem ou fixture claramente identificada;
3. “Explorar publicações”;
4. filtros hierárquicos;
5. busca/autocomplete;
6. abertura HTML;
7. abertura PDF/Jornal na página validada;
8. fallback de página ausente;
9. cache/última visualização em cenário controlado;
10. acesso separado ao acervo oficial;
11. responsividade;
12. recurso protegido somente quando legitimamente autorizado e validado.

### RF-10.4 — Matriz de suporte

Cada funcionalidade deve ser classificada como:

- integrada e validada;
- integrada com limitação conhecida;
- usa fonte oficial via BFF;
- usa índice dimensional próprio;
- fallback/encaminhamento para DOOL;
- simulada para UX — somente se explicitamente identificada;
- fora de escopo.

### RF-10.5 — Evidências

Manter referência a testes, corpus, fixtures, gates de design e resultados do EPIC-09.

### RF-10.6 — Handoff

Documentar:

- arquitetura standalone;
- BFF;
- índice dimensional;
- temporalidade/canonicalização;
- `source_start_page`;
- ingestão/reconciliação;
- fonte documental;
- autenticação própria versus oficial;
- limites dos adaptadores;
- pontos frágeis;
- decisões que precisam ser revisitadas para produção;
- componentes reutilizáveis;
- mecanismos exclusivos do protótipo/extensão.

### RF-10.7 — Operação

Documentar:

- variáveis de ambiente sem valores secretos;
- migrations;
- cron/scheduler;
- health/readiness;
- logs;
- backup/restore;
- procedimento de backfill/reconciliação;
- diagnóstico de índice atrasado.

## 6. Princípio de demonstração honesta

O pacote/site não deve sugerir que:

- fixture é dado oficial real;
- índice próprio é a busca oficial;
- cache stale é conteúdo atualizado;
- sessão própria equivale a autorização DOOL;
- página não validada possui correspondência PDF/Flip;
- recurso protegido está integrado quando apenas redireciona ao fluxo oficial.

A demonstração valida a viabilidade da nova experiência, não certifica por si só a implantação definitiva.

## 7. Plano de transição futura

### Reutilizáveis

- design system;
- componentes de UI;
- modelos normalizados;
- contratos da API própria;
- modelo dimensional;
- testes de UX;
- parte dos adapters DOOL estáveis;
- regras de sanitização/observabilidade.

### Reavaliar

- camada de sessão oficial;
- BFF e transporte, caso a implementação oficial ganhe APIs internas;
- hospedagem/escala;
- estratégia de busca se o volume exigir engine especializada;
- provedor de identidade próprio.

### Descartar ou reduzir

- bootstrap/content script da extensão;
- toggle de sobreposição;
- hacks de DOM;
- permissões Manifest exclusivas do modo secundário.

## 8. Critérios de aceite

### CA-10-A

Terceiro abre o site por URL e executa fluxos públicos seguindo apenas a documentação.

### CA-10-B

Versão demonstrada corresponde ao commit/build e às evidências de QA.

### CA-10-C

Matriz de suporte identifica origem e estado de cada recurso.

### CA-10-D

Handoff diferencia índice próprio, fonte documental, busca oficial, identidade própria e autorização oficial.

### CA-10-E

Operação do índice/ingestor possui documentação suficiente para diagnóstico/restore.

### CA-10-F

Extensão está claramente documentada como modo secundário e sua remoção não impede o uso público do standalone.

### CA-10-G

Nenhuma fixture é apresentada como integração real.

## 9. Revisão adversarial

Testar demonstração como terceiro sem contexto:

- navegador/perfil limpo;
- extensão ausente;
- rota inicial diferente da Home;
- rede instável;
- DOOL indisponível;
- índice atrasado;
- página ausente;
- tamanho de tela diferente;
- build antigo em cache;
- recurso protegido sem sessão oficial;
- pessoa tenta interpretar fixture como dado real;
- restore/backfill em ambiente controlado;
- falha de um subsistema sem mensagem adequada.

Pergunta crítica:

> A demonstração mostra claramente o que está integrado e o que continua dependente da fonte oficial, sem exigir conhecimento prévio do projeto?

## 10. Estratégia de validação

- execução por terceiro;
- checklist de versão;
- comparação matriz de suporte x build;
- revisão do material de handoff por pessoa não envolvida;
- inspeção de status/health;
- simulação de falha de origem/índice;
- verificação da ausência de dependência da extensão para fluxos públicos.

## 11. Definition of Done

- site standalone publicado/versionado;
- configuração/deploy documentados;
- roteiro validado;
- matriz de suporte publicada;
- limitações conhecidas publicadas;
- evidências de QA associadas;
- handoff arquitetural concluído;
- operação do índice documentada;
- plano de integração futura publicado;
- extensão documentada como modo secundário.

## 12. Gate

**G10 aprovado:** Novo DOOL standalone pronto para demonstração controlada por URL e para subsidiar decisão sobre implementação oficial.
