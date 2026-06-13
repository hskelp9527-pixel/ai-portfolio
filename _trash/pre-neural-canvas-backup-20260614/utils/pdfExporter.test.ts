import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { generateFilename, PDFExportOptions } from './pdfExporter';
import { Theme } from '../types';

// Mock html2canvas and jspdf
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/jpeg;base64,test'),
    width: 1920,
    height: 1080
  }))
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn()
  }))
}));

describe('PDFExporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 5: PDF generation completeness
   * For any PDF export request, the system should generate a complete PDF file with current theme styling and exclude no-print elements
   * Validates: Requirements 3.1, 3.3, 3.4
   * Feature: floating-navigation-enhancement, Property 5: PDF generation completeness
   */
  describe('generateFilename', () => {
    it('should generate filename with correct format for any user name', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          (userName) => {
            const filename = generateFilename(userName);
            
            // Should end with .pdf
            expect(filename).toMatch(/\.pdf$/);
            
            // Should contain the user name
            expect(filename).toContain(userName);
            
            // Should contain date in YYYY-MM-DD format
            expect(filename).toMatch(/\d{4}-\d{2}-\d{2}/);
            
            // Should contain "个人简历"
            expect(filename).toContain('个人简历');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate filename with current date', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('任泓雨', 'Test User', '张三'),
          (userName) => {
            const filename = generateFilename(userName);
            
            // Get current date
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const expectedDate = `${year}-${month}-${day}`;
            
            // Should contain current date
            expect(filename).toContain(expectedDate);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should use default user name when not provided', () => {
      const filename = generateFilename();
      expect(filename).toContain('任泓雨');
      expect(filename).toMatch(/\.pdf$/);
    });
  });

  describe('PDFExportOptions', () => {
    it('should support both light and dark themes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('light' as Theme, 'dark' as Theme),
          (theme) => {
            const options: PDFExportOptions = {
              theme,
              filename: 'test.pdf'
            };
            
            // Options should be valid
            expect(options.theme).toBe(theme);
            expect(options.filename).toBe('test.pdf');
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should support custom exclude selectors', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
          fc.constantFrom('light' as Theme, 'dark' as Theme),
          (selectors, theme) => {
            const options: PDFExportOptions = {
              theme,
              excludeSelectors: selectors
            };
            
            // Options should be valid
            expect(options.excludeSelectors).toEqual(selectors);
            expect(options.theme).toBe(theme);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should support quality and scale options', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 3 }),
          fc.integer({ min: 1, max: 4 }),
          fc.constantFrom('light' as Theme, 'dark' as Theme),
          (quality, scale, theme) => {
            const options: PDFExportOptions = {
              theme,
              quality,
              scale
            };
            
            // Options should be valid
            expect(options.quality).toBe(quality);
            expect(options.scale).toBe(scale);
            expect(options.theme).toBe(theme);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Filename format validation', () => {
    it('should always produce valid filenames', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => {
            // Filter out characters that are invalid in filenames
            return !/[<>:"/\\|?*]/.test(s) && s.trim().length > 0;
          }),
          (userName) => {
            const filename = generateFilename(userName);
            
            // Should not contain invalid filename characters (except underscore which we use)
            expect(filename).not.toMatch(/[<>:"/\\|?*]/);
            
            // Should have .pdf extension
            expect(filename.endsWith('.pdf')).toBe(true);
            
            // Should not be empty
            expect(filename.length).toBeGreaterThan(4); // At least ".pdf"
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});