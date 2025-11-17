# myFlix API (scaffold)

This is a minimal scaffold of the myFlix API with a public `/movies` endpoint so your React app can fetch movie data.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set values.

3. Run locally:

```bash
npm run dev
# or
npm start
```

4. Open `http://localhost:3000/movies` to view sample movie data.

Branching & deployment notes

- Create a branch (e.g. `allow-movies-for-react`) and commit your changes before opening a PR.
- After merging to `main`, push to Heroku with `git push heroku main` (ensure `heroku` remote is set).

Security note

- This scaffold includes passport JWT setup in `config/passport.js`, but the `/movies` route is intentionally public (no `passport.authenticate` middleware applied). Use caution when making other routes public; this change is intended to be temporary for development with the React client.
