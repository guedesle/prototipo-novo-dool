# Dependências de documento e DOM

**Data:** 13/09/2026

Este arquivo distingue o que já pode ser atribuído ao documento público do que depende de renderização/JavaScript ainda não observados diretamente.

| Superfície | Documento público observado | DOM renderizado necessário? | Estado |
|---|---|---|---|
| Home | estrutura funcional visível no índice | desconhecido | parcial |
| `/buscanova/` | template com marcadores `results.*`, `queryTerm`, `doc._source.*`, `cliente.*` | provavelmente para resultados, mas não demonstrado | bloqueado |
| `/ver-html/{id}/` | metadados da edição e gate de acesso visíveis | categorias/matérias podem depender de DOM/chamada posterior; não demonstrado | bloqueado |
| `/cadastro` | campos do formulário visíveis | validação dinâmica possivelmente existe; não demonstrada | parcial |
| `/esqueci-senha` | campo e ação visíveis | comportamento de submissão não demonstrado | parcial |

## Regra de implementação

Enquanto a fonte de um dado não estiver demonstrada, componentes futuros não devem acessar seletores do DOM legado presumidos nem codificar nomes de campos internos como contrato público.

## Achado relevante da busca

A presença de marcadores de template não resolvidos na indexação de `/buscanova/` demonstra que existe uma camada de template client-side aparente. Ela **não** demonstra onde os dados são buscados, quando são carregados nem qual framework executa a interpolação.

## Próxima evidência necessária

Para liberar o adaptador do EPIC-03 e a busca do EPIC-06, é necessário capturar em navegador real:

1. documento/source inicial;
2. lista de scripts relevantes;
3. requisições XHR/fetch durante uma consulta;
4. DOM após o carregamento;
5. diferenças entre busca com resultado e zero resultado.

Para liberar o leitor do EPIC-07, repetir o mesmo processo em `/ver-html/{id}/`, incluindo a abertura de categoria e matéria.
