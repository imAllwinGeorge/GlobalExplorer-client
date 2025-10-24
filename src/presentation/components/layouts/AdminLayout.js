import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Footer from "../mainComponents/Footer";
import NavBar from "../mainComponents/NavBar";
import SideBar from "../mainComponents/SideBar";
const role = "admin";
const AdminLayout = () => {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(NavBar, { role: role }), _jsxs("div", { className: "flex flex-1", children: [_jsx("div", { className: "min-w-20", children: _jsx(SideBar, { role: role }) }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsx(Outlet, {}) })] }), _jsx("div", { className: "z-50", children: _jsx(Footer, {}) })] }));
};
export default AdminLayout;
