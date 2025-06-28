// frontend/src/components/layout/Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "../ui/Button";

const ESNLogo = () => (
  <Link to="/" className="flex items-center gap-2">
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="14" cy="14" r="14" fill="#1E1E1E" />
      <circle cx="14" cy="14" r="10" fill="white" />
      <circle cx="14" cy="14" r="6" fill="#1E1E1E" />
    </svg>
    <span className="text-2xl font-bold text-gray-900 tracking-tighter">
      ESN
    </span>
  </Link>
);

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();

  // Helper function to determine if link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Helper function for link classes
  const getLinkClasses = (path: string) => {
    const baseClasses = "transition-colors duration-300 font-medium";
    return isActive(path)
      ? `${baseClasses} text-blue-600 border-b-2 border-blue-600 pb-1`
      : `${baseClasses} text-gray-600 hover:text-blue-600`;
  };

  return (
    <header
      id="header"
      className="bg-white/80 backdrop-blur-lg sticky w-full top-0 z-50 transition-all duration-300 border-b"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <ESNLogo />

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm">
            <Link to="/" className={getLinkClasses("/")}>
              Home
            </Link>
            <Link to="/events" className={getLinkClasses("/events")}>
              Events
            </Link>
            <Link to="/about" className={getLinkClasses("/about")}>
              About Us
            </Link>
            <Link to="/partners" className={getLinkClasses("/partners")}>
              Partners
            </Link>
            <Link to="/contact" className={getLinkClasses("/contact")}>
              Contact
            </Link>
            <SignedIn>
              <Link to="/debug" className={getLinkClasses("/debug")}>
                Debug
              </Link>
            </SignedIn>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              <span className="hidden sm:inline text-gray-700 text-sm">
                Welcome, {user?.firstName}!
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Become a Member</Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};
