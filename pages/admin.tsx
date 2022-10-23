import { signOut, useSession } from 'next-auth/react';
import Navbar from '../components/navbar';

export default function Page() {
    const session = useSession();

    return (
        <>
            <Navbar name={session.data?.user?.name || ''} />
            <h1 className="text-center text-2xl font-bold my-2 capitalize">
                admin User Detected
            </h1>
        </>
    );
}
