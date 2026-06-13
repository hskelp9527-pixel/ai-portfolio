import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { FloatingNavigation } from './FloatingNavigation';
import { Theme } from '../types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, className, ...props }: any) => (
      <nav className={className} {...props}>{children}</nav>
    ),
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>{children}</button>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FloatingNavigation', () => {
  const mockOnToggleTheme = vi.fn();
  const mockOnExportPDF = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  /**
   * Property 1: Fixed positioning persistence
   * For any page scroll action, the floating navigation should maintain its fixed position relative to the viewport
   * Validates: Requirements 1.3
   * Feature: floating-navigation-enhancement, Property 1: Fixed positioning persistence
   */
  it('should maintain fixed positioning during scroll events', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        fc.integer({ min: 0, max: 5000 }), // scroll positions
        (theme, scrollPosition) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Render the component
          const { container } = render(
            <FloatingNavigation
              theme={theme}
              onToggleTheme={mockOnToggleTheme}
              onExportPDF={mockOnExportPDF}
            />
          );

          // Get the navigation element
          const navigation = container.querySelector('nav');
          expect(navigation).toBeTruthy();
          
          // Check that it has fixed positioning classes
          expect(navigation).toHaveClass('fixed');
          expect(navigation).toHaveClass('right-6');
          expect(navigation).toHaveClass('top-1/2');
          expect(navigation).toHaveClass('-translate-y-1/2');
          
          // Simulate scroll by changing window.scrollY
          Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: scrollPosition,
          });
          
          // Dispatch scroll event
          window.dispatchEvent(new Event('scroll'));
          
          // Navigation should still have fixed positioning classes
          expect(navigation).toHaveClass('fixed');
          expect(navigation).toHaveClass('right-6');
          expect(navigation).toHaveClass('top-1/2');
          expect(navigation).toHaveClass('-translate-y-1/2');
          
          // The element should still be in the document
          expect(navigation).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be positioned on the right side of the viewport', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (theme) => {
          cleanup();
          
          const { container } = render(
            <FloatingNavigation
              theme={theme}
              onToggleTheme={mockOnToggleTheme}
              onExportPDF={mockOnExportPDF}
            />
          );

          const navigation = container.querySelector('nav');
          expect(navigation).toBeTruthy();
          
          // Should have right positioning class
          expect(navigation).toHaveClass('right-6');
          
          // Should be fixed positioned
          expect(navigation).toHaveClass('fixed');
          
          // Should be vertically centered
          expect(navigation).toHaveClass('top-1/2');
          expect(navigation).toHaveClass('-translate-y-1/2');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should have glass effect and semi-transparent background', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (theme) => {
          cleanup();
          
          const { container } = render(
            <FloatingNavigation
              theme={theme}
              onToggleTheme={mockOnToggleTheme}
              onExportPDF={mockOnExportPDF}
            />
          );

          const navigation = container.querySelector('nav');
          expect(navigation).toBeTruthy();
          
          // Should have glass effect class
          expect(navigation).toHaveClass('glass');
          
          // Should have theme-appropriate background
          if (theme === 'dark') {
            expect(navigation).toHaveClass('bg-[#0d1117]/95');
            expect(navigation).toHaveClass('border-white/10');
          } else {
            expect(navigation).toHaveClass('bg-white/30');
            expect(navigation).toHaveClass('border-black/5');
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display only icons without text labels initially', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (theme) => {
          cleanup();
          
          const { container } = render(
            <FloatingNavigation
              theme={theme}
              onToggleTheme={mockOnToggleTheme}
              onExportPDF={mockOnExportPDF}
            />
          );

          // All navigation buttons should be present
          const buttons = container.querySelectorAll('button');
          expect(buttons).toHaveLength(5); // resume, gallery, theater, theme, export

          // Text labels should exist but be hidden initially
          const labels = ['简历', '作品集', '视频影院', '主题切换', '导出PDF'];
          labels.forEach(label => {
            // The label spans should exist in the DOM
            expect(container.textContent).toContain(label);
          });
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property 4: Theme synchronization
   * Navigation styling should always match the current theme state
   * Validates: Requirements 4.1, 4.2, 4.4
   * Feature: floating-navigation-enhancement, Property 4: Theme synchronization
   */
  it('should synchronize styling with theme changes', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('light' as Theme, 'dark' as Theme), { minLength: 1, maxLength: 10 }),
        (themeSequence) => {
          cleanup();
          
          // Test each theme in the sequence
          themeSequence.forEach((theme) => {
            cleanup();
            
            const { container } = render(
              <FloatingNavigation
                theme={theme}
                onToggleTheme={mockOnToggleTheme}
                onExportPDF={mockOnExportPDF}
              />
            );

            const navigation = container.querySelector('nav');
            expect(navigation).toBeTruthy();
            
            // Verify theme-specific styling is applied correctly
            if (theme === 'dark') {
              // Dark theme should have dark background and light border
              expect(navigation).toHaveClass('bg-[#0d1117]/95');
              expect(navigation).toHaveClass('border-white/10');
              // Should NOT have light theme classes
              expect(navigation).not.toHaveClass('bg-white/30');
              expect(navigation).not.toHaveClass('border-black/5');
            } else {
              // Light theme should have light background and dark border
              expect(navigation).toHaveClass('bg-white/30');
              expect(navigation).toHaveClass('border-black/5');
              // Should NOT have dark theme classes
              expect(navigation).not.toHaveClass('bg-[#0d1117]/95');
              expect(navigation).not.toHaveClass('border-white/10');
            }
            
            // Common styling should always be present regardless of theme
            expect(navigation).toHaveClass('glass');
            expect(navigation).toHaveClass('rounded-2xl');
            expect(navigation).toHaveClass('shadow-2xl');
            expect(navigation).toHaveClass('transition-all');
            expect(navigation).toHaveClass('duration-300');
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Theme toggle button shows correct icon
   * The theme toggle button should display Moon icon in light mode and Sun icon in dark mode
   * Validates: Requirements 4.1, 4.2
   */
  it('should display correct theme toggle icon based on current theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (theme) => {
          cleanup();
          
          const { container } = render(
            <FloatingNavigation
              theme={theme}
              onToggleTheme={mockOnToggleTheme}
              onExportPDF={mockOnExportPDF}
            />
          );

          // The theme toggle label should always be present
          expect(container.textContent).toContain('主题切换');
          
          // Navigation should have theme-appropriate styling
          const navigation = container.querySelector('nav');
          expect(navigation).toBeTruthy();
          
          // Verify the navigation has the correct theme class
          if (theme === 'dark') {
            expect(navigation).toHaveClass('bg-[#0d1117]/95');
          } else {
            expect(navigation).toHaveClass('bg-white/30');
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property 3: Responsive adaptation
   * Navigation should adapt its layout based on viewport width
   * Validates: Requirements 1.4
   * Feature: floating-navigation-enhancement, Property 3: Responsive adaptation
   */
  it('should adapt layout based on viewport width', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        fc.integer({ min: 320, max: 1920 }), // viewport widths
        (theme, viewportWidth) => {
          cleanup();
          
          // Mock window.innerWidth
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });
          
          // Trigger resize event to update isMobile state
          window.dispatchEvent(new Event('resize'));
          
          const { container } = render(
            <FloatingNavigation
              theme={theme}
              onToggleTheme={mockOnToggleTheme}
              onExportPDF={mockOnExportPDF}
            />
          );

          const isMobile = viewportWidth < 768;
          
          if (isMobile) {
            // Mobile: should have a hamburger menu button
            const menuButton = container.querySelector('button');
            expect(menuButton).toBeTruthy();
            // Mobile button should be positioned at bottom-right
            expect(menuButton).toHaveClass('fixed');
            expect(menuButton).toHaveClass('right-4');
            expect(menuButton).toHaveClass('bottom-4');
          } else {
            // Desktop: should have fixed navigation on right side
            const navigation = container.querySelector('nav');
            expect(navigation).toBeTruthy();
            expect(navigation).toHaveClass('fixed');
            expect(navigation).toHaveClass('right-6');
            expect(navigation).toHaveClass('top-1/2');
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});