# TravelSphere project rules

## Git rules (strict)
- Never run git commands that change anything: no branch, commit, push, merge, rebase, reset or checkout. Read-only ones (status, diff, log) are fine.
- Never create, rename or suggest branch names or commit messages.
- Never touch main. Work only in the files I name.
- When a task is done, only list: files changed, how to test, anything risky.

## Code rules
- Make minimal changes. Do not refactor or touch files outside the task.
- Never read, print or edit .env or .env.local files. Never commit secrets.
- Keep the existing API shape unless the task says otherwise.
- Frontend: Next.js 14 app router, TypeScript, Tailwind. Backend: FastAPI, SQLAlchemy, PostgreSQL, OR-Tools, Gemini explainer, Auth.js Google login with backend JWT.
- After every change, show a diff and keep the final report short.
