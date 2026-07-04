# NoteDrop

NoteDrop is a polished note-taking app built with Next.js, Prisma, Clerk, and the Google Gemini API. It lets you create notes, edit or delete them, search through existing entries, share a public version of a note, and generate quick AI summaries.

## Features

- Create, read, update, and delete notes
- Search notes by title, content, or mood
- Paginated note list for easier browsing
- Share notes through a public URL
- Detect a mood for each note
- Generate concise AI summaries for note content
- Authentication via Clerk

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL with the pgvector extension
- Clerk for authentication
- Google Generative AI for summaries and mood-related AI behavior

## Prerequisites

- Node.js 18 or newer
- npm
- A PostgreSQL database
- A Clerk account
- A Google Gemini API key

## Environment variables

Create a .env.local file in the project root with the following values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC__APP_URL=http://localhost:3000
```

## Getting started

1. Install dependencies

```bash
npm install
```

2. Generate the Prisma client and apply migrations

```bash
npx prisma generate
npx prisma migrate dev
```

3. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Project structure

```text
app/
  api/
    createNotes/
    deleteNotes/
    getNotes/
    shareNote/
    summarizeNotes/
    updateNotes/
  components/
    Modal/
    Pagination/
  lib/
  models/
  services/
  share/[link]/
prisma/
public/
```

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API routes

- POST /api/createNotes
- GET /api/getNotes
- POST /api/updateNotes
- DELETE /api/deleteNotes
- POST /api/shareNote
- POST /api/summarizeNotes
- GET /share/[link]

## Notes

- The app expects a PostgreSQL database with the vector extension available for Prisma schema support.
- Shared notes are served from the public route under the share folder.
- Clerk authentication is required for note creation and management.
