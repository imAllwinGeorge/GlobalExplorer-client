import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../presentation/pages/admin/AdminLogin'
import AdminHomePage from '../presentation/pages/admin/AdminHomepage/AdminHomePage'
import ProtectedRoute from '../utils/protected/ProtectedRoute'
import PublicRoute from '../utils/protected/PublicRoute'
import Users from '../presentation/pages/admin/users/Users'

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path='/adminlogin' element={<PublicRoute element={<AdminLogin />} />} />
        <Route path='/adminhome' element={<ProtectedRoute element={<AdminHomePage />} allowedRoles={['admin']} />} />
        <Route path='/users' element={<Users />} />
    </Routes>
  )
}

export default AdminRoutes