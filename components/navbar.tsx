import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const session = useSession();

    return (
        <div className="navbar relative bg-base-300 shadow-xl">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl normal-case">SU Twitter Feed</a>
            </div>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold normal-case">
                {session.data?.user?.name}
            </h1>

            <div className="flex-none">
                <ul className="menu menu-horizontal gap-3 p-0">
                    <li>
                        <Link href="/admin">TBD</Link>
                    </li>
                    <li>
                        <Link href="/admin/good" className="hover:text-white">
                            Verified
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/denied">Banned</Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                signOut();
                            }}>
                            logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
