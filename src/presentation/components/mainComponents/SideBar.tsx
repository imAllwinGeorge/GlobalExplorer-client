"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { SideBarItems } from "../../config/SideBarConfig";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface SideBarPropsType {
  role: "user" | "host" | "admin";
}

const SideBar = ({ role }: SideBarPropsType) => {
  const items = SideBarItems[role as "user" | "host" | "admin"];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const sidebarVariants = {
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
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

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
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: sidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </motion.div>
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              className="relative w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl border-r border-gray-200/50 h-full shadow-2xl"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-6 pt-20">
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-gray-800 capitalize">
                    {role} Dashboard
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-2" />
                </motion.div>

                <motion.nav
                  className="space-y-2"
                  variants={containerVariants}
                  initial="closed"
                  animate="open"
                >
                  {items.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <motion.div key={index} variants={itemVariants}>
                        <Link
                          to={item.path}
                          className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                              : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isActive
                                ? "text-white"
                                : "text-gray-500 group-hover:text-gray-700"
                            } group-hover:scale-110`}
                          />
                          <span className="font-medium">{item.title}</span>
                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 bg-white rounded-full"
                              layoutId="activeIndicator"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 min-h-screen sticky top-0">
        <div className="flex flex-col w-full p-6">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {role} Dashboard
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-3" />
          </motion.div>

          <motion.nav
            className="space-y-3 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25 transform scale-[1.02]"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:shadow-md"
                    }`}
                  >
                    {/* Background animation for hover */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        layoutId={`hover-${index}`}
                      />
                    )}

                    <Icon
                      className={`w-6 h-6 transition-all duration-300 relative z-10 ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-amber-600"
                      } group-hover:scale-110`}
                    />

                    <span className="font-semibold relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </span>

                    {isActive && (
                      <motion.div
                        className="ml-auto w-3 h-3 bg-white rounded-full relative z-10"
                        layoutId="desktopActiveIndicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Ripple effect on click */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-xl opacity-0"
                      whileTap={{ opacity: [0, 1, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* Footer section */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-sm text-gray-500 text-center">
              <p className="font-medium capitalize">{role} Panel</p>
              <p className="text-xs mt-1">v2.0.1</p>
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
