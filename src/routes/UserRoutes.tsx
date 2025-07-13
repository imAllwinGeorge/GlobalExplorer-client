import { Route, Routes } from 'react-router-dom'
import HomePage from '../presentation/pages/user/homepage/HomePage'
import Login from '../presentation/pages/user/Loginpage/Login'
import SignUP from '../presentation/pages/user/signup/SignUP'
import Otp from '../presentation/pages/otp/Otp'
import ProtectedRoute from '../utils/protected/ProtectedRoute'
import PublicRoute from '../utils/protected/PublicRoute'
import VerifyEmail from '../presentation/pages/user/forgotpassword/VerifyEmail'
import ResetPassword from '../presentation/pages/user/changePasswod/ResetPassword'
import UserLayout from '../presentation/components/layouts/UserLayout'
import LandingPage from '../presentation/pages/LandingPage/LandingPage'
import ActivityPageUser from '../presentation/pages/user/ActivityPageUser'
import Blogs from '../presentation/pages/user/Blogs'
import ActivityDetailsUser from '../presentation/pages/user/ActivityDetailsUser'

const UserRoutes = () => {
  return (
    <Routes>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<PublicRoute element={<Login/>}  />} />
        <Route path='forgot-password' element={<VerifyEmail />} />
        <Route path='reset-password/:role/:id/:token' element={<ResetPassword />} />
        <Route path="signup" element={<SignUP />} />
        <Route path="verify_otp" element={<Otp />} />
        <Route path={'/'} element={<ProtectedRoute element={<UserLayout />} allowedRoles={['user']} />} >
          <Route path='home' element={<HomePage />} />
          <Route path='explorations' element={<ActivityPageUser />} />
          <Route path='blogs' element={<Blogs />} />
          <Route path='activity-details' element={<ActivityDetailsUser />} />
        </Route>
    </Routes>
  )
}

export default UserRoutes