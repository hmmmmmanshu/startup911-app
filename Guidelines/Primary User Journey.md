CONTEXT FILE: Primary User Journey
This file describes the primary user flow for the recommendation engine, which serves as a template for all funnels.

Entry Point: User lands on the Homepage (/).

Selection: User clicks a primary CTA, for example, "I Need Grants."

Navigation: The user is taken to the Questionnaire Page (/grants).

Interaction:

The page fetches available filter options (e.g., all "Industry" tags) from the Supabase tags table to populate the form's dropdowns.

The user selects their criteria (e.g., Industry: 'HealthTech', Stage: 'MVP').

Submission & State Passing:

User clicks "Find Grants."

The frontend client code does not call an API directly.

Instead, it constructs a URL with the selected filter criteria as search parameters and navigates the user to it. For example: /grants/results?industry=HealthTech&stage=MVP.

Results Display:

The Results Page (/grants/results) is a Server Component.

On the server, it reads the search parameters (industry, stage) from the URL.

It then calls a server-side function that queries Supabase for grants matching those parameters.

The page renders the filtered list of grants. This server-side rendering is fast and SEO-friendly.