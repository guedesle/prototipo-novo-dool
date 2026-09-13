# Arquitetura de referência do protótipo

## 1. Objetivo arquitetural

Permitir que uma extensão de navegador apresente uma nova experiência do DOOL usando dados, sessão e regras já existentes, sem modificar o backend de produção e sem tornar a nova UI dependente diretamente de detalhes frágeis do portal legado.

A arquitetura abaixo é uma referência de solução e será validada pelo discovery antes da escolha final de ferramentas.

## 2. Visão em camadas

```text
DOOL / backend existente
        |
        | respostas, documentos e permissões reais
        v
+-------------------------------+
| Adaptadores DOOL              |
| - edições                     |
| - busca                       |
| - HTML                        |
| - sessão/permissões           |
| - documentos/autenticidade    |
+---------------+---------------+
                |
                | modelo interno normalizado
                v
+-------------------------------+
| Estado e serviços da extensão |
| - feature flags               |
| - cache efêmero               |
| - diagnóstico                 |
| - fallback                    |
+---------------+---------------+
                |
                v
+-------------------------------+
| Nova UI                       |
| - shell                       |
| - home                        |
| - busca/acervo                |
| - leitor HTML                 |
| - conta/documentos            |
+-------------------------------+
```

O componente visual nunca deve precisar saber se um dado veio de um endpoint JSON, do HTML existente ou de outra forma de adaptação. Essa decisão pertence ao adaptador.

## 3. Componentes

### 3.1 Bootstrap da extensão

Responsabilidades:

- detectar se a URL atual é suportada;
- verificar se a experiência nova está habilitada;
- montar a raiz da aplicação de forma isolada;
- preservar acesso à página original;
- interromper a inicialização com segurança quando pré-condições falharem.

Não deve:

- executar chamadas de negócio diretamente;
- manipular credenciais;
- esconder permanentemente o DOM original antes de confirmar que a nova UI montou com sucesso.

### 3.2 Router/normalizador de contexto

Transforma URLs e estado atual do portal em uma representação interna, por exemplo:

```text
{ area: "reader", editionId: "...", mode: "html" }
```

Ele deve permitir suporte progressivo a aliases sem espalhar regras de URL pelos componentes.

### 3.3 Adaptadores DOOL

Cada domínio deve possuir uma interface pequena e testável:

- `EditionRepository`
- `SearchRepository`
- `HtmlPublicationRepository`
- `SessionProvider`
- `DocumentRepository`
- `AuthenticityRepository`

Os nomes finais podem mudar, mas a separação de responsabilidade deve permanecer.

### 3.4 Modelo interno normalizado

O protótipo deve converter respostas do portal para modelos estáveis da aplicação. Exemplo conceitual:

```text
Edition
- id
- number
- date
- type
- formatsAvailable

Publication
- id
- category
- title
- html
- metadata

AccessState
- anonymous | registered | subscriber | unknown
- capabilities[]
```

O modelo interno não deve inventar permissões. `capabilities` só pode refletir evidências do backend/interface atual.

### 3.5 Store de interface

Estado temporário necessário para navegação, filtros, seleção de matéria, preferências de leitura e diagnósticos.

Regras:

- não armazenar senha;
- não persistir token de autenticação sem necessidade comprovada e revisão de segurança;
- preferências não sensíveis podem usar storage local da extensão;
- conteúdo oficial deve ser tratado como cache, nunca como fonte de verdade permanente.

### 3.6 Design system e componentes

Deve conter tokens e componentes para tipografia, espaçamento, estados, navegação, busca, listas, feedback e leitor editorial.

O design system precisa suportar:

- alto contraste suficiente para WCAG 2.2 AA;
- foco visível;
- zoom do navegador e texto até 200%;
- navegação por teclado;
- `prefers-reduced-motion`;
- layouts estreitos sem perda de conteúdo ou função.

### 3.7 Diagnóstico local

Erros relevantes devem ser classificáveis sem registrar informação desnecessária.

Exemplos:

- `CONTRACT_UNEXPECTED`
- `NETWORK_FAILURE`
- `AUTH_REQUIRED`
- `UNSUPPORTED_ROUTE`
- `PARSER_FAILURE`

O diagnóstico deve evitar corpo integral de documentos, cookies, tokens, senhas ou dados pessoais.

## 4. Estratégias de integração possíveis

### A. Reuso de chamadas/API — preferencial

A extensão chama os mesmos recursos que o portal utiliza, dentro das permissões existentes.

Vantagens: menor dependência visual e maior testabilidade.

Risco: contratos podem não estar documentados ou podem depender de detalhes de sessão.

### B. Adaptação do HTML/DOM — fallback controlado

A extensão extrai informações já renderizadas pelo portal quando não existir contrato reutilizável acessível.

Vantagem: amplia viabilidade do protótipo.

Riscos: maior fragilidade e custo de manutenção.

Regra: toda dependência do DOM deve possuir seletor centralizado, teste e falha explícita.

### C. Interceptação de rede — último recurso

Só deve ser considerada quando necessária para observar ou reutilizar uma resposta que não possa ser obtida de forma menos invasiva.

Exige revisão de segurança e compatibilidade com Manifest V3.

## 5. Isolamento visual

A solução deve impedir que CSS legado contamine a nova interface e vice-versa. As opções a validar são:

1. root dedicado com reset e convenção rigorosa;
2. Shadow DOM;
3. combinação de root dedicado e Shadow DOM em regiões críticas.

Iframe só deve ser escolhido se houver necessidade técnica clara, pois complica sessão, responsividade, acessibilidade e integração com navegação.

## 6. Fluxo de inicialização seguro

```text
Página DOOL carrega
   |
Extensão reconhece rota?
   | não -> não interfere
   v sim
Experiência nova habilitada?
   | não -> interface original
   v sim
Pré-condições e adaptadores mínimos OK?
   | não -> registra falha + mantém original
   v sim
Monta shell novo
   |
Shell confirmou montagem?
   | não -> restaura original
   v sim
Ativa experiência nova + botão "ver versão original"
```

## 7. Segurança e autorização

Invariantes:

- a extensão não autentica por conta própria;
- não lê senha de formulário para armazenar ou reenviar fora do fluxo original;
- não cria permissões locais para substituir resposta do servidor;
- não tenta descobrir URLs protegidas para contornar a UI;
- chamadas de escrita só podem ocorrer como consequência de ação explícita do usuário e após serem catalogadas no discovery;
- conteúdo oficial deve manter vínculo claro com sua origem.

## 8. Compatibilidade e alvo inicial

Alvo primário: navegadores Chromium compatíveis com Manifest V3, coerente com a necessidade de uma extensão demonstrativa em ambiente Windows.

A arquitetura deve minimizar APIs específicas de um fornecedor quando houver alternativa padronizada, facilitando futura adaptação para Edge/Chrome e eventual portabilidade.

## 9. Decisões adiadas intencionalmente

A spec não fixa nesta fase:

- React, Vue, Svelte, Preact ou vanilla;
- Vite, WXT, Plasmo ou outro toolchain;
- biblioteca de estado;
- biblioteca de componentes;
- biblioteca de testes E2E.

Essas decisões devem ser tomadas no início da implementação, após o EPIC-01 produzir evidências sobre CSP, sessão, rotas e forma de integração.
