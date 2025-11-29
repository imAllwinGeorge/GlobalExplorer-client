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
import BookingPage from "../presentation/pages/host/BookingPage"
import Chat from "../presentation/pages/host/ChatPage"
import SalesPage from "../presentation/pages/host/SalesPage"
import NotFoundPage from "../presentation/pages/common/NotFoundPage"
import QRVerification from "@/presentation/pages/host/QRVerification"
import ActivityDashboard from "@/presentation/pages/host/ActivityDashBoard/ActivityDashboard"



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
          <Route path="activity/dashboard/:activityId" element={<ActivityDashboard />} />
          <Route path="booking/verification" element={<QRVerification />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<BookingPage />} />
          <Route path="chat" element={<Chat />} />
          <Route path="sales" element={<SalesPage/>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  )
}

export default HostRoutes