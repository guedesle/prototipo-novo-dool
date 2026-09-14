# Visão geral — Novo DOOL

**Data-base:** 14/09/2026  
**Status:** arquitetura standalone aprovada para handoff de design  
**Natureza:** protótipo público de nova experiência sobre fontes e regras existentes do DOOL

## 1. Problema

O DOOL já entrega funções relevantes de consulta, pesquisa, leitura e acesso a documentos oficiais, porém sua camada de apresentação e sua capacidade de exploração histórica podem ser modernizadas de forma substancial.

O objetivo não é reescrever o backend oficial nem alterar documentos ou regras de negócio. O projeto passa a demonstrar uma **aplicação web pública standalone**, acessível por URL, que reorganiza os recursos oficiais e acrescenta um índice dimensional histórico de metadados para facilitar descoberta e navegação.

## 2. Resultado esperado

Ao final da fase de protótipo, uma pessoa deverá conseguir abrir o Novo DOOL em um navegador comum, sem instalar extensão, e:

- identificar a edição do dia e suas variações;
- explorar publicações por período, caderno, órgão, subordinados, tipo e título;
- abrir a matéria em HTML;
- chegar à página correspondente no PDF/Jornal quando a página estiver validada;
- acessar a busca oficial do acervo quando necessário;
- compreender claramente quando um recurso depende do DOOL oficial ou de autenticação/autorização específica.

A extensão Chromium existente permanece disponível como modo secundário de integração/demonstração, mas não é requisito para o modo principal.

## 3. Princípio central

> **Nova experiência, mesmas regras de negócio.**

O Novo DOOL pode indexar e organizar metadados, mas o DOOL oficial permanece:

- fonte documental;
- autoridade sobre autenticação e autorização;
- origem oficial de HTML, PDF e Jornal/Flip;
- referência de validade dos recursos protegidos.

## 4. Arquitetura alvo

```text
Usuário
  -> Novo DOOL / Hostinger
       -> Frontend público
       -> BFF / API
       -> Índice dimensional MySQL
       -> Ingestor
       -> DOOL oficial
```

A extensão Chromium passa a ser um modo secundário, não a plataforma principal.

## 5. Escopo funcional

Inclui:

- Home pública;
- edição principal, suplementos e extras;
- edições anteriores dentro dos contratos reais;
- experiência “Explorar publicações”;
- índice dimensional histórico cumulativo;
- busca textual por títulos;
- autocomplete e sugestão ortográfica transparente;
- filtros por período, caderno, órgão/subordinados, tipo e edição;
- leitor HTML;
- PDF e Jornal/Flip por página validada;
- acervo completo/busca oficial como superfície separada;
- cache HTML local de 24h com fallback de última visualização;
- responsividade;
- acessibilidade;
- observabilidade;
- identidade própria opcional para recursos pessoais futuros;
- autenticação oficial somente quando houver contrato aprovado.

## 6. Fora de escopo nesta fase

- alteração do backend de produção do DOOL;
- modificação de documentos oficiais;
- bypass de autenticação/assinatura/autorização;
- armazenamento persistente do corpo HTML das matérias no backend do Novo DOOL;
- uso de conta privilegiada do servidor para distribuir conteúdo protegido;
- reimplementação de login oficial sem Gate AUTH-DOOL;
- automação de publicação de matérias;
- funções internas do EGBANET;
- inferência semântica automática de identidade de órgãos/tipos;
- criação de macrogrupos editoriais inexistentes na fonte.

## 7. Índice dimensional histórico

O índice começa com backfill de 90 dias, sincroniza a cada hora e reconcilia os últimos 7 dias diariamente.

Os 90 dias são janela inicial e default de consulta, não retenção. O histórico cresce continuamente.

Grão:

```text
1 fact_publication = 1 publicationId em 1 cadeia editorial
```

Cadeia:

```text
Edição -> Caderno -> Órgão -> subordinados -> Tipo de publicação -> Publicação
```

A estrutura organizacional é temporal: consultas históricas usam a hierarquia válida na data da publicação.

## 8. Relação com PDF e Jornal

Cada publicação espera uma página inicial de origem:

```text
publicationId + editionId + source_start_page
```

A página só é considerada utilizável quando validada contra o catálogo da edição.

Sem página validada:

```text
HTML: disponível quando o contrato permitir
PDF/Jornal por página: não apresentar como disponível
```

## 9. Autenticação

A consulta pública do Novo DOOL não exige conta própria.

Se identidade própria for habilitada, ela serve para recursos do Novo DOOL, como:

- favoritos;
- preferências;
- buscas salvas;
- alertas.

Invariante:

```text
sessão_Novo_DOOL != sessão_DOOL
```

Uma sessão própria nunca amplia acesso oficial.

## 10. Usuários considerados

### 10.1 Cidadão sem cadastro

Precisa localizar e ler publicações com o mínimo de barreira possível.

### 10.2 Usuário do Novo DOOL

Pode futuramente salvar preferências, favoritos e consultas sem que isso altere sua autorização no DOOL oficial.

### 10.3 Usuário autenticado/autorizado no DOOL

Acessa recursos protegidos conforme regras oficiais, quando a integração suportada estiver comprovada.

### 10.4 Equipe interna e decisores

Precisam demonstrar, avaliar e comparar a nova experiência sem depender de instalação de extensão para os fluxos públicos.

## 11. Princípios de produto

1. **Preservar a verdade da fonte.**
2. **Consulta pública sem barreira desnecessária.**
3. **Acessibilidade por padrão.** Meta: WCAG 2.2 AA nos fluxos implementados.
4. **Responsividade real.** Desktop, tablet, 320 px e zoom 200%.
5. **Leitura como tarefa central.**
6. **Exploração sem jargão de BI.**
7. **Temporalidade histórica correta.**
8. **Nenhuma página ou capacidade inventada.**
9. **Observabilidade sem invasão.**
10. **Fidelidade demonstrativa.** Fixtures devem ser claramente identificadas como sintéticas quando não forem dados oficiais.

## 12. Definição de sucesso do protótipo

O protótipo será considerado apto para demonstração quando:

- fluxos públicos prioritários funcionarem por URL em navegador limpo;
- Home e exploração usarem dados/contratos reais ou fixtures explicitamente identificadas durante design;
- o índice estiver auditável e cumulativo;
- HTML/PDF/Flip preservarem a origem oficial;
- página não validada não gerar ação falsa;
- busca própria e busca oficial forem distinguíveis;
- navegação funcionar por teclado;
- telas prioritárias forem responsivas;
- falhas produzirem estado compreensível e recuperável;
- recursos protegidos respeitarem autorização oficial;
- QA e revisão adversarial forem reproduzíveis.

## 13. Governança

Mudanças nas seguintes invariantes exigem reabertura de decisão arquitetural:

- plataforma principal standalone;
- DOOL como fonte documental;
- separação entre sessão própria e oficial;
- grão de `fact_publication`;
- temporalidade da hierarquia;
- canonicalização conservadora;
- relação `publicationId -> editionId -> source_start_page`;
- separação entre índice dimensional e busca oficial.

## 14. Documentos de referência

- `docs/superpowers/specs/2026-09-14-novo-dool-standalone-indice-dimensional.md`
- `docs/design/HANDOFF-SITES.md`
- `docs/04-roadmap-epicos.md`
- `docs/specs/EPIC-04.5-indice-dimensional-publico.md`
- `docs/specs/EPIC-04.6-plataforma-web-standalone-bff.md`
