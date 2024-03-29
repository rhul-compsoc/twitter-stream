import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
    const session = useSession();
    const { query } = useRouter();

    return (
        <div className="navbar relative bg-base-300 shadow-xl">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl normal-case">
                    SU Twitter Feed
                </a>
            </div>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold normal-case">
                {session.data?.user?.name}
            </h1>

            <div className="flex-none">
                <ul className="menu btn-group menu-horizontal p-0">
                    <Link
                        className={
                            query?.filterType != undefined
                                ? 'btn btn-warning w-24 text-black'
                                : 'btn w-24'
                        }
                        href="/admin">
                        TBD
                    </Link>

                    <Link
                        className={
                            query?.filterType != 'valid'
                                ? 'btn btn-primary w-24'
                                : 'btn w-24'
                        }
                        href="/admin/valid">
                        Verified
                    </Link>

                    <Link
                        className={
                            query?.filterType != 'invalid'
                                ? 'btn btn-secondary w-24'
                                : 'btn w-24'
                        }
                        href="/admin/invalid">
                        Banned
                    </Link>

                    <li
                        className="btn btn-accent w-24"
                        onClick={() => {
                            signOut();
                        }}>
                        logout
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
