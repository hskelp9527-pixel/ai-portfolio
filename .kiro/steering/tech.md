---
inclusion: always
---

# Technology Stack & Build System

## Core Technologies

### Frontend Framework
- **React 19.2.3** with TypeScript
- **Vite 6.2.0** as build tool and dev server
- **TypeScript 5.8.2** for type safety

### UI & Animation Libraries
- **Framer Motion 12.23.26** - Advanced animations, 3D parallax effects, and smooth transitions
- **Lucide React 0.562.0** - Modern icon system
- **Tailwind CSS** (via CDN) - Utility-first styling with custom Apple-inspired design system

### Development Tools
- **@vitejs/plugin-react** - React integration for Vite
- **@types/node** - Node.js type definitions

## Build System & Commands

### Development
```bash
npm run dev          # Start development server on port 3000
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Server Configuration
- **Dev Server**: Runs on port 3000, accessible on all network interfaces (0.0.0.0)
- **Environment Variables**: Supports GEMINI_API_KEY via .env.local

## Architecture Patterns

### Component Structure
- **Functional Components**: All components use React functional components with hooks
- **TypeScript Interfaces**: Strict typing with dedicated types.ts file
- **Theme System**: Centralized theme management with 'light' | 'dark' union types

### Performance Optimizations
- **Lazy Loading**: Custom useLazyLoad hook with Intersection Observer API
- **Image Optimization**: Thumbnail → full resolution loading strategy
- **Code Splitting**: Vite's automatic code splitting
- **Asset Management**: Organized media structure with compressed/original/thumbnail variants

### State Management
- **React Hooks**: useState, useEffect, useRef for local state
- **No External State Library**: Simple prop drilling and context when needed

## File Organization Conventions
- **Absolute Imports**: Use `@/` alias for root-level imports
- **Component Co-location**: Related components in same directory
- **Type Definitions**: Centralized in types.ts
- **Data Layer**: Static data in data.ts with proper TypeScript interfaces