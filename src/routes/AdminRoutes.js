import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../presentation/pages/admin/AdminLogin';
import AdminHomePage from '../presentation/pages/admin/AdminHomepage/AdminHomePage';
import ProtectedRoute from '../utils/protected/ProtectedRoute';
import PublicRoute from '../utils/protected/PublicRoute';
import Users from '../presentation/pages/admin/users/Users';
import AdminLayout from '../presentation/components/layouts/AdminLayout';
import AdminHosts from '../presentation/pages/admin/AdminHosts';
import AdminHostDetails from '../presentation/pages/admin/AdminHostDetails';
import CategoryPage from '../presentation/pages/admin/CategoryPage';
import ActivityPage from '../presentation/pages/admin/ActivityPage';
import Sales from '../presentation/pages/admin/Sales';
import NotFoundPage from '../presentation/pages/common/NotFoundPage';
const AdminRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: 'login', element: _jsx(PublicRoute, { element: _jsx(AdminLogin, {}) }) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { element: _jsx(AdminLayout, {}), allowedRoles: ["admin"] }), children: [_jsx(Route, { path: 'home', element: _jsx(AdminHomePage, {}) }), _jsx(Route, { path: 'users', element: _jsx(Users, {}) }), _jsx(Route, { path: 'host', element: _jsx(AdminHosts, {}) }), _jsx(Route, { path: 'verify/:id/:role', element: _jsx(AdminHostDetails, {}) }), _jsx(Route, { path: 'services', element: _jsx(CategoryPage, {}) }), _jsx(Route, { path: 'activities', element: _jsx(ActivityPage, {}) }), _jsx(Route, { path: 'sales', element: _jsx(Sales, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] })] }));
};
export default AdminRoutes;
