# Matriz de rastreabilidade

Esta matriz conecta objetivos do produto, épicos, evidências e gates após a decisão de arquitetura standalone de 14/09/2026.

| ID | Requisito | Épico(s) | Evidência esperada | Gate |
|---|---|---|---|---|
| RQ-001 | Usar o DOOL oficial como fonte documental sem modificar o backend de produção | 01, 03, 04.6, 07 | contratos + BFF/adapters + comparação de origem | G1/G4.6/G9 |
| RQ-002 | Não ampliar autorização oficial | 03, 04.6, 08, 09 | matriz de capacidades + testes de recurso protegido | G4.6/G8/G9 |
| RQ-003 | Permitir uso público sem extensão | 04.6, 05, 06, 07 | E2E em navegador limpo | G4.6/G5/G9 |
| RQ-004 | Não armazenar senha/cookie/token oficial | 03, 08, 09 | inspeção de storage/logs | G8/G9 |
| RQ-005 | Modernizar Home e navegação de edições | 05 | E2E atual/anterior/suplemento/extra | G5 |
| RQ-006 | Oferecer exploração dimensional histórica | 04.5, 06 | consultas combinadas + facetas + hierarquia | G4.5/G6 |
| RQ-007 | Manter acesso separado à busca oficial do acervo | 03, 06 | UI/origem distinta + contract tests | G6 |
| RQ-008 | Melhorar leitura HTML sem alterar sentido/conteúdo | 07, 09 | corpus comparativo + testes editoriais | G7/G9 |
| RQ-009 | Relacionar publicação à página inicial validada | 04.5, 06, 08 | validação sumário x catálogo de páginas | G4.5/G6/G8 |
| RQ-010 | Não inventar PDF/Jornal quando página for desconhecida | 04.5, 06, 08, 09 | fixtures de anomalia + E2E | G4.5/G8/G9 |
| RQ-011 | Suportar PDF/Jornal conforme capacidade real | 04.6, 08 | matriz de capacidades + Range/206 | G8/G9 |
| RQ-012 | Preservar Range/206 de PDF quando aplicável | 04.6, 08, 09 | teste HTTP de faixa parcial | G4.6/G9 |
| RQ-013 | Suportar consulta de autenticidade somente com contrato exercitado | 08 | caso válido/inválido/erro após discovery | G8 |
| RQ-014 | Ser responsivo | 04 a 09 | 320/768/desktop/wide + zoom 200% | G4/G-D8/G9 |
| RQ-015 | Atingir WCAG 2.2 AA nos fluxos implementados | 04 a 09 | automatizado + teclado + revisão manual | G4/G-D9/G9 |
| RQ-016 | Manter extensão isolada e secundária | 02, 09 | reversibilidade + ausência de dependência no standalone | G2/G9 |
| RQ-017 | Tratar mudança inesperada de contrato | 03, 04.5, 04.6, 09 | fixtures incompatíveis + fallback/anomalia | G3/G9 |
| RQ-018 | Não executar scripts editoriais em contexto privilegiado | 03, 07, 09 | sanitização + HTML adversarial | G9 |
| RQ-019 | Diferenciar dados reais de fixtures/simulação | todos | marcação de origem/evidência | todos |
| RQ-020 | Gerar site demonstrável por terceiro | 10 | URL + roteiro + versão identificada | G10 |
| RQ-021 | Registrar limitações conhecidas | 09, 10 | matriz de suporte e limitações | G9/G10 |
| RQ-022 | Evitar dependência direta de endpoints/SQL na UI | 03, 04.6, 05 a 08 | revisão arquitetural | G3/G4.6 |
| RQ-023 | Manter back/forward/refresh coerentes | 05 a 09 | E2E de histórico/URL | G9 |
| RQ-024 | Minimizar permissões da extensão | 02, 09 | revisão Manifest | G2/G9 |
| RQ-025 | Manter histórico cumulativo além dos 90 dias | 04.5 | teste de retenção/reprocessamento | G4.5 |
| RQ-026 | Usar hierarquia organizacional válida na data da publicação | 04.5, 06 | dataset temporal + query histórica | G4.5/G6 |
| RQ-027 | Canonicalizar apenas com evidência suficiente | 04.5, 09 | testes de alias/ambiguidade | G4.5/G9 |
| RQ-028 | Não criar macrogrupos editoriais inexistentes | 04.5, 06 | comparação com fonte/taxonomia | G4.5/G6 |
| RQ-029 | API pública dimensional ser somente leitura | 04.5, 04.6, 09 | revisão de rotas + usuário DB readonly | G4.5/G9 |
| RQ-030 | BFF não aceitar destino arbitrário | 04.6, 09 | testes SSRF/allowlist | G4.6/G9 |
| RQ-031 | HTML completo não ser acervo persistente no backend próprio | 04.6, 07, 09 | inspeção DB/storage/backend | G4.6/G9 |
| RQ-032 | Cache HTML stale ser identificado como última visualização | 07, 09 | E2E offline/cache | G-D7/G9 |
| RQ-033 | Consulta pública não exigir conta própria | 04.6, 05, 06, 07, 08 | E2E anônimo | G4.6/G8 |
| RQ-034 | Sessão própria nunca ampliar autorização DOOL | 08, 09 | matriz de identidades/capacidades | G8/G9 |
| RQ-035 | Reimplementar login oficial somente após Gate AUTH-DOOL | 08 | documento de discovery + decisão de gate | G8 |

## Evidências obrigatórias por categoria

### Contratos e fonte

- rota/endpoint observado;
- método;
- parâmetros relevantes;
- resposta sanitizada;
- estado de sessão quando aplicável;
- classificação leitura/mutação/documento;
- comportamento de erro;
- origem oficial versus índice próprio.

### Índice dimensional

- grão de `fact_publication`;
- unicidade de `source_publication_id`;
- temporalidade de organizações;
- aliases e evidência de canonicalização;
- `source_start_page`;
- `page_mapping_status`;
- sync run/reconciliação;
- anomalias;
- retenção histórica.

### UX/UI

- viewport testado;
- zoom 200%;
- teclado;
- foco;
- states INITIAL/LOADING/SUCCESS/EMPTY/PARTIAL/ERROR/OFFLINE quando aplicável;
- origem dos dados;
- distinção Explorar x Acervo completo;
- fallback para recurso oficial.

### Segurança

- permissões Manifest do modo secundário;
- privilégios do usuário MySQL da API;
- secrets/env;
- CORS;
- rate limiting;
- SSRF/allowlist do BFF;
- storage utilizado;
- campos de log;
- sanitização HTML;
- mudança de sessão;
- tentativa de acesso não autorizado.

### Fidelidade editorial

- comparação com conteúdo original;
- ordem;
- caracteres especiais;
- tabelas;
- links;
- imagens;
- conteúdo longo;
- página correspondente;
- ausência de alteração de sentido jurídico/editorial.

## Estado atual

- RQ ligados aos EPIC-01 a 04 possuem evidências acumuladas das fases já concluídas.
- RQ ligados aos EPIC-04.5/04.6 estão **ESPECIFICADOS**, ainda não implementados.
- RQ de design devem ser validados pelos gates `G-D1` a `G-D10` em `docs/design/design-qa-gates.md`.
- Implementação anterior do EPIC-05 permanece pausada até novo plano pós-design.
