# GIIS Web (Vite + React) — Simple CSS (Stylish)

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Set `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Deploy on Render (Static Site)
1) Create a **Static Site** on Render
2) Build command:
```
npm install && npm run build
```
3) Publish directory:
```
dist
```
4) Add Environment Variable:
- `VITE_API_BASE_URL` = your backend Render URL (example: https://giis-api.onrender.com)

## React Router on Render (important)
Add a rewrite rule in Render Static Site:
- Source: `/*`
- Destination: `/index.html`
- Status: `200`
