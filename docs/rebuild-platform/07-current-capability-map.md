# Mapa de capacidades da referência atual

Este documento não importa o planejamento antigo. Ele registra apenas capacidades técnicas observadas que podem reduzir retrabalho.

## 1. Edições

Capacidades observadas:
- últimas edições;
- consulta por data;
- principal e suplemento/variações;
- metadados de edição.

Uso proposto:
- reaproveitar dados e regras;
- redesenhar completamente apresentação e navegação.

## 2. HTML

Capacidades observadas:
- shell de leitura;
- sumário hierárquico;
- conteúdo por identificador de publicação;
- leitura pública em cenários observados.

Uso proposto:
- consumir contrato estruturado;
- construir leitor próprio;
- sanitizar;
- preservar conteúdo e ordem.

## 3. PDF

Capacidades observadas:
- download da edição;
- catálogo de páginas;
- PDF por página;
- suporte a Range/206 em fluxo observado.

Uso proposto:
- BFF deve preservar semântica HTTP necessária;
- evitar baixar arquivo inteiro quando o backend suporta acesso parcial.

## 4. Jornal/Flip

Capacidades observadas:
- visualização em formato de páginas/imagens;
- thumbnails.

Uso proposto:
- tratar como representação secundária da edição, não como entidade separada.

## 5. Busca

Capacidades observadas:
- resultados estruturados;
- paginação;
- destaque;
- agregações/facetas;
- zero resultado como resposta válida.

Uso proposto:
- nova experiência sobre o mesmo significado de consulta;
- filtros progressivos;
- URL compartilhável;
- telemetria de reformulação e zero-result.

## 6. Sessão

Capacidades observadas:
- estado autenticado;
- rotas protegidas;
- perfil;
- diferenças de acesso controladas pelo sistema existente.

Uso proposto:
- não armazenar credenciais;
- não inferir assinatura;
- modelar capabilities;
- delegar autorização à fonte oficial.

## 7. Autenticidade

Capacidade existente, mas deve ter seu contrato efetivo validado antes de integração plena.

## 8. Regra de reaproveitamento

Reaproveitar:
- contratos;
- identificadores;
- regras de negócio;
- documentos;
- capacidades comprovadas.

Não reaproveitar automaticamente:
- layout;
- arquitetura da informação;
- hierarquia de páginas;
- componentes;
- terminologia técnica;
- fluxo;
- acoplamento de frontend ao legado.
