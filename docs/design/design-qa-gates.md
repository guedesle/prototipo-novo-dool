# Gates de QA para o design do Novo DOOL

**Aplica-se a:** Sites/Work/Codex e implementação visual posterior  
**Fonte:** `docs/design/HANDOFF-SITES.md`

## G-D1 — Fidelidade arquitetural

Aprovado somente se o design:

- tratar o modo standalone como principal;
- não exigir extensão para consulta pública;
- preservar DOOL como fonte documental;
- separar índice dimensional de busca oficial;
- não inventar autenticação oficial;
- não alterar semântica da API para acomodar layout.

Bloqueador: qualquer tela que sugira que login do Novo DOOL amplia autorização oficial.

## G-D2 — Home editorial

Aprovado somente se:

- edição do dia for protagonista;
- suplementos/extras forem inequívocos;
- HTML/PDF/Jornal tiverem hierarquia coerente;
- “Explorar publicações” estiver acessível sem transformar a Home em dashboard;
- erro do índice não inutilizar a Home.

## G-D3 — Exploração dimensional

Aprovado somente se:

- período, caderno, órgão, tipo e edição forem compreensíveis;
- seleção de pai/descendentes for clara;
- estado indeterminado for perceptível sem depender só de cor;
- exclusões forem visíveis e reversíveis;
- contagens não forem confundidas com valores oficiais imutáveis.

## G-D4 — Página e formatos

Aprovado somente se:

```text
VALIDATED -> HTML + PDF página + Jornal página
não validado -> HTML + mensagem de página não identificada
```

Bloqueador: inventar número de página ou exibir ação que pareça funcional sem capacidade confirmada.

## G-D5 — Busca e autocomplete

Aprovado somente se diferenciar:

- texto digitado;
- sugestão;
- “Você quis dizer?”;
- título completo;
- resultado efetivo.

Bloqueador: correção ortográfica silenciosa.

## G-D6 — Estados de dados

Cada superfície deve possuir design para:

```text
INITIAL
LOADING
SUCCESS
EMPTY
PARTIAL
ERROR_RECOVERABLE
ERROR_BLOCKING
OFFLINE/CACHED quando aplicável
```

Bloqueador: spinner sem saída ou erro indistinguível de zero resultado.

## G-D7 — Cache e atualização

Aprovado somente se o design distinguir:

- conteúdo atualizado do DOOL;
- cache fresco;
- última visualização stale.

Copy stale não pode afirmar “atualizado”.

## G-D8 — Responsividade

Validar:

- 320–767 px;
- 768–1199 px;
- >=1200 px;
- zoom 200%.

Bloqueador: ação essencial ausente no mobile ou scroll horizontal estrutural.

## G-D9 — Acessibilidade

Meta: WCAG 2.2 AA nos fluxos implementados.

Obrigatório:

- teclado integral;
- foco visível;
- headings/landmarks coerentes;
- labels programáticos;
- contraste AA;
- tri-state acessível;
- reduced motion;
- mensagens não dependentes de cor;
- foco gerenciado em drawer/dialog.

## G-D10 — Revisão adversarial

Executar pelo menos os seguintes casos:

- órgão com seis níveis;
- nome institucional excepcionalmente longo;
- zero resultado;
- dez mil resultados;
- seleção parcial profunda;
- página ausente;
- índice atrasado;
- DOOL indisponível;
- cache stale;
- principal + suplemento + extra;
- rede lenta;
- teclado;
- zoom 200%;
- 320 px;
- reduced motion.

Todo achado precisa de severidade e decisão antes de aprovação do design.

## Saída do gate

Usar uma matriz simples:

| Gate | Estado | Evidência | Achado/decisão |
|---|---|---|---|
| G-D1 | PASS/FAIL | link/captura | texto |
| G-D2 | PASS/FAIL | link/captura | texto |
| ... | ... | ... | ... |

O design só segue para implementação quando nenhum bloqueador permanecer aberto.
