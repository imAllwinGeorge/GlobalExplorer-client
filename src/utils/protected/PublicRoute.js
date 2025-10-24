import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react';
import { useSelector } from 'react-redux';
import { getAdminSession, getHostSession, getUserSession } from '../helpers/getActiveSession';
import { Navigate, useLocation } from 'react-router-dom';
const PublicRoute = ({ element }) => {
    const userSession = useSelector(getUserSession);
    const adminSession = useSelector(getAdminSession);
    const hostSession = useSelector(getHostSession);
    console.log(userSession, adminSession);
    const location = useLocation();
    const path = location.pathname.toLowerCase();
    let session;
    if (path.startsWith("/admin")) {
        session = adminSession;
    }
    else if (path.startsWith("/host")) {
        session = hostSession;
    }
    else {
        session = userSession;
    }
    console.log("public routes :", session);
    if (session && session.role) {
        const roleRedirects = {
            user: "/home",
            admin: "/admin/home",
            host: "/host/home",
        };
        return _jsx(Navigate, { to: roleRedirects[session.role] || "/unauthorized", replace: true });
    }
    return element;
};
export default PublicRoute;
