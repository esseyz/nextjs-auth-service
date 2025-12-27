# NestJS Auth & Bookmark Service  
**Version: v2.1.0 — Production-Ready Baseline**

A secure, production-grade backend service built with **NestJS**, designed to serve as a **reusable authentication and authorization foundation** for future projects.

This repository intentionally focuses on **correct architecture, security-by-default, and operational readiness**, rather than feature bloat. It is meant to be cloned, configured, and used as-is.

---

## ✨ Why This Project Exists

Most authentication services start as simple CRUD apps and gradually accumulate security debt.

This project takes the opposite approach:

- 🔒 **Secure by default**
- 🧩 **Stateless authorization**
- 🧠 **Clear separation of concerns**
- 🧪 **End-to-end tested guarantees**

By v2, the codebase has evolved from basic JWT auth into a **clean identity platform** suitable for real-world use and extension.

OAuth and external identity providers are intentionally deferred to later versions.

---

## 🧱 Architecture Overview

- **Authentication**: Stateless JWT (Access + Refresh tokens)
- **Authorization**: Role-Based Access Control (RBAC)
- **Security Model**: Global guards (deny-by-default)
- **Persistence**: PostgreSQL via Prisma ORM
- **Testing Strategy**: Full E2E coverage using Pactum

---

## 🛠️ Technical Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Passport.js (JWT Strategy)
- **Password Hashing**: Argon2
- **Rate Limiting**: @nestjs/throttler
- **Testing**: Jest + Pactum (E2E)

---

## 🔐 Core Features

### Authentication & Authorization

- **JWT-based Authentication**
  - Stateless access token validation via `AtStrategy`
  - Refresh tokens with explicit logout support
- **Role-Based Access Control (RBAC)**
  - User roles embedded directly in JWT payload
  - `@Roles()` decorator for declarative access control
  - Stateless permission checks (no DB lookups per request)

---

### Secure-by-Default Infrastructure

- **Global Auth Guard**
  - All routes are protected by default
  - No accidental public endpoints
- **@Public() Decorator**
  - Explicit opt-in for unauthenticated routes (e.g. signup/signin)
- **Guard Orchestration**
  - Identity guard always executes before permission guards
  - Prevents role-evaluation race conditions

---

### Global Error Handling

- **Prisma Exception Filter**
  - Translates low-level database errors into meaningful HTTP responses
  - Example: unique constraint → `409 Conflict`
- **Validation**
  - Global `ValidationPipe` with `whitelist: true`
  - Rejects unknown or unsafe request properties

---

### Rate Limiting & Abuse Protection

- Global throttling enabled
- Default: **10 requests / 60 seconds**
- Protects auth endpoints from brute-force attacks

---

## 📡 API Endpoints

### Auth

- `POST /auth/signup` — Create a new user account
- `POST /auth/signin` — Authenticate and receive tokens
- `POST /auth/logout` — Invalidate refresh token

### Users

- `GET /users/me` — Get current authenticated user
- `GET /users/admin-only` — ADMIN-only protected route

### Bookmarks

- `POST /bookmarks` — Create a bookmark for the current user
- `GET /bookmarks` — Retrieve all user bookmarks

---

## 🧪 Testing Strategy (E2E)

This project uses **true end-to-end testing** against a real database.

- Framework: **Pactum**
- Database: dedicated test DB (`auth_test_db`)
- Each test run:
  - Applies Prisma migrations
  - Starts from a clean database state

### Verified Scenarios

| Category | Test Case | Result |
|-------|---------|--------|
| Global | Root 404 handling | ✅ PASS |
| Security | Unauthorized access (401) | ✅ PASS |
| Auth | Signup (201) | ✅ PASS |
| Auth | Duplicate signup (409) | ✅ PASS |
| RBAC | Admin-only access | ✅ PASS |
| CRUD | Create bookmark | ✅ PASS |
| Security | Rate limiting (429) | ✅ PASS |

These tests validate **real guarantees**, not just happy paths.

---

## ⚙️ Configuration

### Environment Variables

- `.env` — development
- `.env.test` — testing

### Database

- Managed via Prisma
- Migrations are required before startup
- Tests automatically run `prisma migrate deploy`

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run start:dev
```

## Running E2E Tests

```bash
npm run test:e2e
```

## 📌 What This Repo Is (and Is Not)

    ✅ A secure, reusable auth foundation
    ✅ A reference for clean NestJS architecture
    ✅ Suitable for real projects
    
    ❌ Not a full SaaS app
    ❌ Not OAuth-enabled (by design)
    ❌ Not bloated with optional features

## 🏁 Status

v2 is stable, tested, and ready to be cloned and used.

Future versions will build on this foundation without breaking it.