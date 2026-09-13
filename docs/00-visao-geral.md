# Visão geral — Protótipo Novo DOOL

**Data-base:** 13/09/2026  
**Status:** especificação inicial  
**Natureza:** protótipo de interface sobre o ambiente existente

## 1. Problema

O DOOL já entrega funções relevantes de consulta, pesquisa, leitura e acesso a documentos oficiais, porém sua camada de apresentação pode ser modernizada de forma substancial. O objetivo deste projeto não é reescrever o sistema inteiro nem substituir o backend nesta etapa, mas demonstrar que os recursos existentes podem ser reorganizados em uma experiência mais clara, responsiva, acessível e adequada aos padrões atuais da web.

O protótipo deverá funcionar sobre o ambiente real no navegador, usando as respostas e permissões já fornecidas pelo DOOL, sem alterar o código do servidor de produção.

## 2. Resultado esperado

Ao final da fase de protótipo, uma pessoa deverá conseguir instalar ou habilitar a extensão, abrir o DOOL e experimentar uma interface significativamente modernizada, com possibilidade imediata de voltar para a experiência original.

A demonstração deve ser forte o suficiente para responder, com evidência, à pergunta: **“como ficaria o DOOL se a nova interface já estivesse pronta para integração?”**

## 3. Escopo funcional inicial

O escopo parte dos recursos públicos e autenticados já existentes no portal e será confirmado por captura de rede e testes controlados.

Inclui:

- página inicial e navegação geral;
- edição principal e edições extras;
- edições anteriores;
- pesquisa por palavra-chave e intervalo de datas;
- consulta ao acervo;
- leitura de edição em HTML;
- navegação por categorias e matérias;
- controles de leitura;
- acesso a PDF e versão jornal quando autorizado;
- consulta de autenticidade;
- cadastro, login, recuperação de senha e estados de usuário, sem reimplementar autenticação;
- adaptação responsiva;
- acessibilidade;
- segurança e isolamento da extensão;
- mecanismo de ativar/desativar a nova interface.

## 4. Fora de escopo nesta fase

- alteração de banco de dados do DOOL;
- criação de novos endpoints no servidor;
- migração do backend;
- alteração das regras de assinatura ou comercialização;
- contorno de autenticação ou autorização;
- alteração de documentos oficiais;
- substituição definitiva do portal em produção;
- automação de publicação de matérias;
- funções internas do EGBANET;
- qualquer mudança que exija privilégio administrativo no backend.

## 5. Usuários considerados

### 5.1 Cidadão sem cadastro

Precisa localizar e ler publicações com o mínimo de barreira possível, compreendendo claramente o que é conteúdo para consulta e o que possui validade jurídica.

### 5.2 Usuário cadastrado

Precisa autenticar-se sem fricção desnecessária e acessar os recursos que o backend autoriza para sua conta.

### 5.3 Assinante

Precisa acessar o acervo e documentos protegidos de acordo com as regras já existentes, sem que a extensão amplie ou reduza permissões.

### 5.4 Equipe interna e decisores

Precisam demonstrar, avaliar e comparar a experiência nova com a atual, inclusive em diferentes resoluções, sem risco para o ambiente produtivo.

## 6. Princípios de produto

1. **Preservar a verdade do backend.** A UI nunca deve fabricar um estado de autorização ou um documento que o servidor não tenha concedido.
2. **Reversibilidade.** A interface original deve estar disponível em um comando simples.
3. **Acessibilidade por padrão.** O alvo é WCAG 2.2 nível AA nos fluxos cobertos.
4. **Progressive enhancement.** Falhas da extensão não podem inutilizar o portal original.
5. **Sem credenciais próprias.** A extensão não deve solicitar nem armazenar senha do usuário.
6. **Responsividade real.** O projeto deve funcionar em desktop, tablet e larguras móveis, respeitando as limitações de uma extensão em navegador Chromium.
7. **Leitura como tarefa central.** A visualização HTML deve ser tratada como produto editorial, não como simples renderização de texto.
8. **Observabilidade sem invasão.** Erros devem ser registráveis para depuração sem coletar conteúdo sensível ou credenciais.
9. **Fidelidade demonstrativa.** A experiência precisa usar o backend real sempre que seguro, e deixar explícito quando algum elemento for apenas simulado.

## 7. Hipótese arquitetural

A abordagem recomendada é uma extensão Chromium Manifest V3 que injeta uma aplicação de apresentação no DOOL e usa uma camada adaptadora para consumir os mesmos recursos disponíveis ao portal, preferencialmente por chamadas same-origin e sessão gerenciada pelo próprio navegador.

A extensão deve evitar acoplamento direto a detalhes frágeis do DOM sempre que houver contratos de dados ou rotas reutilizáveis. Quando um recurso só existir na interface legada, a dependência deve ser explicitamente catalogada.

## 8. Definição de sucesso do protótipo

O protótipo será considerado apto para demonstração quando:

- os fluxos prioritários funcionarem com dados reais e permissões reais;
- for possível alternar entre interface nova e original sem recarregar configuração manual;
- não houver alteração intencional de dados do backend fora das ações normais do usuário;
- a navegação e o leitor HTML forem utilizáveis por teclado;
- não houver violações críticas ou sérias de acessibilidade automatizada nas telas-alvo;
- os principais cenários responsivos forem validados;
- falhas de integração produzirem fallback compreensível;
- os fluxos protegidos respeitarem integralmente o estado de autenticação fornecido pelo DOOL;
- a demonstração possuir roteiro e evidências de QA reproduzíveis.

## 9. Governança

Toda decisão que aumente o escopo, exija alteração de backend, introduza armazenamento de credenciais, intercepte tráfego de forma invasiva ou modifique o comportamento de autorização deverá ser tratada como mudança arquitetural e submetida a nova decisão antes da implementação.
