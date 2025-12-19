import React from "react";
import { Link, useLocation } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// Images
import settings from "../assets/setting.png";
import dashboard from "../assets/dashboard.png";
import calendar from "../assets/appointments.png";
import logo from "../assets/link-health.png";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  isOpen,
  toggleSidebar,
}) => {
  const { user } = useAuth();

  return (
    <div
      className={`bg-white flex flex-col h-full fixed top-0 left-0 z-40 shadow-xl 
      transition-all duration-300 border-r border-gray-200 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="px-3 py-12 flex items-center justify-between border-b-2 border-gray-200 h-20">
        {isOpen && (
          <span className="font-bold text-blue-900 truncate text-lg ml-2 animate-fadeIn">
            <img className="w-44 h-14" src={logo} alt="Logo" />
          </span>
        )}

        {/* menu button */}
        <button
          onClick={toggleSidebar}
          className={`mt-2 p-1 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 ${
            !isOpen ? "mx-auto" : ""
          }`}
        >
          <div className="space-y-1.5">
            <div
              className={`h-0.5 bg-gray-600 transition-all ${
                isOpen ? "w-3 rotate-45 translate-y-2" : "w-2.5"
              }`}
            ></div>
            <div
              className={`h-0.5 bg-gray-600 transition-all ${
                isOpen ? "opacity-0" : "w-6"
              }`}
            ></div>
            <div
              className={`h-0.5 bg-gray-600 transition-all ${
                isOpen ? "w-3 -rotate-45 -translate-y-2" : "w-2"
              }`}
            ></div>
          </div>
        </button>
      </div>

      <nav className="flex-grow p-4 space-y-4 mt-4">
        {/* role based links */}
        {user?.role === "doctor" ? (
          <SidebarItem
            icon={dashboard}
            label="My Agenda"
            isOpen={isOpen}
            to="/doctor-dashboard"
          />
        ) : (
          <>
            <SidebarItem
              icon={dashboard}
              label="Find Doctors"
              isOpen={isOpen}
              to="/doctors"
            />
            <SidebarItem
              icon={calendar}
              label="My Journey"
              isOpen={isOpen}
              to="/appointments"
            />
          </>
        )}

        <SidebarItem
          icon={settings}
          label="Settings"
          isOpen={isOpen}
          to="/settings"
        />
      </nav>

      <div className="p-4 border-t-2 border-gray-200">
        <button
          onClick={onLogout}
          className={`cursor-pointer flex items-center w-full p-3 text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group relative
          ${!isOpen ? "justify-center" : "space-x-4"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {isOpen && (
            <span className="font-semibold animate-fadeIn">Logout</span>
          )}
          {!isOpen && (
            <div className="absolute left-18 bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

interface ItemProps {
  icon: string;
  label: string;
  isOpen: boolean;
  to: string;
}

const SidebarItem: React.FC<ItemProps> = ({ icon, label, isOpen, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center w-full rounded-lg transition-all duration-200 group relative
      ${!isOpen ? "justify-center p-3" : "p-3 space-x-4"}
      ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "hover:bg-blue-50 text-gray-700"
      }`}
    >
      <img src={icon} alt={label} className="w-5 h-5 object-contain" />

      {isOpen && (
        <span
          className={`font-medium whitespace-nowrap animate-fadeIn ${
            isActive ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}

      {!isOpen && (
        <div className="absolute left-16 bg-blue-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
};

export default Sidebar;
