# Post Service

Serviço de gerenciamento de posts para o sistema educacional. Parte do ecossistema de microsserviços para a plataforma educacional.

> Nota: Este repositório utiliza a branch `main` como branch principal.

## Funcionalidades

- CRUD completo para Posts
- Integração com Auth Service para validação de tokens
- Integração com User Service para validação de usuários

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB (Mongoose)
- Jest (Testes)
- Swagger (Documentação)
- Winston (Logging)

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente copiando o `.env.example` para `.env` e ajustando conforme necessário
4. Execute o servidor:
   ```
   npm run dev
   ```

## Executando testes

```
npm test
```

## Endpoints da API

Você pode acessar a documentação Swagger em `/api-docs` quando o servidor estiver rodando.

### Principais endpoints:

- `GET /api/posts`: Lista todos os posts
- `GET /api/posts/:id`: Obtém um post específico
- `POST /api/posts`: Cria um novo post
- `PUT /api/posts/:id`: Atualiza um post
- `DELETE /api/posts/:id`: Remove um post

## Estrutura do Projeto

```
/src
  /config         # Configurações (database, logger, etc)
  /controllers    # Controladores
  /middleware     # Middlewares (auth, error handling)
  /models         # Modelos Mongoose
  /routes         # Definições de rotas
  /tests          # Testes
  server.js       # Ponto de entrada da aplicação
``` 