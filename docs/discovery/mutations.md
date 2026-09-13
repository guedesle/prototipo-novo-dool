# Inventário de mutações

O protótipo é orientado a consulta e demonstração. Operações capazes de alterar estado devem ser identificadas antes de qualquer reutilização.

## Regra de classificação

Devem ser tratadas como mutação até prova em contrário:

- requisições `POST`, `PUT`, `PATCH` ou `DELETE`;
- `GET` com efeito colateral conhecido;
- submissão de cadastro, login, recuperação de senha, contato, compra, assinatura ou atualização de perfil;
- qualquer ação cuja semântica não seja comprovadamente somente leitura.

## Política

1. O discovery pode observar uma mutação, mas não deve executá-la apenas para descobrir comportamento.
2. Fluxos legítimos iniciados pelo usuário podem ser observados quando necessários e autorizados, sem registrar credenciais ou PII.
3. Nenhuma mutação entra no protótipo até existir caso de uso explícito e autorização específica.
4. Na dúvida, delegar ao fluxo original.

## Registro

| ID | Operação | Superfície | Evidência | Estado no protótipo |
|---|---|---|---|---|
| MUT-001 | Submissão de cadastro | `/cadastro` | formulário público observado | delegar/fallback |
| MUT-002 | Autenticação/login | `POST /login` | formulário observado; submissão não capturada | delegar ao fluxo original |
| MUT-003 | Recuperação de senha | `/esqueci-senha` | formulário público observado | delegar/fallback |
| MUT-004 | Formulário de contato | home/contato | recurso público observado | fora do primeiro incremento |
| MUT-005 | Aceite de termos | `POST /usuarios/aceitarTermos` | chamada declarada no JavaScript público | não reproduzir automaticamente |
| MUT-006 | Atualização de perfil/endereço/senha | `POST /usuarios/meus_dados/{userId}` | formulário autenticado observado; valores sanitizados | delegar ao perfil original |
| MUT-007 | POST de entrada em `/buscanova` | `POST /buscanova` | dois POSTs capturados com apenas coordenadas de clique e redirect 301 para `/buscanova/` | não necessário na nova UI; usar contrato GET de busca observado |

## Observações das capturas

Na primeira captura não houve POST funcional ao host DOOL. Na segunda, os POSTs ao DOOL foram apenas submissões de navegação para `/buscanova`, que redirecionaram para a superfície de busca; nenhuma atualização de conta, senha, cadastro, recuperação, aceite de termos ou logout foi executada.

A busca efetiva de resultados utiliza `GET` e está catalogada separadamente como operação de leitura.