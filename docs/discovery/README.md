# Discovery técnico do DOOL

Este diretório concentra as evidências e conclusões do **EPIC-01 — Discovery e contratos do DOOL**.

## Objetivo

Descrever o comportamento técnico efetivamente observado no DOOL antes de qualquer implementação da nova camada de interface. O discovery deve distinguir fatos, hipóteses, limitações, operações de leitura e mutações.

## Regras de evidência

1. Nenhuma evidência versionada pode conter senha, token, cookie, `Authorization`, `Set-Cookie`, e-mail pessoal, identificador de assinatura ou outro segredo.
2. Capturas HAR brutas, quando necessárias, ficam fora do Git. Apenas versões sanitizadas podem ser versionadas.
3. URLs com parâmetros sensíveis devem ser redigidas antes do commit.
4. Documentos protegidos não devem ser copiados para fixtures. Registrar apenas metadados ou estruturas mínimas necessárias ao entendimento do contrato.
5. Toda evidência deve indicar data, rota de origem e perfil de acesso utilizado.
6. Inferências são registradas em `hypotheses.md` e não podem ser tratadas como fatos até haver evidência suficiente.
7. Operações com efeito colateral são registradas em `mutations.md` e ficam fora do protótipo até autorização explícita.

## Status de contrato

- `observado`: visto ao menos uma vez.
- `repetido`: comportamento consistente observado em mais de uma execução ou evidência equivalente.
- `hipótese`: inferência ainda não comprovada.
- `bloqueado`: não foi possível observar legitimamente no perfil disponível.

## Fonte de verdade

Cada informação deve ser classificada como uma destas origens:

- `backend-estruturado`
- `documento-html`
- `dom-renderizado`
- `derivado-local`
- `desconhecida`

## Classificação operacional

- `leitura`: consulta sem efeito colateral conhecido.
- `mutação`: altera estado ou pode gerar efeito colateral.
- `navegação`: redirecionamento ou troca de rota sem contrato de dados próprio.
- `documento`: entrega/abertura de artefato como HTML, PDF ou equivalente.

## Estrutura

- `contracts.md`: catálogo canônico de contratos.
- `routes.md`: mapa de superfícies e rotas.
- `access-matrix.md`: diferenças por perfil.
- `browser-policies.md`: CSP, CORS, cookies e políticas do navegador.
- `dom-dependencies.md`: dados dependentes de HTML/DOM.
- `mutations.md`: operações com efeito colateral.
- `hypotheses.md`: hipóteses pendentes.
- `gate-g1.md`: decisão final do Gate G1.
- `evidence/`: evidências sanitizadas.
- `fixtures/`: amostras mínimas sanitizadas para testes futuros.

## Regra de promoção de hipótese

Uma hipótese só pode ser promovida a fato quando houver observação direta reproduzível ou evidência equivalente suficientemente forte. Quando houver dúvida, manter como hipótese.
