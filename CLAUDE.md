# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tabitha Clinic is a full-stack React application for a healthcare clinic with e-commerce functionality. It features service booking, product sales with a global cart, and a WhatsApp contact integration. The application is built with Vite, React 19, TypeScript, and Express, using wouter for client-side routing and shadcn/ui components.

## Architecture

### Directory Structure

- **`client/`**: Frontend React application (Vite)
  - `client/src/pages/`: Route components (Home, ServiceDetail, ProductDetail, NotFound)
  - `client/src/components/`: Reusable UI components (shadcn/ui in `ui/` subdirectory)
  - `client/src/contexts/`: React Context providers (CartContext, ThemeContext)
  - `client/src/hooks/`: Custom React hooks (useMobile, usePersistFn, useComposition)
  - `client/src/lib/`: Utilities and data store
- **`server/`**: Express server for production serving
- **`shared/`**: Shared constants between client and server
- **`dist/`**: Build output
  - `dist/public/`: Frontend build (Vite output)
  - `dist/index.js`: Server bundle (esbuild output)

### Key Patterns

**Client-Side Routing**: Uses wouter (patched version at `patches/wouter@3.7.1.patch`)
- Routes: `/` (Home), `/services/:slug` (ServiceDetail), `/shop/:slug` (ProductDetail)
- All routes use SPA-style navigation

**Global Cart System**: CartContext provides cart state across all pages
- Product inventory is managed in `client/src/lib/store.ts`
- Cart persists in memory during session (no localStorage)
- Stock limits enforced on add/update operations

**Path Aliases**: TypeScript path mapping configured in tsconfig.json and vite.config.ts
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

**Manus Debug Collector**: Custom Vite plugin captures browser logs in development
- Logs written to `.manus-logs/` directory (browserConsole.log, networkRequests.log, sessionReplay.log)
- Auto-trimmed when files exceed 1MB
- Only active in development mode

**Static Assets**: Served from `client/public/` in development, `dist/public/` in production

## Development Commands

### Setup
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
# Starts Vite dev server on port 3000 (or next available port)
# Server is accessible on network (--host flag)
```

### Build
```bash
pnpm build
# 1. Builds client with Vite → dist/public/
# 2. Bundles server with esbuild → dist/index.js
```

### Production
```bash
pnpm start
# Runs dist/index.js with NODE_ENV=production
# Serves built client from dist/public/
```

### Type Checking
```bash
pnpm check
# Runs TypeScript compiler without emitting files
```

### Formatting
```bash
pnpm format
# Formats all files with Prettier
```

### Preview Production Build
```bash
pnpm preview
# Serves production build locally
```

## Environment Variables

- `NODE_ENV`: Set to "production" for production mode
- `PORT`: Server port (defaults to 3000)
- `VITE_OAUTH_PORTAL_URL`: OAuth portal base URL (used in login flow)
- `VITE_APP_ID`: Application ID for OAuth
- `BUILT_IN_FORGE_API_URL`: Forge API base URL (for storage proxy)
- `BUILT_IN_FORGE_API_KEY`: Forge API authentication key

## Important Notes

- **Package Manager**: This project uses pnpm (locked to version 10.4.1)
- **Patched Dependencies**: wouter@3.7.1 has custom patches applied (see `patches/` directory)
- **Node Version**: Uses ESM modules (type: "module" in package.json)
- **Server Static Serving**: Express server handles client-side routing by serving index.html for all routes
- **Tailwind CSS v4**: Using @tailwindcss/vite plugin (not PostCSS)
- **React 19**: Latest React with updated types
- **WhatsApp Integration**: Floating WhatsApp button contacts +233530387812
