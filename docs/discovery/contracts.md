# Catálogo de contratos do DOOL

Este é o catálogo canônico do EPIC-01. Cada entrada deve ser baseada em evidência observável ou marcada explicitamente como hipótese/bloqueio.

## Template

```markdown
## CONTRACT-XXX — <nome>
- Status: observado | repetido | hipótese | bloqueado
- Data da observação: YYYY-MM-DD
- Perfil: anônimo | cadastrado | assinante | sessão-expirada | desconhecido
- Ação do usuário:
- Rota/página de origem:
- Requisição: <método> <host><path>
- Parâmetros/query/body relevantes:
- Cabeçalhos relevantes: <somente nomes/valores não sensíveis>
- Tipo de resposta:
- Schema/estrutura sanitizada:
- Fonte de verdade: backend-estruturado | documento-html | dom-renderizado | derivado-local | desconhecida
- Classificação: leitura | mutação | navegação | documento
- Autorização observada:
- Efeito esperado na UI:
- Erros observados:
- Fallback disponível:
- Dependência de DOM: sim | não | parcial
- Evidência reproduzível:
- Observações/limitações:
```

## Regras

1. Não preencher campos desconhecidos por inferência.
2. Não registrar valores de cookie, token, senha ou credencial.
3. Não copiar conteúdo protegido além do mínimo estrutural indispensável.
4. Uma entrada só muda de `observado` para `repetido` após nova observação equivalente.
5. Toda operação classificada como `mutação` deve constar também em `mutations.md`.
6. Quando não existir chamada separada e o dado vier no documento inicial, registrar `documento-html` em vez de inventar uma API.

---

Nenhum contrato foi promovido a fato técnico nesta abertura do catálogo. As primeiras entradas serão criadas a partir da inspeção pública reproduzível.
