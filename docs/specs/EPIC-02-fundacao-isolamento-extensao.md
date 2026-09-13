# EPIC-02 — Fundação e isolamento da extensão

**Status:** especificado, não implementado  
**Prioridade:** alta/bloqueadora  
**Dependências:** EPIC-01 parcial

## 1. Objetivo

Criar a fundação mínima para que a nova interface possa coexistir com o DOOL, ser ativada/desativada de forma previsível e falhar sem impedir o uso do portal original.

## 2. Resultado de negócio

Uma pessoa autorizada a testar o protótipo consegue instalar a extensão, abrir uma rota suportada do DOOL, alternar entre experiência nova e original e continuar usando o portal mesmo se a extensão falhar.

## 3. Escopo

- estrutura de extensão Chromium Manifest V3;
- permissões mínimas;
- identificação de hosts e rotas suportadas;
- bootstrap da nova UI;
- root visual isolado;
- toggle nova/original;
- feature flags locais;
- fallback automático;
- diagnóstico local sanitizado;
- versão do protótipo visível para suporte;
- mecanismo de desativação global da experiência.

## 4. Fora de escopo

- telas finais do produto;
- lógica completa de busca;
- leitor HTML final;
- implementação própria de login;
- telemetria remota sem decisão específica;
- interceptação invasiva de rede por padrão.

## 5. Requisitos funcionais

### RF-02.1 — Ativação restrita

A extensão só deve montar a nova experiência em hosts e rotas explicitamente autorizados. Em qualquer URL desconhecida, não deve modificar DOM, navegação ou rede.

### RF-02.2 — Montagem transacional

O DOM original só pode ser ocultado/substituído depois que o shell novo confirmar montagem bem-sucedida. Se a montagem falhar, o portal original permanece ou é restaurado automaticamente.

### RF-02.3 — Toggle persistente

O usuário deve conseguir alternar entre “Nova interface” e “Interface original”. A preferência pode ser persistida localmente como dado não sensível.

### RF-02.4 — Kill switch local

Deve existir forma simples de desabilitar totalmente o protótipo sem desinstalar a extensão, útil em demonstração e diagnóstico.

### RF-02.5 — Isolamento visual

CSS e eventos globais da extensão não devem alterar componentes do portal original quando a nova UI estiver desativada.

### RF-02.6 — Feature flags

Módulos em desenvolvimento podem ser habilitados por flags locais, mas nenhuma flag pode simular autorização de backend.

### RF-02.7 — Diagnóstico

Registrar apenas metadados técnicos permitidos: versão, rota normalizada, classe do erro, timestamp e módulo. Não registrar cookie, token, senha, corpo integral de documentos ou dados pessoais desnecessários.

## 6. Requisitos não funcionais

- Manifest com princípio de menor privilégio;
- código carregado apenas nas páginas necessárias;
- ausência de dependências remotas executáveis não versionadas;
- compatibilidade inicial com Chrome e Edge Chromium atuais no ambiente-alvo;
- comportamento previsível em refresh/back/forward.

## 7. Modelo de estados

```text
UNSUPPORTED_ROUTE -> não interfere
DISABLED -> original
BOOTING -> original ainda disponível
ACTIVE -> nova UI montada
DEGRADED -> nova UI parcial + acesso ao original
FAILED -> original restaurado
```

A aplicação não pode permanecer indefinidamente em `BOOTING` ocultando o portal.

## 8. Critérios de aceite

### CA-02-A

Em rota não suportada, uma comparação do DOM antes/depois não mostra alterações funcionais provocadas pela extensão.

### CA-02-B

Uma exceção intencional durante o bootstrap resulta na interface original utilizável.

### CA-02-C

O toggle nova/original funciona após navegação, refresh e reabertura do navegador.

### CA-02-D

Nenhuma permissão do Manifest existe sem justificativa documentada.

### CA-02-E

O storage da extensão não contém credenciais ou documentos oficiais integrais.

### CA-02-F

A versão do build pode ser identificada durante a demonstração.

## 9. Revisão adversarial

Simular:

- DOM inesperado;
- exceção antes da montagem;
- exceção depois da montagem;
- storage indisponível/corrompido;
- navegação para rota não suportada;
- mudança de host/alias;
- página muito lenta;
- múltiplas inicializações do content script;
- atualização da extensão com aba já aberta;
- CSS do portal usando seletores agressivos;
- CSS da extensão tentando escapar do root.

Pergunta crítica: **se a extensão deixar de funcionar agora, o usuário ainda consegue usar o DOOL?** Se a resposta for não, o gate falha.

## 10. Estratégia de testes

- unitários para normalização de rota e estados;
- integração do bootstrap;
- E2E com extensão habilitada/desabilitada;
- teste de falha injetada;
- inspeção automatizada de permissões e storage;
- teste de contaminação CSS em ambos os sentidos.

## 11. Definition of Done

- shell monta apenas em rotas autorizadas;
- fallback é confiável;
- toggle funciona;
- isolamento visual demonstrado;
- logs estão sanitizados;
- permissões estão justificadas;
- nenhum recurso de negócio avançado foi embutido no bootstrap.

## 12. Gate

**G2 aprovado:** a extensão pode servir de hospedeira para os módulos seguintes sem colocar a interface original em risco.
