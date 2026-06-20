# GlowMind AI — Aesthetic AI Notes Sidebar

A pastel, glassmorphism notes sidebar built in React, now with a full
landing page, sign-up/login (email + Google), and a real auth backend on
MongoDB Atlas. The sidebar floats over any page, keeps a separate
notebook per site per signed-in user, and ships with mock AI actions
(summarize, bullet points, explain-like-a-tutor) structured for a
one-file swap to a real model later.

No Chrome extension code is included.

## Project layout

```
glowmind-ai-sidebar/
├── src/                 # frontend (Vite + React)
│   ├── pages/
│   │   ├── Landing.jsx       # public marketing page
│   │   ├── Login.jsx         # email + Google sign-in
│   │   ├── Signup.jsx        # email + Google sign-up
│   │   └── Workspace.jsx     # the protected app: mock host page + Sidebar
│   ├── auth/
│   │   ├── AuthContext.jsx     # token/user state, login/register/logout
│   │   ├── AuthLayout.jsx      # shared glass-card shell for Login/Signup
│   │   ├── GoogleLoginButton.jsx
│   │   └── ProtectedRoute.jsx  # redirects to /login if signed out
│   ├── components/        # Sidebar, Header, DomainBar, NotesArea, NoteItem, AIControls
│   ├── hooks/useNotes.js  # per-user, per-domain notes in React state
│   ├── utils/             # storage.js, aiStubs.js, url.js, constants.js
│   └── styles/theme.css   # design tokens (3 pastel themes) + shared primitives
└── server/               # backend (Node + Express + MongoDB Atlas)
    ├── index.js          # app entry, CORS, route mounting
    ├── db.js             # Mongo connection
    ├── models/User.js    # email/password OR Google-linked accounts
    ├── middleware/fetchuser.js  # JWT verification
    └── routes/auth.js    # /register /login /google /me
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — see "Google sign-in setup" below

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd ..   # back to the project root
npm install
cp .env.example .env
```

Fill in the frontend's `.env`:

- `VITE_API_URL=http://localhost:5000`
- `VITE_GOOGLE_CLIENT_ID` — the same Google client ID as the backend

```bash
npm run dev
```

Visit the printed local URL. You'll land on the marketing page; "Get
started" leads to sign-up, "Sign in" leads to login, and a successful
auth takes you to `/app` — the actual GlowMind sidebar over a mock
article page.

## Google sign-in setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create
   an OAuth client of type **Web application**.
2. Under **Authorized JavaScript origins**, add `http://localhost:5173`
   (and your deployed frontend URL later).
3. You do **not** need to add an Authorized redirect URI — the frontend
   uses Google's popup "auth-code" flow (`@react-oauth/google`'s
   `useGoogleLogin({ flow: 'auth-code' })`), so no real redirect happens.
4. Copy the **Client ID** and **Client secret** into both `.env` files
   as described above.

How it works end to end: the popup returns a short-lived authorization
`code` to the frontend, which sends it to the backend's `/api/auth/google`
route. The backend exchanges that code for the person's Google identity
server-side (via `google-auth-library`'s `OAuth2Client`, using
`'postmessage'` as the redirect URI to match the popup flow) and never
exposes the client secret to the browser. If the email already has a
normal email/password account, the Google identity is linked to it
instead of creating a duplicate.

## Architecture notes

**Auth state** lives in `AuthContext` (`src/auth/AuthContext.jsx`), mounted
around `<App />` in `main.jsx`. It stores the JWT in `localStorage`,
re-verifies it against `/api/auth/me` on load, and exposes `login`,
`register`, `loginWithGoogle`, and `logout` to any component via
`useAuth()`. `ProtectedRoute` wraps `/app` and redirects to `/login` if
there's no valid session.

**Notes storage** (`src/utils/storage.js`) now namespaces every notebook
by **`userId` + `domain`**, not domain alone — so if two people sign in
on the same browser, they never see each other's notes. `useNotes(userId,
domain)` and `Sidebar.jsx` pass the signed-in user's id (from
`useAuth()`) down automatically; nothing about the note-taking UI itself
changed.

**Styling** stays consistent end to end: Landing, Login, Signup, and the
Sidebar all share the same design tokens in `src/styles/theme.css`
(three pastel themes, Quicksand + Nunito type pairing, the `gm-` class
prefix). The auth pages additionally use shared form primitives
(`.gm-field`, `.gm-input`, `.gm-error-banner`, `.gm-divider`) defined in
that same file, so new forms can reuse them without duplicating CSS.

## Connecting a real AI API

Open `src/utils/aiStubs.js` and replace the body of `callAI()` with a
`fetch()` call (an OpenAI example is commented in line). Keep returning
`{ success: true, result }` or `{ success: false, error }` and nothing
else in the app needs to change.

## Moving notes from localStorage into MongoDB later

Right now notes live in the browser via `localStorage`. To move them into
Atlas alongside user accounts:

1. Add a `Note` model in `server/models/` (`userId`, `domain`, `text`,
   `tag`, `createdAt`).
2. Add CRUD routes under `server/routes/notes.js`, protected by the
   existing `fetchuser` middleware (it already attaches `req.user.id`).
3. Rewrite the functions in `src/utils/storage.js` to call those routes
   with the JWT (from `useAuth().token`) in the `auth-token` header,
   keeping the same function names and return shapes. `useNotes.js` and
   every component that calls it stay unchanged.

## Turning this into a Chrome extension later

1. Add a `manifest.json` (Manifest V3) declaring a content script and the
   permissions you need.
2. Build the frontend (`npm run build`) and have the content script
   create a container `<div>` on the host page, then mount the signed-in
   experience into it — the components don't need to change.
3. Replace the manual domain dropdown in `Sidebar.jsx`/`DomainBar.jsx`
   with `window.location.hostname` directly.
4. Keep the backend exactly as-is; the extension just calls the same
   `/api/auth/*` routes over HTTPS once deployed.
5. The widget's CSS already uses a `gm-` prefix on every class, so it
   won't collide with the host page's own styles.

## Portfolio-ready feature ideas

- **Real summarization with citations** — wire up `aiStubs.js` to a real
  model and have it reference which note(s) a summary was built from.
- **Notes synced to MongoDB** — follow the steps above so notes persist
  across devices instead of staying local to one browser.
- **Export to Markdown/Notion** — a "send to" button that turns a domain's
  notebook into a formatted `.md` file or pushes it to a Notion database.
