import { Menu, X, LogOut, UserIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks"
import { logout } from "../../store/slices/authSlice"
import { navitems } from "../../config/SideBarConfig"
import { hostLogout } from "../../store/slices/hostSlice"
import { adminLogout } from "../../store/slices/adminSlice"
import toast from "react-hot-toast"
import { AuthAPI } from "../../../services/AuthAPI"
import { Link } from "react-router-dom"

// // Mock user type for demonstration
// interface User {
//   firstName: string
//   lastName: string
//   email?: string
// }

type NavBarPropsType = {
  role: "user" | "admin" | "host"
}

const NavBar = ({ role }: NavBarPropsType) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = location.pathname;

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
          navigate("/login");
        } else if (role === "host") {
          dispatch(hostLogout());
          navigate("/host/login");
        } else if (role === "admin") {
          dispatch(adminLogout());
          navigate("/admin/login");
        }
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  // const handleLogout = async () => {
  //   try {
  //     // Your logout logic here
  //     console.log("Logging out...")
  //     // Example logout implementation:
  //     // const response = await authAPI.logout(role);
  //     // Handle logout based on role
  //   } catch (error) {
  //     console.error("Logout error:", error)
  //   }
  // }

 const menuVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};


  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  return (
    <>
      <motion.nav
        className="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button - Left Side */}
            <div className="flex md:hidden">
              <motion.button
                type="button"
                className="inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open main menu</span>
                <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </motion.button>
            </div>

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <motion.div
              className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/" className="flex items-center">
                <motion.span
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-gray-800">Global</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Explorer
                  </span>
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <motion.div
                className="ml-10 flex items-center space-x-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {items.map((item, index) => {
                  const isActive = pathname === item.path
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link
                        to={item.path}
                        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                          isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        {item.title}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            layoutId="activeTab"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{`${user.firstName} ${user.lastName}`}</span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link
                    to="/login"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Logout Button - Right Side */}
            <div className="flex md:hidden">
              {user && (
                <motion.button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              className="relative w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl h-full shadow-2xl"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <motion.div
                  className="flex items-center justify-between mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xl font-bold">
                    <span className="text-gray-800">Global</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Explorer
                    </span>
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </motion.div>

                {/* User Info Section */}
                {user && (
                  <motion.div
                    className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{`${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-gray-600 capitalize">{role} Account</p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <motion.nav className="space-y-2" variants={containerVariants} initial="closed" animate="open">
                  {items.map((item, index) => {
                    const isActive = pathname === item.path
                    return (
                      <motion.div key={index} variants={itemVariants}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="font-medium">{item.title}</span>
                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 bg-white rounded-full"
                              layoutId="mobileActiveIndicator"
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.nav>

                {/* Mobile Login/Logout Section */}
                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default NavBar

