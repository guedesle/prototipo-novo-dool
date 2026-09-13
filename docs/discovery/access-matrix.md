# Matriz de acesso do DOOL

**Data de referência:** 13/09/2026

Legenda: `observado`, `declarado-pelo-portal`, `não-observado`, `bloqueado-na-coleta`.

| Recurso | Anônimo | Cadastrado | Assinante | Sessão expirada | Observação |
|---|---|---|---|---|---|
| Home | observado | não-observado | não-observado | não-observado | superfície pública indexada |
| Edição principal/extras | observado | não-observado | não-observado | não-observado | ações visíveis na home |
| Edições anteriores | observado | não-observado | não-observado | não-observado | home informa últimas 30 edições na seleção direta |
| Busca/acervo | observado | não-observado | não-observado | não-observado | `/buscanova/` indexada; chamada real ainda desconhecida |
| Leitura HTML | declarado-pelo-portal | não-observado | não-observado | não-observado | portal declara consulta HTML sem cadastro |
| PDF certificado | restrição declarada | declarado-pelo-portal | não-observado | não-observado | portal declara PDF disponível para usuários cadastrados; contrato não observado |
| Acervo certificado ampliado | restrição declarada | não-observado | declarado-pelo-portal | não-observado | portal declara acervo completo para assinantes |
| Versão Jornal/Flip | ação visível; capacidade real não confirmada | não-observado | não-observado | não-observado | destino final desconhecido |
| Consulta de autenticidade | formulário visível | não-observado | não-observado | não-observado | endpoint desconhecido |
| Cadastro | observado | não aplicável | não aplicável | não aplicável | abertura do formulário observada; submissão não executada |
| Recuperação de senha | observado | não-observado | não-observado | não-observado | abertura do formulário observada; submissão não executada |
| Login | ação visível | não aplicável | não aplicável | não-observado | rota/contrato ainda desconhecidos |

## Estados adversariais

### Busca sem resultado

O template indexado de `/buscanova/` contém mensagem específica para zero resultado, mas a requisição de busca não pôde ser executada/observada nesta rodada. Estado: `não-observado-em-rede`.

### Edição inexistente

Não foi provocada por enumeração de IDs. Estado: `não-observado`.

### 401/403

Nenhum 401/403 funcional foi obtido de forma natural. Estado: `não-observado`.

### 5xx

O fetch automatizado das ferramentas retornou `502 Bad Gateway`, mas esse resultado é tratado como limitação do caminho de coleta, não como comportamento funcional do DOOL para usuários reais.

### Sessão expirada

Pendente de sessão legítima e comportamento normal de expiração/logout.

## Conclusão parcial

A baseline anônima é suficiente para mapear superfícies e restrições declaradas, mas não é suficiente para implementar contratos de busca, PDF/Jornal, autenticidade ou sessão. Esses domínios permanecem bloqueados no Gate G1 até inspeção de rede/navegador real.
