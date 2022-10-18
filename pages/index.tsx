import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function IndexPage() {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status == 'authenticated') router.push('/admin');
    }, [session]);

    return <>hellooooooooooooooo</>;
}
