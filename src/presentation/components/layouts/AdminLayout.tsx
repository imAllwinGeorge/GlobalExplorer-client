import { Outlet } from "react-router-dom"
import Footer from "../mainComponents/Footer"
import NavBar from "../mainComponents/NavBar"
import SideBar from "../mainComponents/SideBar"

const role = "admin"
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar role={role} />
      <div className="flex flex-1">
        <div className="min-w-20">
          <SideBar role={role} />
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <div className="z-40">
        <Footer />
      </div>
    </div>
  )
}

export default AdminLayout