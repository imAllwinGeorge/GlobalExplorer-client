import { Outlet, useLocation } from "react-router-dom";
import Footer from "../mainComponents/Footer";
import NavBar from "../mainComponents/NavBar";
import SideBar from "../mainComponents/SideBar";

const role = "user";

const UserLayout = () => {
  const location = useLocation();

  const sidebarRoutes = ["/profile", "/bookings", "/chat"];
  const showSidebar = sidebarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar role={role} />
      <div className="flex flex-1">
         {showSidebar && (
          <aside className="min-w-20">
            <SideBar role={role} />
          </aside>
        )}
        <main className="flex-1 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
      <div className="z-40">
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
