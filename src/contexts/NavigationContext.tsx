import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

interface NavigationState {
  currentPath: string;
  isNavigating: boolean;
  previousPath: string | null;
  urlParameters: Record<string, string | string[]>;
  navigationError: string | null;
  retryCount: number;
  lastFailedUrl: string | null;
}

interface NavigationContextType {
  navigationState: NavigationState;
  setNavigating: (isNavigating: boolean) => void;
  updateUrlParameters: (params: Record<string, string | string[]>) => void;
  clearNavigationError: () => void;
  retryNavigation: () => Promise<boolean>;
  safeNavigate: (url: string) => Promise<boolean>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const router = useRouter();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPath: '/',
    isNavigating: false,
    previousPath: null,
    urlParameters: {},
    navigationError: null,
    retryCount: 0,
    lastFailedUrl: null,
  });

  const setNavigating = useCallback((isNavigating: boolean) => {
    setNavigationState(prev => ({
      ...prev,
      isNavigating,
      navigationError: isNavigating ? null : prev.navigationError, // Clear error when starting new navigation
    }));
  }, []);

  const updateUrlParameters = useCallback((params: Record<string, string | string[]>) => {
    setNavigationState(prev => ({
      ...prev,
      urlParameters: { ...prev.urlParameters, ...params },
    }));
  }, []);

  const clearNavigationError = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      navigationError: null,
      retryCount: 0,
      lastFailedUrl: null,
    }));
  }, []);

  const retryNavigation = useCallback(async (): Promise<boolean> => {
    const { lastFailedUrl, retryCount } = navigationState;
    
    if (!lastFailedUrl || retryCount >= 3) {
      return false;
    }

    try {
      setNavigationState(prev => ({
        ...prev,
        isNavigating: true,
        navigationError: null,
        retryCount: prev.retryCount + 1,
      }));

      await router.push(lastFailedUrl);
      return true;
    } catch (error) {
      console.error('Navigation retry failed:', error);
      setNavigationState(prev => ({
        ...prev,
        isNavigating: false,
        navigationError: `Retry failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }));
      return false;
    }
  }, [navigationState, router]);

  const safeNavigate = useCallback(async (url: string): Promise<boolean> => {
    try {
      // Validate URL before navigation
      const urlObj = new URL(url, window.location.origin);
      if (urlObj.origin !== window.location.origin) {
        throw new Error('External navigation not allowed');
      }

      setNavigationState(prev => ({
        ...prev,
        isNavigating: true,
        navigationError: null,
      }));

      await router.push(url);
      return true;
    } catch (error) {
      console.error('Safe navigation failed:', error);
      setNavigationState(prev => ({
        ...prev,
        isNavigating: false,
        navigationError: `Navigation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        lastFailedUrl: url,
        retryCount: 0,
      }));
      return false;
    }
  }, [router]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setNavigationState(prev => ({
        ...prev,
        isNavigating: true,
        previousPath: prev.currentPath,
        navigationError: null, // Clear any previous errors
      }));
    };

    const handleRouteChangeComplete = (url: string) => {
      // Parse URL parameters from the completed route
      const urlObj = new URL(url, window.location.origin);
      const params: Record<string, string | string[]> = {};
      
      urlObj.searchParams.forEach((value, key) => {
        if (params[key]) {
          // Handle multiple values for the same parameter
          if (Array.isArray(params[key])) {
            (params[key] as string[]).push(value);
          } else {
            params[key] = [params[key] as string, value];
          }
        } else {
          params[key] = value;
        }
      });

      setNavigationState(prev => ({
        currentPath: url,
        isNavigating: false,
        previousPath: prev.previousPath,
        urlParameters: params,
        navigationError: null,
        retryCount: 0, // Reset retry count on successful navigation
        lastFailedUrl: null, // Clear failed URL on success
      }));
    };

    const handleRouteChangeError = (err: Error, url: string) => {
      console.error('Navigation error:', err, 'URL:', url);
      
      // Determine error type and provide appropriate message
      let errorMessage = 'Navigation failed';
      if (err.message.includes('abort') || err.message.includes('Cancel rendering')) {
        errorMessage = 'Navigation was interrupted. This may be due to a slow connection or conflicting navigation requests.';
      } else if (err.message.includes('404') || err.message.includes('not found')) {
        errorMessage = 'The requested page could not be found.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Navigation timed out. Please check your connection and try again.';
      } else if (err.message.includes('component')) {
        errorMessage = 'Failed to load page components. This may be a temporary issue.';
      } else {
        errorMessage = `Navigation failed: ${err.message}`;
      }

      setNavigationState(prev => ({
        ...prev,
        isNavigating: false,
        navigationError: errorMessage,
        lastFailedUrl: url,
        retryCount: 0,
      }));
    };

    // Listen to route changes
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events]); // Only depend on router.events, not the entire router object

  // Separate effect for initial state to avoid infinite loops
  useEffect(() => {
    const initialParams: Record<string, string | string[]> = {};
    Object.entries(router.query).forEach(([key, value]) => {
      if (value !== undefined) {
        initialParams[key] = value;
      }
    });

    setNavigationState(prev => ({
      ...prev,
      currentPath: router.asPath,
      urlParameters: initialParams,
    }));
  }, [router.asPath, router.query]); // Only update when path or query actually changes

  return (
    <NavigationContext.Provider value={{ 
      navigationState, 
      setNavigating, 
      updateUrlParameters, 
      clearNavigationError,
      retryNavigation,
      safeNavigate
    }}>
      {children}
    </NavigationContext.Provider>
  );
};