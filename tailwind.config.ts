import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{tsx,ts}',
    './hooks/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
    './three/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          base: 'oklch(0.12 0.02 250)',
          mid: 'oklch(0.16 0.025 250)',
          deep: 'oklch(0.08 0.015 250)',
          black: 'oklch(0.04 0.01 250)',
        },
        glass: {
          light: 'oklch(0.20 0.02 250 / 0.6)',
          mid: 'oklch(0.25 0.025 250 / 0.5)',
          dark: 'oklch(0.10 0.015 250 / 0.7)',
          border: 'oklch(0.30 0.02 250 / 0.3)',
          borderBright: 'oklch(0.40 0.025 250 / 0.5)',
        },
        fg: {
          primary: 'oklch(0.95 0.01 250)',
          secondary: 'oklch(0.70 0.02 250)',
          tertiary: 'oklch(0.55 0.02 250)',
          faint: 'oklch(0.40 0.02 250)',
        },
        signature: {
          teal: 'oklch(0.78 0.18 165)',
          tealDim: 'oklch(0.65 0.15 165)',
          amber: 'oklch(0.75 0.20 50)',
          amberDim: 'oklch(0.65 0.17 50)',
        },
      },
      fontFamily: {
        sans: ['AlibabaPuHuiTi', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Geist', 'AlibabaPuHuiTi', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      transitionTimingFunction: {
        neural: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'neural-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'neural-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        state: '300ms',
        atmosphere: '1200ms',
        zoom: '600ms',
        micro: '150ms',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'typing-cursor': 'typing-cursor 1s steps(2) infinite',
        'fade-in-up': 'fade-in-up 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'typing-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        neural: '30px',
        deep: '50px',
      },
      boxShadow: {
        'glow-teal': '0 0 40px oklch(0.78 0.18 165 / 0.4)',
        'glow-amber': '0 0 40px oklch(0.75 0.20 50 / 0.4)',
        'glow-teal-strong': '0 0 60px oklch(0.78 0.18 165 / 0.6)',
        'glass': '0 8px 32px oklch(0.04 0.01 250 / 0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config;
