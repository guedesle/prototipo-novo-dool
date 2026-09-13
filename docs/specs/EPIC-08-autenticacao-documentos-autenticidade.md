# EPIC-08 — Autenticação, PDF, Jornal e autenticidade

**Status:** especificado, não implementado  
**Prioridade:** alta  
**Dependências:** EPIC-03, EPIC-04; evidências autenticadas do EPIC-01

## 1. Objetivo

Integrar a nova interface aos estados de autenticação e aos recursos protegidos já existentes no DOOL sem reimplementar segurança, armazenar credenciais ou ampliar permissões.

## 2. Resultado de negócio

Usuários anônimos, cadastrados e assinantes recebem uma experiência coerente com suas permissões reais, compreendem quando determinado recurso exige autenticação/assinatura e conseguem seguir para PDF, Jornal ou consulta de autenticidade pelo fluxo correto.

## 3. Escopo

- detecção de estado de sessão/capacidades;
- apresentação de login/cadastro/recuperação existentes;
- redirecionamento ou integração visual com os fluxos legados quando apropriado;
- acesso a PDF conforme autorização;
- acesso à versão Jornal conforme autorização;
- consulta de autenticidade;
- atualização de estado após login/logout;
- mensagens de restrição;
- fallback seguro para interface original.

## 4. Fora de escopo

- autenticação própria da extensão;
- captura de senha;
- criação de token paralelo;
- bypass de assinatura;
- armazenamento de documento certificado sem necessidade explícita;
- alteração de regras comerciais;
- automação de compra/assinatura;
- redefinição do mecanismo criptográfico de autenticidade.

## 5. Princípio de autorização

A extensão não decide quem pode acessar um recurso. Ela apenas representa capacidades confirmadas pelo sistema atual.

Estados `unknown` ou inconsistentes devem resultar em verificação/fallback, nunca em acesso otimista.

## 6. Requisitos funcionais

### RF-08.1 — Estado de sessão

A UI deve conseguir representar, no mínimo:

- anônimo;
- autenticado;
- assinatura/capacidade específica confirmada;
- sessão expirada;
- estado desconhecido.

### RF-08.2 — Login

Quando login for necessário, a extensão deve usar o fluxo oficial. Se a integração direta não puder ser feita com segurança, abrir/exibir a rota original e retomar a nova UI após confirmação do novo estado.

### RF-08.3 — Cadastro e recuperação

Cadastro e recuperação de senha devem permanecer sob controle do fluxo oficial. O protótipo pode modernizar a navegação até esses fluxos, mas não deve capturar credenciais ou redefinir suas regras.

### RF-08.4 — PDF

A ação de PDF só pode ser apresentada como disponível quando o backend/contrato confirmar a capacidade. Redirects e 401/403 devem atualizar o estado de acesso.

### RF-08.5 — Jornal

Mesma regra do PDF: usar contrato real, não construir URL por adivinhação.

### RF-08.6 — Autenticidade

A consulta deve enviar somente o código necessário ao contrato oficial e exibir o resultado retornado sem reinterpretar o valor jurídico.

### RF-08.7 — Mudança de sessão

Após login, logout, expiração ou 401/403, invalidar capacidades protegidas e reavaliar as ações exibidas.

### RF-08.8 — Mensagens de restrição

Explicar o motivo conhecido — “é necessário cadastro”, “recurso disponível para assinantes”, “sessão expirada” — apenas quando esse motivo estiver confirmado. Caso contrário, usar mensagem neutra e encaminhar ao fluxo oficial.

## 7. Segurança

- senha nunca entra em storage/log;
- cookies/tokens não entram em documentação nem diagnóstico;
- permissões do Manifest relacionadas a sessão precisam de justificativa explícita;
- não observar campos de senha além do estritamente necessário ao funcionamento normal da página oficial;
- nenhum endpoint protegido deve ser enumerado por tentativa;
- downloads devem preservar origem e nome/metadados quando fornecidos pelo servidor.

## 8. Critérios de aceite

### CA-08-A

Usuário anônimo não recebe ação protegida como se estivesse autorizada.

### CA-08-B

Após login oficial bem-sucedido, capacidades são atualizadas sem armazenar a senha na extensão.

### CA-08-C

Após logout/expiração, ações protegidas deixam de ser tratadas como disponíveis.

### CA-08-D

PDF/Jornal utilizam recursos confirmados pelo discovery e respeitam 401/403/redirects.

### CA-08-E

Consulta de autenticidade diferencia resultado válido, inválido e falha técnica conforme contrato real.

### CA-08-F

Inspeção de storage e logs não encontra senha, cookie ou token.

## 9. Revisão adversarial

Testar:

- login cancelado;
- senha incorreta no fluxo oficial;
- sessão expira com tela aberta;
- logout em outra aba;
- usuário autenticado sem assinatura;
- assinante com recurso temporariamente indisponível;
- 403 em URL anteriormente acessível;
- redirect circular;
- PDF inexistente;
- download interrompido;
- código de autenticidade vazio, inválido, muito longo ou com caracteres inesperados;
- backend de autenticidade indisponível;
- cache local contendo estado anterior.

Pergunta crítica: **a extensão conseguiria mostrar ou abrir algo que o portal atual negaria ao mesmo usuário?** Se sim, a implementação é inaceitável.

## 10. Estratégia de testes

- matriz anônimo/cadastrado/assinante com contas legitimamente disponíveis;
- testes de sessão expirada;
- contract tests de capacidades;
- E2E para login -> retorno -> recurso protegido;
- inspeção de storage/logs;
- casos válido/inválido/erro da autenticidade;
- testes de fallback para o fluxo original.

## 11. Definition of Done

- estados de sessão representados corretamente;
- login/cadastro/recuperação permanecem oficiais;
- PDF/Jornal respeitam capacidades reais;
- autenticidade usa o contrato oficial;
- nenhuma credencial é persistida;
- mudança de sessão invalida estado;
- fallback existe para fluxos não seguros de substituir.

## 12. Gate

**G5 aprovado:** recursos autenticados e documentos protegidos podem ser demonstrados sem alterar o modelo de segurança do DOOL.
