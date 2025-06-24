import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppHooks"
import { logout } from "../../../store/slices/authSlice"
import { persistor } from "../../../store"


const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileOption, setShowProfileOption] = useState(false)
  const user = useAppSelector(state => state.auth.user)
  const dipatch = useAppDispatch();
  console.log(user)

  const handleLogout = () => {
     dipatch(logout());
     persistor.purge();
     setShowProfileOption(false)
  }
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
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link to="/explorations" className="text-gray-600 hover:text-blue-600">
                Explorations
              </Link>
              <Link to="/filter" className="text-gray-600 hover:text-blue-600">
                filter
              </Link>
              <Link to="/blogs" className="text-gray-600 hover:text-blue-600">
                Blogs
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            {user ? <button onClick={() => setShowProfileOption(state => !state)}>{`${user.firstName} ${user.lastName}`}</button>: <Link
              to="/login"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>}
          </div>

          {showProfileOption && (
            <div>
              <button onClick={handleLogout} >logout</button>
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
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/explorations"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              Explorations
            </Link>
            <Link
              to="/filter"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              filter
            </Link>
            <Link
              to="/blogs"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              Blogs
            </Link>
            <Link
              to="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              to="/profile"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              Profile
            </Link>
            <Link
              to="/login"
              className="mt-4 block rounded-md bg-blue-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
    </div>
  )
}

export default HomePage