# Mini ERP Backend

Backend for a small inventory and sales app. It covers JWT login, role-based access, products (with images, search, sort, and pagination), sales with automatic stock control, and a dashboard. API docs are generated with Swagger.

## Test login
A default admin is created automatically on the first run (with a fresh database). Sign in with:
- Email: `admin@test.com`
- Password: `pass1234`

Prefer your own credentials? Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` before the first run.

## Live links
- API: https://erp.tanvirmern.com
- Swagger docs: https://erp.tanvirmern.com/api/v1/docs
- Frontend: https://erpfe.tanvirmern.com
- Frontend repo: https://github.com/TanvirSEF/mini_erp_frontend

## Run locally
Needs Node.js 18+, pnpm, a MongoDB Atlas connection string, and a Cloudinary account.

```bash
git clone https://github.com/TanvirSEF/mini_erp_backend.git
cd mini_erp_backend
pnpm install
cp .env.example .env
pnpm dev
```

The server runs on http://localhost:5000 and the docs on http://localhost:5000/api/v1/docs.

## Tech stack
Node.js, Express 5, TypeScript, MongoDB with Mongoose, JWT, Zod, Cloudinary + Multer, Socket.IO, Swagger UI.

## Environment variables
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor (e.g. 12) |
| `JWT_ACCESS_SECRET` | Secret used to sign JWTs |
| `JWT_ACCESS_EXPIRES_IN` | Token expiry (e.g. 1d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NODE_ENV` | development or production |
| `CLIENT_URL` | Allowed CORS origins for Express and Socket.IO. One URL or comma-separated, e.g. `http://localhost:5173,https://erpfe.tanvirmern.com`. Use `*` to allow all. |

## API endpoints
Base path: `/api/v1`. Every response uses `{ success, message, data }`.

### Auth
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login, returns a JWT |

### Users (admin only)
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/users` | Admin | Create a user (name, email, password, role) |
| GET | `/users` | Admin | List users |
| PATCH | `/users/:id/role` | Admin | Change a user's role |
| DELETE | `/users/:id` | Admin | Delete a user (not self, not the last admin) |

### Products
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/products` | Any logged-in user | List (search, filter, sort, paginate) |
| GET | `/products/:id` | Any logged-in user | Get one product |
| POST | `/products` | Admin, Manager | Create (multipart, image required) |
| PATCH | `/products/:id` | Admin, Manager | Update (optional new image) |
| DELETE | `/products/:id` | Admin, Manager | Delete |

### Sales
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/sales` | Any logged-in user | Create a sale (reduces stock, totals the order) |
| GET | `/sales` | Admin, Manager | Sale history |

### Dashboard
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Admin, Manager | totalProducts, salesCount, totalSales, lowStockProducts |

`GET /products` takes `searchTerm`, `category`, `sort`, `page`, `limit`, and returns `{ meta, result }`.

## Roles and permissions
Roles and permissions are stored in the database and seeded on startup. An admin can edit a role's permissions at runtime without changing code.

| Role | What they can do |
|---|---|
| Admin | Everything |
| Manager | Manage products, record sales, view dashboard |
| Employee | View products, record sales |

Admin-only: `GET /roles` and `PATCH /roles/:name`. The Admin role itself can't be weakened, so no one can lock the system out.

## Real-time updates
Socket.IO pushes live updates to the dashboard. Authenticate the socket with the JWT in `handshake.auth.token`. On the `dashboard` channel you get `sale:created` after a sale, and `low-stock` when a product drops below 5.
