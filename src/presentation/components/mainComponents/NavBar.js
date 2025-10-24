import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Menu, X, LogOut, UserIcon, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { logout } from "../../store/slices/authSlice";
import { navitems } from "../../config/SideBarConfig";
import { hostLogout } from "../../store/slices/hostSlice";
import { adminLogout } from "../../store/slices/adminSlice";
import toast from "react-hot-toast";
import { AuthAPI } from "../../../services/AuthAPI";
import { Link } from "react-router-dom";
import { userService } from "../../../services/UserService";
import { useSocket } from "../../../contexts/SocketContext";
import { HttpStatusCode, NOTIFICATION_EVENT, ROLE } from "../../../shared/constants/constants";
import NotificationMessages from "../notification/NotificationMessage";
const NavBar = ({ role }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const pathname = location.pathname;
    const socket = useSocket();
    const authAPI = new AuthAPI();
    const user = useAppSelector((state) => {
        if (location.pathname.startsWith("/admin")) {
            return state.admin.admin;
        }
        else if (location.pathname.startsWith("/host")) {
            return state.host.host;
        }
        else {
            return state.auth.user;
        }
    });
    const items = navitems[role];
    const handleLogout = async () => {
        try {
            const response = await authAPI.logout(role);
            if (response.status === HttpStatusCode.OK) {
                if (role === ROLE.USER) {
                    dispatch(logout());
                    navigate("/login");
                }
                else if (role === ROLE.HOST) {
                    dispatch(hostLogout());
                    navigate("/host/login");
                }
                else if (role === ROLE.ADMIN) {
                    dispatch(adminLogout());
                    navigate("/admin/login");
                }
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);
    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);
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
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
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
            x: 0,
            transition: {
                type: "spring",
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
    useEffect(() => {
        if (!socket)
            return;
        socket.on(NOTIFICATION_EVENT.SEND_NOTIFICATION, (data) => {
            console.log("recieved notification: ", data);
            setNotifications((prev) => [...prev, data]);
        });
        socket.on(NOTIFICATION_EVENT.READ_NOTIFICATION, (data) => {
            console.log("received notification result:", data);
            setNotifications((prev) => prev.map((noti) => noti._id === data._id ? data : noti));
        });
        return () => {
            socket.off(NOTIFICATION_EVENT.SEND_NOTIFICATION);
            socket.off(NOTIFICATION_EVENT.READ_NOTIFICATION);
        };
    }, [socket]);
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                if (!user)
                    return;
                const response = await userService.fetchNotification(user._id);
                if (response.status === HttpStatusCode.OK) {
                    console.log("navbar notification response : ", response);
                    setNotifications(response.data.notifications);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        setTimeout(() => fetchNotification(), 500);
    }, [user]);
    return (_jsxs(_Fragment, { children: [_jsx(motion.nav, { className: "w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow", initial: { y: -100 }, animate: { y: 0 }, transition: { type: "spring", stiffness: 300, damping: 30 }, children: _jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex h-16 items-center justify-between", children: [_jsx("div", { className: "flex md:hidden", children: _jsxs(motion.button, { type: "button", className: "inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200", onClick: () => setIsMenuOpen(!isMenuOpen), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: [_jsx("span", { className: "sr-only", children: "Open main menu" }), _jsx(motion.div, { animate: { rotate: isMenuOpen ? 180 : 0 }, transition: { duration: 0.3 }, children: isMenuOpen ? (_jsx(X, { className: "h-6 w-6" })) : (_jsx(Menu, { className: "h-6 w-6" })) })] }) }), _jsx(motion.div, { className: "flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none", whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 400, damping: 10 }, children: _jsx(Link, { to: "/", className: "flex items-center", children: _jsxs(motion.span, { className: "text-2xl font-bold", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 }, children: [_jsx("span", { className: "text-gray-800", children: "Global" }), _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Explorer" })] }) }) }), _jsx("div", { className: "hidden md:block", children: _jsx(motion.div, { className: "ml-10 flex items-center space-x-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, children: items.map((item, index) => {
                                        const isActive = pathname === item.path;
                                        return (_jsx(motion.div, { whileHover: { y: -2 }, transition: {
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 10,
                                            }, children: _jsxs(Link, { to: item.path, className: `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? "text-blue-600"
                                                    : "text-gray-600 hover:text-blue-600"}`, children: [item.title, isActive && (_jsx(motion.div, { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full", layoutId: "activeTab", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: {
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 30,
                                                        } }))] }) }, index));
                                    }) }) }), _jsx("div", { className: "hidden md:flex items-center space-x-4", children: user ? (_jsxs(motion.div, { className: "flex items-center space-x-3", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.4 }, children: [_jsxs("div", { className: "relative w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center", children: [_jsx("button", { onClick: () => setIsOpenNoti((prev) => !prev), children: _jsx(Bell, { className: "w-10 h-10 p-1 text-white", fill: "white", strokeWidth: 0 }) }), notifications.filter((noti) => noti.isRead === false)
                                                    .length > 0 && (_jsx("span", { className: "absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full px-1.5 py-[1px] min-w-[18px] text-center", children: notifications.filter((noti) => noti.isRead === false)
                                                        .length }))] }), _jsxs("div", { className: "flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center", children: _jsx(UserIcon, { className: "w-4 h-4 text-white" }) }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: `${user.firstName} ${user.lastName}` })] }), _jsx(motion.button, { onClick: handleLogout, className: "p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, title: "Logout", children: _jsx(LogOut, { className: "w-5 h-5" }) })] })) : (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.4 }, children: _jsx(Link, { to: "/login", className: "rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105", children: "Login" }) })) }), _jsx("div", { className: "flex md:hidden", children: user && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center", children: [_jsx("button", { onClick: () => setIsOpenNoti((prev) => !prev), children: _jsx(Bell, { className: "w-8 h-8 p-1 text-white", fill: "white", strokeWidth: 0 }) }), notifications.filter((noti) => noti.isRead === false)
                                                    .length > 0 && (_jsx("span", { className: "absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full px-1.5 py-[1px] min-w-[18px] text-center", children: notifications.filter((noti) => noti.isRead === false)
                                                        .length }))] }), _jsx(motion.button, { onClick: handleLogout, className: "p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, title: "Logout", children: _jsx(LogOut, { className: "w-5 h-5" }) })] })) })] }) }) }), _jsx(AnimatePresence, { children: isMenuOpen && (_jsxs(motion.div, { className: "fixed inset-0 z-50 md:hidden", variants: overlayVariants, initial: "closed", animate: "open", exit: "closed", children: [_jsx(motion.div, { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setIsMenuOpen(false) }), _jsx(motion.div, { className: "relative w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl h-full shadow-2xl", variants: menuVariants, initial: "closed", animate: "open", exit: "closed", children: _jsxs("div", { className: "p-6", children: [_jsxs(motion.div, { className: "flex items-center justify-between mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: [_jsxs("span", { className: "text-xl font-bold", children: [_jsx("span", { className: "text-gray-800", children: "Global" }), _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Explorer" })] }), _jsx("button", { onClick: () => setIsMenuOpen(false), className: "p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200", children: _jsx(X, { className: "w-5 h-5 text-gray-600" }) })] }), user && (_jsxs(motion.div, { className: "flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 mb-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center", children: _jsx(UserIcon, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-800", children: `${user.firstName} ${user.lastName}` }), _jsxs("p", { className: "text-sm text-gray-600 capitalize", children: [role, " Account"] })] })] })), _jsx(motion.nav, { className: "space-y-2", variants: containerVariants, initial: "closed", animate: "open", children: items.map((item, index) => {
                                            const isActive = pathname === item.path;
                                            return (_jsx(motion.div, { variants: itemVariants, children: _jsxs(Link, { to: item.path, className: `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                                        : "text-gray-700 hover:bg-gray-50"}`, onClick: () => setIsMenuOpen(false), children: [_jsx("span", { className: "font-medium", children: item.title }), isActive && (_jsx(motion.div, { className: "ml-auto w-2 h-2 bg-white rounded-full", layoutId: "mobileActiveIndicator" }))] }) }, index));
                                        }) }), _jsx(motion.div, { className: "mt-8 pt-6 border-t border-gray-200", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, children: user ? (_jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium", children: [_jsx(LogOut, { className: "w-5 h-5" }), _jsx("span", { children: "Logout" })] })) : (_jsx(Link, { to: "/login", className: "w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium", onClick: () => setIsMenuOpen(false), children: "Login" })) })] }) })] })) }), isOpenNoti && (_jsx(NotificationMessages, { notifications: notifications, receiverId: user?._id, onLeave: () => setIsOpenNoti(false) }))] }));
};
export default NavBar;
