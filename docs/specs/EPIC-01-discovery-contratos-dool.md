# EPIC-01 — Discovery e contratos do DOOL

**Status:** especificado, não implementado  
**Prioridade:** bloqueadora  
**Dependências:** nenhuma

## 1. Objetivo

Produzir um inventário verificável dos recursos técnicos usados pelo DOOL nas rotas prioritárias, distinguindo dados, navegação, sessão, autorização, documentos e mutações. O épico existe para impedir que a extensão seja construída sobre suposições.

## 2. Resultado de negócio

Ao concluir este épico, a equipe deverá saber quais recursos do sistema atual podem ser reutilizados diretamente, quais exigem adaptação do HTML/DOM e quais não devem ser tocados pelo protótipo.

## 3. Escopo

Mapear, no mínimo:

1. home;
2. edição principal e extras;
3. seleção de edição anterior;
4. pesquisa por termo e período;
5. lista de resultados;
6. `/ver-html/{id}/`;
7. categorias e matérias do HTML;
8. PDF;
9. versão Jornal;
10. autenticidade;
11. cadastro;
12. login;
13. recuperação de senha;
14. estado de usuário e assinatura quando acessível legitimamente.

## 4. Fora de escopo

- engenharia reversa de controles destinados a impedir acesso não autorizado;
- bypass de pagamento/assinatura;
- alteração de dados;
- testes de carga;
- exploração ofensiva do ambiente;
- captura ou armazenamento de senha/token/cookie em documentação.

## 5. Artefato principal: Catálogo de contratos

Cada fluxo deve gerar um registro com:

```text
ID do contrato
Ação do usuário
Rota/página de origem
Requisição: método + host + path
Parâmetros/query/body relevantes
Cabeçalhos relevantes sem segredos
Estado de sessão
Resposta: tipo + schema sanitizado
Efeito esperado na UI
Classificação: leitura | mutação | navegação | documento
Autorização observada
Erros observados
Fallback disponível
Dependência de DOM: sim/não
Evidência reproduzível
```

Quando não existir chamada separada e o dado vier do HTML inicial, registrar isso explicitamente como contrato de documento/DOM.

## 6. Matriz de perfis

Os mesmos fluxos devem ser comparados, quando aplicável, em estados:

- anônimo;
- cadastrado;
- assinante;
- sessão expirada;
- estado desconhecido após falha de rede.

A documentação não deve guardar identificadores pessoais do usuário usado no teste.

## 7. Requisitos funcionais

### RF-01.1 — Inventariar requisições

Capturar apenas o necessário para entender contratos de negócio. Recursos estáticos comuns podem ser agrupados e não precisam ser documentados individualmente.

### RF-01.2 — Identificar fonte de verdade

Para cada informação exibida pela nova UI, classificar a origem como:

- backend estruturado;
- documento HTML;
- DOM renderizado;
- estado derivado localmente;
- desconhecida.

### RF-01.3 — Classificar mutações

Qualquer POST/PUT/PATCH/DELETE ou GET com efeito colateral conhecido deve ser marcado como mutação e excluído do protótipo até haver caso de uso explícito.

### RF-01.4 — Mapear restrições de navegador

Registrar CSP, CORS, cookies SameSite, redirects, frame restrictions e outras políticas que impactem a extensão.

### RF-01.5 — Criar fixtures sanitizadas

Respostas necessárias a testes futuros devem ser convertidas em fixtures sem cookie, token, dados pessoais desnecessários ou documentos protegidos.

## 8. Requisitos não funcionais

- discovery deve ser reproduzível;
- nenhum segredo pode entrar no Git;
- evidências devem incluir data e rota;
- endpoints só podem ser tratados como estáveis após observação repetida ou validação suficiente;
- diferenças por perfil devem ser explícitas.

## 9. Critérios de aceite

### CA-01-A

**Dado** o conjunto de rotas prioritárias, **quando** o levantamento terminar, **então** cada fluxo possui origem de dados identificada ou uma limitação explicitamente registrada.

### CA-01-B

Nenhuma credencial, cookie, token ou dado pessoal de teste aparece nos artefatos versionados.

### CA-01-C

As operações de leitura e mutação estão separadas.

### CA-01-D

Existe evidência suficiente para decidir, por recurso, entre API/chamada reutilizável, parsing de documento/DOM ou fallback para a tela legada.

### CA-01-E

CSP/CORS/sessão possuem conclusão objetiva: compatível, exige adaptação permitida, ou bloqueia a estratégia atual.

## 10. Revisão adversarial

Testar deliberadamente:

- resposta 401/403;
- sessão que expira entre duas ações;
- resposta 500;
- request cancelada;
- campo importante ausente;
- resposta HTML no lugar de JSON esperado;
- redirect para login;
- edição inexistente;
- busca sem resultado;
- conteúdo muito grande;
- endpoint idêntico com comportamento diferente por perfil.

Pergunta crítica: **o discovery está descrevendo o sistema ou está inferindo o que gostaríamos que ele fizesse?** Toda inferência deve ser marcada como hipótese.

## 11. Testes/evidências

- captura DevTools/HAR sanitizada ou equivalente;
- tabela de contratos;
- amostras sanitizadas;
- matriz de acesso;
- teste de repetição de pelo menos um fluxo de cada domínio.

## 12. Definition of Done

O épico termina quando:

- fluxos prioritários estão catalogados;
- não existem segredos versionados;
- riscos de sessão e políticas do navegador estão conhecidos;
- cada épico posterior possui os contratos mínimos de que depende;
- as hipóteses restantes estão identificadas e não são tratadas como fatos.

## 13. Gate

**G1 aprovado:** a implementação pode começar apenas nos domínios cujo contrato ou estratégia de adaptação esteja demonstrado.
