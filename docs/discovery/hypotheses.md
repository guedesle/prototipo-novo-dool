# Hipóteses do discovery

Este arquivo existe para impedir que inferências sobre o DOOL sejam incorporadas à arquitetura como fatos.

## Regra

Toda hipótese deve conter:

- descrição objetiva;
- evidência que a motivou;
- nível de confiança: baixo, médio ou alto;
- experimento/observação necessária para validação;
- impacto caso esteja errada;
- estado: aberta, confirmada, refutada ou bloqueada.

Uma hipótese só pode ser movida para `confirmada` quando houver evidência direta reproduzível ou validação equivalente. Hipóteses confirmadas devem ser refletidas no catálogo de contratos e permanecer aqui apenas como histórico da decisão.

## Hipóteses iniciais

### HYP-001 — A nova view pode operar sem modificar o backend
- Evidência: existem superfícies públicas consumidas pelo navegador e a proposta depende de reutilizar o comportamento vigente.
- Confiança: média.
- Validação necessária: mapear contratos, políticas do navegador, sessão e dependências do DOM.
- Impacto se errada: a estratégia de extensão precisará usar mais fallback para a interface legada ou ser redesenhada.
- Estado: aberta.

### HYP-002 — A busca utiliza dados estruturados acessíveis ao cliente
- Evidência: a interface pública historicamente exibiu estruturas de template compatíveis com resultados estruturados.
- Confiança: baixa.
- Validação necessária: observar a requisição/resposta real da busca ou confirmar que o conteúdo é entregue no documento HTML.
- Impacto se errada: a nova UI poderá depender de parsing de HTML/DOM em vez de um adaptador de resposta estruturada.
- Estado: aberta.

### HYP-003 — A sessão existente do navegador pode ser reutilizada pela extensão
- Evidência: hipótese arquitetural comum para extensões same-origin, ainda sem inspeção das políticas reais do DOOL.
- Confiança: média.
- Validação necessária: observar cookies, redirects e capacidades em sessão legítima sem registrar valores sensíveis.
- Impacto se errada: os fluxos autenticados deverão permanecer no legado ou usar outra estratégia permitida.
- Estado: aberta.
