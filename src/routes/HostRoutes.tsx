import { Route, Routes } from "react-router-dom"
import HostSignUp from "../presentation/pages/host/HostSignUp/HostSignUp"
import HostLogin from "../presentation/pages/host/HostLogin/HostLogin"
import HostHome from "../presentation/pages/host/HostHome/HostHome"
import PublicRoute from "../utils/protected/PublicRoute"
import ProtectedRoute from "../utils/protected/ProtectedRoute"
import HostOtp from "../presentation/pages/host/otp/HostOtp"
import HostLayout from "../presentation/components/layouts/HostLayout"
import ActivityPage from "../presentation/pages/host/ActivityPage"
import Profile from "../presentation/pages/host/Profile"


const HostRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="signup" element={<HostSignUp />} />
        <Route path="verify_otp" element={<HostOtp />} />
        <Route path="login" element={<PublicRoute element={<HostLogin />} />} />
        {/* <Route path="/home" element={<ProtectedRoute element={<HostHome />} allowedRoles={["host"]} />} /> */}
        <Route  element={<ProtectedRoute element={<HostLayout />} allowedRoles={["host"]} />}>
          <Route path="home" element={<HostHome />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
    </Routes>
    </>
  )
}

export default HostRoutes