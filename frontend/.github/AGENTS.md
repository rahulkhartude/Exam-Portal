# Agent Instructions for Exam Portal Frontend

This is a React 19 frontend for an exam portal, built with Create React App, Tailwind CSS, and React Router DOM.

## Key Conventions
- **Component Naming**: PascalCase for files (e.g., `QuestionCard.js`).
- **Styling**: Use Tailwind utility classes; prefer flexbox/grid for layouts.
- **API Calls**: Use `services/api.js` for all requests; handle auth via interceptors.
- **Routing**: Role-based with ProtectedRoute; admin/student pages in subdirs.
- **State**: Local component state; no global store.

## Common Patterns
- Async/await for API; refs for focus; client-side pagination (10 items/page).
- Exam logic: Timer auto-submits; answers as `{questionId, selectedAnswer}` array.
- Authentication: localStorage for token/user; check `user.role` for access.

## Pitfalls
- Verify token validity on protected routes; add loading states for API calls.
- Ensure question fetching uses correct endpoints (currently `/admin` for students).
- Handle 401/403 errors in interceptors.

For setup and scripts, see [README.md](../README.md).