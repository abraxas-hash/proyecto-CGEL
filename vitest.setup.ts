import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    replace: vi.fn(),
  },
  writable: true,
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => {
  return {
    default: ({ children, href }: any) => {
      return React.createElement('a', { href }, children);
    }
  }
});

const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  then: (resolve: any) => resolve({ data: [], error: null }),
};

// Mock de Supabase Client para evitar llamadas reales en unit tests
vi.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      from: vi.fn(() => mockQueryBuilder),
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({ data: { path: 'test/path.jpg' }, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://mock.url/path.jpg' } })
        }))
      }
    }
  };
});

vi.mock('@/lib/storageHelper', () => ({
  uploadEvidence: vi.fn().mockResolvedValue('http://mock.url/path.jpg')
}));
