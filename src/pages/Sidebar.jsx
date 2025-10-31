import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { name: "Screens", path: "/admin/screens" },
  { name: "Upload Content", path: "/admin/upload-content" },
  { name: "Screen Containers", path: "/admin/screen-containers" },
  { name: "Contents", path: "/admin/contents" },
];

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6 border-r min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-8">Admin Dashboard</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;

