CONTEXT FILE: Frontend Development Guidelines
This document defines the rules and best practices for all frontend code in the startup911.in project.

1. Framework & Architecture
Framework: Next.js 14+ with the App Router.

Default Component Type: Components must be React Server Components (RSCs) by default to maximize performance.

Client Components: Only use the "use client"; directive when browser-only APIs (useState, useEffect, onClick) are absolutely necessary. Keep Client Components as small as possible ("at the leaves of the component tree").

2. Styling
Styling Engine: Tailwind CSS is the only method for styling.

No Custom CSS: Do not write separate .css files for individual components. All styling must be done with Tailwind utility classes directly in the JSX.

Responsiveness: All components and pages must be fully responsive. Use Tailwind's responsive prefixes (sm:, md:, lg:) extensively.

3. Component Structure
Directory Structure:

components/ui/: For generic, reusable, application-agnostic elements (e.g., Button.tsx, Card.tsx). Think of these as our private library.

components/feature/: For complex components that are specific to a feature (e.g., QuestionnaireForm.tsx).

Props: All component props must be explicitly typed using TypeScript interfaces or types. Do not use the any type.

4. Data Fetching
Primary Method: Data should be fetched on the server within Server Components.

Client-Side Fetching: Use client-side fetching (e.g., SWR or useEffect) only for data that needs to change dynamically on the client without a page reload (e.g., live search results).