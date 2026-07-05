# Mini ERP — Inventory & Sales Management Backend

RESTful API for a Mini ERP system: JWT authentication, role-based access control, product management (full CRUD + image upload + search/filter/sort/pagination), sales with transactional stock control, and a dashboard stats endpoint. Interactive API docs via Swagger.

## Tech Stack
- Node.js, Express 5, TypeScript
- MongoDB + Mongoose 9
- JWT authentication (`jsonwebtoken`)
- Zod input validation
- Cloudinary (product images) + Multer (file upload)
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

## Roles & Permissions
| Role | Permissions |
|---|---|
| **Admin** | Full access (all endpoints) |
| **Manager** | Manage products (CRUD), create sales, view dashboard & sales history |
| **Employee** | View products, create sales |

## Admin Credentials (for testing)
- Email: `admin@test.com`
- Password: `pass1234`

> On a fresh / deployed database, create an Admin with `POST /auth/register` and body `{ "role": "Admin" }`.

## Production Build
```bash
pnpm build      # tsc -> dist/ + copies swagger.json
pnpm start      # node dist/server.js
```

## Deploy (Render)
1. Push the repo to GitHub.
2. Render → **New +** → **Web Service** → connect this repo.
3. Build command: `pnpm install && pnpm build`
4. Start command: `pnpm start`
5. Add all environment variables (table above) in Render's dashboard.
6. Deploy → use the Render URL as the Live Backend API URL.

## Frontend
- Frontend repo: `[TODO]`
- Live frontend URL: `[TODO]`
