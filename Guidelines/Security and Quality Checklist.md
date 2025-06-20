CONTEXT FILE: Security and Quality Checklist
This is an additional context file to ensure we build a secure and high-quality application. The AI should adhere to these points.

[ ] Environment Variables: All secrets must be stored in .env.local and never committed to Git. Vercel will manage production variables.

[ ] Row Level Security (RLS): All Supabase tables must have RLS enabled. The default policy should deny all access. We will then create specific, permissive policies for public read access.

[ ] API Input Validation: All API routes must validate and sanitize any user-provided input before using it in a database query to prevent injection attacks.

[ ] XSS Prevention: We will rely on React's default JSX escaping. The dangerouslySetInnerHTML prop is forbidden.

[ ] No Errors in Console: The final code for any feature must not produce any errors or warnings in the browser's developer console.

[ ] Accessibility (a11y): All interactive elements like buttons and form inputs must have proper ARIA attributes and be navigable via keyboard.