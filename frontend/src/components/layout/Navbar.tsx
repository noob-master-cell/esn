import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserButton, useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { GET_MY_PROFILE } from "../../lib/graphql/users";
import logo from "../../assets/favicon/favicon.ico";

export const Navbar: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const { data: profileData } = useQuery(GET_MY_PROFILE, {
    skip: !user,
  });

  const userRole = profileData?.myProfile?.role;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);
  const isOrganizer = ["ORGANIZER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Events",
      path: "/events",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const adminNavItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Events", path: "/admin/events" },
    { name: "Users", path: "/admin/users", adminOnly: true },
    { name: "Registrations", path: "/admin/registrations" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="ESN Logo" className="w-8 h-8" />
                <span className="text-xl font-semibold text-gray-900">
                  ESN Kaiserslautern
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-1">
              {/* Main Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Dropdown */}
              <SignedIn>
                {isOrganizer && (
                  <div className="relative">
                    <button
                      onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                        location.pathname.startsWith("/admin")
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Admin
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          adminDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {adminDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                        <div className="py-1">
                          {adminNavItems.map((item) => {
                            if (item.adminOnly && !isAdmin) return null;
                            return (
                              <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setAdminDropdownOpen(false)}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  isActivePath(item.path)
                                    ? "bg-purple-50 text-purple-700"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </SignedIn>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              <SignedIn>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath("/profile")
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Profile
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </SignedIn>

              <SignedOut>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate("/sign-in")}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Top Bar for Mobile */}
        <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="ESN Logo" className="w-8 h-8" />
                <span className="text-lg font-semibold text-gray-900">
                  ESN KL
                </span>
              </Link>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </SignedIn>

              <SignedOut>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg"
                >
                  Sign In
                </button>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-4 py-2">
            {/* Home & Events */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center py-2 px-1 transition-colors ${
                  isActivePath(item.path) ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActivePath(item.path) ? "bg-blue-50" : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium mt-1">{item.name}</span>
              </Link>
            ))}

            {/* Profile */}
            <SignedIn>
              <Link
                to="/profile"
                className={`flex flex-col items-center py-2 px-1 transition-colors ${
                  isActivePath("/profile") ? "text-green-600" : "text-gray-500"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActivePath("/profile") ? "bg-green-50" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium mt-1">Profile</span>
              </Link>
            </SignedIn>

            {/* Admin */}
            <SignedIn>
              {isOrganizer && (
                <Link
                  to="/admin"
                  className={`flex flex-col items-center py-2 px-1 transition-colors ${
                    location.pathname.startsWith("/admin")
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      location.pathname.startsWith("/admin")
                        ? "bg-purple-50"
                        : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium mt-1">Admin</span>
                </Link>
              )}
            </SignedIn>

            <SignedOut>
              <button
                onClick={() => navigate("/sign-up")}
                className="flex flex-col items-center py-2 px-1 text-gray-500 transition-colors"
              >
                <div className="p-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium mt-1">Join</span>
              </button>
            </SignedOut>
          </div>
        </div>

        {/* Bottom padding to prevent content overlap */}
        <div className="h-20"></div>
      </div>
    </>
  );
};
