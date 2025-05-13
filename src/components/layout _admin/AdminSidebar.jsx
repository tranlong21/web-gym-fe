import React from "react";
import {
  FaChartBar,
  FaUsers,
  FaDumbbell,
  FaCog,
  FaSignOutAlt,
  FaRunning,
  FaClipboardList,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: <FaChartBar />, path: "/admin/dashboard" },
  { name: "Gym Shop", icon: <FaDumbbell />, path: "/admin/shop" },
  { name: "Users", icon: <FaUsers />, path: "/admin/users" },
  { name: "Exercises", icon: <FaRunning />, path: "/admin/exercises" },
  { name: "Orders", icon: <FaClipboardList />, path: "/admin/orders" },
  { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gray-100 h-screen shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">🏋️‍♂️ Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-200 ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
