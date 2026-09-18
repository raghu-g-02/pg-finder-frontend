import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlusCircle, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-indigo-600">
          <Home className="h-6 w-6" />
          <span>BLR Flatmates</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600">
            Find PGs
          </Link>

          {user?.role === 'owner' && (
            <Link
              to="/create-listing"
              className="flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post PG</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;