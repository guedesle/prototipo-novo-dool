# Permissões da extensão — EPIC-02

## Permissão solicitada

- `storage` — necessária exclusivamente para preferência Nova/Original, kill switch, feature flags locais e diagnóstico técnico sanitizado.

## Host inicial

- `https://dool.egba.ba.gov.br/*` — limitado ao host observado no discovery. O match do content script será ainda restringido por roteamento interno.

## Permissões deliberadamente não solicitadas

- `cookies`
- `webRequest`
- `webRequestBlocking`
- `tabs`
- `downloads`
- `history`
- `management`
- `<all_urls>`

## Regra

Qualquer permissão adicional exige evidência de necessidade, atualização deste documento e revisão adversarial antes de entrar no Manifest.
