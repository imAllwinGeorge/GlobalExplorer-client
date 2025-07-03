import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { logout } from "../../store/slices/authSlice";
import { navitems } from "../../config/SideBarConfig";
import { hostLogout } from "../../store/slices/hostSlice";
import { adminLogout } from "../../store/slices/adminSlice";
import toast from "react-hot-toast";
import { AuthAPI } from "../../../services/AuthAPI";
// import { persistor } from "../../../store"

type NavBarPropsType = {
  role: "user" | "admin" | "host";
};
const NavBar = ({ role }: NavBarPropsType) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authAPI = new AuthAPI();

  const user = useAppSelector((state) => {
    if (location.pathname.startsWith("/admin")) {
      return state.admin.admin;
    } else if (location.pathname.startsWith("/host")) {
      return state.host.host;
    } else {
      return state.auth.user;
    }
  });

  const items = navitems[role as "user" | "admin" | "host"];

  const handleLogout = async () => {
    try {
      const response = await authAPI.logout(role);
      if (response.status === 200) {
        if (role === "user") {
          dispatch(logout());
          navigate("/");
        } else if (role === "host") {
          dispatch(hostLogout());
          navigate("/host/login");
        } else if (role === "admin") {
          dispatch(adminLogout());
          navigate("/admin/adminlogin");
        }
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div>
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">
                  <span className="text-gray-800">Global</span>
                  <span className="text-blue-600">Explorer</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {items.map((item,index) => (
                  <Link
                    to={item.path}
                    key={index}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={() => setShowProfileOption((state) => !state)}
                  className="font-bold"
                >{`${user.firstName} ${user.lastName}`}</button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>

            {showProfileOption && (
              <div className="absolute right-5 mt-20 mr-30 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 px-3 py-1 rounded font-bold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {items.map((item,index) => (
                <Link
                  to={item.path}
                  key={index}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {item.title}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={() => setShowProfileOption((state) => !state)}
                >{`${user.firstName} ${user.lastName}`}</button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
