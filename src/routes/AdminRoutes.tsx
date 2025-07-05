import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../presentation/pages/admin/AdminLogin'
import AdminHomePage from '../presentation/pages/admin/AdminHomepage/AdminHomePage'
import ProtectedRoute from '../utils/protected/ProtectedRoute'
import PublicRoute from '../utils/protected/PublicRoute'
import Users from '../presentation/pages/admin/users/Users'
import AdminLayout from '../presentation/components/layouts/AdminLayout'
import AdminHosts from '../presentation/pages/admin/AdminHosts'
import AdminHostDetails from '../presentation/pages/admin/AdminHostDetails'
import CategoryPage from '../presentation/pages/admin/CategoryPage'

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path='adminlogin' element={<PublicRoute element={<AdminLogin />} />} />
        
        <Route  element= {<ProtectedRoute element={<AdminLayout />} allowedRoles={["admin"]} />} >
          <Route path='adminhome' element={<AdminHomePage />} />
          <Route path='users' element={<Users />} />
          <Route path='host' element={<AdminHosts />} />
          <Route path='verify' element={<AdminHostDetails />} />
          <Route path='services' element={<CategoryPage />} />
        </Route>
    </Routes>
  )
}

export default AdminRoutes