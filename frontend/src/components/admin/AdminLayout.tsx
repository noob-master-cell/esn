import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/favicon/favicon.ico";
// --- AdminNavbar Component ---
// To resolve the import error, the AdminNavbar component is now defined
// directly within this file.

const esnLogo = logo;

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
}

import {
  Squares2X2Icon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <Squares2X2Icon className="w-5 h-5" />,
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  {
    name: "Registrations",
    href: "/admin/registrations",
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
  },
  {
    name: "Users",
    href: "/admin/users",
    adminOnly: true,
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    adminOnly: true,
    icon: <Cog6ToothIcon className="w-5 h-5" />,
  },
];

// --- AdminLayout Component ---

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Modern Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            <NavLink to="/admin" className="flex items-center gap-3">
              <img src={esnLogo} alt="ESN Logo" className="h-9 w-auto" />
              <span className="text-lg font-bold text-gray-900 hidden sm:inline">Admin Panel</span>
            </NavLink>

            <div className="flex items-center gap-3">
              <NavLink
                to="/"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </NavLink>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation - Clean Tabs */}
          <nav className="hidden lg:flex items-center gap-1 -mb-px">
            {menuItems.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${isActive
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                >
                  <span className={isActive ? "text-cyan-500" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1 bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Navigation Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl p-6 flex flex-col animate-slideInRight">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  {menuItems.map((item) => {
                    const isActive = isActiveLink(item.href);
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                          ? "bg-cyan-50 text-cyan-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <span className={isActive ? "text-cyan-600" : "text-gray-400"}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Site
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};
