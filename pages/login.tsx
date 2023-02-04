import Footer from '@components/footer';
import MainLayout from '@components/layouts/mainLayout';
import {
    ClientSafeProvider,
    getProviders,
    signIn,
    useSession
} from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPageWithLayout } from './_app';

const Login: NextPageWithLayout<{
    providers: Awaited<typeof getProviders>;
}> = ({ providers }) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status == 'authenticated') router.push('/admin');
    }, [session]);

    return (
        <>
            <div className="flex flex-1 items-center justify-center p-20">
                <div className="rounded-2xl bg-primary p-4 shadow-2xl">
                    <h1 className="my-2 text-center text-2xl font-bold capitalize">
                        You are not authenticated
                    </h1>
                    {Object.values(providers).map((v: ClientSafeProvider) => (
                        <button
                            key={v.id}
                            className="btn btn-wide mx-auto my-2 block"
                            onClick={() =>
                                signIn(v.id, { callbackUrl: '/admin' })
                            }>
                            Login
                        </button>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

Login.getLayout = (page) => (
    <MainLayout className="flex h-screen w-screen">{page}</MainLayout>
);

export async function getStaticProps() {
    const providers = await getProviders();
    return {
        props: { providers }
    };
}

export default Login;
