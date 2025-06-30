// frontend/src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserButton, useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { GET_MY_PROFILE } from "../../lib/graphql/users";

export const Navbar: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: profileData } = useQuery(GET_MY_PROFILE, {
    skip: !user,
  });

  const userRole = profileData?.myProfile?.role;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);
  const isOrganizer = ["ORGANIZER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">ESN</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Events</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Main Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Navigation */}
              <SignedIn>
                {isOrganizer && (
                  <div className="relative group">
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        location.pathname.startsWith("/admin")
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Admin
                      <svg
                        className="ml-1 w-4 h-4"
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
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {adminNavItems.map((item) => {
                          if (item.adminOnly && !isAdmin) return null;

                          return (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isActivePath(item.path)
                                  ? "bg-purple-50 text-purple-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </SignedIn>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              {/* Profile Link */}
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath("/profile")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Profile
              </Link>

              {/* User Button */}
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
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Main Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin Navigation for Mobile */}
            <SignedIn>
              {isOrganizer && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </div>
                  {adminNavItems.map((item) => {
                    if (item.adminOnly && !isAdmin) return null;

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActivePath(item.path)
                            ? "bg-purple-100 text-purple-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Profile Link for Mobile */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActivePath("/profile")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Profile
                </Link>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/sign-in");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/sign-up");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};
