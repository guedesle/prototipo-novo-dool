# Matriz de acesso do DOOL

**Data:** 2026-09-13

Legenda:

- `observado`: evidência pública suficiente nesta rodada.
- `anunciado`: regra declarada pela própria interface, mas contrato técnico não capturado.
- `não observado`: exige sessão legítima ou execução que não ocorreu.
- `bloqueado`: ferramenta atual não conseguiu observar o comportamento técnico necessário.

| Recurso/fluxo | Anônimo | Cadastrado | Assinante | Sessão expirada | Evidência/observação |
|---|---|---|---|---|---|
| abrir home | observado | não observado | não observado | não observado | documento público indexado |
| ver edição Principal/Extras na home | observado estruturalmente | não observado | não observado | não observado | ações e blocos visíveis; valores dinâmicos não capturados |
| edições anteriores | anunciado/observado estruturalmente | não observado | não observado | não observado | seleção informa últimas 30 edições |
| busca por termo/período | formulário observado; resultado técnico bloqueado | não observado | não observado | não observado | `/buscanova/` expõe template e controles |
| busca exata | observado estruturalmente | não observado | não observado | não observado | opção visível em `/buscanova/` |
| HTML `/ver-html/{id}/` | anunciado como consulta pública | não observado | não observado | não observado | páginas indexadas repetidamente |
| categorias/matérias do HTML | bloqueado para inspeção dinâmica | não observado | não observado | não observado | requer browser/DOM/rede |
| PDF certificado | anunciado como disponível a usuários cadastrados | não observado | não observado | não observado | regra textual da própria interface |
| Versão Jornal/Flip | ação visível; acesso efetivo não observado | não observado | não observado | não observado | contrato pendente |
| acervo completo certificado | não | não determinado | anunciado para assinantes | não observado | regra textual da própria interface |
| consulta de autenticidade | campo/ação observados; resultado não executado | não observado | não observado | não observado | home |
| abrir cadastro | observado | n/a | n/a | n/a | `/cadastro` público |
| submeter cadastro | não executado; mutação | n/a | n/a | n/a | fora do discovery automático |
| abrir recuperação de senha | observado | n/a | n/a | n/a | `/esqueci-senha` público |
| submeter recuperação | não executado; mutação | n/a | n/a | n/a | fora do discovery automático |
| login | ação anunciada | não observado | não observado | não observado | requer sessão legítima |
| perfil/assinatura | não observado | não observado | não observado | não observado | requer sessão legítima |

## Cenários adversariais benignos

### Busca sem resultado

A interface de `/buscanova/` contém estado explícito de “nenhum resultado encontrado”. O estado existe no template, porém uma requisição real de busca sem resultado não foi capturada nesta ferramenta. Portanto, o comportamento técnico permanece pendente.

### Edição inexistente

Não foi realizada enumeração de IDs nem varredura de rotas. O caso permanece pendente para teste benigno no navegador real com um identificador controlado, sem automação em massa.

### 401/403/500/timeout/redirect

- `502 Bad Gateway`/timeout foram observados no cliente automatizado ao abrir algumas páginas públicas; isso pode refletir o caminho do crawler/proxy e **não é classificado como comportamento funcional do DOOL para o usuário final**.
- 401/403 não foram provocados.
- sessão expirada não foi simulada nem adulterada.

## Conclusão da baseline anônima

A baseline pública é suficiente para documentar arquitetura de informação e contratos de documento, mas **não é suficiente para fechar contratos de dados, autorização ou sessão**. Esses pontos permanecem dependentes de navegador real/DevTools e, para perfis protegidos, sessão legítima.
