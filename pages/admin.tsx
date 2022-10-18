import { signOut } from 'next-auth/react';

export default function Page() {
    return (
        <>
            <h1 className="text-center text-2xl font-bold my-2 capitalize">
                admin User Detected
            </h1>

            <button
                className="btn btn-error hover:bg-black hover:text-white mx-auto block my-14"
                onClick={() => {
                    signOut();
                }}>
                logout
            </button>
        </>
    );
}
