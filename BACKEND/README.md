# devTinder – Backend Service

A production-grade backend service powering **devTinder**, a developer-focused social and matching platform.  
This backend is designed using real-world backend engineering principles with a strong focus on **security, scalability, and maintainability**.

The service exposes secure REST APIs for authentication, profile management, and connection workflows, enabling frontend clients to interact safely and efficiently with the system.

---

## 1. Backend Purpose & Role

The **devTinder Backend** is responsible for:

- Handling authentication and authorization
- Managing user profiles
- Processing connection and matching workflows
- Enforcing data validation and security
- Exposing secure APIs to frontend applications

This backend operates as an **independent service** and acts as the system’s **single source of truth** for user data and application logic.

---

## 2. Backend Responsibilities & Scope

### Authentication & Authorization

- Secure signup and login
- JWT-based authentication
- Middleware-protected routes

### Profile Management

- Create and update user profiles
- Controlled access to sensitive user data

### Connection Request Workflow

- Send, accept, reject, and track connection requests
- Maintain clean and consistent relationship states

### Validation & Sanitization

- Schema-level validation using Mongoose
- Defensive handling of malformed input

### Secure API Exposure

- Public vs protected route separation
- Token-verified access for authenticated users

---

## 3. High-Level System Architecture

### Request Lifecycle

Client
↓
Route
↓
Middleware (Auth / Validation)
↓
Controller (Business Logic)
↓
Model (Mongoose Schema)
↓
MongoDB

### Architectural Principles

- Routes define API boundaries
- Middleware enforces authentication and guards
- Controllers encapsulate business logic
- Models define data structure and constraints
- Database persists application state

This layered architecture ensures **separation of concerns** and **long-term maintainability**.

---

## 4. Technology Stack & Design Rationale

### Node.js & Express

- Non-blocking I/O for scalable request handling
- Lightweight and flexible framework
- Ideal for API-driven applications

### MongoDB & Mongoose

- Document-based, schema-flexible database
- Natural fit for user-centric data models
- Mongoose provides validation and schema enforcement

### JWT Authentication

- Stateless authentication model
- Scales horizontally without server-side sessions
- Industry-standard security approach

---

## 5. Production-Grade Folder Architecture

src/
├── config/
│ └── database.js
│
├── middleware/
│ └── auth.js
│
├── models/
│ ├── user.js
│ └── connectionRequest.js
│
├── routes/
│ ├── auth.js
│ ├── profile.js
│ ├── request.js
│ └── user.js
│
├── utils/
│ └── validators.js
│
├── app.js
└── server.js

### Folder & File Responsibilities

#### `src/config`

- Centralized configuration logic
- Database connection and environment setup
- Isolates infrastructure concerns

#### `src/middleware`

- Authentication and request guards
- Protects private routes using JWT
- Improves security and reusability

#### `src/models`

- Mongoose schemas and data modeling
- Enforces structure, constraints, and defaults
- Represents the domain layer

#### `src/routes`

- Defines REST API endpoints
- Groups routes by responsibility
- Keeps controllers clean and modular

#### `src/utils`

- Shared helpers and validation utilities
- Prevents duplication and improves consistency

#### `app.js`

- Application bootstrap
- Registers middleware and routes

#### Root Configuration

- `.env` for secrets and environment variables
- `package.json` for dependency management

---

## 6. API & Routing Strategy

- REST-compliant endpoints
- Clear separation between public and protected routes
- Route grouping by domain responsibility
- Middleware-first request execution

### Example Routes

- `/auth/*` → Public authentication routes
- `/profile/*` → Auth-protected profile routes
- `/request/*` → Connection workflows

Designed to support **future API versioning** without refactoring core logic.

---

## 7. Authentication & Security Strategy

### JWT Authentication Flow

1. User submits credentials
2. Server validates credentials
3. JWT is issued and signed
4. Token is sent via HTTP-only cookies
5. Middleware verifies token on protected routes

### Security Measures

- Passwords hashed using `bcrypt`
- JWT secrets stored in environment variables
- Middleware-based route protection
- No sensitive data exposed to clients

---

## 8. Environment Configuration

### Required Environment Variables

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

### Why Environment Isolation Matters

- Prevents credential leakage
- Enables development and production separation
- Supports CI/CD pipelines

---

## 9. Local Setup & Execution

### Installation

```bash
git clone https://github.com/your-username/devTinder-backend.git
cd devTinder-backend
npm install
```
