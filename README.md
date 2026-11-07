
# 🚗 Luna — Gestão de Veículos

Sistema web moderno para gerenciamento de frotas, veículos, condutores, rotas e usuários. Desenvolvido com React, TypeScript e Tailwind CSS, integrado a uma API REST construída em Java com Spring Boot e banco de dados MySQL.

---

## 📌 Sobre o projeto

O **Luna — Gestão de Veículos** é uma aplicação template desenvolvida pela empresa Luna para facilitar o controle e a administração de frotas de veículos, oferecendo uma interface intuitiva para gerenciamento das informações.

O sistema possui controle de acesso por perfil de usuário, permitindo diferentes níveis de permissão para administradores e editores.

---

## ✨ Funcionalidades

- 📊 **Visão geral:** painel principal com informações do sistema.
- 🚘 **Veículos:** gerenciamento e visualização da frota.
- 🛣️ **Rotas:** gerenciamento de rotas.
- 👨‍✈️ **Condutores:** cadastro e gerenciamento de condutores.
- 👥 **Usuários:** autenticação e controle de acesso.
- ⚙️ **Configurações:** gerenciamento das configurações do sistema.
- 💬 **Central de ajuda:** área de suporte e orientação.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem e segurança do código |
| Vite | Ambiente de desenvolvimento |
| Tailwind CSS | Estilização da aplicação |
| Java | Desenvolvimento do backend |
| Spring Boot | Construção da API REST |
| MySQL 8+ | Banco de dados |
| Hibernate / JPA | Persistência de dados |
| Flyway | Gerenciamento de migrations |
| Maven | Gerenciamento de dependências Java |
| Node.js / npm | Gerenciamento de dependências do frontend |

---

## 📂 Estrutura do projeto

```text
minimal-api-java/
│
├── src/
│   ├── main/
│   │   ├── java/                  # Backend Java
│   │   └── resources/
│   │       ├── db/migration/      # Migrations do Flyway
│   │       └── application.yml    # Configurações do backend
│   │
│   └── test/                      # Testes
│
├── Gestão de Veículos Moderna 2/
│   ├── src/                       # Código-fonte React
│   │   └── services/
│   │       └── api.ts             # Configuração da API
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── pom.xml                        # Configuração Maven
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, instale:

- Java JDK 18 ou superior
- Maven 3.9 ou superior
- Node.js 22 ou superior
- MySQL 8.0 ou superior
- Git (opcional)

---

## 🚀 Como executar o projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd minimal-api-java
```

### 2. Configurar o banco de dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE minimal_api
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
```

### 3. Configurar o backend

Abra o arquivo:

```text
src/main/resources/application.yml
```

Configure as credenciais do MySQL:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/minimal_api?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: SUA_SENHA
    driver-class-name: com.mysql.cj.jdbc.Driver
```

Substitua `SUA_SENHA` pela senha configurada no seu MySQL.

### 4. Executar o backend

Na raiz do projeto, execute:

```bash
mvn clean compile
```

Em seguida:

```bash
mvn spring-boot:run
```

**Endereço da API:**

```text
http://localhost:5000
```

**Documentação Swagger (se habilitada):**

```text
http://localhost:5000/swagger-ui.html
```

O Flyway executará automaticamente as migrations necessárias para criação e atualização da estrutura do banco de dados.

### 5. Configurar o frontend

Entre na pasta do frontend:

```bash
cd "Gestão de Veículos Moderna 2"
```

Instale as dependências:

```bash
npm install
```

### 6. Configurar a URL da API

Abra o arquivo:

```text
src/services/api.ts
```

Verifique se o endereço da API está configurado corretamente:

```typescript
const API_URL = 'http://localhost:5000';
```

Caso o backend esteja em outro computador, substitua `localhost` pelo endereço IP da máquina onde a API está sendo executada.

### 7. Executar o frontend

Execute:

```bash
npm run dev
```

**Endereço do frontend:**

```text
http://localhost:5173
```

> **Importante:** mantenha o backend e o MySQL em execução enquanto utiliza o sistema.

---

## 🔐 Acesso ao sistema

Na primeira inicialização, o Flyway executa o script de seed e disponibiliza duas contas de teste, caso ainda não existam:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | administrador@teste.com | 123456 |
| Editor | editor@teste.com | 123456 |

### Níveis de permissão

| Permissão | Administrador | Editor |
|---|:---:|:---:|
| Visualizar veículos | ✅ | ✅ |
| Adicionar veículos | ✅ | ❌ |
| Remover veículos | ✅ | ❌ |
| Adicionar condutores | ✅ | ❌ |
| Remover condutores | ✅ | ❌ |

---

## 🔒 Segurança

Algumas recomendações importantes antes de publicar ou executar o projeto:

- Não publique senhas reais ou credenciais do banco de dados.
- Não envie arquivos de configuração com informações sensíveis para o GitHub.
- Utilize variáveis de ambiente para armazenar credenciais em ambientes de produção.
- Altere as senhas padrão das contas de teste antes de utilizar o sistema em um ambiente real.

Adicione ao `.gitignore` da raiz do backend:

```gitignore
target/
*.class
*.log
src/main/resources/application.yml
```

Caso o `application.yml` seja ignorado, disponibilize um arquivo de exemplo sem credenciais reais para facilitar a configuração por outros desenvolvedores.

---

## 🗄️ Banco de dados

O projeto foi desenvolvido especificamente para **MySQL 8+**.

A utilização de outros bancos, como PostgreSQL, SQL Server ou Oracle, exige adaptações no driver JDBC, nas configurações do Hibernate e nas migrations do Flyway.

---

## 📋 Resumo da execução

| Etapa | Comando / Ação |
|---|---|
| Criar banco | `CREATE DATABASE minimal_api;` |
| Configurar MySQL | Editar `application.yml` |
| Iniciar backend | `mvn spring-boot:run` |
| Instalar frontend | `npm install` |
| Iniciar frontend | `npm run dev` |
| Acessar sistema | `http://localhost:5173` |

---

<div align="center">

### 🚗 Luna — Gestão de Veículos

**Organização, controle e praticidade na administração de frotas, veículos, condutores e rotas.**

Desenvolvido pela **Luna**.

</div>
