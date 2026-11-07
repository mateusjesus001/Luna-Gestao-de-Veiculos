# Luna - Gestão de Veículos Moderna

Interface web (React + Vite + Tailwind CSS) para o sistema de gestão de veículos, condutores, rotas e administradores.

---

## 📋 Sumário

1. [O que é este projeto](#o-que-é-este-projeto)
2. [Como funciona a conexão com banco de dados](#como-funciona-a-conexão-com-banco-de-dados)
3. [O que você precisa ter instalado no seu PC](#o-que-você-precisa-ter-instalado-no-seu-pc)
4. [Passo a passo para rodar o projeto em outro PC](#passo-a-passo-para-rodar-o-projeto-em-outro-pc)
   - [Passo 1: Baixar/copiar a pasta do projeto](#passo-1-baixar-copiar-a-pasta-do-projeto)
   - [Passo 2: Instalar o MySQL (se ainda não tiver)](#passo-2-instalar-o-mysql-se-ainda-não-tiver)
   - [Passo 3: Criar o banco de dados no MySQL](#passo-3-criar-o-banco-de-dados-no-mysql)
   - [Passo 4: Configurar a conexão com o banco no backend](#passo-4-configurar-a-conexão-com-o-banco-no-backend)
   - [Passo 5: Rodar o backend (API Java)](#passo-5-rodar-o-backend-api-java)
   - [Passo 6: Instalar dependências do frontend](#passo-6-instalar-dependências-do-frontend)
   - [Passo 7: Configurar o endereço da API no frontend](#passo-7-configurar-o-endereço-da-api-no-frontend)
   - [Passo 8: Rodar o frontend](#passo-8-rodar-o-frontend)
5. [Como acessar o sistema](#como-acessar-o-sistema)
6. [Permissões de usuário (Adm vs Editor)](#permissões-de-usuario-adm-vs-editor)
7. [⚠️ Segurança - senha do banco](#️-segurança-senha-do-banco)
8. [Quer usar outro banco que não seja MySQL?](#quer-usar-outro-banco-que-não-seja-mysql)

---

## O que é este projeto

Este é o **frontend** da aplicação "Luna", um sistema de gerenciamento de frota de veículos. Ele se comunica com uma **API backend escrita em Java (Spring Boot)** que roda na porta `5000` e usa banco de dados **MySQL**.

O frontend é uma aplicação **React** (Vite) com **Tailwind CSS**. Ele não guarda dados sozinho: tudo (veículos, condutores, rotas, login) vem do backend Java.

---

## Como funciona a conexão com banco de dados

- O **backend (Java)** se conecta diretamente ao **MySQL**.
- O **frontend (React)** se conecta ao backend via HTTP (endereço `http://localhost:5000` por padrão).
- O banco de dados é criado/atualizado automaticamente pelo **Flyway** (migrations SQL) quando o backend inicia.

⚠️ **Importante:** este projeto foi desenvolvido especificamente para **MySQL**. Ele não funciona "de caixa" com PostgreSQL, SQL Server, Oracle, etc. sem alterações no código.

---

## O que você precisa ter instalado no seu PC

Antes de começar, certifique-se de que o outro PC tem:

| Item | Versão mínima | Onde baixar |
|------|---------------|-------------|
| **MySQL** | 8.0+ | https://dev.mysql.com/downloads/ |
| **Java (JDK)** | 18+ | https://www.oracle.com/java/technologies/downloads/ |
| **Maven** | 3.9+ | https://maven.apache.org/download.cgi |
| **Node.js** | 22+ | https://nodejs.org/ |
| **Git** (opcional) | qualquer | https://git-scm.com/ |

> Dica: para verificar se já tem algo instalado, abra o terminal e digite `java -version`, `mvn -version`, `node -v` e `mysql --version`.

---

## Passo a passo para rodar o projeto em outro PC

### Passo 1: Baixar/copiar a pasta do projeto

Copie toda a pasta `minimal-api-java` (que contém o backend Java e o frontend) para o computador onde você vai testar.

Exemplo de estrutura:

```
minimal-api-java/
├── README.md                      <- backend
├── pom.xml                        <- backend (Maven)
├── src/                           <- backend Java
└── Gestão de Veículos Moderna 2/  <- frontend React
    ├── README.md                  <- frontend (este arquivo)
    ├── package.json
    ├── vite.config.ts
    └── src/
```

### Passo 2: Instalar o MySQL (se ainda não tiver)

Se o MySQL ainda não estiver instalado neste PC:

1. Baixe o **MySQL Installer** em https://dev.mysql.com/downloads/installer/
2. Durante a instalação, escolha **Server only** ou **Full** (conforme precisar).
3. Anote a **senha do root** que você definir durante a instalação.
4. Após instalar, certifique-se de que o serviço MySQL está rodando.

### Passo 3: Criar o banco de dados no MySQL

Abra o terminal (ou o MySQL Workbench / linha de comando do MySQL) e execute:

```sql
CREATE DATABASE minimal_api CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

Isso cria o banco chamado `minimal_api`, que é o nome esperado pelo backend.

> Se você quiser usar outro nome de banco, precisará alterar no `application.yml` (veja o Passo 4).

### Passo 4: Configurar a conexão com o banco no backend

Vá na pasta do backend:

```
minimal-api-java/src/main/resources/application.yml
```

Abra o arquivo `application.yml` e edite a seção `spring.datasource`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/minimal_api?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: SUA_SENHA_DO_MYSQL_AQUI
    driver-class-name: com.mysql.cj.jdbc.Driver
```

O que preencher:
- **`url`**: `jdbc:mysql://localhost:3306/minimal_api` (se o MySQL estiver neste mesmo PC e na porta padrão 3306). Se o MySQL estiver em outro PC, troque `localhost` pelo IP daquele PC.
- **`username`**: normalmente `root` (ou o usuário que você criou no MySQL).
- **`password`**: a senha que você definiu ao instalar o MySQL.

> ⚠️ Nunca comite este arquivo com a senha real no GitHub. Veja a seção de segurança abaixo.

### Passo 5: Rodar o backend (API Java)

No terminal, entre na pasta do backend:

```powershell
cd minimal-api-java
```

Compile:

```powershell
mvn clean compile
```

Rode a API:

```powershell
mvn spring-boot:run
```

Se tudo der certo, você verá algo como:

```
Tomcat started on port 5000 (http)
Started MinimalApiApplication in X seconds
```

A API agora está rodando em: **http://localhost:5000**

Você pode testar se está funcionando acessando no navegador:
```
http://localhost:5000/swagger-ui.html
```

### Passo 6: Instalar dependências do frontend

Em outro terminal (ou feche o do backend e abra um novo), entre na pasta do frontend:

```powershell
cd "minimal-api-java\Gestão de Veículos Moderna 2"
```

Instale as dependências:

```powershell
npm install
```

> Se você não tiver o `npm`, instale o Node.js primeiro (veja a tabela de pré-requisitos).

### Passo 7: Configurar o endereço da API no frontend

O frontend precisa saber onde o backend está rodando. Abra o arquivo:

```
minimal-api-java/Gestão de Veículos Moderna 2/src/services/api.ts
```

Na primeira linha você verá:

```typescript
const API_URL = 'http://localhost:5000';
```

- Se o backend estiver rodando **no mesmo PC** que o frontend, deixe como está (`http://localhost:5000`).
- Se o backend estiver rodando em **outro PC** da rede, troque `localhost` pelo IP daquele PC. Exemplo:

```typescript
const API_URL = 'http://192.168.1.50:5000';
```

Salve o arquivo.

### Passo 8: Rodar o frontend

Ainda na pasta do frontend, rode:

```powershell
npm run dev
```

O Vite vai subir o servidor de desenvolvimento. Você verá algo como:

```
  VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Acesse no navegador: **http://localhost:5173** (ou a porta mostrada no terminal).

---

## Como acessar o sistema

### Contas que já vêm prontas (criadas automaticamente)

Quando o backend sobe pela primeira vez, o Flyway executa o seed (`V2__seed.sql`) e insere duas contas padrão no banco, desde que elas ainda não existam:

| Perfil | Email | Senha |
|--------|-------|-------|
| **Adm** | `administrador@teste.com` | `123456` |
| **Editor** | `editor@teste.com` | `123456` |

> Isso garante que quem for rodar o projeto em outro PC já tenha ao menos uma conta de **administrador** funcional para logar e testar o sistema. Você não precisa criar nada manualmente — basta usar esses dados na tela de login.

1. Abra `http://localhost:5173` no navegador.
2. Você verá a tela de login.
3. Faça login com um dos usuários acima (ou crie um novo Editor pela tela de cadastro).
4. Após logar, use o menu lateral para navegar entre: Visão geral, Veículos, Rotas, Condutores, Configurações e Central de ajuda.

---

## Permissões de usuário (Adm vs Editor)

O sistema tem dois tipos de perfil:

| Perfil | Pode ver veículos | Pode adicionar veículos | Pode remover veículos | Pode adicionar/remover condutores |
|--------|-------------------|-------------------------|-----------------------|-----------------------------------|
| **Adm** | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim |
| **Editor** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não |

O perfil é definido no momento do cadastro/login do administrador e vem do campo `perfil` do banco.

---

## ⚠️ Segurança - senha do banco

O arquivo `src/main/resources/application.yml` contém a configuração de conexão com o banco de dados.

**Não envie este arquivo com a senha real para o GitHub.** Antes de publicar o código:

1. Crie um arquivo `.gitignore` na raiz do backend (`minimal-api-java/`) com o seguinte conteúdo:

```gitignore
target/
*.class
*.log
src/main/resources/application.yml
```

2. Ou remova a senha do `application.yml` e instrua quem for rodar o projeto a preencher a senha manualmente antes de iniciar.

---

## Quer usar outro banco que não seja MySQL?

**Não é possível "de caixa".** Este projeto foi desenvolvido especificamente para **MySQL 8+**. Os motivos:

- O `pom.xml` depende do driver `mysql-connector-j`.
- O `application.yml` usa o dialeto `MySQLDialect` do Hibernate.
- As migrations do Flyway (`src/main/resources/db/migration/*.sql`) usam sintaxe MySQL (backticks, `ENGINE=InnoDB`, `COLLATE=utf8mb4...`).

Se você quiser usar **PostgreSQL, SQL Server, Oracle ou outro**, será necessário:

1. Trocar a dependência do driver no `pom.xml` (remover `mysql-connector-j`, adicionar o driver do banco desejado).
2. Alterar o `url`, `driver-class-name` e `dialect` no `application.yml`.
3. Reescrever as migration SQL do Flyway para a sintaxe do novo banco.
4. Ajustar eventuais comandos SQL específicos do MySQL usados no código.

---

## Resumo rápido (checklist)

- [ ] MySQL 8+ instalado e rodando
- [ ] Banco `minimal_api` criado
- [ ] `application.yml` configurado com usuário/senha do MySQL
- [ ] Backend rodando (`mvn spring-boot:run`) na porta 5000
- [ ] `npm install` feito na pasta do frontend
- [ ] `API_URL` em `src/services/api.ts` apontando para o backend
- [ ] Frontend rodando (`npm run dev`) na porta 5173

Pronto! O sistema está disponível para teste neste PC e em qualquer outro PC que repetir esses passos.
