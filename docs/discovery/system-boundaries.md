# Fronteiras de sistemas e ambientes

**Data:** 13/09/2026

Este documento impede que o protótipo misture recursos de consulta pública, backoffice de publicação e instâncias/template da plataforma sem evidência de equivalência.

## Zona A — DOOL público

### Finalidade

Consulta pública das edições e do acervo do Diário Oficial do Estado da Bahia.

### Hosts observados

- `www.doe.ba.gov.br`
- `doe.ba.gov.br`
- `do.ba.gov.br`
- `www2.egba.ba.gov.br`

### Superfícies observadas

- home;
- edição principal e extras;
- edições anteriores;
- busca por palavra/período;
- `/buscanova/`;
- `/ver-html/{id}/`;
- PDF e Jornal/Flip como capacidades visíveis;
- consulta de autenticidade;
- cadastro/recuperação associados ao consumo do portal.

### Regra

Esta é a zona prioritária da extensão. Os hosts ainda não são considerados equivalentes entre si em rede, sessão ou políticas do navegador até captura HTTP real.

---

## Zona B — EGBANET 2.0 / IONEWS — publicação e backoffice

### Finalidade

Envio, gerenciamento e formatação automática de matérias, conforme descrição institucional atual da EGBA.

### Host observado

`egbanet.egba.ba.gov.br`

### Rotas públicas atuais observadas

- `/login` — login geral do EGBANET;
- `/cadastro/` — cadastro de pessoa/empresa e credencial de acesso;
- `/usuarios/recupera_senha` — recuperação por e-mail;
- `/esqueci-senha` — recuperação por login + e-mail;
- `/balcao` — tela identificada como `IONEWS` / `Entrar no EgbaNet 2.0`;
- `/portal/login` — tela IONEWS de autenticação/área protegida;
- `<cliente>/...` — portais de outros diários hospedados pela plataforma, como ALBA, TCM, municípios e câmaras.

### Evidência institucional

A página institucional `ba.gov.br/egba/egbanet-20` descreve o EGBANET 2.0 como sistema informatizado para envio, gerenciamento e formatação automática de matérias.

### Regra

O novo DOOL **não** deve incorporar o backoffice de publicação ao MVP público. As rotas desta zona são catalogadas porque podem compartilhar autenticação, plataforma e recursos com o DOOL, mas qualquer integração precisa de caso de uso explícito.

---

## Zona C — hosts Autopage/IONEWS associados à EGBA

### Hosts observados

- `egba.autopage.inf.br`
- `dool.autopage.inf.br`

### `egba.autopage.inf.br`

Apresenta marca EGBA, EGBANET, consulta por data/palavra, PDF/HTML/FLIP, autenticidade, outros diários e links para `/balcao`, `/clipping` e `/loja/`. É uma pista técnica forte do ecossistema Autopage/IONEWS, mas seu papel exato — produção, espelho, origem, homologação ou interface paralela — ainda não foi demonstrado.

### `dool.autopage.inf.br`

Reproduz visualmente e textualmente grande parte do DOOL da Bahia, inclusive acervo desde 30/06/2007, edições, HTML/PDF/Jornal, autenticidade e contatos da EGBA.

Entretanto, sua navegação pública contém links parametrizados para outro ente federativo:

- `Estrutura de Governo` aponta para `www.portal.ap.gov.br`;
- `Normas de envio` aponta para `editor.amapa.gov.br`.

Também foi observado `/canal/valores` e `/cadastro` como destinos internos.

### Conclusão adversarial

`dool.autopage.inf.br` **não pode ser promovido a ambiente canônico da Bahia** nesta fase. Os links do Amapá são evidência de template multicliente ou parametrização incompleta, tornando perigoso copiar endpoints, regras ou navegação desse host para a extensão.

---

## Zona D — outros clientes IONEWS/EGBA

Exemplos observados em `egbanet.egba.ba.gov.br`:

- `/alba`
- `/tcm`
- portais de prefeituras e câmaras

Esses ambientes revelam famílias de rota da plataforma, como:

- `/<cliente>/ver-pdf/{id}/`;
- `/<cliente>/portal/edicoes/download/{id}`.

### Regra

Essas famílias são úteis para orientar investigação, mas **não são contratos do DOOL estadual** até serem observadas no contexto do DOE. Não reutilizar IDs, endpoints ou regras de autorização de outro cliente.

---

## Decisão para implementação

A extensão deve começar assumindo apenas:

1. Zona A como produto-alvo;
2. Zona B como sistema relacionado, fora do MVP público salvo integração explicitamente necessária;
3. Zona C como fonte de pistas técnicas, não fonte de verdade;
4. Zona D como material comparativo de plataforma, nunca como contrato local.
