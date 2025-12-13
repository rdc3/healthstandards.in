/**
 * Navigation utilities for URL parameter handling and route management
 */

/**
 * Safely updates URL parameters without causing navigation conflicts
 */
export const updateUrlParameters = (
  currentUrl: string,
  newParams: Record<string, string | string[] | undefined>
): string => {
  try {
    const url = new URL(currentUrl, window.location.origin);
    
    // Clear existing parameters that are being updated
    Object.keys(newParams).forEach(key => {
      url.searchParams.delete(key);
    });
    
    // Add new parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else {
          url.searchParams.set(key, value);
        }
      }
    });
    
    return url.pathname + url.search;
  } catch (error) {
    console.error('Failed to update URL parameters:', error);
    return currentUrl;
  }
};

/**
 * Extracts parameters from a URL string
 */
export const extractUrlParameters = (url: string): Record<string, string | string[]> => {
  try {
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
    
    return params;
  } catch (error) {
    console.error('Failed to extract URL parameters:', error);
    return {};
  }
};

/**
 * Validates that a URL is safe for navigation
 */
export const isValidNavigationUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    
    // Only allow same-origin navigation
    if (urlObj.origin !== window.location.origin) {
      return false;
    }
    
    // Validate path format
    if (!urlObj.pathname.match(/^\/[a-zA-Z0-9\-\/]*$/)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Prevents navigation conflicts by ensuring only one navigation method is active
 */
export const createSafeNavigationHandler = (
  onNavigate: () => void,
  onAnalytics?: (data: any) => void
) => {
  return (_e: React.MouseEvent, _url: string, analyticsData?: any) => {
    // Don't prevent default - let Link handle navigation
    // Only perform analytics tracking without interfering
    try {
      if (onAnalytics && analyticsData) {
        onAnalytics(analyticsData);
      }
      // Let the Link component handle the actual navigation
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // Don't prevent navigation even if analytics fails
    }
  };
};

/**
 * Creates a navigation handler with error recovery
 */
export const createNavigationHandlerWithRecovery = (
  router: any,
  onError?: (error: Error, url: string) => void
) => {
  return async (url: string, options?: { replace?: boolean; shallow?: boolean }) => {
    try {
      // Validate URL before navigation
      if (!isValidNavigationUrl(url)) {
        throw new Error(`Invalid navigation URL: ${url}`);
      }

      // Perform navigation
      if (options?.replace) {
        await router.replace(url, undefined, { shallow: options.shallow });
      } else {
        await router.push(url, undefined, { shallow: options.shallow });
      }
      
      return true;
    } catch (error) {
      const navigationError = error instanceof Error ? error : new Error('Unknown navigation error');
      console.error('Navigation failed:', navigationError, 'URL:', url);
      
      if (onError) {
        onError(navigationError, url);
      }
      
      return false;
    }
  };
};

/**
 * Detects if an error is navigation-related
 */
export const isNavigationError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return message.includes('navigation') ||
         message.includes('route') ||
         message.includes('component') ||
         message.includes('abort') ||
         message.includes('fetch');
};

/**
 * Gets a user-friendly error message for navigation errors
 */
export const getNavigationErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  
  if (message.includes('abort')) {
    return 'Navigation was interrupted. This may be due to a slow connection or conflicting navigation requests.';
  } else if (message.includes('404') || message.includes('not found')) {
    return 'The requested page could not be found.';
  } else if (message.includes('timeout')) {
    return 'Navigation timed out. Please check your connection and try again.';
  } else if (message.includes('component')) {
    return 'Failed to load page components. This may be a temporary issue.';
  } else if (message.includes('network')) {
    return 'Network error occurred during navigation. Please check your connection.';
  } else {
    return `Navigation failed: ${error.message}`;
  }
};