import { Outlet } from "react-router-dom"
import Footer from "../mainComponents/Footer"
import NavBar from "../mainComponents/NavBar"

const role = "admin"
const AdminLayout = () => {
  return (
    <>
    <NavBar role={role} />
    <Outlet />
    <Footer />
    </>
  )
}

export default AdminLayout