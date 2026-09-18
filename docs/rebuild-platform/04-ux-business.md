# UX, usuários e análise de negócios

## 1. Perfis iniciais de usuários

Estes perfis são hipóteses de trabalho e devem ser validados.

### Cidadão eventual
Quer localizar rapidamente um ato, nome, processo ou publicação específica. Baixa tolerância a terminologia interna.

### Profissional recorrente
Advocacia, contabilidade, empresas, imprensa, pesquisa e fornecedores. Precisa pesquisar, filtrar, comparar datas e recuperar fontes com frequência.

### Servidor público
Consulta atos, processos e publicações por órgão, data e contexto institucional.

### Usuário de leitura integral
Acessa uma edição para percorrer cadernos, sumário e matérias, não apenas para pesquisar termos.

## 2. Jobs-to-be-done

- “Quando preciso verificar se algo foi publicado, quero encontrar a publicação sem conhecer a estrutura do Diário.”
- “Quando sei a data, quero abrir a edição certa imediatamente.”
- “Quando encontro um resultado, quero entender de qual edição/página/órgão ele veio.”
- “Quando preciso comprovar a fonte, quero chegar ao documento oficial correspondente.”
- “Quando não encontro, quero saber se não existe resultado ou se pesquisei de forma inadequada.”

## 3. Arquitetura da informação proposta

Navegação principal:
- Hoje
- Edições
- Buscar
- Autenticidade

Navegação de utilidade:
- Conta
- Ajuda
- Interface/serviço oficial, quando necessário

A interface não deve expor a topologia interna do backend.

## 4. Home

A home deve priorizar:
1. busca;
2. edição atual;
3. escolha de data;
4. edições adicionais do dia;
5. acesso a formatos.

Evitar painéis administrativos, terminologia técnica e excesso de cards competindo com a tarefa principal.

## 5. Busca

Requisitos de experiência:
- campo dominante;
- busca simples primeiro;
- filtros progressivos;
- datas compreensíveis;
- resultados com contexto;
- destaque do termo sem destruir legibilidade;
- zero-result com recuperação;
- preservar consulta na URL;
- retorno ao mesmo ponto da lista após leitura.

## 6. Leitura

- tipografia de leitura separada da tipografia de interface;
- largura controlada;
- navegação pelo sumário;
- contexto da edição sempre recuperável;
- controles de tamanho e espaçamento;
- impressão e compartilhamento previsíveis;
- aviso objetivo sobre natureza consultiva do HTML quando aplicável.

## 7. Regras de negócio que não podem ser inventadas pela UI

- disponibilidade de formatos;
- perfil de acesso;
- assinatura;
- validade documental;
- autenticidade;
- existência de edição;
- classificação oficial;
- conteúdo e ordem do ato.

## 8. Critérios de priorização de negócio

Uma entrega sobe na prioridade quando:
- reduz volume de suporte;
- atende tarefa de alta frequência;
- elimina ambiguidade jurídica/documental;
- reduz etapas;
- melhora acesso móvel/acessível;
- reduz acoplamento ao legado;
- cria base reutilizável para outras jornadas.
