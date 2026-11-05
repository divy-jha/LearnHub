# LearnHub

LearnHub is a full-stack course learning MVP built with React, Node.js, Express, MongoDB, JWT, and Zod. Learners can register and sign in, browse database-backed courses, enroll, work through lessons and quizzes, and track progress. Administrators can manage courses and learner accounts.

## Requirements

- Node.js 20.19 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Configure the API

Install the server packages and create the local environment file:

```sh
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set:

- `MONGODB_URI` to your local database or Atlas connection string
- `JWT_SECRET` to a private random value with at least 32 characters
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the first administrator account (password must be at least 12 characters)

The API seeds the three starter courses on its first connection. It creates the admin account from the environment values if that account does not exist. `.env` is ignored by Git; do not commit secrets or a real connection string.

## Run locally

Start the API in one terminal:

```sh
cd server
npm run dev
```

Start the client in another terminal:

```sh
cd client
npm install
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:3000`. The catalog and course detail pages read from MongoDB through the API. After signing in with the configured admin account, use **Manage courses** to create, edit, or delete courses and open the Users tab to administer learner accounts.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET/PATCH /api/auth/me`
- `GET/POST /api/courses`, `GET/PATCH/DELETE /api/courses/:slug`
- `GET/POST /api/enrollments`, `POST /api/enrollments/:courseId/lessons/:lessonNumber/complete`
- Admin-only `GET /api/users` and `DELETE /api/users/:userId`

Write requests are validated with Zod. Passwords are salted and hashed with Node's scrypt, and sessions use signed, expiring JWTs. Course CRUD and account administration require the `admin` role.

## Notes before deployment

Configure a production MongoDB database, a strong private JWT secret, HTTPS, allowed client origins, backups, and appropriate rate limits. The starter lesson reading materials and quizzes are client content keyed to the seeded course slugs; courses added by an administrator get a generic lesson prompt and knowledge check until custom lesson authoring is added.
