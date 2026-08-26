# Chat App Backend

A production-ready WhatsApp-like Chat Backend built with Node.js, Express, TypeScript, Sequelize, and Socket.IO.

## Commands

* `npm run dev` - Starts the development server with nodemon.
* `npm run build` - Compiles TypeScript to JavaScript in the `dist/` directory.
* `npm run start` - Runs the compiled production code.
* `npm run migrate` - Runs all pending database migrations.
* `npm run migrate <name>` - Creates a new migration file with the given name.
* `npm run seeder` - Runs all database seeders.
* `npm run seeder <name>` - Creates a new seeder file.
* `npm run lint` - Lints the codebase using ESLint.
* `npm run format` - Formats the codebase using Prettier.
* `npm run test` - Runs tests using Jest.

## E2EE Architecture

* **Server-side responsibility**: The backend routes opaque encrypted messages and stores public keys. It DOES NOT possess the private keys to decrypt the content.
* **Client-side responsibility**: Clients must generate keypairs, exchange pre-keys via the backend, and encrypt all payloads before transmission.

## Docker Setup

```bash
docker-compose up -d
```
Starts PostgreSQL, Redis, and MinIO.

## Documentation
Available at `http://localhost:3000/api-docs`
