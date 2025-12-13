import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextRouter } from 'next/router';
import { NavigationProvider } from '../../src/contexts/NavigationContext';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Create a mock router function
const createMockRouter = (router: Partial<NextRouter> = {}): NextRouter => ({
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  back: jest.fn(),
  forward: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: jest.fn(),
  push: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
  ...router,
});

interface AllTheProvidersProps {
  children: React.ReactNode;
  router?: Partial<NextRouter>;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ 
  children, 
  router = {} 
}) => {
  // Set up the mock router before rendering
  const { useRouter } = require('next/router');
  const mockRouter = createMockRouter(router);
  useRouter.mockReturnValue(mockRouter);
  
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    router?: Partial<NextRouter>;
  }
) => {
  const { router, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders router={router}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

export * from '@testing-library/react';
export { customRender as render };