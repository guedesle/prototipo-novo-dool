# Inventário de mutações

O protótipo é orientado a consulta e demonstração. Operações capazes de alterar estado devem ser identificadas antes de qualquer reutilização.

## Regra de classificação

Devem ser tratadas como mutação:

- requisições `POST`, `PUT`, `PATCH` ou `DELETE`;
- `GET` com efeito colateral conhecido;
- submissão de cadastro, login, recuperação de senha, contato, compra, assinatura ou outra operação que altere estado no servidor;
- qualquer ação cuja semântica não seja comprovadamente somente leitura.

## Política

1. O discovery pode observar que uma mutação existe, mas não deve executá-la apenas para descobrir comportamento.
2. Fluxos legítimos iniciados pelo próprio usuário podem ser observados quando necessários e autorizados, sem registrar credenciais ou dados pessoais.
3. Nenhuma mutação entra no protótipo até existir caso de uso explícito e autorização específica.
4. Na dúvida, classificar como mutação e manter o fallback para o fluxo original.

## Registro

| ID | Operação | Superfície | Evidência | Estado no protótipo |
|---|---|---|---|---|
| MUT-001 | Submissão de cadastro | `/cadastro` | formulário público observado | excluída; apenas navegação/fallback |
| MUT-002 | Autenticação/login | fluxo de login | existência do fluxo observada publicamente | excluída da reimplementação; sessão será apenas observada legitimamente |
| MUT-003 | Recuperação de senha | `/esqueci-senha` | formulário público observado | excluída; apenas navegação/fallback |
| MUT-004 | Formulário de contato | home/contato | recurso público observado | excluída até contrato e caso de uso explícito |
