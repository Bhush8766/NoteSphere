import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  StickyNote,
  Bell,
  User,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <CalendarDays size={20} />,
    },
    {
      name: "Notes",
      path: "/notes",
      icon: <StickyNote size={20} />,
    },
    {
      name: "Reminders",
      path: "/reminders",
      icon: <Bell size={20} />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-purple-700 text-white hidden md:flex flex-col shadow-2xl z-50">

      {/* Logo */}
      <div className="p-6 border-b border-purple-500">
        <h1 className="text-3xl font-bold">NoteSphere</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all duration-300 font-medium
                ${
                  isActive
                    ? "bg-white text-purple-700"
                    : "hover:bg-purple-600"
                }
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;