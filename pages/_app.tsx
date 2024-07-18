import {Auth0TokenProvider} from '../contexts/Auth0TokenProvider';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AWSProvider } from '@/contexts/AWSProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0TokenProvider>
      <AWSProvider>
        <Component {...pageProps} />
      </AWSProvider>
    </Auth0TokenProvider>
  );
}

export default MyApp;