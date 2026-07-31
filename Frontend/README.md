# Home Interior — Interior Design Catalog

A lightweight React + TypeScript app (Vite) that demonstrates an interior design/catalog UI with material, color, and furniture views plus a simple cart.

**Tech stack:** React, TypeScript, Vite, Tailwind CSS

**Highlights:**
- Clean, responsive layout for desktop and mobile
- Material and furniture catalog views
- Client-side cart with localStorage persistence
- Reusable UI components in `src/components`

## Quick Start

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Layout

- `src/main.tsx` — App entry
- `src/App.tsx` — App shell and routing/view switching
- `src/components/` — UI components and view implementations
- `src/data.ts` — sample data used by the demo
- `src/index.css` — global styles and theme tokens

## Notes

- Cart state persists in `localStorage` across reloads.
- The UI is component-driven to make experimenting with themes and layouts simple.

## Contributing

Feel free to open issues or PRs. For local development, use the commands above. Keep changes small and focused.

---
Updated README to improve clarity and developer setup instructions.
