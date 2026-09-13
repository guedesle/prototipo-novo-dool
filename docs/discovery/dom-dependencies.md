# Dependências de HTML e DOM

**Data:** 2026-09-13

Este documento separa o que já está disponível no documento público do que ainda depende de execução client-side/DOM e captura no navegador real.

| Superfície/dado | Documento público | DOM renderizado necessário? | Rede separada conhecida? | Estado |
|---|---:|---:|---:|---|
| estrutura da home | sim | não para inventário básico | desconhecida | observado |
| edição Principal/Extras na home | elementos visíveis | possivelmente para valores dinâmicos | desconhecida | parcial |
| seletor de edições anteriores | controle visível | sim para opções/estado dinâmico | desconhecida | parcial |
| formulário da busca | sim | não para estrutura | desconhecida | observado |
| resultados da busca | template existe | sim para resultados reais | desconhecida | bloqueado nesta ferramenta |
| metadados de `/ver-html/{id}/` | sim | não para metadados básicos | desconhecida | repetido |
| categorias e matérias | instruções/estrutura anunciadas | provavelmente sim após interação | desconhecida | pendente |
| zoom/tamanho do texto | controle visível | sim para comportamento | não necessário para dado | observado estruturalmente |
| PDF/Jornal | ações visíveis | pode haver navegação dinâmica | desconhecida | contrato pendente |
| cadastro | formulário visível | comportamento de validação depende de JS/DOM | submissão não observada | parcial |
| recuperação de senha | formulário visível | comportamento depende de JS/DOM | submissão não observada | parcial |
| autenticidade | campo/ação visíveis na home | comportamento depende de execução | desconhecida | pendente |

## Conclusão provisória

A interface pública fornece estrutura suficiente para modelar navegação e componentes, mas **não há evidência suficiente para acoplar a futura UI ao DOM legado como fonte principal de dados**. O EPIC-03 deverá preferir adaptadores de contratos estruturados quando o navegador real comprovar sua existência; parsing de documento/DOM deve permanecer fallback explícito.
