# NestJS Auth Microservice

A production-ready, reusable authentication and authorization microservice built with NestJS.
This service provides a robust foundation for user management, JWT-based security, and data persistence using Prisma and PostgreSQL.
It is designed to act as the Identity Provider within a larger microservices architecture.

**OVERVIEW**

This service handles the core Identity and Authentication domain of an application.
It manages user registration, secure authentication, authorization, and basic profile access.

By decoupling authentication into a standalone microservice, other services in the system can focus on business logic while relying on this service for user validation and access control.

This repository is intended to be cloned and reused across multiple projects.

**TECH STACK**

- Framework: NestJS (Node.js)
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Passport.js and JWT
- Password Hashing: argon2
- Validation: class-validator
- Containerization: Docker and Docker Compose

**KEY FEATURES**

- JWT-based stateless authentication
- Secure password hashing using argon2
- Prisma ORM for clean and type-safe database access
- Custom JWT guards and GetUser decorator
- Example User to Bookmark (1:N) relationship demonstrating ownership
- DTO-based request validation
- Clean and scalable NestJS project structure

**PROJECT STRUCTURE**

    src/
    ├── auth/                 Authentication logic, strategies, controllers
    │   ├── dto/              Auth-specific DTOs
    │   ├── auth.controller.ts
    │   └── auth.service.ts
    ├── user/                 User profile management
    ├── bookmark/             Example resource domain (User -> Bookmark)
    ├── prisma/               Prisma module and database service
    ├── common/               Shared guards and decorators
    └── main.ts               Application entry point

**CONFIGURATION**

Create a .env file in the project root.

    DATABASE_URL=postgresql://user:password@localhost:5432/auth_db?schema=public
    JWT_SECRET=your-super-secret-key

Never commit your real .env file.
Use strong secrets in production.

**QUICK START**

1. Start the database

        docker-compose up -d

2. Install dependencies

        npm install

3. Run Prisma migrations

        npx prisma migrate dev

4. Run the application

        #Development:
        npm run start:dev

        #Production:
        npm run build
        npm run start:prod

**AUTHENTICATION FLOW**

1. Sign up
   POST /auth/signup

2. Sign in
   POST /auth/signin

3. Token issuance
   A JWT access token is returned on successful login

4. Authorized requests
   Include the token in the request header:
   Authorization: Bearer <token>

**MICROSERVICE INTEGRATION**

This service acts as the source of truth for user identity.

Integration options:

Option 1: Shared JWT Secret (Recommended)
- Internal services share the JWT_SECRET
- JWTs are verified locally without network calls

Option 2: API Gateway or Auth Proxy
- Requests are validated by a gateway
- Downstream services receive authenticated traffic only

**API ENDPOINTS (BRIEF)**

POST   /auth/signup     Register a new user        Public
POST   /auth/signin     Login and receive JWT      Public
GET    /users/me        Get current user profile   Auth required
GET    /bookmarks       List user bookmarks        Auth required

**SECURITY NOTES**

- Always use HTTPS in production
- Keep JWT secrets private
- Rotate secrets periodically
- Refresh tokens planned for future versions

**ROADMAP AND VERSIONING**

*v1.0.0*
- JWT authentication
- User and Bookmark CRUD
- Prisma integration

*v1.1.0*
- Refresh tokens and token rotation

*v2.0.0*
- Role-based access control (RBAC)
- OAuth2 providers (Google, GitHub)

*v3.0.0*
- Migration to NestJS microservices (gRPC or TCP)

**WHEN TO CLONE VS DEPLOY**

Clone this repository if:
- You want full control over authentication logic
- You need a fast backend starting point

Deploy as a shared service if:
- You are running multiple microservices
- You want centralized identity management

============================================================

Built for scalability, clarity, and developer productivity.
