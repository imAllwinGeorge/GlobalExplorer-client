import { type JSX } from 'react'
import { useSelector } from 'react-redux'
import { getAdminSession, getUserSession } from '../helpers/getActiveSession'
import { Navigate, useLocation } from 'react-router-dom';

interface PublicRouteProps {
    element: JSX.Element;
}

const PublicRoute = ({element}: PublicRouteProps) => {
    const userSession = useSelector(getUserSession);
    const adminSession = useSelector(getAdminSession);
    console.log(userSession,adminSession)
    const location = useLocation()
    const path = location.pathname.toLowerCase();

    let session;
    if(path.startsWith("/admin")){
        session = adminSession
    }else{
        session = userSession
    }
    console.log("public routes :",session)
    if(session && session.role){
        const roleRedirects: Record<string,string> = {
            user : "/",
            admin: "/admin/adminhome",
        };
        return <Navigate to={roleRedirects[session.role] || "/unauthrorized"} />
    }
  return element
}

export default PublicRoute