import { Link } from "react-router-dom";
import { SideBarItems } from "../../config/SideBarConfig";
import { useState } from "react";

interface SideBarPropsType {
  role: "user" | "host" | "admin";
}

const SideBar = ({ role }: SideBarPropsType) => {
  const items = SideBarItems[role as "user" | "host" | "admin"];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-6 md:hidden p-4 text-gray-700"
      >
        ☰
      </button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <aside className="w-64 bg-white border-r border-gray-200 h-full">
            <div className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-4 text-gray-700"
                >
                  ☰
                </button>
                {items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-gray-700" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-full">
        <div className="p-6">
          <nav className="space-y-2">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100"
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
