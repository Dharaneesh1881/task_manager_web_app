import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Settings,
  ChevronDown,
  LogOut
} from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg transition-all duration-300 group-hover:scale-105">
            <Zap className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md animate-ping" />
          </div>

          <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
            TaskFlow
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div ref={menuRef} className="relative">
          <button
            onClick={handleMenuToggle}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200"
          >
            {/* Avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-9 h-9 rounded-full shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            {/* User Info */}
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || ""}
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          {menuOpen && (
            <ul className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden z-50 animate-fadeIn">

              <li className="p-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-purple-50 rounded-lg flex items-center gap-2 transition-colors"
                  role="menuitem"
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
              </li>

              <li className="p-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
