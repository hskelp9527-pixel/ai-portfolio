---
inclusion: always
---

# Project Structure & Organization

## Root Level Files
```
├── App.tsx              # Main application component with theme system
├── index.tsx            # React app entry point
├── index.html           # HTML template with Tailwind CDN and fonts
├── data.ts              # Static data (personal info, projects, media)
├── types.ts             # TypeScript type definitions
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── metadata.json        # Project metadata
```

## Directory Structure

### `/components/` - React Components
- **Gallery.tsx** - Main media gallery with grid/carousel modes
- **Hero.tsx** - Landing section with animated typography
- **IdentitySection.tsx** - Personal introduction section
- **ImageModal.tsx** - Full-screen image viewer with navigation
- **LazyImage.tsx** - Optimized image component with lazy loading
- **Navbar.tsx** - Navigation with theme toggle and export
- **ParallaxCard.tsx** - 3D parallax wrapper component
- **Resume.tsx** - Professional experience display
- **Theater.tsx** - Video gallery section

### `/hooks/` - Custom React Hooks
- **useLazyLoad.ts** - Intersection Observer based lazy loading

### `/utils/` - Utility Functions
- **gestureUtils.ts** - Touch and gesture handling utilities

### `/public/` - Static Assets
```
public/
├── images/
│   ├── avatar/          # Profile pictures
│   ├── backgrounds/     # Background images
│   └── gallery/
│       ├── compressed/  # Optimized images for display
│       ├── original/    # High-resolution source files
│       └── thumbnails/  # Small preview images
└── videos/
    └── gallery/
        ├── compressed/  # Optimized videos for web
        ├── original/    # Source video files
        └── thumbnails/  # Video preview images (JPG)
```

## Naming Conventions

### Components
- **PascalCase** for component files and names
- **Descriptive names** indicating purpose (LazyImage, ImageModal)
- **Props interfaces** named `ComponentNameProps`

### Files & Directories
- **camelCase** for utility files and hooks
- **kebab-case** for asset filenames
- **Descriptive directory names** (gallery, compressed, thumbnails)

### Data Structure
- **SCREAMING_SNAKE_CASE** for exported constants (PERSONAL_INFO, IMAGES)
- **Organized by type** (experiences, projects, skills, media)

## Component Architecture Patterns

### Theme Integration
- All components accept `theme: Theme` prop
- Conditional styling based on theme state
- Smooth transitions with duration-1000 classes

### Media Management
- **Three-tier system**: thumbnail → compressed → original
- **Lazy loading** with intersection observer
- **Error handling** with retry mechanisms
- **Progressive enhancement** (thumbnail first, then full resolution)

### Animation Patterns
- **Framer Motion** for all animations
- **Consistent easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Staggered animations** for list items
- **3D transforms** with preserve-3d

## Configuration Files

### TypeScript Config
- **ES2022 target** with modern features
- **Path aliases**: `@/*` maps to root directory
- **Strict type checking** enabled
- **React JSX** transform

### Vite Config
- **React plugin** for JSX support
- **Environment variable** injection for API keys
- **Path resolution** with @ alias
- **Development server** on port 3000