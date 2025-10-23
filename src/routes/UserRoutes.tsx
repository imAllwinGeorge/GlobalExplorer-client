import { Route, Routes } from "react-router-dom";
import HomePage from "../presentation/pages/user/homepage/HomePage";
import Login from "../presentation/pages/user/Loginpage/Login";
import SignUP from "../presentation/pages/user/signup/SignUP";
import Otp from "../presentation/pages/otp/Otp";
import ProtectedRoute from "../utils/protected/ProtectedRoute";
import PublicRoute from "../utils/protected/PublicRoute";
import VerifyEmail from "../presentation/pages/user/forgotpassword/VerifyEmail";
import ResetPassword from "../presentation/pages/user/changePasswod/ResetPassword";
import UserLayout from "../presentation/components/layouts/UserLayout";
import LandingPage from "../presentation/pages/LandingPage/LandingPage";
import ActivityPageUser from "../presentation/pages/user/ActivityPageUser";
import Blogs from "../presentation/pages/user/blog/Blogs";
import ActivityDetailsUser from "../presentation/pages/user/ActivityDetailsUser";
import FilterPage from "../presentation/pages/user/Filter-page";
import OrderSuccess from "../presentation/pages/user/OrderSuccess";
import Profile from "../presentation/pages/user/Profile";
import MyBookings from "../presentation/pages/user/MyBookings";
import ChatPage from "../presentation/pages/user/Chat-Page";
import BlogWriter from "../presentation/pages/user/blog/Blog-Writer";
import BlogRead from "../presentation/pages/user/blog/Read-Blog";
import VideoChat from "../presentation/pages/user/Video-Chat";
import NotFoundPage from "../presentation/pages/common/NotFoundPage";


const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="login" element={<PublicRoute element={<Login />} />} />
      <Route path="forgot-password/:role" element={<VerifyEmail />} />
      <Route
        path="reset-password/:role/:id/:token"
        element={<ResetPassword />}
      />
      <Route path="signup" element={<SignUP />} />
      <Route path="verify_otp" element={<Otp />} />
      <Route
        path={"/"}
        element={
          <ProtectedRoute element={<UserLayout />} allowedRoles={["user"]} />
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route path="explorations" element={<ActivityPageUser />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blog/write/:userId" element={<BlogWriter />} />
        <Route path="blog/read/:id" element={<BlogRead />} />
        <Route path="activity-details/:id" element={<ActivityDetailsUser />} />
        <Route path="filter" element={<FilterPage />} />
        <Route path="order-success/:orderId" element={<OrderSuccess />} />
        <Route path="profile" element={<Profile />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="video/:receiverId" element={<VideoChat />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
