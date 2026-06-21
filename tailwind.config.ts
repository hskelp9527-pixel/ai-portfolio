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
          base: 'oklch(var(--color-ink-base) / <alpha-value>)',
          mid: 'oklch(var(--color-ink-mid) / <alpha-value>)',
          deep: 'oklch(var(--color-ink-deep) / <alpha-value>)',
          black: 'oklch(var(--color-ink-black) / <alpha-value>)',
        },
        glass: {
          light: 'oklch(var(--color-glass-light) / <alpha-value>)',
          mid: 'oklch(var(--color-glass-mid) / <alpha-value>)',
          dark: 'oklch(var(--color-glass-dark) / <alpha-value>)',
          border: 'oklch(var(--color-glass-border) / <alpha-value>)',
          borderBright: 'oklch(var(--color-glass-border-bright) / <alpha-value>)',
        },
        fg: {
          primary: 'oklch(var(--color-fg-primary) / <alpha-value>)',
          secondary: 'oklch(var(--color-fg-secondary) / <alpha-value>)',
          tertiary: 'oklch(var(--color-fg-tertiary) / <alpha-value>)',
          faint: 'oklch(var(--color-fg-faint) / <alpha-value>)',
        },
        signature: {
          teal: 'oklch(var(--color-signature-teal) / <alpha-value>)',
          tealDim: 'oklch(var(--color-signature-teal-dim) / <alpha-value>)',
          amber: 'oklch(var(--color-signature-amber) / <alpha-value>)',
          amberDim: 'oklch(var(--color-signature-amber-dim) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'PingFang SC', 'Microsoft YaHei', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Geist', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
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
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
      backdropBlur: {
        neural: '30px',
        deep: '50px',
      },
      boxShadow: {
        'glow-teal': '0 0 40px oklch(var(--color-signature-teal) / 0.4)',
        'glow-amber': '0 0 40px oklch(var(--color-signature-amber) / 0.4)',
        'glow-teal-strong': '0 0 60px oklch(var(--color-signature-teal) / 0.6)',
        'glass': '0 8px 32px oklch(var(--color-ink-black) / 0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config;
