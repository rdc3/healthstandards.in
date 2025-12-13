import type { AppProps } from 'next/app';
import { NavigationProvider } from '../contexts/NavigationContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NavigationProvider>
      <Component {...pageProps} />
    </NavigationProvider>
  );
}