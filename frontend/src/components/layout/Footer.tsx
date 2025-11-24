import React from "react";
import logo from "../../assets/favicon/favicon.ico";

const ESNLogo: React.FC = () => (
  <a
    href="#"
    className="flex items-center gap-2 group transition-all duration-300"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <img
        src={logo}
        alt="ESN Logo"
        className="logo-image w-9 h-9 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
      ESN Kaiserslautern
    </span>
  </a>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      url: "#",
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500"
    },
    {
      name: "Facebook",
      icon: "fab fa-facebook",
      url: "#",
      color: "hover:bg-blue-600"
    },
    {
      name: "Twitter",
      icon: "fab fa-twitter",
      url: "#",
      color: "hover:bg-sky-500"
    },
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin",
      url: "#",
      color: "hover:bg-blue-700"
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 border-t border-gray-800">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              About ESN
              <span className="flex-1 max-w-[40px] h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Erasmus Student Network supports international students and
              promotes student mobility across Europe.
            </p>
            <div className="pt-2">
              <ESNLogo />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              Quick Links
              <span className="flex-1 max-w-[40px] h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></span>
            </h3>
            <nav className="flex flex-col gap-2.5">
              {["Events", "About Us", "Membership", "Blog"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="group flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200 w-fit"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              Support
              <span className="flex-1 max-w-[40px] h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></span>
            </h3>
            <nav className="flex flex-col gap-2.5">
              {["Contact", "FAQ", "Help Center", "Privacy Policy"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="group flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200 w-fit"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              Connect
              <span className="flex-1 max-w-[40px] h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></span>
            </h3>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`bg-gray-800 p-2.5 rounded-lg border border-gray-700 hover:border-gray-600 ${social.color} text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110`}
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
            <div className="space-y-2.5 pt-2">
              <a href="mailto:info@esn.org" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                <i className="fas fa-envelope w-4 text-center"></i>
                <span>info@esn.org</span>
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                <i className="fas fa-phone w-4 text-center"></i>
                <span>+1 (555) 123-4567</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <p className="text-gray-300">
                © {currentYear} <span className="text-white font-semibold">Erasmus Student Network</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-center md:justify-start gap-1.5">
                <span>Made with</span>
                <i className="fas fa-heart text-red-500 text-xs animate-pulse"></i>
                <span>by</span>
                <span className="font-semibold text-cyan-400">
                  Dheeraj Karwasra
                </span>
              </p>
            </div>

            <nav className="flex items-center gap-5 flex-wrap justify-center">
              {["Terms", "Privacy", "Cookies"].map((link, index) => (
                <React.Fragment key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                  {index < 2 && <span className="text-gray-700">•</span>}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};