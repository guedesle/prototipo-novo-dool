# Protocolo de captura de navegador — EPIC-01

**Objetivo:** obter os contratos reais de rede e DOM do DOOL com uma única sessão curta de navegação, sem alterar dados nem registrar credenciais no repositório.

## Navegador

Chrome ou Edge desktop, em uma janela comum. Para a primeira captura, permanecer **anônimo**; não fazer login.

## Preparação

1. Abra o DOOL normalmente.
2. Abra DevTools (`F12` ou `Ctrl+Shift+I`).
3. Selecione **Network / Rede**.
4. Ative **Preserve log / Preservar registro**.
5. Ative **Disable cache / Desativar cache** enquanto DevTools estiver aberto.
6. Limpe o log de rede antes de começar.

## Roteiro público — executar nesta ordem

### Fluxo A — Home e edição

1. recarregar a home;
2. aguardar carregamento completo;
3. selecionar uma data válida em `Edições anteriores`;
4. retornar à edição atual.

### Fluxo B — Busca

1. executar uma busca que produza resultados;
2. avançar uma página de resultados, se houver paginação;
3. abrir um resultado em HTML;
4. voltar à busca;
5. executar uma busca propositalmente muito improvável, para obter zero resultado.

Não usar termos sensíveis; um termo público comum e um termo sintético são suficientes.

### Fluxo C — Leitor HTML

1. abrir uma edição em HTML;
2. expandir uma categoria;
3. selecionar uma matéria;
4. selecionar outra matéria;
5. usar uma vez o controle de tamanho do texto, se disponível.

### Fluxo D — Documentos e autenticidade

1. acionar PDF sem tentar contornar eventual gate de acesso;
2. acionar Jornal/Flip sem tentar contornar eventual gate;
3. voltar à home;
4. na autenticidade, **não enviar um código inventado** se o comportamento puder produzir efeito externo; se houver um código público de edição já aberta, pode-se consultar normalmente.

## Exportação

No painel Network:

1. clique com o botão direito na lista de requisições;
2. escolha **Save all as HAR with content** / equivalente;
3. salve o arquivo localmente.

O HAR bruto **não deve ser commitado**.

## Sanitização obrigatória

Antes de compartilhar/versionar, remover ou substituir por `<redacted>`:

- `Cookie`;
- `Set-Cookie`;
- `Authorization`;
- tokens CSRF/XSRF;
- bearer tokens;
- valores de sessão;
- e-mail, login ou identificador pessoal eventualmente presente em URL/body;
- qualquer parâmetro de assinatura/cliente que identifique uma pessoa real.

Não é necessário remover:

- método HTTP;
- host e path públicos;
- nomes de parâmetros não sensíveis;
- status HTTP;
- `Content-Type`;
- CSP/CORS e demais headers de política;
- payloads públicos mínimos necessários para entender schema.

## Alternativa mais segura

Se houver dúvida sobre sanitização, compartilhe o HAR bruto **somente como arquivo temporário na conversa**, não no Git. A análise deve extrair apenas estrutura sanitizada para `docs/discovery/`; o bruto não será versionado.

## Evidência de DOM complementar

Para `/ver-html/{id}/`, é útil também salvar:

1. **View Source** da página, se disponível; e/ou
2. no painel Elements, copiar apenas o nó contêiner da árvore de categorias/matérias e o nó da matéria aberta.

Não é necessário copiar o texto completo da edição; alguns elementos representativos bastam para determinar estrutura.

## Segunda rodada — autenticada

Somente depois de fechar a captura pública, repetir os fluxos relevantes após login legítimo. Nessa rodada:

- nunca compartilhar senha;
- não documentar valores de cookie/token;
- registrar apenas capacidades observadas;
- não testar bypass, adulteração de token ou acesso não autorizado.

## Critério de sucesso

A captura pública será suficiente se permitir responder objetivamente:

1. qual request resolve uma edição/data;
2. qual request executa busca e paginação;
3. qual schema representa resultado;
4. de onde vêm categorias e matérias do HTML;
5. como PDF e Jornal/Flip são acionados;
6. qual request valida autenticidade;
7. quais headers/políticas condicionam a extensão;
8. se a nova view pode reutilizar a sessão/origem sem proxy próprio.
