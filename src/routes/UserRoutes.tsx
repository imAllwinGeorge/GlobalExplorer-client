import { Route, Routes } from 'react-router-dom'
import HomePage from '../presentation/pages/user/homepage/HomePage'
import Login from '../presentation/pages/user/Loginpage/Login'
import SignUP from '../presentation/pages/user/signup/SignUP'
import Otp from '../presentation/pages/otp/Otp'
import ProtectedRoute from '../utils/protected/ProtectedRoute'
import PublicRoute from '../utils/protected/PublicRoute'
import VerifyEmail from '../presentation/pages/user/forgotpassword/VerifyEmail'
import ResetPassword from '../presentation/pages/user/changePasswod/ResetPassword'

const UserRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<ProtectedRoute element={<HomePage/>} allowedRoles={['user']} />} />
        <Route path='/login' element={<PublicRoute element={<Login/>}  />} />
        <Route path='/forgot-password' element={<VerifyEmail />} />
        <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
        <Route path="/signup" element={<SignUP />} />
        <Route path="/verify_otp" element={<Otp />} />
    </Routes>
  )
}

export default UserRoutes