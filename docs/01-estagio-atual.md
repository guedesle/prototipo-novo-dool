# Estágio atual

**Data de referência:** 13/09/2026  
**Fase:** discovery e especificação  
**Implementação da extensão:** não iniciada

## 1. O que já está confirmado publicamente

O levantamento inicial do DOOL confirma a existência, na interface pública atual, dos seguintes recursos:

- página inicial com acesso à edição principal e a edições extras;
- acesso em HTML sem cadastro;
- acesso à versão PDF e à versão jornal conforme as regras vigentes;
- seleção de edições anteriores;
- indicação de disponibilidade das últimas 30 edições na seleção direta;
- pesquisa por palavra-chave;
- pesquisa no acervo a partir de 30/06/2007;
- consulta de autenticidade por código;
- cadastro de usuário;
- recuperação de senha;
- rota pública de visualização HTML com padrão `/ver-html/{id}/`;
- distinção, na visualização HTML, entre consulta pública e recursos que dependem de cadastro/assinatura.

Também estão publicamente acessíveis as rotas de cadastro e recuperação de senha, atualmente observadas como `/cadastro` e `/esqueci-senha`.

## 2. O que ainda NÃO está confirmado

Nenhum dos itens abaixo deve ser tratado como contrato implementável enquanto não houver captura de rede e validação prática:

- endpoints efetivos usados pela busca;
- formato de resposta da busca;
- endpoint que resolve edição por data;
- endpoint ou payload que entrega categorias e matérias da visualização HTML;
- método real de obtenção de PDF completo ou por página;
- implementação da versão jornal/flip;
- chamada da consulta de autenticidade;
- contrato de login;
- cookies, tokens ou outros mecanismos de sessão;
- diferenças de resposta entre anônimo, cadastrado e assinante;
- política de CORS/CSP relevante para a extensão;
- necessidade ou não de interceptação de `fetch`/XHR;
- dependências do DOM legado;
- domínios/aliases que precisam ser suportados pela extensão;
- existência de antifraude, rate limiting ou outros controles que afetem o protótipo.

## 3. Evidências atuais e nível de confiança

| Evidência | Situação | Confiança | Ação seguinte |
|---|---|---:|---|
| Home oferece HTML, PDF e Jornal | Observado publicamente | Alta | Capturar URLs e estados por perfil |
| Pesquisa por palavra e período | Observado publicamente | Alta | Capturar requisição e resposta |
| Acervo desde 30/06/2007 | Informado pelo portal | Alta | Validar limites e paginação |
| `/ver-html/{id}/` | Observado publicamente | Alta | Mapear dados carregados e DOM |
| HTML sem cadastro | Informado pelo portal | Alta | Validar fluxo e limites |
| PDF depende de regras de acesso | Informado pelo portal | Alta | Testar com perfis controlados |
| Assinantes têm acesso ampliado ao acervo | Informado pelo portal | Alta | Testar após autenticação |
| Busca usa mecanismo compatível com Elasticsearch | Apenas indício visual anterior | Baixa | Não assumir; confirmar por rede |
| Interface pode ser substituída sem alterar backend | Hipótese técnica | Média | Validar no Épico 1 e Épico 2 |

## 4. Estado de decisão arquitetural

### Decidido

- o protótipo será apresentado como extensão/camada de view, e não como substituição imediata do sistema oficial;
- a extensão não deve alterar backend de produção;
- permissões existentes serão respeitadas;
- o foco é demonstrar uma interface pronta para posterior integração oficial;
- o leitor HTML é uma prioridade de produto;
- responsividade e acessibilidade são requisitos estruturais, não acabamento.

### Recomendado, mas ainda sujeito a validação técnica

- extensão Chromium Manifest V3;
- aplicação de UI isolada da página legada;
- adaptadores por domínio funcional em vez de acesso direto ao DOM em todos os componentes;
- uso da sessão já mantida pelo navegador;
- fallback para a interface original sempre disponível;
- feature flags para ativar módulos progressivamente.

### Não decidido

- framework de UI;
- bundler/toolchain;
- biblioteca de componentes;
- mecanismo exato de isolamento visual (Shadow DOM, iframe, root dedicado ou combinação);
- necessidade de background service worker;
- estratégia final de interceptação de rede;
- telemetria da demonstração;
- processo de distribuição corporativa.

Essas escolhas só devem ser fechadas quando os contratos reais do DOOL forem conhecidos.

## 5. Riscos conhecidos nesta fase

1. **Acoplamento ao DOM legado.** Se dados relevantes só existirem após renderização da página atual, o protótipo pode ficar frágil.
2. **CSP/CORS.** O portal pode restringir scripts, recursos ou chamadas necessárias à nova view.
3. **Sessão e autenticação.** Uma implementação equivocada pode duplicar credenciais ou quebrar fluxos existentes.
4. **Diferenças por perfil.** Recursos podem variar de maneira não evidente entre usuário anônimo, cadastrado e assinante.
5. **Conteúdo editorial heterogêneo.** Tabelas, atos longos, imagens, assinaturas e estruturas incomuns podem quebrar o leitor HTML.
6. **Falsa sensação de completude.** Uma demo visual pode parecer pronta mesmo sem cobrir contratos, erros e acessibilidade.
7. **Mutação acidental.** A extensão deve evitar disparar ações de escrita apenas por montar a nova UI.
8. **Dependência de produção.** Instabilidade do ambiente oficial não pode ser confundida com defeito da camada nova.

## 6. Próxima evidência obrigatória

Antes de iniciar a implementação de recursos de negócio, o projeto precisa produzir um **inventário de contratos** por fluxo:

`ação do usuário -> requisição -> método/URL -> parâmetros -> resposta -> estado de autorização -> efeito visual`

A captura deve cobrir, no mínimo:

1. home;
2. seleção de edição;
3. busca;
4. resultado;
5. leitura HTML;
6. PDF;
7. versão jornal;
8. autenticidade;
9. login;
10. perfil/assinatura, quando aplicável.

## 7. Gate atual

**Gate G0 — documentação e especificação:** em construção.

Nenhuma implementação deve começar antes de:

- as specs dos épicos estarem registradas;
- o modelo de riscos estar revisado;
- os limites de segurança estarem explícitos;
- o usuário autorizar a transição de especificação para implementação.
