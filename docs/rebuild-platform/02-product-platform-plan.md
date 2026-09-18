# Planejamento de produto e plataforma

## 1. Problema

O desafio não é “refazer o site”. É transformar um conjunto de páginas e recursos do DOOL em uma plataforma de consulta pública orientada a tarefas.

O planejamento parte do zero e responde, nesta ordem:
1. quem usa;
2. para quê;
3. quais capacidades existem;
4. quais jornadas importam;
5. quais contratos suportam essas jornadas;
6. qual arquitetura permite evoluir sem reproduzir o legado.

## 2. Norte do produto

A experiência principal deve responder rapidamente a três intenções:
- **ver o Diário de hoje**;
- **encontrar uma publicação**;
- **consultar uma edição/data específica**.

A navegação secundária deve dar acesso a:
- leitura HTML;
- PDF/documento oficial;
- Jornal/Flip quando aplicável;
- autenticidade;
- conta e recursos protegidos;
- ajuda e contexto sobre validade dos formatos.

## 3. Descoberta

### Evidências a levantar
- tarefas mais frequentes por perfil;
- consultas que falham ou exigem muitas tentativas;
- termos usados pelos usuários;
- abandono de busca;
- uso por desktop/mobile;
- origem dos acessos;
- comportamento de usuários recorrentes;
- diferenças entre usuário anônimo, cadastrado e demais perfis.

### Métodos
- análise de logs e analytics, se disponíveis;
- entrevistas curtas com usuários internos e externos;
- teste de tarefas no portal atual;
- análise heurística;
- análise de chamados de suporte;
- card sorting/tree testing para arquitetura da informação;
- teste comparativo do protótipo.

## 4. Organização do produto por domínios

### Consulta de edições
Entidade principal: **Edição**.  
A data é filtro; HTML/PDF/Jornal são representações da mesma edição.

### Pesquisa
Entidade principal: **Resultado/Publicação** com contexto de edição, órgão, data e localização.

### Leitura
Entidade principal: **Publicação dentro de uma edição**.  
Deve permitir orientação, retorno aos resultados e acesso à fonte.

### Documentos
Entrega das representações oficiais sem reinterpretar autorização.

### Conta
Sessão e capacidades delegadas; a nova plataforma não se torna fonte autônoma de autorização oficial.

### Autenticidade
Fluxo dedicado e inequívoco, separado da busca textual.

## 5. Priorização

### P0 — Consulta pública essencial
Home, edição atual, histórico por data, leitura HTML e acesso ao PDF quando público.

### P1 — Pesquisa
Busca, filtros, resultados, zero-result, paginação e contexto.

### P2 — Navegação editorial/documental
Sumário, leitura de publicação, âncoras, compartilhamento e retorno ao contexto.

### P3 — Recursos protegidos
Sessão, conta e capacidades condicionadas.

### P4 — Autenticidade e serviços especializados
Consulta de autenticidade e demais fluxos institucionais.

## 6. Métricas

### Produto
- taxa de sucesso por tarefa;
- tempo para localizar edição;
- tempo para localizar publicação;
- taxa de reformulação de busca;
- zero-result;
- abandono;
- retorno ao resultado após leitura.

### UX
- sucesso sem ajuda;
- cliques/passos por tarefa;
- erros de navegação;
- uso por teclado;
- legibilidade e compreensão dos formatos.

### Plataforma
- disponibilidade;
- P50/P95 por jornada;
- taxa de erro por adaptador;
- cache hit;
- fallback acionado;
- regressões de contrato.

## 7. Governança

Toda feature deve ter:
- owner de produto;
- regra de negócio;
- contrato;
- métrica;
- teste;
- fallback;
- documentação de decisão.

Não avançar por “página pronta”; avançar por **jornada validada**.
