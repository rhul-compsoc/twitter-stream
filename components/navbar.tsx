import { signOut, useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const session = useSession();

  return (
    <div className="navbar bg-base-300 shadow-xl relative">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">
          SU Twitter Feed
        </a>
      </div>

      <h1 className="normal-case text-xl font-bold absolute left-1/2 -translate-x-1/2">
        {session.data?.user?.name}
      </h1>

      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 gap-3">
          <li>
            <a className="btn btn-success text-success-content hover:bg-base-300 hover:text-white">
              Verified
            </a>
          </li>
          <li>
            <a className="btn btn-warning text-warning-content hover:bg-base-300 hover:text-white">
              Banned
            </a>
          </li>
          <li>
            <button
              className="btn btn-error hover:bg-base-300 hover:text-white mx-auto block text-black"
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
