import {
    GetServerSidePropsContext,
    GetStaticProps,
    GetStaticPropsContext
} from 'next';
import {
    ClientSafeProvider,
    getProviders,
    signIn,
    useSession
} from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Login: React.FC<{ providers: Awaited<typeof getProviders> }> = ({
    providers
}) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status == 'authenticated') router.push('/admin');
    }, [session]);

    return (
        <>
            <h1 className="text-center text-2xl font-bold my-2 capitalize">
                oioi
            </h1>
            {Object.values(providers).map((v: ClientSafeProvider) => (
                <button
                    key={v.id}
                    className="btn mx-auto block my-14"
                    onClick={() => signIn(v.id, { callbackUrl: '/admin' })}>
                    Login
                </button>
            ))}
        </>
    );
};

export async function getServerSideProps(_: GetServerSidePropsContext) {
    const providers = await getProviders();
    return {
        props: { providers }
    };
}

export default Login;
