# API REST - Gestão de Alunos

Esta é uma API RESTful desenvolvida em Node.js para gerenciar um sistema simples de alunos, incluindo cadastro, notas, faltas, situação acadêmica e fotos de perfil. A API também conta com um sistema de autenticação de usuários baseado em JWT.

## ✨ Funcionalidades

- **Autenticação de Usuários**: Sistema de login seguro com JSON Web Tokens (JWT).
- **CRUD de Usuários**: Operações completas de Criação, Leitura, Atualização e Deleção para usuários.
- **CRUD de Alunos**: Operações completas de Criação, Leitura, Atualização e Deleção para alunos.
- **Upload de Fotos**: Permite o upload de fotos de perfil para os alunos.
- **Cálculo Automático de Média**: A média final do aluno é calculada automaticamente quando as três notas são inseridas.
- **Definição Automática de Situação**: A situação do aluno (`Aprovado`, `Reprovado por nota` ou `Reprovado por falta`) é definida automaticamente com base na média e no número de faltas.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **Sequelize**: ORM (Object-Relational Mapper) para interagir com o banco de dados (MySQL/MariaDB).
- **Sequelize-CLI**: Interface de linha de comando para gerenciar migrations do Sequelize.
- **JSON Web Token (JWT)**: Para autenticação e autorização.
- **Bcrypt.js**: Para hashing de senhas.
- **Multer**: Middleware para upload de arquivos.
- **Dotenv**: Para gerenciar variáveis de ambiente.

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Um banco de dados relacional, como MySQL ou MariaDB.

## ⚙️ Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd API-REST
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` (se houver) ou usando o exemplo abaixo:

    ```env
    # Configuração do Banco de Dados
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_USERNAME=seu_usuario_db
    DATABASE_PASSWORD=sua_senha_db
    DATABASE=nome_do_banco
    DATABASE_DIALECT=mysql

    # Configuração da Aplicação
    APP_URL=http://localhost:3001
    APP_PORT=3001

    # Segredos do Token JWT
    TOKEN_SECRET=umsegredomuitoforte
    TOKEN_EXPIRATION=7d
    ```

4.  **Execute as migrations do banco de dados:**
    Este comando criará todas as tabelas necessárias no seu banco de dados.
    ```bash
    npx sequelize-cli db:migrate
    ```

5.  **Inicie o servidor:**
    - Para ambiente de desenvolvimento (com reinicialização automática):
      ```bash
      npm run dev
      ```
    - Para produção:
      ```bash
      npm start
      ```

O servidor estará rodando em `http://localhost:3001` (ou na porta que você definiu).

## Endpoints da API

A seguir estão os endpoints disponíveis na API. A maioria das rotas requer um token de autenticação no cabeçalho `Authorization`.

---

### 🔑 Autenticação (`/tokens`)

#### `POST /tokens`
- **Descrição**: Autentica um usuário e retorna um token JWT.
- **Corpo da Requisição**:
  ```json
  {
    "email": "usuario@email.com",
    "password": "sua_senha"
  }
  ```

---

### 👤 Usuários (`/users`)

#### `POST /users`
- **Descrição**: Cria um novo usuário.
- **Corpo da Requisição**:
  ```json
  {
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "sua_senha"
  }
  ```

#### `PUT /users`
- **Descrição**: Atualiza os dados do usuário autenticado.
- **Autenticação**: Obrigatória.

---

### 🎓 Alunos (`/alunos`)

#### `GET /alunos`
- **Descrição**: Lista todos os alunos cadastrados.
- **Autenticação**: Obrigatória.

#### `GET /alunos/:id`
- **Descrição**: Busca um aluno específico pelo ID.
- **Autenticação**: Obrigatória.

#### `POST /alunos`
- **Descrição**: Cadastra um novo aluno.
- **Autenticação**: Obrigatória.
- **Corpo da Requisição**:
  ```json
  {
    "nome": "João",
    "sobrenome": "Silva",
    "email": "joao.silva@email.com",
    "idade": 20,
    "nota1": 8.5,
    "nota2": 7.0,
    "nota3": 9.0,
    "faltas": 5
  }
  ```

#### `PUT /alunos/:id`
- **Descrição**: Atualiza os dados de um aluno.
- **Autenticação**: Obrigatória.

#### `DELETE /alunos/:id`
- **Descrição**: Deleta um aluno.
- **Autenticação**: Obrigatória.

---

### 🖼️ Fotos (`/fotos`)

#### `POST /fotos`
- **Descrição**: Faz o upload de uma foto de perfil para um aluno.
- **Autenticação**: Obrigatória.
- **Corpo da Requisição**: `multipart/form-data`
  - `aluno_id`: ID do aluno.
  - `foto`: O arquivo da imagem.

---

## 🧠 Lógica de Negócio Automática

O modelo `Aluno` possui lógicas automáticas que são acionadas antes de salvar os dados:

1.  **Reprovação por Faltas**: Se um aluno tiver mais de 16 faltas, sua situação é automaticamente definida como `Reprovado por falta`, e o cálculo da média não é realizado.
2.  **Cálculo de Média e Situação**: Quando as três notas (`nota1`, `nota2`, `nota3`) são fornecidas, o sistema calcula a `media_final`.
    - Se a `media_final` for **maior ou igual a 7**, a `situacao` é definida como `Aprovado`.
    - Se a `media_final` for **menor que 7**, a `situacao` é definida como `Reprovado por nota`.
