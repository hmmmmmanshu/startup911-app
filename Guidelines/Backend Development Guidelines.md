CONTEXT FILE: Backend Development Guidelines
This document defines the rules for all backend logic, API routes, and database interactions.

1. API Layer
Structure: All backend API logic must reside in Next.js Route Handlers within the app/api/ directory.

Unified Endpoint: We will use a single, unified endpoint (/api/recommend) that accepts a type parameter (grants, vcs, mentors) to handle all recommendation requests. This promotes code reuse.

Request/Response: All API endpoints must expect JSON and return JSON, with appropriate HTTP status codes (e.g., 200 for success, 400 for bad request, 500 for server error).

2. Database Interaction
Abstraction: Do not write raw database queries directly in your API route files. All database logic must be encapsulated in functions within the /lib/supabase/ directory. API routes will call these functions.

Type Safety: We will use the Supabase CLI to generate TypeScript types directly from our database schema. This ensures end-to-end type safety. The command is npx supabase gen types typescript --project-id <your-ref-id> --schema public > lib/supabase/types.ts.

Security: Always use the server-side Supabase client (initialized with the service_role key) for operations that require bypassing RLS, and ensure these operations are secure.

3. Vercel Hosting
Statelessness: All API routes must be stateless. They cannot rely on in-memory storage between requests.

Execution Time: Be mindful of Vercel's function execution time limits (e.g., 10-60 seconds on hobby/pro plans). Design database queries to be efficient.