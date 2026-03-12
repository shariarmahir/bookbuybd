# BookBuyBD Frontend

Next.js (App Router) frontend for BookBuyBD.

## Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Production build

```bash
npm run lint
npm run build
npm run start
```

## cPanel deployment (Node.js app)

This project includes a standalone build path for cPanel:

```bash
npm run build:cpanel
```

That command:
1. Builds Next.js in `standalone` mode.
2. Copies required static assets into `.next/standalone`.

Then run:

```bash
npm run start:cpanel
```

For cPanel environment variables, copy `.env.example` values into your app environment and set:
1. `BACKEND_ORIGIN` to your backend domain (for API/media proxy).
2. `NEXT_PUBLIC_API_BASE_URL` (usually `/api`).
3. `NEXT_PUBLIC_BACKEND_ORIGIN` only if you need explicit browser-side media origin.
4. `HOSTNAME` and `PORT` according to cPanel Node app settings.
