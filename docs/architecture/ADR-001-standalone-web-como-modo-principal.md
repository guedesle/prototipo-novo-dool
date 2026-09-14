# ADR-001 — Aplicação web standalone como modo principal

**Status:** Aceita  
**Data:** 2026-09-14

## Contexto

O protótipo foi iniciado como extensão Chromium sobre o DOOL. O discovery confirmou contratos públicos suficientes para edições, HTML, PDF/Flip e outros fluxos, enquanto a evolução do produto introduziu um índice dimensional histórico próprio para exploração de publicações.

A necessidade de disponibilizar a experiência a qualquer usuário sem instalação adicional tornou a extensão inadequada como plataforma principal.

Também existe vantagem em consumir o DOOL server-to-server por uma camada BFF controlada, evitando dependência de CORS no browser e mantendo o frontend desacoplado dos endpoints legados.

## Decisão

O modo principal do Novo DOOL será uma **aplicação web pública standalone**, hospedada na Hostinger.

Arquitetura:

```text
Browser
 -> Frontend Novo DOOL
 -> BFF/API
 -> índice dimensional MySQL
 -> DOOL oficial como fonte documental
```

A extensão Chromium existente permanece como modo secundário/experimental.

A consulta pública não exige autenticação própria.

Identidade própria futura é permitida para recursos do Novo DOOL, mas nunca amplia autorização no DOOL oficial.

## Consequências positivas

- uso por URL sem instalação;
- design não limitado por content script/overlay;
- melhor separação entre frontend e fonte oficial;
- possibilidade de BFF controlado e cache HTTP;
- índice dimensional disponível independentemente da extensão;
- autenticação própria opcional para recursos pessoais;
- manutenção da extensão como laboratório/integração alternativa.

## Consequências negativas / custos

- nova superfície operacional na Hostinger;
- necessidade de BFF, banco, scheduler e observabilidade;
- responsabilidade adicional por rate limiting, SSRF, secrets e disponibilidade;
- sessão do DOOL não pode ser reutilizada silenciosamente entre domínios;
- recursos protegidos exigem integração oficial específica ou encaminhamento ao fluxo original.

## Invariantes

1. DOOL oficial permanece fonte documental.
2. Recurso protegido não pode ser tornado público pelo BFF.
3. `sessão_Novo_DOOL != sessão_DOOL`.
4. BFF não pode aceitar destino arbitrário.
5. Índice próprio não deve ser apresentado como busca oficial.
6. Corpo HTML integral não é acervo persistente do backend próprio.
7. A extensão não é dependência do modo público.

## Alternativas rejeitadas

### Extensão como plataforma principal

Rejeitada como alvo principal porque exige instalação e mantém dependência do ambiente do portal para toda a experiência.

### Browser consumir DOOL diretamente

Rejeitada como arquitetura principal por dependência de CORS, cookies e políticas do navegador entre origens.

### Proxy genérico

Rejeitado por risco de SSRF e perda de controle contratual.

### Copiar documentos oficiais para banco próprio

Rejeitado porque o índice precisa de metadados/referências; o DOOL continua sendo a fonte documental.

## Relação com outros documentos

- `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`
- `docs/specs/EPIC-04.5-indice-dimensional-publico.md`
- `docs/specs/EPIC-04.6-plataforma-web-standalone-bff.md`
- `docs/design/HANDOFF-SITES.md`
