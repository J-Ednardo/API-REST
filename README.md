<div align="center">

# 🎓 API REST — Sistema de Gestão Acadêmica e Escolar

[![CI Backend](https://img.shields.io/github/actions/workflow/status/J-Ednardo/API-REST/main.yml?branch=main&label=CI%20Backend&logo=github)](https://github.com/J-Ednardo/API-REST/actions)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1)](https://zod.dev/)
[![Jest](https://img.shields.io/badge/Tests-33%20Passing-C21325?logo=jest&logoColor=white)](#testes-automatizados-e-cicd)
[![Swagger](https://img.shields.io/badge/Docs-Swagger%20OpenAPI-85EA2D?logo=swagger&logoColor=black)](#documentacao-swagger)

API RESTful em **Node.js + Express + Sequelize** para gestão escolar completa: controle de períodos letivos, disciplinas, turmas, matrículas, diário de notas, chamada diária, histórico escolar e controle de acesso baseado em perfis (**RBAC**).

[Front-end React](https://github.com/J-Ednardo/front-projeto-escola) · [Reportar Bug](https://github.com/J-Ednardo/API-REST/issues)

</div>

---

## 📌 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura em Camadas](#arquitetura-em-camadas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Perfis de Acesso (RBAC)](#perfis-de-acesso-rbac)
- [Regras de Negócio Acadêmicas](#regras-de-negocio-academicas)
- [Endpoints da API](#endpoints-da-api)
- [Como Executar Localmente](#como-executar-localmente)
- [Testes Automatizados e CI/CD](#testes-automatizados-e-cicd)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## 📖 Sobre o Projeto

Esta API compõe o back-end do **Ecossistema Escola**, provendo uma arquitetura desacoplada, segura e testada para operações de secretaria acadêmica, docência e consulta estudantil.

### Destaques
- **Segurança & RBAC**: Autenticação JWT (`jsonwebtoken` + `bcryptjs`), proteção contra escalação de privilégio, `helmet`, `cors` e `express-rate-limit` contra força bruta no login.
- **Validação Padronizada**: Schemas **Zod** por rota e middleware global de tratamento de erros (`AppError`).
- **Domínio Acadêmico Completo**: Separação entre cadastro de alunos, períodos letivos (`ABERTO`/`FECHADO`), disciplinas, turmas vinculadas a professores titulares, matrículas, aulas e frequências.
- **Soft Delete**: Exclusão lógica (`paranoid`) para preservação de histórico e integridade referencial.

---

## 🏗️ Arquitetura em Camadas

O projeto segue uma separação estrita de responsabilidades:

```text
routes → middlewares (loginRequired, checkRole, validateRequest) → controllers → services → models
```

- **Controllers**: Recebem a requisição HTTP, repassam os parâmetros/contexto ao Service e devolvem a resposta JSON.
- **Services**: Concentram todas as regras de negócio (cálculo de média/recuperação, trava de semestre fechado, validação de titularidade do professor, etc.).
- **Models**: Definem estrutura de tabelas e associações do Sequelize (`User`, `Aluno`, `Foto`, `PeriodoLetivo`, `Disciplina`, `Turma`, `Matricula`, `Aula`, `Frequencia`).
- **Formato Padrão de Erro**:
  ```json
  {
    "erro": {
      "codigo": "VALIDACAO",
      "mensagem": "Dados inválidos.",
      "detalhes": [{ "campo": "email", "mensagem": "E-mail inválido." }]
    }
  }
  ```

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia |
|---|---|
| **Runtime & Transpilação** | Node.js, Sucrase, Nodemon |
| **Framework Web** | Express 4 |
| **ORM & Banco de Dados** | Sequelize 6, MySQL (`mysql2`), SQLite3 (testes em memória) |
| **Autenticação & Segurança** | JSON Web Token (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit` |
| **Validação de Dados** | Zod |
| **Upload de Arquivos** | Multer |
| **Documentação** | Swagger (`swagger-jsdoc` + `swagger-ui-express`) |
| **Qualidade & Testes** | Jest, Supertest, ESLint (Airbnb Base) |

---

## 🔐 Perfis de Acesso (RBAC)

O sistema distingue três perfis de usuário (`ADMIN`, `PROFESSOR` e `ALUNO`):

| Recurso / Ação | `ADMIN` (Secretaria) | `PROFESSOR` (Docente) | `ALUNO` (Estudante) |
|---|:---:|:---:|:---:|
| Gerenciar Usuários e Perfis (`/users`) | ✅ Completo | ❌ | ❌ |
| Cadastrar / Editar / Excluir Alunos e Fotos | ✅ Completo | 🔍 Somente Leitura | 🔍 Próprio Cadastro |
| Gerenciar Semestres Letivos e Disciplinas | ✅ Completo | 🔍 Somente Leitura | ❌ |
| Criar / Editar / Excluir Turmas | ✅ Completo | 🔍 Apenas Suas Turmas | ❌ |
| Matricular / Remover Alunos da Turma | ✅ Completo | ❌ | ❌ |
| Lançar Notas no Diário (`PUT /matriculas/:id`) | ✅ Todas as Turmas | ✅ Apenas Suas Turmas | ❌ |
| Registrar Aulas e Chamadas (`/aulas`, `/frequencias`) | ✅ Todas as Turmas | ✅ Apenas Suas Turmas | ❌ |
| Consultar Boletim e Histórico Escolar | ✅ Todos os Alunos | ✅ Todos os Alunos | ✅ Apenas o Próprio |

---

## 🧠 Regras de Negócio Acadêmicas

1. **Cálculo Automático de Média e Situação (`MatriculaService`)**:
   - Notas obrigatórias no intervalo de **`0` a `10`** (`400 NOTA_INVALIDA` caso fora da faixa).
   - **Média $\ge 7.0$**: `Aprovado`.
   - **Média $\ge 5.0$ e $< 7.0$**: `Em Recuperação` (após lançamento da `nota_recuperacao`, se a nova média final for $\ge 6.0$, passa para `Aprovado`; caso contrário, `Reprovado por nota`).
   - **Média $< 5.0$**: `Reprovado por nota`.
2. **Controle de Frequência e Reprovação por Falta**:
   - Caso o total de faltas registradas nas chamadas (`presente: false`) somado a `faltas_legado` ultrapasse **16 faltas**, a situação passa automaticamente para **`Reprovado por falta`**, independentemente das notas.
3. **Bloqueio de Período Letivo Fechado (`403 PERIODO_FECHADO`)**:
   - Turmas vinculadas a um semestre com `status: 'FECHADO'` têm criação, edição, novas matrículas, alteração de notas e chamadas bloqueadas.
4. **Unicidade de Matrícula e de Chamada**:
   - Um aluno não pode ser matriculado duas vezes na mesma turma (`400 ALUNO_JA_MATRICULADO`).
   - Uma turma não pode ter duas chamadas registradas na mesma data (`400 CHAMADA_JA_REGISTRADA`).

---

## 📡 Endpoints da API

| Método | Rota | Perfis Permitidos | Descrição |
|---|---|---|---|
| `POST` | `/tokens` | Público (Rate Limit: 5/min) | Autentica usuário e retorna `{ token, user }` |
| `POST` | `/users` | Público | Cria conta de usuário (sempre com perfil `ALUNO`) |
| `GET` | `/users` | `ADMIN` | Lista usuários paginados |
| `PUT` | `/users` | Autenticado | Atualiza dados da própria conta |
| `PUT` | `/users/:id` | `ADMIN` | Atualiza perfil (`ADMIN`, `PROFESSOR`, `ALUNO`) e vínculo `aluno_id` |
| `GET` | `/alunos` | `ADMIN`, `PROFESSOR` | Lista alunos paginados com busca e foto |
| `GET` | `/alunos/:id` | `ADMIN`, `PROFESSOR`, `ALUNO` (próprio) | Detalhes do aluno e suas matrículas |
| `GET` | `/alunos/:id/historico` | `ADMIN`, `PROFESSOR`, `ALUNO` (próprio) | Histórico escolar oficial, CR e carga horária integralizada |
| `POST / PUT / DELETE` | `/alunos` | `ADMIN` | Cria, atualiza ou remove (soft delete) um aluno |
| `POST` | `/fotos` | `ADMIN` | Upload de foto do aluno (`multipart/form-data`) |
| `GET` | `/periodos-letivos` | `ADMIN`, `PROFESSOR` | Lista períodos letivos (`ABERTO` / `FECHADO`) |
| `POST / PUT / DELETE` | `/periodos-letivos` | `ADMIN` | Gerencia períodos letivos |
| `GET` | `/disciplinas` | `ADMIN`, `PROFESSOR` | Lista disciplinas e cargas horárias |
| `POST / PUT / DELETE` | `/disciplinas` | `ADMIN` | Gerencia o catálogo de disciplinas |
| `GET` | `/turmas` | `ADMIN`, `PROFESSOR` (próprias) | Lista turmas com `Disciplina`, `PeriodoLetivo` e `Professor` |
| `POST / PUT / DELETE` | `/turmas` | `ADMIN` | Cria, edita ou exclui turmas (em semestres abertos) |
| `GET` | `/matriculas` | `ADMIN`, `PROFESSOR`, `ALUNO` | Lista matrículas, notas e frequências |
| `POST / DELETE` | `/matriculas` | `ADMIN` | Matricula ou remove aluno de uma turma |
| `PUT` | `/matriculas/:id` | `ADMIN`, `PROFESSOR` (titular) | Lança notas (`nota1`, `nota2`, `nota3`, `nota_recuperacao`) |
| `GET / POST` | `/turmas/:turma_id/aulas` | `ADMIN`, `PROFESSOR` (titular) | Lista aulas com frequências ou registra nova aula |
| `POST` | `/aulas/:aula_id/frequencias` | `ADMIN`, `PROFESSOR` (titular) | Registra lote de presença da chamada |
| `PUT` | `/frequencias/:id` | `ADMIN`, `PROFESSOR` (titular) | Retifica presença individual de um aluno |

### Documentação Swagger
Com o servidor rodando, acesse a documentação interativa OpenAPI em:
```text
http://localhost:3001/api-docs
```

---

## ⚙️ Como Executar Localmente

### Pré-requisitos
- **Node.js** 18+ (recomendado 22.x)
- **MySQL** ou **MariaDB** (para execução em desenvolvimento/produção; os testes usam SQLite em memória automaticamente)

### Passo a Passo

1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone https://github.com/J-Ednardo/API-REST.git
   cd API-REST
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:
   ```env
   DATABASE=escola
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=sua_senha

   APP_URL=http://localhost:3001
   APP_PORT=3001

   TOKEN_SECRET=seu_segredo_jwt_seguro
   TOKEN_EXPIRATION=7d
   ```

3. **Execute as migrations (e seeds opcionais):**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. **Inicie o servidor em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 🧪 Testes Automatizados e CI/CD

O projeto conta com **33 testes automatizados** distribuídos em **5 suítes** (unitários e de integração com `Supertest` e banco **SQLite em memória**), além de pipeline de Integração Contínua no **GitHub Actions** (`.github/workflows/main.yml`).

```bash
# Executar linter (ESLint)
npm run lint

# Executar suíte completa de testes
npm test
```

### Cobertura das Suítes
- `__tests__/unit/Aluno.test.js` (**11 testes**): Cálculo de média, aprovação direta, exame de recuperação e reprovação por faltas (`> 16`).
- `__tests__/integration/users.test.js` (**2 testes**): Cadastro público e bloqueio de escalação de privilégio (`perfil: 'ADMIN'`).
- `__tests__/integration/tokens.test.js` (**3 testes**): Login JWT, credenciais inválidas (`401`) e proteção de Rate Limit (`429`).
- `__tests__/integration/alunos.test.js` (**10 testes**): Paginação, filtros, RBAC (`ADMIN` vs `PROFESSOR` vs `ALUNO`), Soft Delete e Histórico Escolar.
- `__tests__/integration/aulas.test.js` (**7 testes**): Criação de aulas, bloqueio de chamada duplicada na mesma data, restrição de turmas em semestre fechado, isolamento de turmas por `professor_id`, bloqueio de matrícula duplicada e validação de notas `0–10`.

---

## 📂 Estrutura do Projeto

```text
API-REST/
├── __tests__/               # Testes unitários e de integração (Jest + Supertest)
├── src/
│   ├── config/              # Configurações de banco, multer e Swagger
│   ├── controllers/         # Controllers finos HTTP
│   ├── database/            # Inicialização do Sequelize, migrations e seeds
│   ├── errors/              # Classe padrão AppError
│   ├── middlewares/         # loginRequired, checkRole, rateLimiter, validateRequest, errorHandler
│   ├── models/              # Models Sequelize (User, Aluno, Turma, Matricula, Aula, Frequencia...)
│   ├── routes/              # Definição das rotas Express
│   ├── schemas/             # Schemas de validação Zod
│   ├── services/            # Camada de regras de negócio
│   ├── app.js               # Configuração do app Express
│   └── server.js            # Entrypoint do servidor HTTP
└── .github/workflows/       # Pipeline CI Backend (Lint + Testes)
```
