# Gates de qualidade

## G0 — Descoberta válida
- usuários e tarefas definidos como hipótese/evidência;
- mapa de capacidades;
- regras de negócio identificadas;
- métricas definidas.

## G1 — Arquitetura
- contratos internos versionados;
- BFF allowlisted;
- modelo de erro;
- observabilidade;
- threat model;
- decisão de cache;
- política de sessão.

## G2 — UX
- fluxo completo;
- teclado;
- 320 px;
- zoom 200%;
- contraste;
- foco;
- estados loading/empty/error/success;
- linguagem compreensível;
- deep link/back/refresh.

## G3 — Integração
- fixtures e contratos reais;
- schema drift detectável;
- timeouts;
- fallback;
- nenhum scraping quando existe contrato estruturado aprovado.

## G4 — Fidelidade
- data, edição, tipo, órgão, publicação e conteúdo conferidos;
- ordem não alterada;
- documento/fonte alcançável;
- HTML incompatível não é silenciosamente “corrigido”.

## G5 — Segurança
- CSP;
- SSRF;
- XSS;
- injeção;
- autorização;
- dependências;
- headers;
- secrets;
- logs.

## G6 — Performance
Metas iniciais a validar em produção:
- navegação pública com resposta percebida rápida;
- P95 de BFF medido por endpoint lógico;
- budgets de JS/CSS;
- imagens/documentos sem bloqueio desnecessário;
- PDF preservando streaming/range quando disponível.

## G7 — Usabilidade
Para tarefas críticas:
- taxa de sucesso;
- tempo;
- erros;
- abandono;
- compreensão de HTML vs documento oficial.

## G8 — Operação
- dashboards;
- alertas;
- runbook;
- rollback;
- health/readiness;
- versão identificável;
- correlação ponta a ponta.

## Bloqueadores de release

São bloqueadores:
- conteúdo oficial alterado;
- autorização ampliada indevidamente;
- falha sem fallback em jornada crítica;
- regressão grave de acessibilidade;
- XSS/SSRF/segredo;
- diferença de dados sem explicação;
- navegação que perde contexto no refresh/back.
