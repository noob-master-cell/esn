import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from '../common/Icon';
import logo from "../../assets/favicon/favicon.ico";
// The local image import caused an error.
// It has been replaced with a placeholder URL.
// You can replace this with your actual hosted logo URL.
const esnLogo = logo;

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
}

// Menu items definition remains the same
const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <Icon name="event" size="md" />,
  },
  {
    name: "Events",
    path: "/admin/events",
    icon: <Icon name="calendar" size="md" />,
  },
  {
    name: "Registrations",
    path: "/admin/registrations",
    icon: <Icon name="bookmark" size="md" />,
  },
  {
    name: "Users",
    path: "/admin/users",
    adminOnly: true,
    icon: <Icon name="users" size="md" />,
  },

  {
    name: "Settings",
    path: "/admin/settings",
    adminOnly: true,
    icon: <Icon name="settings" size="md" />,
  },
];

export const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderNavLink = (item: MenuItem, isMobile: boolean = false) => {
    const isActive = isActiveLink(item.path);
    const baseClasses =
      "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors";
    const mobileClasses = `px-3 py-2.5 ${isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
      }`;
    const desktopClasses = `px-3 py-2 ${isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-900"
      }`;

    return (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={isMobile ? closeMobileMenu : undefined}
        className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses
          }`}
      >
        <span className={isActive ? "text-blue-600" : "text-gray-400"}>
          {item.icon}
        </span>
        <span className="truncate">{item.name}</span>
        {item.badge && (
          <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Primary Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <NavLink
              to="/admin"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <img
                src={esnLogo}
                alt="ESN Logo"
                className="h-8 w-auto rounded"
              />
              <span className="text-lg font-bold text-gray-900 hidden sm:inline">
                ESN Admin
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => renderNavLink(item))}
            </nav>
          </div>

          {/* Right side Actions & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/admin/events/new"
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Event
            </NavLink>

            <NavLink
              to="/"
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Site
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                // X Icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200" id="mobile-menu">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => renderNavLink(item, true))}
            {/* Mobile-only action buttons */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
              <NavLink
                to="/admin/events/new"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Event
              </NavLink>
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Site
              </NavLink>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                ESN Event Management v1.0.0
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
