# Inventário de mutações

Este arquivo registra operações que podem produzir efeito colateral no DOOL. O protótipo não deve executá-las automaticamente nem incluí-las em fluxos de demonstração sem caso de uso e autorização explícitos.

## Critério

Registrar aqui:

- POST, PUT, PATCH e DELETE;
- GET com efeito colateral conhecido;
- submissões de formulário que criem/alterem dados;
- ações que mudem sessão, perfil, assinatura ou estado persistente.

## Estado inicial

Nenhuma mutação técnica foi confirmada nesta abertura do discovery.

A existência visual de formulários de cadastro, login, recuperação de senha, contato ou compra não é suficiente para inferir método, endpoint ou efeito. Esses itens só serão adicionados após observação técnica legítima.
