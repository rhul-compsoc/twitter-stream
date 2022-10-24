import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './main.css';

import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import type { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout<T> = AppProps<T> & {
    Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({
    Component,
    pageProps: { session, ...pageProps }
}: AppPropsWithLayout<{ session: Session }>) {
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                {getLayout(<Component {...pageProps} />)}
            </SessionProvider>{' '}
        </QueryClientProvider>
    );
}
