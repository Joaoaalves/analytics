import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextAuthProvider } from '@/contexts/AuthProvider';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <NextAuthProvider>
            <Component {...pageProps} />
        </NextAuthProvider>
    );
}

export default MyApp;
