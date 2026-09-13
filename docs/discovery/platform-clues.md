# Indícios de plataforma e fornecedor

**Data:** 13/09/2026

Este arquivo reúne evidências úteis para orientar o discovery técnico. Nada aqui substitui contratos locais observados em `contracts.md`.

## 1. Host atual da plataforma associado à EGBA

Foi observado publicamente o host:

`https://egba.autopage.inf.br/`

O conteúdo indexado e aberto recentemente apresenta:

- marca EGBA;
- referência explícita a `EGBANET acesso ao sistema de publicação`;
- busca por data;
- Diário Oficial e suplemento;
- PDF;
- HTML;
- FLIP;
- edições anteriores;
- outros diários oficiais;
- consulta de autenticidade;
- busca por palavra;
- rota de entrada apontando para `/balcao`;
- módulo `/clipping`;
- módulo `/loja/`;
- páginas institucionais em `/canal/...`.

A presença desse host é forte evidência de que existe uma implantação EGBA operada sobre infraestrutura/domínio Autopage. Ainda não foi demonstrado se esse host é produção, espelho, origem, homologação ou interface paralela do mesmo backend usado por `doe.ba.gov.br`.

## 2. Relação contratual EGBA–Autopage

Há documentação pública que registra o Contrato EGBA nº `2022.0008.00`, firmado com Autopage Gestão da Informação Ltda., cujo objeto é sustentação técnica especializada da plataforma informatizada de publicação de Diários Oficiais em operação na rede corporativa da EGBA.

Também foi localizada apostila datada de 23/08/2024, ainda vinculando a Autopage ao mesmo contrato/plataforma.

**Limite temporal:** nesta rodada não foi encontrada evidência pública suficientemente clara de 2025/2026 para afirmar a vigência contratual atual. Portanto, o vínculo é historicamente confirmado e tecnicamente coerente com os hosts atuais, mas não deve ser descrito como contrato vigente em 2026 sem nova evidência.

## 3. Identificação IONEWS

A Autopage informa publicamente que é representante exclusiva da solução IONEWS para automação de diários oficiais. O site atual da IONEWS descreve recursos como:

- automação de produção e gestão;
- busca inteligente;
- assinatura/certificação digital;
- financeiro e integrações;
- mobile;
- clipping;
- workflow;
- conferência de matéria;
- gestão de múltiplos diários.

Documentação pública histórica de outra imprensa oficial registra explicitamente a presença da solução IONEWS na Bahia entre seus clientes estaduais.

## 4. Template multicliente

O conjunto incomum de marcadores da busca pública, como:

- `results.hits.total`;
- `queryTerm`;
- `doc._source.*`;
- `isSuplemento(doc)`;
- `cliente.limiteAntigos`;

aparece também em portais de outros diários oficiais. Alguns desses portais possuem vínculo público conhecido com Autopage/IONEWS.

Isso sustenta a hipótese de uma base de aplicação multicliente/customizável.

## 5. Regra para o protótipo

Mesmo com os indícios acima:

- endpoints de outro cliente não podem ser copiados para o DOOL;
- nomes de rotas de outro cliente não são contratos da Bahia;
- framework e banco/mecanismo de busca não devem ser inferidos sem source/tráfego local;
- `egba.autopage.inf.br` não deve ser tratado como origem canônica até comparar rede, sessão e dados com `doe.ba.gov.br`.

## 6. Impacto no discovery

A identificação da família de plataforma reduz o espaço de busca, mas o Gate G1 continua exigindo captura local dos seguintes pontos:

1. chamadas da home/edição;
2. busca por data e palavra;
3. leitura HTML;
4. PDF/FLIP;
5. autenticidade;
6. sessão/login;
7. headers/cookies/CSP/CORS;
8. relação entre os hosts DOOL e Autopage.
