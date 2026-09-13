# Protótipo Novo DOOL

Protótipo funcional para modernização da experiência do **Diário Oficial On-Line do Estado da Bahia (DOOL)** sem alterar, nesta fase, o backend de produção.

O projeto parte de uma extensão de navegador que reutiliza os recursos e as permissões já fornecidos pelo DOOL e apresenta uma nova camada de interface mais ergonômica, responsiva e acessível, com especial atenção à leitura das publicações em HTML.

## Estado do projeto

**Fase atual:** discovery, arquitetura e especificação.

- Backend do DOOL: **não será modificado pelo protótipo**.
- Código da extensão: **ainda não iniciado**.
- Implementação: **bloqueada até aprovação explícita após a revisão das especificações**.
- Levantamento público inicial: iniciado em 13/09/2026.
- Contratos reais de rede/API: ainda precisam ser capturados e validados.

## Objetivos

1. Demonstrar, sobre o ambiente real, como pode funcionar uma nova interface do DOOL.
2. Reutilizar o backend, as regras de negócio, a sessão e as permissões existentes sempre que tecnicamente possível.
3. Não contornar autenticação, assinatura, autorização ou restrições de acesso.
4. Melhorar responsividade, acessibilidade, arquitetura da informação e leitura HTML.
5. Produzir um protótipo suficientemente fiel para subsidiar decisão executiva, validação com usuários e posterior implantação oficial.
6. Manter retorno imediato à interface original durante toda a demonstração.

## Estrutura documental

- [`docs/00-visao-geral.md`](docs/00-visao-geral.md) — visão e limites do projeto.
- [`docs/01-estagio-atual.md`](docs/01-estagio-atual.md) — evidências, hipóteses e lacunas atuais.
- [`docs/02-planejamento.md`](docs/02-planejamento.md) — fases, dependências e gates.
- [`docs/03-arquitetura.md`](docs/03-arquitetura.md) — arquitetura de referência do protótipo.
- [`docs/04-roadmap-epicos.md`](docs/04-roadmap-epicos.md) — backlog em épicos e ordem de execução.
- [`docs/05-qualidade-seguranca-adversarial.md`](docs/05-qualidade-seguranca-adversarial.md) — estratégia de qualidade, segurança e revisão adversarial.
- [`docs/06-matriz-rastreabilidade.md`](docs/06-matriz-rastreabilidade.md) — requisitos, épicos e evidências de aceite.
- [`docs/specs/`](docs/specs/) — especificações executáveis de cada épico.

## Regra de governança desta fase

Este repositório começa deliberadamente pela documentação. Nenhum código de extensão deve ser considerado autorizado apenas pela existência destas especificações. A transição para implementação exige uma decisão explícita após a revisão do conjunto documental.

## Princípio central

> **Nova experiência, mesmas regras de negócio.**

O protótipo pode substituir a apresentação no navegador, mas não deve ampliar permissões, alterar documentos oficiais, modificar dados do backend ou mascarar diferenças entre conteúdo consultivo e documentos com validade jurídica.
