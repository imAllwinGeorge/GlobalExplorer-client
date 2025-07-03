import { Outlet } from "react-router-dom"
import Footer from "../mainComponents/Footer"
import NavBar from "../mainComponents/NavBar"
import SideBar from "../mainComponents/SideBar"

const role = "host"
const HostLayout = () => {
  return (
    <>
    <NavBar role={role} />
    <SideBar role ={role} />
    <Outlet />
    <Footer />
    </>
  )
}

export default HostLayout