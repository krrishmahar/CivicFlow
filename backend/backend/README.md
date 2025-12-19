# backend-2

A Motia project created with the starter template.

## What is Motia?

Motia is an open-source, unified backend framework that eliminates runtime fragmentation by bringing **APIs, background jobs, queueing, streaming, state, workflows, AI agents, observability, scaling, and deployment** into one unified system using a single core primitive, the **Step**.

## Quick Start

```bash
# Start the development server (backend on :3001 by default)
npm run dev
```

This starts the Motia runtime and the **Workbench** - a powerful UI for developing and debugging your workflows.

### Environment variables

Create a `.env` file in the project root (do not commit this file) with at least:

```bash
APP_NAME="CivicFlow Backend"
GREETING_PREFIX="Hello"
# Generate a strong random secret, for example using Git Bash / WSL:
#   openssl rand -hex 32
JWT_SECRET="replace-with-secure-random-hex"
```

### Auth & RBAC endpoints

All auth state is stored in Motia State (no in-memory stores).

- **Signup**  
  - **Method**: `POST`  
  - **Path**: `/auth/signup`  
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "changeme123",
      "role": "COMPLAINANT"
    }
    ```

- **Login**  
  - **Method**: `POST`  
  - **Path**: `/auth/login`  
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "changeme123"
    }
    ```
  - **Response** (shape):
    ```json
    {
      "token": "JWT_TOKEN_HERE",
      "user": {
        "id": "user-id",
        "email": "user@example.com",
        "role": "COMPLAINANT",
        "isActive": true,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    }
    ```

- **Protected ADMIN-only example**  
  - **Method**: `GET`  
  - **Path**: `/admin/secure`  
  - **Headers**:
    ```http
    Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
    ```

- **Protected VOLUNTEER + ADMIN example**  
  - **Method**: `GET`  
  - **Path**: `/secure/volunteer-or-admin`  
  - **Headers**:
    ```http
    Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
    ```

All flows log structured events via the Motia logger (e.g. `auth.signup.start`, `auth.login.success`, `auth.login.failed`), which are visible in the Motia runtime / Workbench logs.

## Step Types

Every Step has a `type` that defines how it triggers:

| Type | When it runs | Use case |
|------|--------------|----------|
| **`api`** | HTTP request | REST APIs, webhooks |
| **`event`** | Event emitted | Background jobs, workflows |
| **`cron`** | Schedule | Cleanup, reports, reminders |

## Development Commands

```bash
# Start Workbench and development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Start production server (without hot reload)
npm run start
# or
yarn start
# or
pnpm start

# Generate TypeScript types from Step configs
npm run generate-types
# or
yarn generate-types
# or
pnpm generate-types

# Build project for deployment
npm run build
# or
yarn build
# or
pnpm build
```

## Project Structure

```
steps/              # Your Step definitions (or use src/)
motia.config.ts     # Motia configuration
```

Steps are auto-discovered from your `steps/` or `src/` directories - no manual registration required.

## Learn More

- [Documentation](https://motia.dev/docs) - Complete guides and API reference
- [Quick Start Guide](https://motia.dev/docs/getting-started/quick-start) - Detailed getting started tutorial
- [Core Concepts](https://motia.dev/docs/concepts/overview) - Learn about Steps and Motia architecture
- [Discord Community](https://discord.gg/motia) - Get help and connect with other developers