CONTEXT FILE: Cursor Project Rules for startup911.in
This document outlines the standard operating procedures for using the Cursor IDE on this project. Adhering to these rules is mandatory to ensure code consistency, quality, and maintainability.

1. Context is King: Always Use @
@db or @supabase: Before writing or modifying any code that interacts with the database, always load the database schema as context (e.g., Using @supabase, help me write an API route to fetch grants...). This gives the AI precise knowledge of our tables and columns.

@<filename>: When modifying an existing file, always reference the file (e.g., In @app/grants/page.tsx, add a loading state...).

@PRD or other context files: For any new feature, reference the relevant documentation file (e.g., @PRD-master.md) to ensure the generated code aligns with our requirements.

2. Version Control is Non-Negotiable
Atomic Commits: Each commit must represent a single, logical change.

Conventional Commit Messages: All commit messages must follow the Conventional Commits standard (feat:, fix:, docs:, style:, refactor:, chore:).

Commit Often: Don't wait until the end of the day to commit many unrelated changes. Commit after each small, completed task.

3. Code Generation Protocol
Trust but Verify: Never accept AI-generated code without reading and understanding it first. You are the developer; the AI is your tool.

One Component at a Time: Generate one component at a time. Do not ask to generate an entire complex page in one prompt.

Be Explicit: Always specify the stack in your prompts. Example: "Create a Next.js Server Component using Tailwind CSS and TypeScript."

4. Vercel Compatibility
Serverless First: Our code must be compatible with Vercel's serverless environment. All backend logic must reside in Next.js Route Handlers (app/api/...), which deploy as serverless functions.

No Incompatible Runtimes: Do not write code that requires a long-running server instance. All operations must be stateless and handle a request/response lifecycle.

Environment Variables: All secrets must be managed through Vercel's environment variable settings for production. Use the .env.local file for local development only.