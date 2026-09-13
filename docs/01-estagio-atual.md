# Estágio atual

**Data de referência:** 13/09/2026  
**Fase:** EPIC-01 em execução — discovery técnico  
**Implementação da extensão:** ainda não iniciada  
**Gate atual:** G1 aprovado parcialmente por domínio

## 1. O que já está confirmado tecnicamente

Uma captura HAR real do navegador permitiu substituir parte das hipóteses iniciais por contratos observados. Estão demonstrados:

- home real em `dool.egba.ba.gov.br`;
- endpoint estruturado para edição/data: `/apifront/portal/edicoes/edicoes_from_data.json`;
- endpoint estruturado de últimas edições: `/apifront/portal/edicoes/ultimas_edicoes.json`;
- download de edição completa em `/portal/edicoes/download/{editionId}`;
- shell PDF em `/ver-pdf/{editionId}/`;
- catálogo de páginas em `/apifront/portal/edicoes/edicao_imagens/{editionId}`;
- PDF por página em `/apifront/portal/edicoes/pdf_diario/{editionId}/{page}` com suporte observado a Range/206;
- shell Jornal/Flip em `/ver-flip/{editionId}/`;
- imagens e thumbnails por página;
- shell HTML em `/ver-html/{editionId}/`;
- verificação de disponibilidade em `/apifront/portal/edicoes/edicao_disponivel/{editionId}`;
- sumário hierárquico em `/html/{editionId}.html`;
- conteúdo individual de matéria em `/apifront/portal/edicoes/publicacoes_ver_conteudo/{publicationId}`;
- formulário de login em `POST /login`, sem submissão capturada;
- redirect de `/admin/home` para `/login` no estado capturado;
- redirect de `/meus-dados` para `/` no estado capturado;
- uso de jQuery nos fluxos de home, PDF e HTML capturados;
- ausência de mutações contra o host DOOL no HAR analisado.

## 2. O que ainda NÃO está confirmado

Permanecem fora do conjunto de contratos implementáveis:

- request/resposta efetivos da busca em `/buscanova/`;
- lista real de resultados da busca e paginação;
- resposta executada da consulta de autenticidade;
- sessão autenticada legítima;
- atributos/estratégia real de cookies de sessão;
- capacidades de usuário cadastrado;
- capacidades de assinante;
- acesso ao acervo certificado por perfil;
- comportamento de sessão expirada;
- diferenças autenticadas entre PDF/acervo/HTML;
- aliases/domínios adicionais que precisam integrar `host_permissions`;
- corpus amplo de HTML editorial adversarial.

## 3. Evidências atuais e confiança

| Evidência | Situação | Confiança | Consequência |
|---|---|---:|---|
| edições da home usam JSON estruturado | capturado duas vezes | Alta | adaptador de edições liberado |
| últimas edições usam JSON estruturado | capturado duas vezes | Alta | navegação histórica inicial liberada |
| PDF possui catálogo e endpoint por página | capturado | Alta | adaptador PDF liberado |
| PDF suporta Range | 206 observado | Alta | preservar carregamento parcial |
| Flip usa imagens por página | capturado | Alta | adapter de imagens liberado |
| leitor HTML separa sumário e conteúdo | capturado | Alta | arquitetura do novo leitor liberada |
| matéria HTML pode ser adquirida sem DOM renderizado | capturado | Alta na amostra | parsing/sanitização + fallback obrigatórios |
| busca usa dados estruturados | não capturado | Baixa/Média | EPIC-06 continua parcialmente bloqueado |
| consulta de autenticidade usa rota JSON | declarada em JS, não exercitada | Média | não implementar ainda |
| sessão pode ser reutilizada pela extensão | não demonstrado | Média como hipótese | manter abstração e fallback |
| nova view pública pode operar sem alterar backend | contratos demonstrados | Alta para os domínios capturados | EPIC-02 pode iniciar |

## 4. Decisões arquiteturais atualizadas

### Decidido

- backend de produção não será modificado pelo protótipo;
- UI e transporte serão desacoplados por adaptadores;
- fallback para a interface original é obrigatório;
- edição, PDF, Flip e HTML devem consumir contratos já demonstrados, não scraping do DOM quando houver fonte direta;
- o leitor HTML deve trabalhar com `sumário -> publicationId -> conteúdo`;
- nenhuma credencial será armazenada pela extensão;
- login/cadastro/recuperação permanecerão delegados ao legado até evidência autenticada;
- PDF deve preservar comportamento eficiente de Range quando aplicável;
- conteúdo de matéria deve ser sanitizado de forma conservadora, com fallback se houver risco de perda semântica.

### Recomendado para EPIC-02, sujeito a prova

- extensão Chromium Manifest V3;
- UI isolada da página legada;
- montagem transacional antes de ocultar a UI original;
- adaptador de transporte same-origin/bridge/host permission escolhido por teste e não por suposição;
- feature flags por domínio;
- fail-open para a interface original.

### Ainda não decidido

- framework de UI;
- bundler/toolchain;
- Shadow DOM versus root dedicado/composição;
- service worker de background;
- estratégia de transporte final;
- telemetria;
- distribuição corporativa.

## 5. Riscos atuais

1. **Sessão/autorização não demonstradas.** O primeiro incremento não deve depender delas.
2. **Busca ainda opaca.** Reimplementar resultados agora criaria acoplamento por suposição.
3. **HTML editorial heterogêneo.** Uma amostra limpa não elimina tabelas, imagens, assinaturas ou estruturas incomuns em outras matérias.
4. **MIME inconsistente.** Alguns endpoints retornam JSON com `Content-Type: text/html`; o adaptador precisa validar body e não confiar apenas no MIME.
5. **Redirect como sinal de sessão.** Responses inesperados/HTML de login devem virar estado controlado e nunca ser parseados como dados.
6. **CORS não demonstrado como aberto.** A extensão deve provar o transporte permitido no EPIC-02.
7. **Falsa completude visual.** Demo pronta visualmente não equivale a fluxo autenticado pronto.

## 6. Artefatos do discovery versionados

Em `docs/discovery/`:

- `README.md` — método e regras de sanitização;
- `routes.md` — superfícies e rotas;
- `contracts.md` — catálogo canônico;
- `access-matrix.md` — matriz de capacidades observadas;
- `browser-policies.md` — políticas relevantes ao navegador;
- `dom-dependencies.md` — dependências de documento/DOM;
- `mutations.md` — operações com efeito colateral;
- `hypotheses.md` — hipóteses e promoções por evidência;
- `fixtures/public/` — schemas sanitizados;
- `evidence/public/2026-09-13-har-network-summary.md` — resumo do HAR sem segredos;
- `gate-g1.md` — decisão do Gate G1.

O HAR bruto não foi enviado ao GitHub.

## 7. Gate atual

**Gate G0 — documentação e especificação: CONCLUÍDO.**

**Gate G1 — discovery: APROVADO PARCIALMENTE POR DOMÍNIO.**

Liberados: EPIC-02; EPIC-03 para dados públicos; EPIC-04; EPIC-05; EPIC-07 com gate de fidelidade; parte pública de PDF/Flip do EPIC-08.

Bloqueados/condicionados: motor de busca do EPIC-06; sessão/assinatura e autenticidade do EPIC-08.

## 8. Próxima ação recomendada

Iniciar **EPIC-02 — Fundação e isolamento da extensão** com um primeiro incremento estritamente público: montar/desmontar nova view de forma reversível, detectar rotas suportadas e provar acesso controlado aos contratos de edições/HTML sem modificar backend. Em paralelo, uma segunda captura autenticada poderá completar o G1 para sessão e conta sem bloquear esse incremento público.
