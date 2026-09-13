# Estágio atual

**Data de referência:** 13/09/2026  
**Fase:** EPIC-01 concluído para o primeiro ciclo de implementação  
**Implementação da extensão:** ainda não iniciada  
**Gate atual:** G1 aprovado com ressalvas por domínio

## 1. O que já está confirmado tecnicamente

Duas capturas HAR reais do navegador permitiram substituir as principais hipóteses por contratos observados. Estão demonstrados:

- host funcional capturado: `dool.egba.ba.gov.br`;
- endpoint estruturado para edição/data: `/apifront/portal/edicoes/edicoes_from_data.json`;
- endpoint de últimas edições: `/apifront/portal/edicoes/ultimas_edicoes.json`;
- edição Principal e Suplemento no mesmo dia, usando o mesmo modelo de contratos;
- download de edição completa em `/portal/edicoes/download/{editionId}`;
- shell PDF em `/ver-pdf/{editionId}/`;
- catálogo de páginas em `/apifront/portal/edicoes/edicao_imagens/{editionId}`;
- PDF por página em `/apifront/portal/edicoes/pdf_diario/{editionId}/{page}` com Range/206;
- shell Jornal/Flip em `/ver-flip/{editionId}/`;
- imagens e thumbnails por página;
- shell HTML em `/ver-html/{editionId}/`;
- disponibilidade em `/apifront/portal/edicoes/edicao_disponivel/{editionId}`;
- sumário hierárquico em `/html/{editionId}.html`;
- conteúdo de matéria em `/apifront/portal/edicoes/publicacoes_ver_conteudo/{publicationId}`;
- busca real em `/busca/busca/buscar/query/{page}...`;
- resposta de busca com `hits`, `highlight` e agregações por tipo/edição/ano;
- comportamento de zero resultado como HTTP 200 com lista vazia;
- sessão autenticada comprovada por `GET /meus-dados` com HTTP 200;
- perfil autenticado com atualização de dados como mutação delegada;
- estado não autenticado anterior demonstrado por redirects de rotas protegidas;
- ausência de necessidade de scraping do DOM para os principais dados públicos.

## 2. Ressalvas conhecidas

Ainda não foram demonstrados:

- resposta executada da consulta de autenticidade;
- distinção entre usuário cadastrado e assinante;
- capacidades de acervo certificado por assinatura;
- sessão expirada/logout observado até o estado posterior;
- autorização efetiva da área administrativa;
- corpus amplo de HTML editorial adversarial;
- aliases adicionais que realmente precisem de `host_permissions`.

Essas lacunas estão isoladas e não bloqueiam o EPIC-02.

## 3. Evidências e confiança

| Evidência | Situação | Confiança | Consequência |
|---|---|---:|---|
| edições usam JSON estruturado | repetido em duas capturas | Alta | adaptador de edições liberado |
| Principal/Suplemento compartilham modelo | observado na mesma data | Alta | normalização por variante liberada |
| PDF possui catálogo e endpoint por página | repetido | Alta | adaptador PDF liberado |
| PDF suporta Range | 206 observado | Alta | preservar carregamento parcial |
| Flip usa imagens por página | repetido | Alta | adaptador de imagens liberado |
| leitor HTML separa sumário e conteúdo | repetido | Alta | novo leitor desacoplado do DOM liberado |
| matéria HTML é adquirida por `publicationId` | repetido | Alta na amostra | parsing/sanitização + fallback obrigatórios |
| busca usa contrato JSON estruturado | consulta positiva e zero resultado capturadas | Alta | EPIC-06 liberado |
| busca oferece highlight e facetas | capturado | Alta | adaptador de busca liberado |
| sessão autenticada existe | `/meus-dados` 200 | Alta | estado autenticado básico liberado |
| assinatura pode ser inferida do perfil | não demonstrado | Baixa | proibido inferir; manter capability gate |
| nova view pode operar sem alterar backend | múltiplos contratos demonstrados | Alta | EPIC-02 liberado |

## 4. Decisões arquiteturais

### Decidido

- backend de produção não será modificado;
- UI e transporte serão desacoplados por adaptadores;
- fallback para a interface original é obrigatório;
- edição, busca, PDF, Flip e HTML devem consumir contratos observados, evitando scraping do DOM quando houver fonte direta;
- o leitor HTML usará `sumário -> publicationId -> conteúdo`;
- a busca dependerá do contrato HTTP observado, não da tecnologia interna presumida;
- nenhuma credencial será armazenada pela extensão;
- login/cadastro/recuperação/atualização de perfil continuarão delegados ao legado no primeiro incremento;
- estado de sessão será modelado por capacidades (`anonymous | authenticated | unknown/reauth-required`) sem leitura direta de cookies pela UI;
- PDF deve preservar Range quando aplicável;
- conteúdo editorial terá sanitização conservadora e fallback.

### A provar no EPIC-02

- extensão Chromium Manifest V3;
- mecanismo de isolamento visual;
- montagem transacional antes de ocultar UI original;
- transporte same-origin/bridge/host permission;
- feature flags por domínio;
- fail-open para interface original.

### Ainda não decidido

- framework de UI;
- bundler/toolchain;
- Shadow DOM versus root dedicado;
- necessidade de service worker;
- telemetria;
- distribuição corporativa.

## 5. Riscos atuais

1. **Assinatura não demonstrada.** Não exibir capacidades premium sem resposta real.
2. **HTML editorial heterogêneo.** Corpus ampliado continua obrigatório antes do leitor ser considerado robusto.
3. **MIME inconsistente.** Alguns endpoints entregam JSON com `Content-Type: text/html`.
4. **Sessão pode mudar durante o uso.** Redirect/HTML inesperado devem virar estado controlado e fallback.
5. **CORS não está demonstrado como aberto.** Transporte deve ser provado no EPIC-02.
6. **Falsa completude visual.** Recursos ainda bloqueados devem permanecer explicitamente feature-gated.

## 6. Artefatos do discovery

Em `docs/discovery/` estão versionados:

- método e regras de sanitização;
- rotas e superfícies;
- catálogo de contratos públicos;
- suplemento de contratos de busca/sessão;
- matriz de acesso;
- políticas do navegador;
- dependências de DOM/documento;
- inventário de mutações;
- hipóteses;
- schemas sanitizados;
- evidências sanitizadas das duas capturas HAR;
- decisão do Gate G1.

Os HARs brutos não foram enviados ao GitHub.

## 7. Gates

**G0 — documentação e especificação: CONCLUÍDO.**

**G1 — discovery: APROVADO COM RESSALVAS POR DOMÍNIO.**

Liberados: EPIC-02; EPIC-03 para contratos conhecidos e estado básico de sessão; EPIC-04; EPIC-05; EPIC-06; EPIC-07 com gate de fidelidade; partes observadas do EPIC-08.

Condicionados/feature-gated: assinatura/acervo certificado, autenticidade e sessão expirada específica.

## 8. Próxima ação

Iniciar **EPIC-02 — Fundação e isolamento da extensão**. O primeiro incremento deve montar/desmontar a nova view de forma reversível, detectar apenas rotas suportadas, provar transporte permitido contra contratos conhecidos e falhar aberto para a interface original.