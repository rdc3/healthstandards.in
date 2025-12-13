import type { AppProps } from 'next/app';
import { NavigationProvider } from '../contexts/NavigationContext';
import { NavigationErrorBoundary, LoadingBar, NavigationErrorRecovery } from '../components/navigation';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NavigationProvider>
      <NavigationErrorBoundary>
        <LoadingBar />
        <NavigationErrorRecovery className="fixed top-16 left-4 right-4 z-40" />
        <Component {...pageProps} />
      </NavigationErrorBoundary>
    </NavigationProvider>
  );
}