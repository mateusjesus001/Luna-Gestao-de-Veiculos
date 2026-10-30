# 🚗 Gestão de Veículos Moderna

Sistema web de gerenciamento de veículos desenvolvido com **Spring Boot, Spring Security, JWT, React e MySQL**. A aplicação oferece autenticação de usuários, controle de acesso por perfil e persistência de dados em banco de dados relacional.

O projeto permite que um administrador gerencie o catálogo de veículos, enquanto usuários autenticados podem consultar os veículos disponíveis e criar suas próprias contas.

## 📌 Funcionalidades

- **Autenticação e segurança:** login com geração de token JWT e proteção de endpoints.
- **Controle de acesso por perfil:** diferenciação entre administrador e usuário comum.
- **Gerenciamento de veículos:** cadastro, visualização e remoção de veículos pelo administrador.
- **Consulta de veículos:** usuários autenticados podem visualizar os veículos cadastrados.
- **Cadastro de usuários:** criação de contas com persistência das informações no banco de dados.
- **Persistência de dados:** integração com banco relacional utilizando Spring Data JPA e Hibernate.
- **Interface web:** frontend desenvolvido em React, com execução por meio do Vite.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Java | Desenvolvimento do backend |
| Spring Boot | Construção da API REST |
| Spring Security | Autenticação e autorização |
| JWT | Autenticação baseada em tokens |
| Spring Data JPA | Persistência e acesso aos dados |
| Hibernate | Mapeamento objeto-relacional (ORM) |
| Maven | Gerenciamento de dependências e execução |
| MySQL | Banco de dados relacional padrão |
| React | Construção da interface web |
| Vite | Servidor de desenvolvimento do frontend |
| JavaScript | Lógica da interface |

## 🏗️ Arquitetura e permissões

A aplicação é dividida em duas partes principais:

- **Backend:** API REST responsável pelas regras de negócio, autenticação, autorização e comunicação com o banco de dados.
- **Frontend:** interface web responsável pela interação com os usuários e pelo consumo da API.

### Perfis de acesso

| Funcionalidade | Administrador | Usuário autenticado |
|---|:---:|:---:|
| Fazer login | ✅ | ✅ |
| Criar conta de usuário | — | ✅ |
| Visualizar veículos | ✅ | ✅ |
| Adicionar veículos | ✅ | ❌ |
| Remover veículos | ✅ | ❌ |

As permissões são aplicadas no backend, por meio da camada de segurança, para restringir o acesso às operações administrativas.

## ⚙️ Requisitos

Antes de executar o projeto, verifique se você possui:

- [Java JDK](https://adoptium.net/) compatível com a versão utilizada pelo projeto.
- [Apache Maven](https://maven.apache.org/).
- [Node.js e npm](https://nodejs.org/).
- [MySQL](https://www.mysql.com/) instalado e em execução.
- Um cliente Git para clonar o repositório.

## 🚀 Como executar o projeto

### 1. Configurar o banco de dados

Crie um banco de dados MySQL para a aplicação:

```sql
CREATE DATABASE minimal_api;
```

Configure as credenciais e a conexão no arquivo `src/main/resources/application.yml`, utilizando os valores correspondentes ao seu ambiente:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/minimal_api?useSSL=false&serverTimezone=UTC
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

O exemplo utiliza variáveis de ambiente para evitar que a senha precise ficar registrada no arquivo de configuração. Defina `DB_PASSWORD` antes de iniciar o backend.

**Importante:** verifique também as configurações JPA, as migrações do banco e os demais parâmetros exigidos pelo projeto. Caso as tabelas sejam criadas por scripts de migração, execute o mecanismo de migração configurado antes de utilizar a aplicação.

### 2. Executar o backend

No terminal, acesse a pasta do backend, onde se encontra o arquivo `pom.xml`:

```powershell
cd "minimal-api-java"
mvn clean spring-boot:run
```

Para salvar os logs em um arquivo:

```powershell
mvn clean spring-boot:run *> C:\temp\spring.log
```

A API estará disponível em:

`http://localhost:5000`

> O projeto utiliza a porta 5000 na configuração de execução apresentada neste README. Caso a porta esteja definida de outra forma no arquivo de configuração, utilize a porta configurada pela aplicação.

### 3. Executar o frontend

Em outro terminal, acesse a pasta do frontend:

```powershell
cd "Gestão de Veículos Moderna"
npm install
npm run dev -- --port 5174
```

A interface web estará disponível em:

`http://localhost:5174`

**Os dois serviços precisam estar em execução simultaneamente** para que o frontend consiga consumir a API.

> Os comandos pressupõem que as pastas do backend e do frontend estejam organizadas conforme a estrutura apresentada. Ajuste os caminhos de acordo com a raiz do repositório clonado.

## 🔌 Endpoints principais

Os exemplos abaixo representam as rotas utilizadas para autenticação e consulta de veículos.

| Método | Endpoint | Finalidade |
|---|---|---|
| `POST` | `/administradores/login` | Autenticação do administrador |
| `GET` | `/veiculos` | Listagem dos veículos, mediante token válido |

As rotas para cadastro de usuários, inclusão e remoção de veículos dependem dos endpoints implementados no backend. Consulte os controladores da API para obter a lista completa.

### Testar a API pelo PowerShell

**Verificar se o servidor está respondendo:**

```powershell
curl.exe -i http://localhost:5000/
```

**Realizar login:**

```powershell
curl.exe -s -X POST "http://localhost:5000/administradores/login" `
  -H "Content-Type: application/json" `
  -d '{"email":"SEU_EMAIL","senha":"SUA_SENHA"}'
```

Utilize as credenciais de uma conta administrativa válida no ambiente de desenvolvimento.

**Consultar veículos com JWT:**

```powershell
curl.exe -s "http://localhost:5000/veiculos" `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Substitua `SEU_TOKEN_AQUI` pelo token retornado após a autenticação. O acesso depende das regras de autorização configuradas na API.

## 🗄️ Banco de dados e portabilidade

A aplicação utiliza **Spring Data JPA e Hibernate** para abstrair boa parte das operações de persistência, reduzindo o acoplamento entre as regras de negócio e o banco de dados.

O MySQL é o banco de dados utilizado na configuração apresentada, mas a aplicação pode ser adaptada para outros bancos relacionais compatíveis.

Entre as alternativas estão:

- PostgreSQL
- H2
- Microsoft SQL Server
- Oracle Database

A migração exige configurar a URL JDBC, as credenciais, o driver correspondente e o dialeto quando necessário. Também é preciso verificar a compatibilidade dos scripts de migração, consultas SQL e demais recursos específicos do banco utilizado.

Para ambientes diferentes, recomenda-se manter as configurações em variáveis de ambiente ou arquivos de configuração específicos por ambiente, evitando credenciais fixas no código-fonte.

## 🔐 Segurança

O projeto utiliza Spring Security e JWT para proteger os recursos da API.

Principais aspectos:

- Autenticação por credenciais.
- Emissão e utilização de tokens JWT.
- Proteção de rotas que exigem autenticação.
- Autorização de operações de acordo com o perfil do usuário.
- Separação entre permissões administrativas e permissões de consulta.

**Recomendação:** não publique senhas reais, tokens JWT, chaves secretas ou credenciais de banco de dados no repositório. Utilize variáveis de ambiente e mantenha as credenciais de demonstração restritas ao ambiente local.

## 📁 Estrutura do projeto

A organização geral esperada é:

```text
minimal-api-java/
├── src/
│   └── main/
│       ├── java/
│       │   └── .../
│       └── resources/
│           └── application.yml
├── pom.xml
└── Gestão de Veículos Moderna/
    ├── src/
    ├── package.json
    └── vite.config.js
```

A estrutura é ilustrativa; a localização exata dos arquivos pode variar conforme a organização atual do repositório.

## 🎯 Objetivo do projeto

O projeto demonstra a integração entre uma API REST em Java, mecanismos de autenticação e autorização, persistência relacional e uma interface web moderna.

Além de oferecer funcionalidades de gerenciamento de veículos, constitui uma aplicação prática de conceitos importantes do desenvolvimento backend, como segurança, controle de acesso, integração com banco de dados e comunicação entre frontend e backend.


Desenvolvido com **Java, Spring Boot, Spring Security, JWT, React e MySQL**.
