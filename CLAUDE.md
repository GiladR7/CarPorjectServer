# CLAUDE.md — CarProjectServer

AI assistant guide for the CarProjectServer codebase. Read this before making any changes.

---

## Project Overview

A Node.js/Express REST API backend for an Israeli car marketplace platform. Users can register/login, post car advertisements with images, search/filter ads, and manage favorites. The UI is designed for Hebrew-speaking users (validation messages are in Hebrew).

**Stack:** Node.js · Express 4 · MySQL2 · JWT · bcrypt · multer · dotenv

---

## Repository Structure

```
CarPorjectServer/
├── app.js                    # Express app setup, middleware, route mounting
├── bin/www                   # HTTP server entry point (port 5000)
├── .env                      # Environment secrets (not committed)
│
├── routes/                   # Express routers — thin, only delegate to controllers
│   ├── index.js              # GET /  (root)
│   ├── users.js              # /users
│   ├── carsRouter.js         # /cars
│   └── adsRouer.js           # /ads  ← NOTE: intentional typo in filename, do not rename
│
├── controller/               # Business logic: validate input, call DAL, send response
│   ├── users.js
│   ├── cars.js
│   └── ads.js
│
├── DAL/                      # Data Access Layer — all database interaction lives here
│   ├── DBconnection.js       # MySQL connection pool (10 connections)
│   ├── api.js                # Re-exports all DAL modules as a single import
│   ├── usersApi.js
│   ├── adsApi.js
│   ├── carsApi.js
│   └── utilitiesApi.js       # Shared helpers (e.g., mergeTable)
│   └── queries/              # Raw SQL string builders — one file per domain
│       ├── usersQueris.js    # ← NOTE: intentional typo in filename
│       ├── adsQueries.js
│       └── carsQueries.js
│
├── utilities/                # Reusable Express middleware
│   ├── jwtMiddle.js          # Verifies JWT, attaches payload to req.user; returns 401 on failure
│   ├── isLogeedIn.js         # Soft auth check — sets req.user if token valid, never blocks
│   └── multer.js             # Multer config: dest=public/carImages/, timestamp filenames
│
├── validation/               # Input validation (server-side)
│   ├── validationFuc.js      # validate(obj, schema) → {valid, errors}
│   ├── validationObj.js      # Validation schemas with Hebrew error messages
│   └── inputsObj.js          # Input field definitions
│
└── public/
    └── carImages/            # Persisted uploaded images (served statically)
```

---

## Architecture Pattern

The codebase follows a strict 3-layer architecture. Always respect this separation:

```
HTTP Request
    ↓
routes/        — Mount middleware, parse URL params, call controller function
    ↓
controller/    — Validate input, orchestrate DAL calls, format and send HTTP response
    ↓
DAL/           — Execute SQL queries, return raw results; NO business logic here
    ↓
MySQL Database
```

**Rules:**
- Routes never talk to DAL directly.
- Controllers never build raw SQL.
- DAL functions never touch `req` or `res`.

---

## Key Files

### `app.js`
Mounts CORS (origin: `http://localhost:3000`), morgan, cookie-parser, JSON body-parser, and four routers.

### `DAL/DBconnection.js`
Creates a pool of 10 MySQL connections. Exports `pool.promise()` so all queries use `async/await`. The database name is `cars-data`.

### `DAL/api.js`
Central barrel file. Import all DAL modules from here: `const { usersApi, adsApi, carsApi } = require('../DAL/api')`.

### `utilities/jwtMiddle.js`
Required for protected routes. Reads `token` from cookies, verifies with `ACCESS_TOKEN` env var, sets `req.user`. Sends `401` on any failure.

### `utilities/isLogeedIn.js`
Optional auth. Same as `jwtMiddle` but calls `next()` regardless — used on public endpoints that behave differently for logged-in users.

---

## API Endpoints

### Authentication
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users/logIn` | None | Login; sets `token` cookie |
| GET | `/users/token` | Required | Validate current token |
| GET | `/users/logOut` | None | Clears `token` cookie |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users` | None | Register new user |
| GET | `/users` | Required | Get own profile |
| PUT | `/users` | Required | Update profile fields |

### Car Reference Data (lookup tables, read-only)
| Method | Path | Query Params | Description |
|--------|------|-------------|-------------|
| GET | `/cars` | — | All vehicle categories |
| GET | `/cars/manufacturers` | `categoryID` | Manufacturers for a category |
| GET | `/cars/models` | `categoryID`, `manufacturerID` | Models |
| GET | `/cars/colors` | — | All colors |
| GET | `/cars/gears` | — | Transmission types |
| GET | `/cars/codeArea` | — | Phone area codes |

### Advertisements
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/ads` | Optional | List ads; supports filters + pagination |
| POST | `/ads` | Required | Create ad with images |
| PUT | `/ads` | Required | Update ad (full replacement) |
| DELETE | `/ads` | Required | Delete ad |
| GET | `/ads/myAds` | Required | Current user's ads |
| GET | `/ads/can-edit` | Required | Check ownership (`?adID=`) |
| POST | `/ads/views` | Required | Record a view |
| GET | `/ads/favorites` | Required | User's favorites |
| POST | `/ads/favorites` | Required | Add to favorites |
| DELETE | `/ads/favorites` | Required | Remove from favorites |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ACCESS_TOKEN` | JWT signing secret — long hex string |
| `PORT` | Server port (default: `5000`) |

The `.env` file is not committed. When setting up locally, create one with these two keys.

---

## Database

- **Engine:** MySQL
- **Database name:** `cars-data`
- **Connection:** Pool of 10, via `mysql2/promise`

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | Registered users (hashed passwords via bcrypt) |
| `ads` | Car listings |
| `images` | One-to-many images per ad (stores filename) |
| `manufacturers` | Car brand reference |
| `models` | Car model reference (linked to manufacturer + category) |
| `categories` | Vehicle type (car, SUV, truck…) |
| `car_color` | Color options |
| `gears` | Transmission types |
| `phone_area_codes` | Israeli phone prefixes |
| `users_favorites` | User ↔ ad favorites |
| `ad_views` | Per-user view tracking |

---

## Development Workflow

### Running Locally

```bash
npm start          # nodemon ./bin/www — auto-reloads on file changes
```

Server listens on `http://localhost:5000` by default.

### No Tests Exist

There is currently no test suite. When adding tests, use Jest or Mocha with Supertest for HTTP integration tests.

### No TypeScript

The project is plain JavaScript (CommonJS `require`/`module.exports`). Do not introduce ES module syntax (`import`/`export`) without refactoring the entire project.

---

## Conventions to Follow

### Adding a New Endpoint

1. **Query** — Add SQL builder function in `DAL/queries/<domain>Queries.js`.
2. **DAL** — Add async function in `DAL/<domain>Api.js` that calls the query via the pool.
3. **Controller** — Add handler function in `controller/<domain>.js`: validate → call DAL → respond.
4. **Route** — Register the route in `routes/<domain>Router.js`, applying `jwtMiddle` if protected.

### SQL Queries

All SQL is raw string-based (no ORM). Queries are built in `DAL/queries/`. Use parameterised queries (`?` placeholders with `pool.execute(sql, [params])`) to prevent SQL injection — **this is not consistently done in the current codebase; always use parameterised queries in new code**.

### Response Format

Controllers respond with `res.json(...)`. There is no shared response wrapper — match the pattern of the existing controller you're editing.

### Authentication

- Protect routes by adding `jwtMiddle` as the second argument to the route handler.
- Use `isLogeedIn` for routes that are public but should be context-aware for logged-in users.

### File Uploads

- Multer is pre-configured in `utilities/multer.js`.
- Use `upload.array('images')` or `upload.single('image')` in the route.
- Uploaded files land in `public/carImages/` with filenames like `<timestamp>_<original>`.
- Store only the filename (not full path) in the database.

### Validation

- Input schemas live in `validation/validationObj.js`.
- Call `validate(inputData, schema)` from `validation/validationFuc.js` in controllers before any DB call.
- Error messages are in **Hebrew** — keep them in Hebrew for consistency.

---

## Known Issues / Technical Debt

- Some query files still concatenate user input into SQL strings — replace with `?` placeholders when touching those files.
- MySQL credentials are hardcoded in `DAL/DBconnection.js` — they should be moved to `.env`.
- No error-handling middleware exists; unhandled rejections may crash the server.
- `adsRouer.js` (typo) and `usersQueris.js` (typo) — do **not** rename these files as it would break existing requires.
- No rate limiting or request size limits beyond JSON body-parser defaults.
