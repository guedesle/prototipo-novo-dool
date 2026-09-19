# Arquitetura de plataforma

## 1. Arquitetura-alvo

A solução principal será uma **aplicação web standalone**.

### Camadas

```
Usuário
  ↓
Frontend Web
  ↓
BFF do Novo DOOL
  ↓
Adaptadores de domínio
  ↓
Serviços/contratos oficiais existentes
```

Serviços novos só serão criados quando uma necessidade de produto não puder ser atendida de forma segura pelos contratos existentes.

## 2. Frontend

Responsabilidades:
- renderização;
- estado de navegação;
- acessibilidade;
- validação de entrada;
- composição de jornadas;
- cache de interface não sensível;
- telemetria de experiência.

Não pode:
- acessar cookies oficiais diretamente;
- inferir autorização;
- chamar endpoints legados arbitrários;
- depender de seletores DOM do portal legado;
- transformar semanticamente conteúdo oficial.

### 2.1 Design system

O design system do frontend deve ser modular e separar:
- tokens;
- foundations;
- componentes;
- padrões de composição;
- estados;
- acessibilidade;
- contratos de dados usados pela interface;
- fixtures e testes.

A pasta `design-system/inputs/` contém insumos versionados. Ela não é, por si só, a biblioteca de produção.

O primeiro insumo formalizado é o sumário hierárquico inspirado no EUR-Lex, com contrato conceitual:

```text
dimension
  dimension
    ...
      fact
```

Regras:
- qualquer nó pai da perspectiva exibida é `dimension`;
- a publicação é `fact` e não possui filhos;
- profundidade e ordem das dimensões não são hardcoded no componente;
- expandir/recolher individual e global são comportamentos de interface;
- a publicação terminal permanece acessível por link real;
- a projeção hierárquica não deve expor a estrutura física do banco.

### 2.2 Projeção dimensional para navegação

A modelagem dimensional pode otimizar ingestão e consulta no backend. O BFF ou adaptador responsável pela edição deve materializar uma projeção de navegação estável para o frontend.

Exemplo lógico:

```text
DIM_CADERNO
  DIM_ORGAO
    DIM_HIERARQUIA_INTERNA
      DIM_TIPO_PUBLICACAO
        FATO_PUBLICACAO
```

O contrato de domínio deve permitir outras sequências de dimensões sem exigir reescrita do componente.

## 3. BFF

Responsabilidades:
- expor contratos estáveis ao frontend;
- chamar apenas endpoints oficiais allowlisted;
- normalizar inconsistências de payload/MIME;
- materializar projeções de leitura/navegação a partir dos modelos internos;
- timeouts, retry e circuit breaker quando adequados;
- cache control;
- sanitização;
- correlação e observabilidade;
- rate limiting;
- preservar Range/206 para PDF quando necessário.

Proibido:
- proxy genérico baseado em URL recebida do cliente;
- bypass de sessão/autorização;
- armazenamento de senha do usuário.

## 4. Adaptadores

Contratos por domínio:
- EditionsAdapter;
- SearchAdapter;
- PublicationAdapter;
- DocumentAdapter;
- SessionAdapter;
- AuthenticityAdapter.

Cada adaptador converte contrato externo instável em modelo interno versionado.

## 5. Modelo de navegação

URLs da nova plataforma devem representar estado compartilhável:

- `/` — entrada;
- `/edicoes/:date`;
- `/edicoes/:editionId`;
- `/buscar?q=...&inicio=...&fim=...`;
- `/publicacoes/:publicationId`;
- `/edicoes/:editionId/pdf`;
- `/autenticidade`;
- `/conta`.

Back, forward, refresh e deep link são critérios de aceite.

## 6. Segurança

- TLS obrigatório;
- CSP restritiva;
- sanitização de HTML;
- política explícita de origem;
- proteção contra SSRF no BFF;
- validação de parâmetros;
- logs sem credenciais ou conteúdo pessoal desnecessário;
- dependências auditadas;
- headers de segurança;
- separação clara entre consulta pública e ações autenticadas.

## 7. Resiliência

- timeout por dependência;
- mensagens de erro por jornada;
- fallback para recurso oficial quando seguro;
- degradação parcial: falha do leitor não deve inutilizar busca ou edição;
- health/readiness por dependência.

## 8. Observabilidade

Por request:
- trace id;
- jornada;
- adaptador;
- endpoint lógico;
- duração;
- status;
- fallback;
- cache.

Nunca registrar senha, token ou payload sensível.

## 9. Evolução

A arquitetura deve suportar troca futura do backend oficial sem reescrever a experiência. A unidade estável é o **contrato de domínio do Novo DOOL**, não o endpoint legado.
