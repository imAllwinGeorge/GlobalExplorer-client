import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../mainComponents/Footer";
import NavBar from "../mainComponents/NavBar";
import SideBar from "../mainComponents/SideBar";
const role = "user";
const UserLayout = () => {
    const location = useLocation();
    const sidebarRoutes = ["/profile", "/bookings", "/chat"];
    const showSidebar = sidebarRoutes.some((path) => location.pathname.startsWith(path));
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(NavBar, { role: role }), _jsxs("div", { className: "flex flex-1", children: [showSidebar && (_jsx("aside", { className: "min-w-20", children: _jsx(SideBar, { role: role }) })), _jsx("main", { className: "flex-1 overflow-auto w-full", children: _jsx(Outlet, {}) })] }), _jsx("div", { className: "z-50", children: _jsx(Footer, {}) })] }));
};
export default UserLayout;
