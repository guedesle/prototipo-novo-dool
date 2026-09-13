# EPIC-10 — Empacotamento, demonstração e handoff

**Status:** especificado, não implementado  
**Prioridade:** alta para encerramento da fase  
**Dependências:** EPIC-09 aprovado

## 1. Objetivo

Transformar o protótipo validado em um artefato demonstrável, reproduzível e compreensível por terceiros, com documentação suficiente para orientar avaliação executiva, validação técnica e eventual integração oficial da nova interface ao DOOL.

## 2. Resultado de negócio

Uma pessoa que não participou do desenvolvimento deve conseguir instalar a versão aprovada, executar o roteiro principal, diferenciar o que é integração real do que é limitação conhecida e entender quais partes podem ser aproveitadas na implementação definitiva.

## 3. Escopo

- build versionado;
- pacote instalável/distribuível compatível com o ambiente-alvo;
- checksum/identificação de versão quando apropriado;
- instruções de instalação e desinstalação;
- roteiro de demonstração;
- matriz de funcionalidades suportadas;
- matriz de perfis/estados suportados;
- limitações conhecidas;
- evidências de QA;
- changelog da versão demonstrada;
- guia de troubleshooting;
- guia de arquitetura/handoff;
- plano de integração futura;
- plano de retirada da extensão após incorporação oficial.

## 4. Fora de escopo

- implantação da nova UI no backend/portal oficial;
- distribuição corporativa em massa sem autorização específica;
- suporte operacional permanente;
- compromisso de compatibilidade com versões futuras não testadas do DOOL;
- transformação do protótipo em produto final sem nova avaliação arquitetural.

## 5. Requisitos funcionais

### RF-10.1 — Build identificável

A interface deve mostrar ou permitir consultar versão do protótipo, commit/build de origem e data de geração sem expor dados sensíveis.

### RF-10.2 — Instalação reproduzível

Documentar caminho de instalação em ambiente de demonstração e forma segura de remoção/desativação.

### RF-10.3 — Roteiro principal

O roteiro deve demonstrar, no mínimo:

1. portal original;
2. ativação da nova interface;
3. home/edição;
4. busca;
5. leitura HTML;
6. responsividade;
7. retorno à interface original;
8. recurso autenticado representativo, apenas quando uma conta legítima estiver disponível e o fluxo tiver sido validado.

### RF-10.4 — Matriz de suporte

Cada funcionalidade deve ser classificada como:

- integrada e validada;
- integrada com limitação conhecida;
- fallback para legado;
- simulada para UX — somente se explicitamente identificada;
- fora de escopo.

### RF-10.5 — Evidências

Manter referência às versões de testes, corpus e resultados usados no gate G6.

### RF-10.6 — Handoff

Documentar:

- arquitetura;
- limites dos adaptadores;
- dependências do legado;
- pontos frágeis;
- decisões que precisam ser revisitadas para produção;
- itens que podem ser reaproveitados diretamente;
- itens específicos de extensão que devem desaparecer na integração oficial.

## 6. Princípio de demonstração honesta

O pacote não deve sugerir que um recurso está integrado quando estiver usando dado fixo/mock. Qualquer simulação necessária deve possuir indicação visível ou estar documentada no roteiro e na matriz de suporte.

A extensão demonstra a **viabilidade da nova camada de experiência**, não certifica por si só que a implantação definitiva será uma simples cópia de arquivos para produção.

## 7. Plano de transição futura

O handoff deve separar componentes em três grupos:

### Reutilizáveis

Design system, componentes de UI, modelos normalizados, testes de UX e parte dos adaptadores que usem contratos estáveis.

### Reavaliar

Camada de sessão, integração de rede e roteamento, pois em produção oficial poderão existir APIs e acesso interno mais apropriados do que os usados pela extensão.

### Descartar

Bootstrap de content script, toggle de sobreposição, hacks de DOM, permissões do Manifest e qualquer mecanismo exclusivo da demonstração.

## 8. Critérios de aceite

### CA-10-A

Instalação limpa pode ser realizada seguindo apenas a documentação.

### CA-10-B

Desinstalar/desabilitar a extensão devolve o ambiente ao comportamento original sem intervenção no servidor.

### CA-10-C

Roteiro principal é reproduzível na versão empacotada.

### CA-10-D

Matriz de suporte identifica claramente integrações reais, fallbacks, simulações e itens fora de escopo.

### CA-10-E

Build demonstrado corresponde à versão identificada na documentação e às evidências de QA.

### CA-10-F

Handoff diferencia código reutilizável de mecanismos temporários de extensão.

## 9. Revisão adversarial

Testar a demonstração como se fosse executada por alguém sem contexto:

- instalação em perfil limpo;
- extensão desabilitada e reabilitada;
- portal abre antes da extensão;
- rede instável durante demo;
- rota inicial diferente da home;
- conta não autenticada quando o roteiro esperava sessão;
- tamanho de tela diferente;
- versão antiga instalada;
- falha de um recurso integrado;
- pessoa tenta executar funcionalidade marcada como limitação.

Pergunta crítica: **o pacote demonstra com clareza o que está pronto sem ocultar os limites do protótipo?** Se não, a demonstração cria risco de decisão equivocada.

## 10. Estratégia de validação

- instalação por terceiro;
- execução cronometicamente livre do roteiro, sem depender de sequência frágil;
- checklist de versão;
- confirmação de toggle/fallback;
- revisão do material de handoff por alguém não envolvido na implementação;
- conferência da matriz de suporte contra o build real.

## 11. Definition of Done

- build identificado e reproduzível;
- instruções de instalação/remoção completas;
- roteiro validado;
- matriz de suporte publicada;
- limitações conhecidas publicadas;
- evidências de QA associadas;
- handoff arquitetural concluído;
- plano de integração/retirada da extensão documentado.

## 12. Gate

**G7 aprovado:** protótipo pronto para demonstração controlada e para subsidiar decisão sobre a implementação oficial.
