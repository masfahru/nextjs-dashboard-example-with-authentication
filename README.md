# Next.js 14 App Router Example with Authentication

This is a modified result after following [Next.js learning course](https://nextjs.org/learn)

Tech-stack:

- [Next.js v14](https://github.com/vercel/next.js)
- [Postgres.js v3](https://github.com/porsager/postgres)
- [Nextauth.js v5 (beta)](https://github.com/nextauthjs/next-auth)

## Requirements

- Nodejs v20
- Package Manager (npm, yarn, or bun)
- PostgreSQL server (if you want to use local database server)

## Development

- Clone this project to local
- Install dependencies: `npm i`
- Copy .env.example to .env
- Modify .env as per the requirement
- Run database seed (just for once): `npm run seed`
- run `npm run dev`

## Build

- run `npm run build`

## Start

- run `npm run start` after successful build.

## The changes

There are some differences between the original result of the course and this repository, which are:

### Database driver

Using `Postgres.js` instead of `@vercel/postgres`, both of them have a similiar syntax.

for example:

```javascript
const [result] = sql``;
```

### Authentication

Implement a simple session manager, so we can force log-out other sessions by deleting their session id from the database.

Credentials:

```json
{
  "email": "user@nextmail.com",
  "password": "123456"
}
```

### Web Endpoints

- Signin `http://localhost:3000/login`
- Dashboard `http://localhost:3000/dashboard`

### RestAPI Endpoints

#### Signin POST `http://localhost:3000/api/auth/callback/credentials`

payload:

```json
{
  "email": "user@nextmail.com",
  "password": "123456",
  "callbackUrl": "/api/auth/session"
}
```

**callbackUrl** can be changed to any pathname to redirect after successful sign-in

#### Signout POST `http://localhost:3000/api/auth/signout`

payload:

```json
{
  "callbackUrl": "/api/auth/providers"
}
```

**callbackUrl** can be changed to any pathname to redirect after successful sign-out
