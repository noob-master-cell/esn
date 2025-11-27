import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useMyProfile } from "../../hooks/api/useUsers";
import { Avatar } from "../ui/Avatar";
import logo from "../../assets/logos/star-color.svg";
import {
  HomeIcon,
  CalendarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
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
    { name: "Feedback", path: "/feedback", icon: ChatBubbleLeftRightIcon },
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

  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  return (
    <>
      <nav
        className={`top-0 z-40 transition-all duration-700 ease-in-out w-full ${isHomePage ? "fixed" : "sticky"
          } ${isTransparent
            ? "bg-transparent border-b border-transparent"
            : "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logo} alt="ESN" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                <div className="flex flex-col">
                  <span className={`text-lg font-bold tracking-tight leading-none ${isTransparent ? "text-white drop-shadow-md" : "text-gray-900"}`}>ESN</span>
                  <span className={`text-xs font-medium tracking-wide ${isTransparent ? "text-gray-200 drop-shadow-md" : "text-gray-500"}`}>Kaiserslautern</span>
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
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                    : isTransparent
                      ? "text-white hover:text-cyan-400 hover:bg-white/10"
                      : "text-gray-600 hover:text-cyan-600 hover:bg-cyan-50"
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
                    : isTransparent
                      ? "text-white hover:text-indigo-400 hover:bg-white/10"
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
                    <Avatar
                      src={profileData?.avatar}
                      alt="Profile"
                      fallback={profileData?.firstName?.[0] || user?.name?.[0] || "U"}
                      size="sm"
                      className="ring-1 ring-gray-200"
                    />
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
                    className={`text-sm font-medium transition-colors ${isTransparent ? "text-white hover:text-cyan-400" : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="px-5 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-full hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-600/30 transition-all transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Feedback Button */}
            <div className="flex md:hidden items-center">
              <Link
                to="/feedback"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${isTransparent
                  ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-cyan-600"
                  }`}
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Feedback</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
