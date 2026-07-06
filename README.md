# Mini ERP — Inventory & Sales Management Backend

RESTful API for a Mini ERP system: JWT authentication, role-based access control, product management (full CRUD + image upload + search/filter/sort/pagination), sales with transactional stock control, and a dashboard stats endpoint. Interactive API docs via Swagger.

## Tech Stack
- Node.js, Express 5, TypeScript
- MongoDB + Mongoose 9
- JWT authentication (`jsonwebtoken`)
- Zod input validation
- Cloudinary (product images) + Multer (file upload)
- Socket.IO (real-time dashboard updates)
- Swagger UI (auto-generated API docs)

## Prerequisites
- Node.js >= 18
- pnpm  (`npm i -g pnpm`)
- A MongoDB Atlas cluster (connection string)
- A Cloudinary account (cloud name + API key/secret)

## Local Setup
```bash
git clone https://github.com/TanvirSEF/mini_erp_backend.git
cd mini_erp_backend
pnpm install
cp .env.example .env     # then fill in real values
pnpm dev
```

Server runs at `http://localhost:5000`. API docs at `http://localhost:5000/api/v1/docs`.

> `bcrypt` is a native module — its build is already allowlisted in `package.json` (`pnpm.onlyBuiltDependencies`). If pnpm skips it, run `pnpm approve-builds`.

## Environment Variables
| Variable | Description |
|---|---|
| `PORT` | Server port (default `5000`) |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor (e.g. `12`) |
| `JWT_ACCESS_SECRET` | Secret used to sign JWTs |
| `JWT_ACCESS_EXPIRES_IN` | Token expiry (e.g. `1d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NODE_ENV` | `development` or `production` (controls error detail exposure) |
| `CLIENT_URL` | CORS origins for Express + Socket.IO. One URL or a comma-separated list (e.g. `http://localhost:5173,https://app.example.com`). Use `*` to allow any. |

## Scripts
| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server with auto-reload (ts-node-dev) |
| `pnpm build` | Compile TypeScript to `dist/` + copy Swagger spec |
| `pnpm start` | Run the compiled build (`node dist/server.js`) |
| `pnpm swagger:autogen` | Regenerate `src/docs/swagger.json` from route annotations |

## API Endpoints
Base URL: `/api/v1` · Response envelope: `{ success, message, data }`

### Auth
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login → returns JWT access token |

### Users (admin only)
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| PATCH | `/users/:id/role` | Admin | Change a user's role (body: `{ "role": "Manager" }`) |
| DELETE | `/users/:id` | Admin | Delete a user (cannot delete self or the last admin) |

### Products
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/products` | Any authenticated | List (search, filter, sort, paginate via query) |
| GET | `/products/:id` | Any authenticated | Single product |
| POST | `/products` | Admin, Manager | Create — `multipart/form-data`, image required |
| PATCH | `/products/:id` | Admin, Manager | Update (optional new image) |
| DELETE | `/products/:id` | Admin, Manager | Delete |

### Sales
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/sales` | Any authenticated | Create sale → auto stock reduce + grand total (transactional) |
| GET | `/sales` | Admin, Manager | Sale history |

### Dashboard
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Admin, Manager | `totalProducts`, `salesCount`, `totalSales` (revenue), `lowStockProducts` (stock < 5) |

**Query params for `/products`:** `searchTerm`, any field (e.g. `category`), `sort` (e.g. `-createdAt`), `page`, `limit`.

Swagger UI: `http://localhost:5000/api/v1/docs`

## Roles & Permissions (Database-driven)
Roles and their permissions are stored in MongoDB and seeded automatically on startup. Permissions use a `resource:action` format (e.g. `product:create`) and routes are guarded through the `auth(...)` middleware, so an admin can reassign a role's permissions at runtime without a code change.

| Role | Default Permissions |
|---|---|
| **Admin** | `*` (wildcard — unrestricted access to everything) |
| **Manager** | `product:*`, `sale:create`, `sale:read`, `dashboard:read` |
| **Employee** | `product:read`, `sale:create` |

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/roles` | Admin | List all roles and their permissions |
| PATCH | `/roles/:name` | Admin | Update a role's permissions (body: `{ "permissions": ["..."] }`) |

> The `Admin` role is immutable (its wildcard cannot be removed), which prevents anyone from locking the system out.

## Real-time Updates (Socket.IO)
The server exposes a Socket.IO endpoint (same origin/port as the API). Connections are JWT-authenticated — the client must pass its access token in `handshake.auth.token`.

| Event | Channel | Payload | When |
|---|---|---|---|
| `sale:created` | `dashboard` | `{ saleId, grandTotal, itemsCount }` | After every successful sale |
| `low-stock` | `dashboard` | `[{ _id, name, sku, stockQuantity }]` | When a sale pushes a product below 5 units |

Frontend example (`socket.io-client`):
```ts
const socket = io(API_URL, { auth: { token: accessToken } });
socket.on('sale:created', () => refetchDashboard());
socket.on('low-stock', (products) => showLowStockBanner(products));
```

## Admin Credentials (for testing)
- Email: `admin@test.com`
- Password: `pass1234`

> On a fresh / deployed database, create an Admin with `POST /auth/register` and body `{ "role": "Admin" }`.

## Production Build
```bash
pnpm build      # tsc compiles src/ -> dist/
pnpm start      # node dist/server.js (reads swagger.json from src/docs at runtime)
```

## Docker & Dokploy Deployment
The repo ships a production multi-stage `Dockerfile`, a `.dockerignore`, and a `docker-compose.yml`. The image is built in two stages (full deps for compiling, prod-only deps for running), runs as a non-root user, ships a health check, and exposes port `5000`.

Run locally with Docker:
```bash
docker compose up --build        # api at http://localhost:5000
```

Deploy on **Dokploy**:
1. Push the repo to GitHub.
2. Dokploy → **Services → New → Application** → connect this repo. Dokploy auto-detects the `Dockerfile` and builds it.
3. **Port:** `5000`.
4. **Environment variables** — add every variable from the table above, with `NODE_ENV=production` and `CLIENT_URL` set to your live frontend URL.
5. Deploy. Dokploy builds the image, injects the env vars at runtime, and routes traffic to port `5000`.

> Env vars are injected by Dokploy at runtime and never baked into the image. The app reads them through `process.env`; the local `.env` is only used outside Docker.

## Frontend
- Frontend repo: `[TODO]`
- Live frontend URL: `[TODO]`
