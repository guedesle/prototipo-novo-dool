# Roadmap de implementação

O roadmap é organizado por **fatias verticais de valor**.

## Slice 0 — Fundação executável

Entregas:
- frontend standalone;
- BFF mínimo;
- roteamento;
- design tokens;
- CI;
- ambientes;
- logs/traces;
- feature flags;
- health check.

Gate:
- deploy reproduzível;
- acessibilidade estrutural;
- erro controlado;
- nenhuma chamada arbitrária ao legado.

## Slice 1 — Hoje

Jornada:
**abrir a plataforma → identificar a edição atual → ler/acessar formato disponível.**

Entregas:
- edição atual;
- principal e variações do dia;
- estados de carregamento/erro/vazio;
- HTML como ação primária quando disponível;
- PDF/Jornal como representações da edição;
- URL estável.

Gate:
- usuário completa tarefa por teclado e mobile;
- dados conferem com fonte oficial.

## Slice 2 — Edição por data

Jornada:
**selecionar data → identificar edição → abrir conteúdo.**

Entregas:
- calendário/campo de data;
- múltiplas edições;
- data sem edição;
- navegação anterior/próxima quando suportada;
- deep link.

## Slice 3 — Busca pública

Jornada:
**pesquisar → filtrar → abrir resultado → voltar ao resultado.**

Entregas:
- consulta;
- período;
- paginação;
- facetas comprovadas;
- zero-result;
- highlight seguro;
- persistência da consulta na URL.

Gate:
- sem diferença semântica não documentada em relação ao mecanismo oficial.

## Slice 4 — Leitor HTML

Jornada:
**abrir publicação → ler → navegar pelo contexto → acessar fonte.**

Entregas:
- sumário;
- matéria;
- sanitização;
- preferências de leitura;
- contexto da edição;
- fallback para conteúdo incompatível.

Gate:
- fidelidade documental e ordem preservadas.

## Slice 5 — Documentos

Entregas:
- PDF;
- download;
- página específica quando suportada;
- Range/206;
- Jornal/Flip;
- estados de autorização.

## Slice 6 — Sessão e conta

Entregas:
- detectar estado;
- delegar login/logout/recuperação quando apropriado;
- recursos condicionados por capability;
- reautenticação controlada.

## Slice 7 — Autenticidade

Entregas:
- formulário próprio;
- validação;
- resposta oficial;
- erro/ausência;
- link/registro de origem quando disponível.

## Slice 8 — Hardening e migração

- testes de carga;
- segurança;
- acessibilidade com tecnologia assistiva;
- compatibilidade;
- observabilidade;
- SLO;
- plano de rollback;
- rollout progressivo;
- documentação operacional.

## Política de release

Cada slice só avança após:
1. critérios funcionais;
2. QA automatizado;
3. revisão adversarial;
4. teste de usabilidade da jornada;
5. evidência de integração;
6. métricas implantadas;
7. plano de rollback.
