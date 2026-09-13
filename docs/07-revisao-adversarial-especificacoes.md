# Revisão adversarial das especificações

**Data:** 13/09/2026  
**Objeto:** documentação-base + EPIC-01 a EPIC-10  
**Objetivo:** tentar invalidar o desenho antes de autorizar implementação

## 1. Método

A revisão foi conduzida assumindo que o plano está errado até que consiga responder às principais formas de falha. Foram procurados: suposições tratadas como fatos, acoplamentos prematuros, falsas garantias de segurança, riscos de fidelidade documental, conflitos entre specs e mecanismos que poderiam fazer a demonstração parecer mais completa do que realmente é.

Também foi feita varredura por placeholders explícitos (`TODO`/`TBD`), sem ocorrências encontradas no conjunto versionado no momento da revisão.

## 2. Desafios levantados e decisões

### D-01 — “Uma extensão consegue substituir a view sem tocar o backend” pode ser falso em partes do portal

**Risco:** CSP, CORS, cookies, redirects ou dados disponíveis apenas após renderização podem impedir integração limpa.

**Decisão:** não prometer API. EPIC-01 precisa classificar cada recurso como chamada reutilizável, documento/DOM adaptável ou fallback legado. Interceptação de rede é último recurso.

### D-02 — Uma UI isolada pode quebrar o portal antes de conseguir exibir fallback

**Risco:** ocultar o DOM original cedo demais deixa tela branca.

**Decisão:** montagem transacional no EPIC-02; original só é ocultado após confirmação da nova UI. Falha restaura original.

### D-03 — Representar “usuário autenticado” não é suficiente para autorização

**Risco:** cadastrado e assinante podem possuir capacidades diferentes; cache pode ficar obsoleto.

**Decisão:** EPIC-03 usa modelo por capacidades e estados `unknown`; 401/403/logout invalidam capacidades. Nenhuma capacidade desconhecida é otimisticamente concedida.

### D-04 — Modernizar busca pode inadvertidamente mudar a busca

**Risco:** filtros locais, re-ranking ou interpretação de snippets podem criar resultados diferentes do mecanismo oficial.

**Decisão:** EPIC-06 é deliberadamente uma nova UX sobre o mecanismo atual. Busca semântica/IA/re-ranking ficam fora deste protótipo.

### D-05 — Sanitizar HTML pode remover conteúdo oficial legítimo

**Risco:** segurança e fidelidade podem entrar em conflito.

**Decisão:** EPIC-07 exige corpus representativo, allowlist derivada de conteúdo real e fallback explícito quando o parser/sanitizador não conseguir preservar o documento. Truncamento silencioso é crítico.

### D-06 — Tabelas responsivas podem alterar interpretação

**Risco:** transformar tabela em cards/linhas móveis pode destruir relação entre células.

**Decisão:** padrão conservador: preservar estrutura e usar container rolável/estratégia equivalente antes de qualquer reflow semântico.

### D-07 — “Não armazenar senha” não basta

**Risco:** cookie, token, documento ou histórico de pesquisa podem vazar por storage/log.

**Decisão:** allowlist de diagnóstico, minimização de dados, inspeção explícita de storage/log no EPIC-09 e proibição de persistência padrão para documentos e histórico identificável.

### D-08 — Demo visual pode induzir decisão errada sobre prontidão para produção

**Risco:** partes simuladas parecerem integrações reais; mecanismos específicos de extensão parecerem arquitetura final.

**Decisão:** EPIC-10 exige matriz de suporte com estados “integrado”, “limitado”, “fallback”, “simulado” e “fora de escopo”, além de separar claramente código reutilizável, reavaliável e descartável.

### D-09 — Fixar framework agora cria lock-in sem evidência

**Risco:** escolher stack antes de conhecer CSP, forma de montagem e integração pode gerar retrabalho.

**Decisão:** specs fixam responsabilidades e contratos, não React/Vue/Svelte/WXT/Plasmo. Toolchain só será decidido na fase de implementação após evidência do EPIC-01.

### D-10 — Métricas absolutas de performance agora seriam arbitrárias

**Risco:** um orçamento inventado pode ser inadequado ao ambiente real e ao stack escolhido.

**Decisão:** EPIC-09 exige baseline comparativo e isolamento do custo da extensão. Orçamentos numéricos serão definidos após spike técnico e medição inicial, sem relaxar a obrigação de evitar regressão severa.

### D-11 — “Interface original sempre disponível” pode falhar em navegação SPA ou alterações dinâmicas

**Risco:** o portal pode mudar URL/DOM sem reload completo.

**Decisão:** EPIC-02 deve testar refresh, back/forward, múltiplos bootstraps e navegação dinâmica. O router/normalizador é responsabilidade explícita da arquitetura.

### D-12 — Deep links podem não ser representáveis no portal atual

**Risco:** a nova UI gerar URLs que não sobrevivem sem a extensão.

**Decisão:** deep-link no leitor é requisito condicionado ao contrato real. Quando não houver URL oficial equivalente, a extensão pode manter estado local de navegação para demonstração, mas deve identificar esse mecanismo como específico do protótipo no handoff.

## 3. Consistência entre documentos

A revisão confirma as seguintes invariantes em todas as specs:

- backend não é alterado nesta fase;
- extensão não concede autorização;
- credenciais não são persistidas;
- UI depende de adaptadores, não diretamente de endpoints;
- interface original funciona como fallback;
- leitura HTML não pode alterar significado;
- acessibilidade é gate, não tarefa cosmética;
- implementação não foi iniciada;
- simulação precisa ser identificada;
- integração definitiva ao produto exigirá reavaliação dos mecanismos específicos de extensão.

## 4. Evidências ainda obrigatórias antes ou durante os primeiros épicos

Estas lacunas não são placeholders de documentação; são objetos explícitos do discovery:

1. contratos reais de busca;
2. contratos de edição/data;
3. origem estruturada do HTML de categorias/matérias;
4. mecanismo de PDF/Jornal;
5. chamada de autenticidade;
6. login/sessão/capacidades;
7. CSP/CORS/SameSite;
8. aliases de host suportados;
9. corpus editorial representativo;
10. comportamento de navegação dinâmica do portal.

## 5. Conclusão da revisão

Não foi identificado, nesta fase documental, conflito que exija reorganizar os 10 épicos. A principal conclusão adversarial é manter a arquitetura **orientada a evidência e fallback**, evitando qualquer promessa de que todos os recursos atuais serão consumíveis por API.

O desenho está suficientemente decomposto para iniciar o planejamento detalhado de implementação somente após autorização humana. O primeiro trabalho técnico autorizado deverá começar pelo EPIC-01, não pelo desenvolvimento visual.
