# Matriz de rastreabilidade

Esta matriz conecta objetivos do produto, épicos, evidências e gates. Ela deve ser atualizada quando os contratos reais do DOOL forem descobertos.

| ID | Requisito | Épico(s) | Evidência esperada | Gate |
|---|---|---|---|---|
| RQ-001 | Usar backend existente sem modificá-lo no protótipo | 01, 03 | inventário de contratos + adaptadores | G1/G3 |
| RQ-002 | Não ampliar autorização existente | 01, 03, 08, 09 | testes por perfil e sessão | G5/G6 |
| RQ-003 | Permitir retorno imediato à interface original | 02, 09 | teste de toggle e fallback | G2/G6 |
| RQ-004 | Não armazenar senha | 02, 03, 08, 09 | inspeção de storage/logs | G5/G6 |
| RQ-005 | Modernizar home e navegação de edições | 05 | E2E com edição atual e anterior | G4 |
| RQ-006 | Modernizar busca e acervo | 06 | comparação de consultas e resultados | G4 |
| RQ-007 | Melhorar leitura HTML sem alterar sentido/conteúdo | 07, 09 | corpus comparativo + testes editoriais | G4/G6 |
| RQ-008 | Suportar PDF/Jornal quando backend autorizar | 08 | matriz por perfil | G5 |
| RQ-009 | Suportar consulta de autenticidade | 08 | caso válido, inválido e erro | G5 |
| RQ-010 | Ser responsivo | 04 a 09 | testes 320/768/desktop/wide | G4/G6 |
| RQ-011 | Atingir WCAG 2.2 AA nos fluxos cobertos | 04 a 09 | axe + teclado + revisão manual | G4/G6 |
| RQ-012 | Isolar estilos e falhas da extensão | 02, 09 | testes de contaminação/falha | G2/G6 |
| RQ-013 | Tratar mudança inesperada de contrato | 03, 09 | fixtures incompatíveis e fallback | G3/G6 |
| RQ-014 | Não executar scripts provenientes do conteúdo editorial | 03, 07, 09 | testes com HTML adversarial | G6 |
| RQ-015 | Diferenciar dados reais de simulação | todos | marcação de origem/evidência | todos |
| RQ-016 | Gerar pacote demonstrável por terceiro | 10 | instalação limpa + roteiro | G7 |
| RQ-017 | Registrar limitações conhecidas | 09, 10 | matriz de suporte e limitações | G7 |
| RQ-018 | Evitar dependência direta de endpoints na UI | 03 a 08 | revisão arquitetural | G3 |
| RQ-019 | Manter navegação back/forward/refresh coerente | 02, 04 a 09 | E2E de histórico | G6 |
| RQ-020 | Minimizar permissões da extensão | 02, 09 | revisão do manifest | G2/G6 |

## Evidências obrigatórias por categoria

### Contratos

- URL/rota observada;
- método;
- parâmetros relevantes;
- exemplo sanitizado de resposta;
- estado de sessão;
- classificação leitura/mutação;
- comportamento de erro.

### UX/UI

- viewport testado;
- teclado;
- foco;
- estados loading/empty/error/success;
- origem dos dados;
- fallback para original.

### Segurança

- permissões do manifest;
- storage utilizado;
- campos de log;
- sanitização de HTML;
- mudança de sessão;
- tentativa de acesso não autorizado.

### Fidelidade editorial

- comparação com conteúdo original;
- ordem;
- caracteres especiais;
- tabelas;
- links;
- imagens quando existentes;
- conteúdo muito longo.

## Status inicial

Todos os requisitos estão em estado **PLANEJADO**. O EPIC-01 será responsável por converter parte deles em **VALIDADO**, **REFINADO** ou **NÃO APLICÁVEL**, sempre com evidência registrada.
