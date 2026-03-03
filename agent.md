Production AI Development Contract
React E-commerce Platform (Shopify + Supabase + Stripe/Paystack)

1. Project Identity

This is a production-ready, scalable React e-commerce platform that:

Clones and merges two existing e-commerce websites

Uses Shopify for catalog/products

Uses Supabase for backend (auth, DB, storage)

Uses Stripe and Paystack for payment processing

Is built and maintained by a solo developer

Requires strict documentation across the entire codebase

The agent must behave like a senior production engineer.

No shortcuts. No temporary logic. No "we'll fix later".

2. Mandatory Folder Structure

The project must follow this structure unless explicitly changed:

src/
│
├── app/ # App setup, routing, providers
├── components/ # Reusable UI components
│ ├── ui/ # Buttons, inputs, modals, base UI
│ └── ecommerce/ # ProductCard, CartItem, etc.
│
├── features/ # Feature-based modules
│ ├── auth/
│ ├── cart/
│ ├── checkout/
│ ├── products/
│ └── orders/
│
├── hooks/ # Reusable custom hooks
├── context/ # React context providers
├── services/ # API abstraction layer
│ ├── shopify/
│ ├── supabase/
│ ├── stripe/
│ └── paystack/
│
├── utils/ # Pure helper functions
├── types/ # Type definitions (if using TS)
├── constants/ # App-wide constants
└── docs/ # Optional in-project documentation

Rules:

UI must never directly call APIs.

API calls must only exist in /services.

Business logic belongs in /features.

Shared logic goes in /hooks.

3. React Development Rules

Functional components only.

Hooks must follow rules of hooks.

Components must remain small and focused.

No business logic inside JSX.

No inline heavy logic in render.

Avoid prop drilling beyond two levels.

State management must be predictable and documented.

4. Cloning & Merging the Two Source Websites

When implementing features inspired by the two reference stores:

Extract behavior patterns.

Improve structure.

Standardize naming.

Normalize UX inconsistencies.

Create a unified design system.

Never duplicate two slightly different implementations of the same feature.

If both sites implement something differently:

Choose the cleaner solution

Or design a superior unified abstraction

5. Service Layer Architecture (Strict Boundary)

All external systems must be abstracted.

Shopify

Product fetching

Collections

Search

Variants

All logic must live inside:

services/shopify/

Components must call:

productsService.getProducts()

Never call fetch directly in UI.

Supabase

Handles:

Authentication

Orders

User profiles

Database reads/writes

All queries must:

Be centralized

Handle errors

Validate input

Never expose raw database structure inside UI.

Stripe & Paystack

Payment logic must:

Never expose secret keys

Use environment variables

Validate server responses

Handle failed transactions

Confirm transaction success before order completion

No fake payment success flows.

6. Documentation Standards (Mandatory)

Every file must begin with:

/\*\*

- File: ProductCard.jsx
- Purpose: Displays a single product preview inside product grid.
- Dependencies: React, priceFormatter, AddToCartButton
- Notes: Stateless UI component.
  \*/

Every function must include:

/\*\*

- Creates a Stripe payment intent.
-
- @param {number} amount - Amount in smallest currency unit
- @param {string} currency - ISO currency code
- @returns {Promise<PaymentIntent>}
-
- Side Effects:
- - Calls backend endpoint
- - May throw network errors
-
- Edge Cases:
- - Invalid amount
- - Network failure
    \*/

Complex logic must explain:

Why approach was chosen

Performance implications

Security considerations

No obvious comments like:

// increments count by 1 7. Naming Conventions
Components

PascalCase
ProductCard.jsx

Hooks

camelCase prefixed with use
useCart.js

Services

camelCase + Service
productsService.js

Variables

Descriptive, not abbreviated
Bad: p, res, d
Good: productData, apiResponse

8. State Management Rules

Local UI state stays inside component.

Shared state goes in context or feature module.

Cart state must be centralized.

Auth state must be globally accessible.

Avoid unnecessary global state.

No hidden state side effects.

9. Performance Rules

Memoize expensive calculations.

Use lazy loading for heavy routes.

Avoid unnecessary API calls.

Cache Shopify results where appropriate.

Avoid rendering full product lists without pagination or virtualization.

Never sacrifice readability for micro-optimizations.

10. Security Checklist

Before completing any feature:

No secrets hardcoded.

Environment variables used correctly.

No console logs left in production.

Inputs validated.

Payment flows secure.

Admin-only features protected.

Supabase policies respected.

Security is mandatory.

11. Error Handling Contract

Every async call must:

Use try/catch

Return structured error objects

Provide user feedback

Avoid silent failure

Never swallow errors.

12. Git & Commit Standards

Commit format:

feat: add product filtering logic
fix: resolve cart duplication bug
refactor: extract payment service layer
docs: add checkout flow documentation

Rules:

No massive unrelated commits.

One logical change per commit.

Document architectural decisions in commit messages.

13. Production Enforcement

Before marking any feature complete:

Code documented

No unused imports

No commented-out code

No placeholder UI

No mock data left

No debugging logs

All API boundaries respected

If any of the above fails → feature is incomplete.

14. Agent Behavior Rules

If unclear about:

Database structure

Payment flow logic

Business rules

Shopify schema

The agent must ask for clarification.

Never invent production business logic.

15. Absolute Non-Negotiables

Code must be scalable.

Code must be secure.

Code must be documented.

Architecture must remain clean.

No shortcuts.

No temporary hacks.

No silent assumptions.

This is production software.
