# Minimal API Java

API minimal em **Java 18 + Spring Boot 3** para gestão de administradores e veículos — equivalente ao projeto .NET `minimal-api`.

## Stack

| Camada        | Tecnologia                                        |
|---------------|---------------------------------------------------|
| Framework     | Spring Boot 3.3.5 (MVC)                           |
| Linguagem     | Java 18                                           |
| Banco de dados| MySQL 8                                          |
| ORM           | Spring Data JPA / Hibernate                       |
| Migrations    | Flyway                                            |
| Autenticação  | Spring Security + JWT (jjwt 0.12.6)               |
| Documentação  | SpringDoc OpenAPI (Swagger UI)                    |
| Testes        | JUnit 5 + Spring Boot Test (MockMvc)              |
| Build         | Maven 3.9+                                        |

## Estrutura do projeto

```
minimal-api-java/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/minimalapi/
    │   │   ├── MinimalApiApplication.java
    │   │   ├── api/            → Controllers REST
    │   │   ├── domain/
    │   │   │   ├── dto/        → DTOs (LoginDTO, AdministradorDTO, VeiculoDTO)
    │   │   │   ├── entidades/  → Entidades JPA
    │   │   │   ├── enums/      → Perfil (Adm, Editor)
    │   │   │   ├── modelviews/ → Respostas (AdministradorLogado, Home, etc.)
    │   │   │   └── servicos/   → Serviços (interfaces + implementações)
    │   │   ├── infraestrutura/
    │   │   │   └── repositorios/ → Repositórios Spring Data
    │   │   └── seguranca/      → JWT Service, Filter, SecurityConfig
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/   → Flyway (V1__criar_tabelas.sql, V2__seed.sql)
    └── test/
        ├── java/com/minimalapi/testes/ → Testes JUnit + MockMvc
        └── resources/application-test.yml
```

## Pré-requisitos

- Java 18+
- Maven 3.9+
- MySQL 8.0+ rodando localmente
- Banco `minimal_api` (e `minimal_apitest` para testes) — as migrations Flyway criam/validam as tabelas

## Configuração do banco

O projeto usa as credenciais padrão do ambiente do usuário (`root` / `mjdc23657890`). Para alterar, edite:

- **`src/main/resources/application.yml`** — conexão principal (banco `minimal_api`)
- **`src/test/resources/application-test.yml`** — conexão de testes (banco `minimal_apitest`)

As migrations Flyway são **idempotentes** — funcionam tanto em banco novo quanto em banco já existente do .NET.

## Como rodar

### 1. Restaurar e compilar

```powershell
cd minimal-api-java
mvn clean compile
```

### 2. Rodar a API

```powershell
mvn spring-boot:run
```

A API sobe em **http://localhost:5000**.

### 3. Rodar os testes

```powershell
mvn test
```

### 4. Swagger UI

Após iniciar a API, acesse:

```
http://localhost:5000/swagger-ui.html
```

## Endpoints

### Home

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/` | Mensagem de boas-vindas + link do Swagger | Nenhuma |

### Administradores

| Método | Rota                    | Descrição                       | Role         |
|--------|-------------------------|---------------------------------|--------------|
| POST   | `/administradores/login`| Autentica e retorna JWT         | Nenhuma      |
| GET    | `/administradores`      | Lista (paginação opcional `?pagina=1`) | Adm |
| GET    | `/administradores/{id}` | Busca por ID                    | Autenticado  |
| POST   | `/administradores`      | Cria administrador              | Adm          |

### Veículos

| Método | Rota              | Descrição                              | Role         |
|--------|-------------------|----------------------------------------|--------------|
| POST   | `/veiculos`       | Cria veículo (ano ≥ 1950)              | Adm, Editor  |
| GET    | `/veiculos`       | Lista (paginação opcional `?pagina=1`) | Adm          |
| GET    | `/veiculos/{id}`  | Busca por ID                           | Adm, Editor  |
| PUT    | `/veiculos/{id}`  | Atualiza veículo                       | Adm          |
| DELETE | `/veiculos/{id}`  | Remove veículo                         | Adm          |

## Exemplo rápido (curl)

```bash
# Login
curl -X POST http://localhost:5000/administradores/login \
  -H "Content-Type: application/json" \
  -d '{"Email":"administrador@teste.com","Senha":"123456"}'
```

Resposta:

```json
{
  "Email": "administrador@teste.com",
  "Perfil": "Adm",
  "Token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

```bash
# Listar veículos com token
curl http://localhost:5000/veiculos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Comparação com o projeto .NET

| Aspecto            | .NET (original)                     | Java (este projeto)                     |
|--------------------|-------------------------------------|------------------------------------------|
| Framework          | ASP.NET Core Minimal API (net8.0)  | Spring Boot 3.3.5 (MVC)                  |
| ORM/Migrations     | EF Core + Migrations                | Spring Data JPA + Flyway                  |
| Autenticação       | JWT Bearer                          | Spring Security + JWT (jjwt)             |
| Documentação       | Swashbuckle                         | SpringDoc OpenAPI                         |
| Teste integração   | MSTest + WebApplicationFactory      | JUnit 5 + MockMvc + @SpringBootTest       |
| Porta              | 5000 (API) / 5001 (testes)          | 5000 (API) / 5001 (testes)                |
| Banco              | MySQL (minimal_api / minimal_apitest)| MySQL (mesmos bancos)                     |

## Compatibilidade de schema

As entidades JPA mapeiam explicitamente as colunas **PascalCase** (`Id`, `Email`, `Senha`, `Perfil`, `Nome`, `Marca`, `Ano`) para serem 100% compatíveis com o schema criado pelo EF Core no banco MySQL existente.