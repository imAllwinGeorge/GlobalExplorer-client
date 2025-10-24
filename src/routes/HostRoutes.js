import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import HostSignUp from "../presentation/pages/host/HostSignUp/HostSignUp";
import HostLogin from "../presentation/pages/host/HostLogin/HostLogin";
import HostHome from "../presentation/pages/host/HostHome/HostHome";
import PublicRoute from "../utils/protected/PublicRoute";
import ProtectedRoute from "../utils/protected/ProtectedRoute";
import HostOtp from "../presentation/pages/host/otp/HostOtp";
import HostLayout from "../presentation/components/layouts/HostLayout";
import ActivityPage from "../presentation/pages/host/ActivityPage";
import Profile from "../presentation/pages/host/Profile";
import BookingPage from "../presentation/pages/host/BookingPage";
import Chat from "../presentation/pages/host/ChatPage";
import SalesPage from "../presentation/pages/host/SalesPage";
import NotFoundPage from "../presentation/pages/common/NotFoundPage";
const HostRoutes = () => {
    return (_jsx(_Fragment, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "signup", element: _jsx(HostSignUp, {}) }), _jsx(Route, { path: "verify_otp", element: _jsx(HostOtp, {}) }), _jsx(Route, { path: "login", element: _jsx(PublicRoute, { element: _jsx(HostLogin, {}) }) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { element: _jsx(HostLayout, {}), allowedRoles: ["host"] }), children: [_jsx(Route, { path: "home", element: _jsx(HostHome, {}) }), _jsx(Route, { path: "activity", element: _jsx(ActivityPage, {}) }), _jsx(Route, { path: "profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "bookings", element: _jsx(BookingPage, {}) }), _jsx(Route, { path: "chat", element: _jsx(Chat, {}) }), _jsx(Route, { path: "sales", element: _jsx(SalesPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }));
};
export default HostRoutes;
