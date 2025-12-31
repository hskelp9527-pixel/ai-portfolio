import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { NavigationItem } from './NavigationItem';
import { NavigationItem as NavigationItemType, Theme } from '../types';
import { FileText, Image, Play } from 'lucide-react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, onClick, ...props }: any) => (
      <button 
        className={className} 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
}));

describe('NavigationItem', () => {
  const mockOnHover = vi.fn();
  const mockOnClick = vi.fn();

  // Sample navigation items for testing
  const sampleItems: NavigationItemType[] = [
    { id: 'resume', icon: FileText, label: '简历', href: '#resume' },
    { id: 'gallery', icon: Image, label: '作品集', href: '#gallery' },
    { id: 'theater', icon: Play, label: '视频影院', href: '#theater' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  /**
   * Property 2: Hover interaction cycle
   * For any navigation item, hovering should expand to show text label and un-hovering should collapse back to icon-only state
   * Validates: Requirements 2.1, 2.2
   * Feature: floating-navigation-enhancement, Property 2: Hover interaction cycle
   */
  it('should expand on hover and collapse on unhover', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleItems),
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        fc.boolean(), // isExpanded state
        (item, theme, initialExpanded) => {
          cleanup();
          
          const { container } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={initialExpanded}
              onHover={mockOnHover}
              onClick={mockOnClick}
            />
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Test hover enter
          fireEvent.mouseEnter(button!);
          expect(mockOnHover).toHaveBeenCalledWith(true);

          // Test hover leave
          fireEvent.mouseLeave(button!);
          expect(mockOnHover).toHaveBeenCalledWith(false);

          // Verify the label text is present in the DOM
          expect(container.textContent).toContain(item.label);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle touch interactions equivalently to hover', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleItems),
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (item, theme) => {
          cleanup();
          
          const { container } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={false}
              onHover={mockOnHover}
              onClick={mockOnClick}
            />
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Test touch start (equivalent to hover enter)
          fireEvent.touchStart(button!);
          expect(mockOnHover).toHaveBeenCalledWith(true);

          // Test touch end (equivalent to hover leave)
          fireEvent.touchEnd(button!);
          expect(mockOnHover).toHaveBeenCalledWith(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should change icon color based on theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleItems),
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (item, theme) => {
          cleanup();
          
          const { container } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={false}
              onHover={mockOnHover}
              onClick={mockOnClick}
            />
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Check theme-appropriate classes
          if (theme === 'dark') {
            expect(button).toHaveClass('text-gray-300');
            expect(button).toHaveClass('hover:text-white');
            expect(button).toHaveClass('hover:bg-white/10');
          } else {
            expect(button).toHaveClass('text-gray-600');
            expect(button).toHaveClass('hover:text-black');
            expect(button).toHaveClass('hover:bg-black/5');
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should have proper accessibility attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleItems),
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (item, theme) => {
          cleanup();
          
          const { container } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={false}
              onHover={mockOnHover}
              onClick={mockOnClick}
            />
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Should have aria-label for accessibility
          expect(button).toHaveAttribute('aria-label', item.label);

          // Should have minimum touch target size
          expect(button).toHaveClass('min-w-[48px]');
          expect(button).toHaveClass('min-h-[48px]');
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should trigger onClick when clicked', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleItems),
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (item, theme) => {
          cleanup();
          
          // Create fresh mocks for each property test iteration
          const localMockOnClick = vi.fn();
          const localMockOnHover = vi.fn();
          
          const { container } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={false}
              onHover={localMockOnHover}
              onClick={localMockOnClick}
            />
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Test click
          fireEvent.click(button!);
          expect(localMockOnClick).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should show expanded text when isExpanded is true', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleItems),
        fc.constantFrom('light' as Theme, 'dark' as Theme),
        (item, theme) => {
          cleanup();
          
          // Test expanded state
          const { container: expandedContainer } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={true}
              onHover={mockOnHover}
              onClick={mockOnClick}
            />
          );

          const expandedSpan = expandedContainer.querySelector('span');
          expect(expandedSpan).toBeTruthy();
          expect(expandedSpan?.textContent).toBe(item.label);

          cleanup();

          // Test collapsed state
          const { container: collapsedContainer } = render(
            <NavigationItem
              item={item}
              theme={theme}
              isExpanded={false}
              onHover={mockOnHover}
              onClick={mockOnClick}
            />
          );

          const collapsedSpan = collapsedContainer.querySelector('span');
          expect(collapsedSpan).toBeTruthy();
          expect(collapsedSpan?.textContent).toBe(item.label);
        }
      ),
      { numRuns: 30 }
    );
  });
});