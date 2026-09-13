# Gate G3 — Camada de adaptação e sessão

**EPIC:** EPIC-03 — Camada de adaptação e sessão  
**Branch:** `epic-03-adapters`  
**Data:** 2026-09-13  
**Resultado:** APROVADO COM LIMITES EXPLÍCITOS DE CONTRATO

## 1. Evidência de verificação

GitHub Actions run `34784541361`, commit `660d4cce933a3b807b020d554328fdc762339d71`:

- `npm install --legacy-peer-deps`: sucesso, 0 vulnerabilidades reportadas;
- Vitest: **18 arquivos, 80/80 testes aprovados**;
- `tsc --noEmit`: sucesso;
- `wxt build --mv3`: sucesso;
- auditoria do manifest: sucesso;
- auditoria de fronteira dos adapters: sucesso;
- manifest gerado: MV3, permissão `storage`, match apenas `https://dool.egba.ba.gov.br/*`.

## 2. Contratos internos entregues

A UI futura pode depender apenas de tipos e interfaces internas para:

- edições;
- documentos e catálogo de páginas;
- busca;
- sumário e conteúdo HTML;
- sessão e capacidades;
- autenticidade como operação explicitamente ainda não suportada.

O transporte HTTP mantém payloads como `unknown` até validação runtime, impedindo que um chamador declare antecipadamente um contrato externo como válido.

## 3. Segurança e sessão

- `fetch` usa `credentials: include` e a sessão já gerenciada pelo navegador;
- não há leitura, cópia ou persistência de cookie/token;
- acesso direto a `document.cookie`, `chrome.cookies` e `browser.cookies` é bloqueado por auditoria;
- falhas 401/403 têm representação tipada e podem invalidar capacidades observadas;
- capacidade não observada permanece `unknown`, nunca `available` por inferência;
- falha de rede não é convertida em falso estado autenticado/anônimo;
- logs/erros do transporte não incorporam corpo de resposta potencialmente sensível.

## 4. Validação fail-closed

Os adapters rejeitam como `CONTRACT_UNEXPECTED` ou `PARSER_FAILURE`:

- campo obrigatório ausente;
- tipo divergente;
- envelopes `erro=true` recebidos com HTTP 200;
- IDs de edição duplicados;
- páginas inválidas ou duplicadas;
- estruturas de busca incompatíveis;
- agregações inconsistentes;
- sumário HTML sem matérias identificáveis;
- matéria HTML vazia.

Uma resposta incompatível não é transformada em dado aparentemente válido.

## 5. Revisão adversarial

| Pressão | Resultado |
|---|---|
| Campo ausente/tipo divergente | bloqueado por validação runtime |
| `suplemento` string vs inteiro | normalizado explicitamente |
| Principal + Suplemento | representados como variantes distintas |
| HTTP 200 com corpo de erro | rejeitado |
| Zero resultados de busca | estado válido, não erro |
| Highlight com marcação | preservado como dado; não tratado como HTML confiável nesta camada |
| HTML com caracteres incomuns | preservado sem reescrita editorial |
| HTML vazio/estrutura sem matéria | `PARSER_FAILURE` |
| 401 após sessão válida | identidade/capacidade protegida pode ser invalidada |
| 403 | capacidade afetada fica indisponível sem inferir logout |
| Falha de rede | propagada; não cria autorização falsa |
| Endpoint legado fora de adapters | bloqueado pelo auditor de fronteira |
| API de cookie em runtime | bloqueada pelo auditor de fronteira |

Pergunta de bloqueio: **uma falha do backend consegue chegar à UI parecendo dado válido ou autorização concedida?**  
Resposta para os contratos implementados: **não nos cenários cobertos e validados neste gate**.

## 6. Limites deliberados

Os itens abaixo continuam bloqueados até nova evidência e não devem ser simulados:

1. **Autenticidade:** endpoint real não foi comprovado; `verify()` retorna `UNSUPPORTED_OPERATION`.
2. **Filtro de busca por período:** a existência do recurso foi observada, mas a codificação completa do path/filtros ainda não está documentada com precisão suficiente; filtros de data retornam `UNSUPPORTED_OPERATION`.
3. **Consulta arbitrária de edição por data:** não é implementada até o contrato exato ser comprovado.
4. **Assinatura/acervo certificado:** o estado permanece `unknown` quando não observado.
5. **Expiração/logout completos:** a arquitetura suporta invalidação por erro de autorização, mas o ciclo completo de expiração continua dependente de evidência adicional.

## 7. Semântica importante para a UI

`Edition.hasPdf`, `Edition.hasJournal` e `Edition.hasHtml` representam **existência/formato da edição**, não autorização do usuário. A UI deve combinar disponibilidade de formato com `AccessState.capabilities` antes de representar uma ação protegida como disponível.

## 8. Decisão do gate

O EPIC-03 está apto a ser integrado como fronteira técnica para os próximos épicos. A arquitetura mantém o legado confinado, a autorização fail-closed e as operações não comprovadas explicitamente desabilitadas.
