import { signOut, useSession } from 'next-auth/react';
import React from 'react';

type NavbarProps = {
  setFilter: (filter: string) => void;
};

const Navbar = (props: NavbarProps) => {
  const session = useSession();
  const { setFilter } = props;

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
        <ul className="menu menu-horizontal gap-3 p-0">
          <li>
            <a className="btn bg-slate-500 text-success-content hover:bg-base-300 hover:text-white" onClick={() => setFilter('u')}>
              Unprocessed
            </a>
          </li>
          <li>
            <a className="btn btn-success text-success-content hover:bg-base-300 hover:text-white" onClick={() => setFilter('v')}>
              Verified
            </a>
          </li>
          <li>
            <a className="btn bg-orange-500 text-success-content hover:bg-base-300 hover:text-white" onClick={() => setFilter('d')}>
              Unverified
            </a>
          </li>
          <li>
            <a className="btn bg-red-500 text-warning-content hover:bg-base-300 hover:text-white" onClick={() => setFilter('b')}>
              Banned
            </a>
          </li>
          <li>
            <button
              className="btn btn-error mx-auto block text-black hover:bg-base-300 hover:text-white"
              onClick={() => {
                signOut();
              }}
            >
              logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
