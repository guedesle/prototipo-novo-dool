# Hipóteses do discovery

Este arquivo existe para impedir que inferências sobre o DOOL sejam incorporadas à arquitetura como fatos.

## Regra

Toda hipótese deve conter descrição, evidência, confiança, validação necessária, impacto e estado. Uma hipótese só é confirmada com evidência direta reproduzível ou equivalente.

## HYP-001 — A nova view pode operar sem modificar o backend
- Evidência: o HAR demonstrou contratos de leitura separados para edições, catálogo de páginas, PDF por página, imagens do Flip, sumário HTML e conteúdo de matéria.
- Confiança: alta para os fluxos públicos capturados; ainda não demonstrada para sessão/assinatura.
- Validação necessária: prova de conceito do EPIC-02 usando os contratos existentes sem alterar o servidor.
- Impacto se errada: ampliar fallback para o legado.
- Estado: **confirmada parcialmente** para home/edições/PDF/Flip/HTML; aberta para fluxos autenticados.

## HYP-002 — A busca utiliza dados estruturados acessíveis ao cliente
- Evidência: a home serializa `q`, `di`, `df` e `p` no fragmento de navegação; a superfície de busca existe, mas seu request de dados não foi capturado no HAR.
- Confiança: baixa a média.
- Validação necessária: capturar uma pesquisa real em `/buscanova/`, com resultado e sem resultado.
- Impacto se errada: a nova UI de busca poderá depender de parsing de documento/DOM ou delegação ao legado.
- Estado: aberta.

## HYP-003 — A sessão existente do navegador pode ser reutilizada pela extensão
- Evidência: os contratos capturados são same-origin, mas o HAR enviado não contém sessão autenticada comprovada; `/admin/home` redirecionou para `/login` e `/meus-dados` para `/`.
- Confiança: média como possibilidade arquitetural, baixa como fato do sistema atual.
- Validação necessária: captura após login legítimo e teste controlado no EPIC-02, sem leitura/armazenamento de credenciais pela UI.
- Impacto se errada: fluxos de conta/assinatura permanecerão delegados ao legado.
- Estado: aberta.

## HYP-004 — O leitor HTML pode ser refeito sem depender do DOM legado
- Evidência: o sumário vem de `/html/{editionId}.html` e o conteúdo vem de `/apifront/portal/edicoes/publicacoes_ver_conteudo/{publicationId}`; ambos são adquiridos independentemente do DOM já renderizado.
- Confiança: alta para a edição capturada.
- Validação necessária: testar corpus maior com tabelas, imagens, conteúdo longo e HTML atípico.
- Impacto se errada: fallback por matéria/edição ou parser mais conservador.
- Estado: confirmada para a arquitetura básica; aberta quanto à cobertura editorial completa.

## HYP-005 — PDF e Flip podem compartilhar um modelo de páginas normalizado
- Evidência: ambos consomem `/apifront/portal/edicoes/edicao_imagens/{editionId}` e derivam recursos por página.
- Confiança: alta na captura.
- Validação necessária: repetir com edição suplemento/extra e edição de tamanho diferente.
- Impacto se errada: adaptadores distintos por variante.
- Estado: confirmada para a edição capturada.
