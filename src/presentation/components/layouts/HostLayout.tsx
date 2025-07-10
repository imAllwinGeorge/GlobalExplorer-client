import { Outlet } from "react-router-dom";
import Footer from "../mainComponents/Footer";
import NavBar from "../mainComponents/NavBar";
import SideBar from "../mainComponents/SideBar";

const role = "host";
const HostLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar role={role} />
      <div className="flex flex-1">
        <SideBar role={role} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HostLayout;
