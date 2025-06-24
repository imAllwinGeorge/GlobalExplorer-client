import { type JSX } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession, getUserSession } from '../helpers/getActiveSession';


interface ProtectedRouteProps {
    element: JSX.Element;
    allowedRoles: string[]
}
const ProtectedRoute = ({element, allowedRoles}: ProtectedRouteProps) => {
    const location = useLocation();
    const path = location.pathname.toLowerCase();
    const userSession = useSelector(getUserSession);
    const adminSession = useSelector(getAdminSession);

    let inferredRole: string | null = null;
    if(path.startsWith("/admin")) inferredRole = "admin";
    else inferredRole = "user";

    if(!userSession && !adminSession) {
      const loginRedirects: Record<string, string> = {
        user: "/login",
        admin: "/admin/adminlogin",
      };
      return <Navigate to={loginRedirects[inferredRole]} />;
}

let role;
if(userSession && userSession.role === inferredRole){
  role = userSession.role
}else if(adminSession && adminSession.role === inferredRole){
  role = adminSession.role
}else {
  role = null
}

if(!role || !allowedRoles.includes(role)){
  const loginRedirects: Record<string, string> = {
        user: "/login",
        admin: "/admin/adminlogin",
      };
      const redirectRoute = loginRedirects[role as keyof typeof loginRedirects] || "/unauthrorized"
      return <Navigate to={redirectRoute} />;
}

  return element;
}

export default ProtectedRoute