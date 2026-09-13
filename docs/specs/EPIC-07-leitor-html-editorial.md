# EPIC-07 — Leitor HTML editorial

**Status:** especificado, não implementado  
**Prioridade:** crítica para o valor demonstrativo  
**Dependências:** EPIC-03, EPIC-04

## 1. Objetivo

Transformar a leitura HTML do DOOL em uma experiência editorial de primeira classe, mais legível, navegável, responsiva e acessível, preservando integralmente o conteúdo e a ordem semântica fornecidos pela fonte oficial.

## 2. Resultado de negócio

O usuário deve conseguir localizar uma matéria dentro da edição, ler confortavelmente em diferentes dispositivos, navegar entre matérias e compreender o contexto da edição sem depender da apresentação legada.

## 3. Escopo

- metadados da edição;
- sumário por categorias/matérias;
- seleção de matéria;
- conteúdo HTML da publicação;
- navegação anterior/próxima;
- âncoras/deep-link quando o contrato permitir;
- controles de tamanho/legibilidade;
- largura de leitura apropriada;
- tabelas, imagens, links e blocos longos;
- navegação por teclado;
- versão móvel;
- indicação clara de que a versão HTML é consultiva quando essa for a regra vigente;
- link/ação para documento oficial protegido quando autorizado.

## 4. Fora de escopo

- resumir ou reescrever atos;
- corrigir ortografia do documento;
- alterar ordem editorial;
- converter automaticamente conteúdo HTML em novo documento juridicamente válido;
- executar JavaScript proveniente da matéria;
- inserir IA generativa no conteúdo;
- esconder partes do ato por conveniência visual.

## 5. Invariante de fidelidade

O conteúdo oficial deve ser tratado como **dados a apresentar**, não como código a executar e não como texto a reinterpretar.

A transformação é permitida apenas para:

- estruturar navegação;
- aplicar tipografia e layout;
- tornar tabelas/imagens responsivas;
- sanitizar elementos perigosos;
- acrescentar controles externos de leitura;
- gerar âncoras técnicas sem modificar o significado.

Qualquer transformação que possa alterar conteúdo, ordem ou associação entre título e corpo deve ser bloqueada até validação específica.

## 6. Modelo de informação

```text
Edition
  -> Category[]
      -> Publication[]
          -> title
          -> html/content
          -> metadata
```

A hierarquia real só será fixada após EPIC-01/03 confirmarem o contrato. O leitor deve suportar ausência controlada de níveis opcionais sem inventá-los.

## 7. Requisitos funcionais

### RF-07.1 — Sumário

Exibir estrutura navegável da edição com categorias e matérias na ordem oficial disponível.

### RF-07.2 — Seleção e foco

Ao selecionar uma matéria, mover o contexto visual sem provocar perda de foco para usuários de teclado/leitor de tela. Mudanças relevantes devem ser anunciadas de forma adequada, sem excesso de live regions.

### RF-07.3 — Navegação sequencial

Oferecer anterior/próxima com base na ordem real do conjunto carregado. No início/fim, estado deve ser explícito.

### RF-07.4 — Conteúdo seguro

Sanitizar HTML conforme allowlist compatível com o conteúdo real. Scripts, handlers inline e elementos ativos não necessários devem ser removidos ou neutralizados.

### RF-07.5 — Tabelas

Tabelas não podem perder célula, cabeçalho ou relação estrutural. Em telas estreitas, preferir container rolável/estratégia que preserve a tabela a reformatá-la de modo semântico arriscado.

### RF-07.6 — Imagens

Imagens relevantes devem respeitar dimensões do viewport sem distorção. Alt text existente deve ser preservado; ausência de alt não deve ser “inventada” automaticamente como descrição factual.

### RF-07.7 — Links

Links devem manter destino real, indicar comportamento externo quando necessário e não receber privilégios da extensão.

### RF-07.8 — Preferências de leitura

Permitir ajuste de tamanho do texto e, se adotado, largura de leitura/tema, sem alterar estrutura do conteúdo. Preferências não sensíveis podem ser persistidas localmente.

### RF-07.9 — Contexto documental

Exibir data, número/tipo da edição e estado de validade/acesso conforme fonte de verdade disponível.

### RF-07.10 — Fonte original

Quando o parser detectar conteúdo incompatível ou incompleto, oferecer acesso claro à versão original em vez de apresentar uma matéria truncada como válida.

## 8. Requisitos de acessibilidade

- `main` e headings coerentes;
- sumário com semântica navegável;
- foco visível;
- leitura sem depender de hover;
- tabelas preservando semântica quando presente;
- controles de fonte com labels;
- 200% de zoom sem perda de conteúdo;
- skip link para conteúdo da matéria;
- mobile com drawer/menu que não aprisione foco;
- reduced motion respeitado.

## 9. Critérios de aceite

### CA-07-A

Para o corpus de referência, texto e ordem das matérias correspondem à fonte oficial após normalizações técnicas explicitamente permitidas.

### CA-07-B

Nenhum `<script>`, handler inline ou conteúdo ativo não autorizado do documento editorial executa no contexto privilegiado da extensão.

### CA-07-C

Tabelas largas permanecem completas em viewport de 320 px.

### CA-07-D

Usuário percorre sumário, abre matéria e navega anterior/próxima somente por teclado.

### CA-07-E

Matéria muito longa permanece utilizável e não degrada o shell de forma severa.

### CA-07-F

Falha de parsing gera fallback identificável, nunca truncamento silencioso.

### CA-07-G

Versão HTML consultiva e documento com validade jurídica não são confundidos na interface.

## 10. Corpus adversarial mínimo

O EPIC deve ser validado com exemplos reais públicos ou sanitizados que cubram:

- matéria curta;
- matéria muito longa;
- múltiplos níveis de título;
- tabela estreita;
- tabela mais larga que a viewport;
- imagem;
- caracteres acentuados e símbolos;
- links;
- listas;
- conteúdo com markup irregular;
- categoria com muitas matérias;
- edição com combinação atípica de categorias;
- conteúdo vazio/incompleto;
- HTML contendo tags ou atributos potencialmente perigosos.

## 11. Revisão adversarial

Perguntas obrigatórias:

1. Alguma transformação pode alterar o sentido do texto?
2. Um conteúdo malicioso poderia executar script ou acessar APIs da extensão?
3. Uma tabela pode parecer completa quando, na verdade, células foram ocultadas?
4. O título mostrado pode ser associado à matéria errada?
5. O parser falha de forma explícita quando não entende a estrutura?
6. A navegação sequencial preserva a ordem oficial?
7. O mobile está escondendo informação essencial?
8. Um usuário com zoom alto consegue ler e sair da matéria?
9. O estado de validade jurídica está correto?
10. O original continua acessível em caso de dúvida?

## 12. Estratégia de testes

- comparação de texto/estrutura entre fixture e renderização;
- snapshots estruturais usados com parcimônia;
- testes de sanitização;
- testes específicos de tabelas;
- E2E de sumário e navegação;
- acessibilidade automatizada e manual;
- responsividade;
- performance com conteúdo grande;
- injeção de HTML adversarial controlado.

## 13. Definition of Done

- corpus representativo validado;
- conteúdo e ordem preservados;
- sanitização comprovada;
- leitor funciona em mobile/desktop;
- teclado e acessibilidade aprovados;
- tabelas/imagens não perdem informação;
- fallback cobre parsing incompatível;
- contexto documental está correto.

## 14. Gate

**G4 — leitor aprovado:** o principal ganho de experiência do protótipo pode ser demonstrado sem comprometer fidelidade editorial ou segurança.
