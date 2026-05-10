<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Next.js 16 has breaking changes — APIs, conventions, and file structure may differ from training data. Read guides in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Career Accessor

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint (ESLint v9)
```

## Tech Stack
- Next.js 16.2.6 (App Router)
- React 19.2.4
- Tailwind CSS v4 (configured via `@tailwindcss/postcss`, NOT tailwind.config.js)
- TypeScript
- Google Gemini API (gemini-1.5-flash-lite-latest)
- SQLite (dev) / PostgreSQL (prod)

## Project Structure (to implement)
```
app/
├── layout.tsx              # Root layout (exists)
├── page.tsx                # / route (exists, replace with JobTitleForm)
├── home/page.tsx           # /home route (create)
├── questions/page.tsx      # /questions route (create)
├── api/
│   ├── generate-questions/route.ts  # POST endpoint (create)
│   └── questions/route.ts            # GET endpoint (create)
└── components/
    ├── JobTitleForm.tsx
    ├── QuestionCard.tsx
    ├── QuestionsList.tsx
    └── LoadingSpinner.tsx

lib/
├── db.ts                   # Database setup & queries
├── gemini.ts               # Gemini API integration
├── logger.ts               # Logging system
└── types.ts                # TypeScript interfaces
```

## Environment Variables (.env.local)
```env
NEXT_PUBLIC_GEMINI_API_KEY=<your-key>
DATABASE_URL=sqlite:./dev.db
LOG_LEVEL=debug
DETAILED_LOGGING=true
```

## Implementation Order
1. Create `lib/` utilities first (db.ts, gemini.ts, logger.ts, types.ts)
2. Create API routes
3. Create components
4. Update pages
5. Test with `npm run dev`

## Key Implementation Details
- **Gemini model**: `gemini-1.5-flash-lite-latest`
- **Prompt**: Generate exactly 3 questions, return JSON array only (no markdown)
- **DB**: SQLite via better-sqlite3. Tables: `job_searches`, `interview_questions`, `logs`
- **Logger**: JSON format, write to `logs` table. Categories: `API_CALL`, `USER_INPUT`, `DB_QUERY`, `API_ERROR`
- **Response format**: `{ searchId, questions: [{ id, question, focus_area, what_it_seeks }] }`
- **Navigation**: After submit, navigate to `/questions?id=<searchId>`

## Quirks
- Tailwind v4 uses `@tailwindcss/postcss` — no `tailwind.config.js` by default
- Use `uuid` for ID generation (install: `npm install uuid`)
- Use `@google/generative-ai` SDK for Gemini
- All lib files use `@/` alias (root)