import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    replace: vi.fn(),
  },
  writable: true,
});
