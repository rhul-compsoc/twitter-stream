import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import './main.css';

import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import type { AppProps } from 'next/app';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout<T> = AppProps<T> & {
    Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const App = ({
    Component,
    pageProps: { session, ...pageProps }
}: AppPropsWithLayout<{ session: Session }>) => {
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
        </QueryClientProvider>
    );
};

export default App;
