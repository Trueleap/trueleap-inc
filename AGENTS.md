# TrueLeap Site Development Principles

## Core Philosophy

This project embodies **Premium Fluidity** - the intersection of editorial elegance and technical precision. Every decision prioritizes user trust, accessibility, and performance.

## Design Principles

### 1. Trust Through Craft
B2G audiences judge credibility through visual refinement. Every pixel, animation, and interaction must feel deliberate. No generic patterns.

### 2. Performance as Feature
Sub-100KB initial JS. Defer everything non-critical. Perceived speed > actual speed. First contentful paint under 1.5s.

### 3. Accessibility First
WCAG AA minimum. Color contrast, keyboard navigation, screen reader support are requirements, not afterthoughts. Mix-blend-difference must maintain 4.5:1 contrast.

### 4. Motion with Purpose
Animation guides attention, never distracts. Use the signature `cubic-bezier(0.22, 1, 0.36, 1)` easing consistently. Respect reduced-motion preferences.

### 5. Content Hierarchy
Monospace for metadata. Serif for impact. Sans-serif for reading. Typography signals information architecture.

## Technical Principles

### 1. Islands Architecture
React components are islands of interactivity in a sea of static HTML. Minimize hydration surface.

### 2. Progressive Enhancement
Core content works without JS. Interactivity enhances, never gates. The globe is a delight, not a requirement.

### 3. Internationalization Ready
All user-facing strings externalized. Route structure supports `/[lang]/` prefix. RTL consideration in layouts.

### 4. CMS-Driven Content
Content schemas define structure. Payload CMS (at `cms.trueleapinc.com`) stores content in Cloudflare D1 (SQLite) with media in R2. The same Astro codebase is deployed twice:
- **Customer site** (`dev.trueleapinc.com`): prerendered, fetches published content at build time
- **Preview site** (`dev-preview.trueleapinc.com`): SSR with `DRAFT_MODE=true`, fetches draft content on every request

Publishing triggers a GitHub Actions rebuild of both sites via `repository_dispatch` webhook. The CMS live preview iframe points to the preview site for instant draft feedback.

### 5. Component Composition
Prefer composition over configuration. Components should be combinable, not configurable with boolean props.

## Testing Principles

### 1. Test User Journeys
Focus on critical paths: navigation, form submissions, content discovery. E2E tests for key flows.

### 2. Component Isolation
Unit test complex logic in isolation. Visual regression for design system components.

### 3. Accessibility Testing
Automated a11y audits in CI. Manual screen reader testing for interactive components.

### 4. Performance Budgets
Lighthouse CI with thresholds. Bundle size checks on PR. Core Web Vitals monitoring.

## Code Standards

### File Organization
- `src/components/` - Reusable UI primitives
- `src/layouts/` - Page-level structural components
- `src/pages/` - Route definitions only, minimal logic
- `trueleap-cms/` - Payload CMS (separate Next.js app deployed as CF Worker)
- `src/lib/` - Utilities, hooks, helpers
- `src/styles/` - Global styles, Tailwind config

### Naming
- Components: PascalCase (`WaveTransition.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- CSS classes: Tailwind utilities, custom classes use BEM for complex components

### Performance Rules
- No barrel exports
- Dynamic import for components >20KB
- Preload on hover for route changes
- Images: WebP with fallbacks, explicit dimensions

## Accessibility Checklist
- [ ] Focus indicators visible
- [ ] Skip links present
- [ ] Headings hierarchical
- [ ] ARIA labels on interactive elements
- [ ] Color not sole information carrier
- [ ] Reduced motion respected

## CSS Standards

**Follow [CSS_RULES.md](./CSS_RULES.md) for all defensive CSS practices.**

Key rules to always apply:

### Layout
- Always use `flex-wrap: wrap` on flex containers (unless single-line is intentional)
- Set `min-width: 0` on flex/grid items containing text or images
- Use `gap` instead of `justify-content: space-between` for consistent spacing
- Prefer `auto-fill` over `auto-fit` in CSS Grid for consistent sizing
- Wrap fixed grid values in media queries

### Images
- Always set `max-width: 100%` and `object-fit: cover` on images
- Add fallback `background-color` for text-over-image sections
- Use `background-repeat: no-repeat` on background images

### Sizing
- Use `min-height` instead of fixed `height` for flexible containers
- Set `min-width: 90px` on buttons for touch targets
- Use `overflow: auto` instead of `scroll` for conditional scrollbars

### Responsive
- Use `@media (hover: hover)` for hover-only effects (prevents touch issues)
- Set `font-size: 16px` minimum on inputs (prevents iOS zoom)
- Test layouts at various viewport heights, not just widths

### Variables & Fallbacks
- Always provide fallback values: `var(--color, #fallback)`
- Never group vendor-prefixed selectors in the same rule

### Scrolling
- Use `overscroll-behavior-y: contain` on modals/nested scrollables
- Use `scrollbar-gutter: stable` to prevent layout shift

