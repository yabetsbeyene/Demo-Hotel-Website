<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.
Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code.
<!-- END:nextjs-agent-rules -->

# Project Rules – Impeccable UI Focus

## Core Principles
- Always prefer **Server Components** by default. Only add `"use client"` when interactivity, browser APIs, or hooks are required.
- Keep client components as small and leaf-level as possible.
- Write clean, readable, and maintainable code. Prefer clarity over cleverness.

## UI & Design Quality
- Aim for **impeccable UI**: consistent spacing, typography, alignment, and visual hierarchy.
- Use Tailwind CSS utilities thoughtfully. Avoid arbitrary values when possible.
- Prefer semantic HTML (`button`, `nav`, `main`, `section`, `article`, etc.).
- Make every interactive element accessible (proper labels, focus states, keyboard support, ARIA when needed).
- Maintain consistent border radius, shadows, and color usage across the app.
- Ensure good contrast and readability.
- Mobile-first responsive design is mandatory.

## Component Guidelines
- Create small, focused, reusable components.
- Colocate component-specific styles/logic when it makes sense.
- Extract repeated UI patterns into shared components.
- Use proper TypeScript types — avoid `any`.
- Prefer composition over prop drilling.

## Next.js Specific
- Use the App Router conventions correctly.
- Use `next/image` for all images.
- Use the Metadata API for SEO and social previews.
- Prefer Server Actions for form mutations when appropriate.
- Keep data fetching in Server Components whenever possible.

## Code Quality
- Write meaningful variable and function names.
- Add short comments only when the "why" is not obvious.
- Keep files reasonably small and focused.
- Follow existing project patterns before inventing new ones.

## Before writing code
1. Check the relevant docs in `node_modules/next/dist/docs/`
2. Look at existing components and patterns in the project
3. Prioritize clean UI, accessibility, and performance