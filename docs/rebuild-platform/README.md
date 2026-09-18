# Novo DOOL — Reconstrução de Produto e Plataforma

**Baseline:** 18/09/2026  
**Status:** nova fonte de verdade para planejamento de produto, UX e engenharia.  
**Princípio:** reconstruir o plano do zero, usando a plataforma atual apenas como referência de capacidades, dados e restrições técnicas.

## Regra de precedência

Este diretório substitui, para novos trabalhos de produto/plataforma, o planejamento anterior como fonte normativa. Documentos antigos continuam no repositório apenas como histórico e evidência.

Nada aqui utiliza skills de planejamento editorial. O trabalho é de:
- engenharia de software e plataforma;
- arquitetura de sistemas;
- UX/UI;
- pesquisa e análise de experiência;
- análise de negócios e produto;
- QA, segurança, acessibilidade e observabilidade.

## Objetivo

Propor e implementar uma nova plataforma pública para o Diário Oficial Online da Bahia que:
1. aproveite capacidades reais já disponíveis no ecossistema atual;
2. reduza dependência da estrutura visual e técnica do portal legado;
3. organize a experiência por tarefas do usuário, e não por páginas herdadas;
4. preserve validade, origem e integridade do conteúdo oficial;
5. seja responsiva, acessível, observável e evolutiva;
6. permita implantação incremental e rollback seguro.

## Documentos

- [01 — Prompt mestre de execução](01-master-prompt.md)
- [02 — Planejamento de produto e plataforma](02-product-platform-plan.md)
- [03 — Arquitetura de plataforma](03-platform-architecture.md)
- [04 — UX, usuários e análise de negócios](04-ux-business.md)
- [05 — Roadmap de implementação](05-implementation-roadmap.md)
- [06 — Gates de qualidade](06-quality-gates.md)
- [07 — Mapa de capacidades da referência atual](07-current-capability-map.md)

## Decisão de abordagem

A nova plataforma é tratada como **produto web público independente**, com integração controlada aos recursos oficiais existentes. Extensão de navegador pode permanecer como artefato de experimentação, mas não define a arquitetura-alvo.

## Regra de desenvolvimento

Cada incremento deve entregar uma jornada de usuário completa e mensurável. Não serão criados épicos exclusivamente por camada técnica quando uma entrega vertical for possível.
