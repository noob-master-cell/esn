import React from "react";
import logo from "../../assets/favicon/favicon.ico";

const ESNLogo: React.FC = () => (
  <a
    href="#"
    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
  >
    <img src={logo} alt="ESN Logo" className="logo-image w-8 h-8" />
    <span className="text-xl font-bold text-white tracking-tighter">
      ESN Kaiserslautern
    </span>
  </a>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-100 pb-10 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About ESN</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Erasmus Student Network supports international students and
              promotes student mobility across Europe.
            </p>
            <ESNLogo />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Events
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Membership
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Blog
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                FAQ
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
            <div className="text-sm text-gray-300">
              <p>Email: info@esn.org</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">
                © {currentYear} Erasmus Student Network. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Website developed by{" "}
                <span className="font-semibold text-gray-300">
                  Dheeraj Karwasra
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};