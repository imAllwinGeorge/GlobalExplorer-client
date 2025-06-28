import { Outlet } from "react-router-dom";
import Footer from "../mainComponents/Footer";
import NavBar from "../mainComponents/NavBar"

const role = "user";
const UserLayout = () => {
  return (
    <>
    <NavBar role={role} />
    <Outlet />
    <Footer />
    </>
  )
}

export default UserLayout