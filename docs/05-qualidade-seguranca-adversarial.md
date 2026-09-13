# Qualidade, segurança e revisão adversarial

## 1. Objetivo

Este documento define como o projeto deve ser testado contra falhas previsíveis e não previsíveis. A revisão adversarial não é uma etapa final isolada: cada épico deve demonstrar que considerou formas plausíveis de quebrar o comportamento proposto.

## 2. Princípios

1. **Preservar o portal original.** A extensão é descartável; o DOOL não pode se tornar dependente dela.
2. **Nunca elevar privilégio.** Toda autorização vem do backend atual.
3. **Tratar conteúdo como não confiável para a UI.** HTML recebido deve ser exibido sem permitir que conteúdo editorial execute comportamento privilegiado da extensão.
4. **Falhar de forma visível e reversível.** Erro da nova view deve oferecer fallback, não tela quebrada silenciosa.
5. **Não confundir mock com integração.** Evidências de demonstração devem indicar a origem do dado.
6. **Testar contratos, não só pixels.** UI bonita com integração errada é falha crítica.
7. **Acessibilidade como requisito funcional.** Teclado, foco, zoom e semântica fazem parte do aceite.

## 3. Classes de risco

### R1 — Autorização incorreta

Exemplos:

- botão de PDF aparece para usuário não autorizado;
- extensão reutiliza uma URL protegida sem validar o estado real;
- estado em cache faz usuário parecer assinante após logout.

Severidade: **crítica**.

Mitigação: capacidades derivadas do backend, invalidação de cache em mudança de sessão e testes por perfil.

### R2 — Alteração semântica do conteúdo oficial

Exemplos:

- matéria truncada;
- tabela reordenada;
- cabeçalho associado à matéria errada;
- texto ocultado em mobile;
- normalização que altera caracteres relevantes.

Severidade: **crítica**.

Mitigação: comparação de conteúdo, corpus representativo e fallback para fonte original.

### R3 — Interferência no portal

Exemplos:

- CSS global quebra tela original;
- exceção da extensão deixa body invisível;
- interceptação de rede altera uma operação legítima.

Severidade: **crítica/alta**.

Mitigação: isolamento, montagem transacional e toggle original/nova.

### R4 — Vazamento de dados

Exemplos:

- log contém cookie;
- diagnóstico registra token;
- persistência local guarda dados pessoais desnecessários.

Severidade: **crítica**.

Mitigação: allowlist de campos de log, revisão de storage e testes automatizados de sanitização.

### R5 — Fragilidade a mudanças do DOOL

Exemplos:

- seletor DOM deixa de existir;
- resposta muda de nome de campo;
- rota ganha parâmetro novo.

Severidade: **alta/média**.

Mitigação: adaptadores, validação de schema, erro `CONTRACT_UNEXPECTED` e fallback.

### R6 — Acessibilidade insuficiente

Exemplos:

- foco invisível;
- diálogo prende usuário;
- leitor HTML não tem landmarks;
- conteúdo requer hover;
- zoom causa perda de função.

Severidade: **alta**.

Mitigação: WCAG 2.2 AA, axe e validação manual por teclado/leitor de tela em fluxos críticos.

## 4. Matriz adversarial mínima

Cada fluxo relevante deve ser testado em pelo menos estes estados:

| Dimensão | Casos |
|---|---|
| Sessão | anônimo, cadastrado, assinante, sessão expirada, estado desconhecido |
| Rede | normal, lenta, timeout, 4xx, 5xx, resposta vazia |
| Contrato | correto, campo ausente, tipo inesperado, HTML incompleto |
| Conteúdo | curto, muito longo, tabela larga, imagem, caracteres especiais, links |
| Viewport | 320 px, 768 px, desktop comum, tela ampla |
| Interação | mouse, somente teclado, zoom 200%, reduced motion |
| Navegação | entrada direta por URL, back/forward, refresh, deep link |
| Extensão | habilitada, desabilitada, falha durante bootstrap, falha após montagem |

## 5. Gates de qualidade

### Gate A — Segurança

- nenhuma senha persistida;
- nenhum token/cookie em log;
- nenhuma tentativa de elevar autorização;
- HTML editorial não executa scripts privilegiados;
- permissões do manifest justificadas e mínimas.

### Gate B — Fidelidade documental

- conteúdo textual comparável à fonte;
- ordem de categorias/matérias preservada quando a ordem tiver significado;
- tabelas e blocos não perdem dados;
- link para fonte/original disponível quando aplicável.

### Gate C — Acessibilidade

- zero violação crítica ou séria em verificação automatizada nas rotas-alvo;
- fluxo principal completo por teclado;
- foco previsível;
- contraste conforme AA;
- 200% de zoom sem perda de função;
- reduced motion respeitado.

### Gate D — Robustez

- erros de rede não deixam tela branca;
- mudança de contrato é detectada;
- toggle para original funciona mesmo após falha parcial;
- refresh/back/forward não corrompem estado.

### Gate E — Performance

Os limites definitivos devem ser medidos após escolha do stack, mas a implementação deve:

- evitar carregar dependências pesadas antes de saber se a rota é suportada;
- lazy-loadar módulos quando apropriado;
- não duplicar downloads grandes já realizados pela página sem justificativa;
- registrar regressões relevantes entre baseline e nova view.

## 6. Política de dados e privacidade

A extensão deve operar com minimização de dados.

Pode persistir, quando necessário:

- preferência de ativação da nova UI;
- preferências visuais não sensíveis;
- flags de demonstração;
- versão/schema local.

Não deve persistir por padrão:

- senha;
- cookie;
- token;
- conteúdo integral de documento;
- histórico de pesquisa identificável;
- dados de perfil além do estritamente necessário para a tela atual.

## 7. Revisão adversarial por épico

Cada spec possui uma seção própria de ameaças/falhas. Antes de considerar um épico pronto, o revisor deve responder:

1. O que acontece se o backend responder algo diferente do esperado?
2. O que acontece se a sessão mudar no meio do fluxo?
3. O que acontece se a extensão falhar neste ponto?
4. O usuário consegue voltar ao original?
5. Algum conteúdo ou permissão pode ser falsamente inferido?
6. O fluxo funciona sem mouse?
7. Há alguma ação destrutiva ou mutação acionada implicitamente?
8. O que um atacante controlando conteúdo HTML conseguiria fazer?
9. O que muda em mobile e em zoom alto?
10. A evidência de teste permite reproduzir a conclusão?

## 8. Severidade e bloqueio

- **Crítica:** impede demo/release.
- **Alta:** impede o épico de atingir seu gate.
- **Média:** pode seguir apenas com limitação documentada e decisão consciente.
- **Baixa:** melhoria não bloqueadora.

Questões de autorização, vazamento de credenciais, corrupção de conteúdo oficial e impossibilidade de retornar ao portal original são sempre tratadas como críticas.
