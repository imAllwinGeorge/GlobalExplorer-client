import { type JSX } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession, getHostSession, getUserSession } from '../helpers/getActiveSession';


interface ProtectedRouteProps {
    element: JSX.Element;
    allowedRoles: string[]
}
const ProtectedRoute = ({element, allowedRoles}: ProtectedRouteProps) => {
    const location = useLocation();
    const path = location.pathname.toLowerCase();
    const userSession = useSelector(getUserSession);
    const adminSession = useSelector(getAdminSession);
    const hostSession = useSelector(getHostSession);

    let inferredRole: string | null = null;
    if(path.startsWith("/admin")){
      inferredRole = "admin"
    }else if(path.startsWith("/host")){
      inferredRole = "host"
    }else {
      inferredRole = "user"
    };

    if(!userSession && !adminSession && !hostSession) {
      const loginRedirects: Record<string, string> = {
        user: "/login",
        admin: "/admin/adminlogin",
        host: "/host/login",
      };
      return <Navigate to={loginRedirects[inferredRole]} />;
}

let role;
if(userSession && userSession.role === inferredRole){
  role = userSession.role
}else if(adminSession && adminSession.role === inferredRole){
  role = adminSession.role
}else if(hostSession && hostSession.role === inferredRole){
  role = hostSession.role
}else {
  role = null
}

if(!role || !allowedRoles.includes(role)){
  const loginRedirects: Record<string, string> = {
        user: "/login",
        admin: "/admin/adminlogin",
        host: "/host/login"
      };
      const redirectRoute = loginRedirects[role as keyof typeof loginRedirects] || "/unauthrorized"
      return <Navigate to={redirectRoute} />;
}

  return element;
}

export default ProtectedRoute