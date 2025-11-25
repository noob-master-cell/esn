import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useMyProfile } from "../../hooks/api/useUsers";
import logo from "../../assets/favicon/favicon.ico";
import {
  HomeIcon,
  CalendarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user: profileData } = useMyProfile({
    skip: !user,
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userRole = profileData?.role;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);
  const isOrganizer = ["ORGANIZER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Events", path: "/events", icon: CalendarIcon },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <img src={logo} alt="ESN" className="w-6 h-6 object-contain" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 tracking-tight leading-none">ESN</span>
                  <span className="text-xs font-medium text-gray-500 tracking-wide">Kaiserslautern</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActivePath(item.path)
                    ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Link */}
              {(isAdmin || isOrganizer) && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${location.pathname.startsWith("/admin")
                    ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden">
                        {profileData?.avatar ? (
                          <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs font-bold text-gray-600">
                            {profileData?.firstName?.[0] || user?.name?.[0] || "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {profileData?.firstName || "Account"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 z-40 overflow-hidden transform transition-all">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {profileData?.firstName} {profileData?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <UserCircleIcon className="w-5 h-5 text-gray-400" />
                            My Profile
                          </Link>
                          {(isAdmin || isOrganizer) && (
                            <Link
                              to="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/sign-in"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-black hover:shadow-lg hover:shadow-gray-900/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
