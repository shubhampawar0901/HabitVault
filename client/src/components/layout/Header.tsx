import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Your App Name
          </Link>
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <span className="text-gray-500">
                    Hello, {user?.firstName}
                  </span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-700 hover:text-blue-600">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
