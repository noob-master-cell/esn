import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Button } from "../ui/Button";
import esnLogo from "../../assets/favicon/mstile-70x70.png";

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClasses = "bg-white shadow-sm text-gray-900";
  const inactiveClasses = "text-gray-500 hover:text-gray-800 hover:bg-white/50";

  return (
    <Link
      to={to}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavButton = ({
  to,
  children,
  icon,
}: {
  to?: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  const content = (
    <div className="flex flex-col items-center justify-center py-3">
      <div
        className={`${
          isActive ? "text-blue-600" : "text-gray-500"
        } mb-1 transition-colors duration-200`}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-medium ${
          isActive ? "text-blue-600" : "text-gray-500"
        } transition-colors duration-200`}
      >
        {children}
      </span>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="flex-1 hover:bg-gray-50 transition-colors duration-200 rounded-lg mx-1"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex-1 hover:bg-gray-50 transition-colors duration-200 rounded-lg mx-1">
      {content}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 hidden lg:block">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo (Left) */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={esnLogo} alt="ESN Logo" className="h-8 w-8" />
              <span className="font-bold text-lg text-gray-800">
                ESN Kaiserslautern
              </span>
            </Link>

            {/* Nav Links (Center) */}
            <div className="flex flex-1 justify-center">
              <div className="flex bg-gray-100 rounded-full px-2 py-1 space-x-1">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/events">Events</NavLink>
                <button className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-white/50 transition-all duration-200">
                  Install App
                </button>
              </div>
            </div>

            {/* Auth Buttons (Right) */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "shadow-lg",
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm font-medium hover:bg-gray-100"
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="rounded-full text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                    Start Free Trial
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Header (Top) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <nav className="px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={esnLogo} alt="ESN Logo" className="h-8 w-8" />
              <span className="font-bold text-lg text-gray-800">
                ESN Kaiserslautern
              </span>
            </Link>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden shadow-lg">
        <div className="flex items-center px-2 py-1">
          <MobileNavButton
            to="/"
            icon={<img src={esnLogo} alt="Home" className="w-6 h-6" />}
          >
            Home
          </MobileNavButton>

          <MobileNavButton
            to="/events"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          >
            Events
          </MobileNavButton>

          <MobileNavButton
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            }
          >
            Install
          </MobileNavButton>

          <SignedOut>
            <div className="flex-1 hover:bg-gray-50 transition-colors duration-200 rounded-lg mx-1">
              <SignInButton>
                <button className="w-full flex flex-col items-center justify-center py-3">
                  <svg
                    className="w-6 h-6 text-gray-500 mb-1 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 transition-colors duration-200">
                    Login
                  </span>
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <MobileNavButton
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              Profile
            </MobileNavButton>
          </SignedIn>
        </div>
      </nav>

      {/* Mobile Menu Overlay (for sign up when signed out) */}
      <SignedOut>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
            <div className="fixed bottom-20 left-4 right-4 bg-white rounded-xl p-6 shadow-2xl">
              <div className="space-y-4">
                <SignUpButton>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join ESN
                  </Button>
                </SignUpButton>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </SignedOut>

      {/* Add bottom padding to prevent content from being hidden behind bottom nav on mobile */}
      <div className="pb-20 lg:pb-0" />
    </>
  );
};
// ...existing code...
<MobileNavButton
  to="/"
  icon={<img src={esnLogo} alt="Home" className="w-8 h-8" />}
>
  Home
</MobileNavButton>;
// ...existing code...
{
  /* Add bottom padding to prevent content from being hidden behind bottom nav on mobile */
}
<div className="pb-24 lg:pb-0" />;
// ...existing code...
