import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface NavigationState {
  currentPath: string;
  isNavigating: boolean;
  previousPath: string | null;
}

interface NavigationContextType {
  navigationState: NavigationState;
  setNavigating: (isNavigating: boolean) => void;
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
  });

  const setNavigating = (isNavigating: boolean) => {
    setNavigationState(prev => ({
      ...prev,
      isNavigating,
    }));
  };

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setNavigationState(prev => ({
        currentPath: prev.currentPath,
        isNavigating: true,
        previousPath: prev.currentPath,
      }));
    };

    const handleRouteChangeComplete = (url: string) => {
      setNavigationState(prev => ({
        currentPath: url,
        isNavigating: false,
        previousPath: prev.previousPath,
      }));
    };

    const handleRouteChangeError = () => {
      setNavigationState(prev => ({
        ...prev,
        isNavigating: false,
      }));
    };

    // Set initial path
    setNavigationState(prev => ({
      ...prev,
      currentPath: router.asPath,
    }));

    // Listen to route changes
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <NavigationContext.Provider value={{ navigationState, setNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
};