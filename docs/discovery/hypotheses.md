# Registro de hipóteses

Toda interpretação ainda não demonstrada deve permanecer aqui até ser confirmada, refutada ou substituída por uma limitação explícita.

## Regras de promoção

Uma hipótese só pode ser promovida a fato quando houver evidência técnica reproduzível suficiente para preencher um registro em `contracts.md` sem depender de suposição.

## Hipóteses iniciais

### HYP-001 — A nova view pode reutilizar recursos do DOOL sem alteração do backend
- Estado: aberta
- Fundamentação: objetivo arquitetural do protótipo; ainda depende dos contratos reais de rede/documento e das políticas do navegador.
- Evidência necessária: mapeamento de home, edição, busca, leitura HTML e sessão.

### HYP-002 — A leitura HTML pode ser reconstruída a partir de dados acessíveis à extensão
- Estado: aberta
- Fundamentação: a rota pública `/ver-html/{id}/` foi identificada na fase preliminar, mas a origem efetiva de categorias e matérias ainda precisa ser demonstrada.
- Evidência necessária: HTML inicial, chamadas posteriores e/ou DOM renderizado.

### HYP-003 — A pesquisa possui um contrato reutilizável pela nova UI
- Estado: aberta
- Fundamentação: a interface pública de busca existe, mas mecanismo, endpoint e formato de resposta ainda não estão demonstrados.
- Evidência necessária: requisição/resposta observável ou contrato de documento/DOM.

### HYP-004 — A sessão atual do navegador pode ser reaproveitada sem armazenamento adicional de credenciais
- Estado: aberta
- Fundamentação: requisito desejável, ainda dependente de cookies, redirects, políticas de origem e comportamento autenticado.
- Evidência necessária: discovery autenticado legítimo e análise das políticas do navegador.
