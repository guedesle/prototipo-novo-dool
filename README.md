# Novo DOOL

Este branch contém a reconstrução do planejamento de produto e plataforma do Novo DOOL **a partir do zero**.

## Fonte de verdade deste branch

A documentação normativa está em:

- [docs/rebuild-platform/README.md](docs/rebuild-platform/README.md)
- [Prompt mestre](docs/rebuild-platform/01-master-prompt.md)
- [Planejamento de produto e plataforma](docs/rebuild-platform/02-product-platform-plan.md)
- [Arquitetura de plataforma](docs/rebuild-platform/03-platform-architecture.md)
- [UX, usuários e análise de negócios](docs/rebuild-platform/04-ux-business.md)
- [Roadmap de implementação](docs/rebuild-platform/05-implementation-roadmap.md)
- [Gates de qualidade](docs/rebuild-platform/06-quality-gates.md)
- [Mapa de capacidades atuais](docs/rebuild-platform/07-current-capability-map.md)
- [Design system e insumos](design-system/README.md)

## Diretriz

O planejamento anterior permanece no histórico do repositório, mas não deve orientar novos trabalhos neste branch.

O Novo DOOL passa a ser tratado como uma **plataforma web pública independente**, orientada às tarefas de consulta, busca, leitura, documentos, autenticidade e recursos autenticados.

## Design system

A pasta [`design-system/`](design-system/README.md) versiona referências, contratos e experimentos de interface que alimentam o design system da plataforma.

Arquivos em `design-system/inputs/` são **insumos**, não componentes de produção automaticamente aprovados. A consolidação deve ocorrer conforme arquitetura, UX e gates da baseline `docs/rebuild-platform/`.

## Especialidades obrigatórias

O processo de concepção e desenvolvimento combina:

1. especialista de UX;
2. engenheiro de plataforma;
3. analista de experiência do usuário;
4. analista de negócios.

Não utilizar skills de planejamento editorial, redação humanizada ou arquitetura textual para especificação técnica, arquitetura, backlog, QA ou implementação de software.

## Princípio

> Reaproveitar capacidades e regras comprovadas; redesenhar produto, experiência e arquitetura sem reproduzir o legado.
