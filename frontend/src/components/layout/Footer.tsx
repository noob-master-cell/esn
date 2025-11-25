import React from "react";
import logo from "../../assets/favicon/favicon.ico";

const SocialLink: React.FC<{ href: string; icon: string; label: string }> = ({ href, icon, label }) => (
  <a
    href={href}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-300"
    aria-label={label}
  >
    <i className={`${icon} text-lg`}></i>
  </a>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  </li>
);

const FooterColumn: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
      {title}
    </h3>
    <ul className="space-y-3">
      {children}
    </ul>
  </div>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Brand Section - Takes up 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="ESN Logo"
                className="w-10 h-10 opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                ESN Kaiserslautern
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Supporting international students and promoting mobility across Europe.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://www.instagram.com/esn_kaiserslautern/?hl=en" icon="fab fa-instagram" label="Instagram" />
              <SocialLink href="#" icon="fab fa-facebook" label="Facebook" />
              <SocialLink href="#" icon="fab fa-twitter" label="Twitter" />
              <SocialLink href="#" icon="fab fa-linkedin" label="LinkedIn" />
            </div>
          </div>

          {/* Links Sections - Takes up 8 columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterColumn title="Organization">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Our Team</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Partners</FooterLink>
            </FooterColumn>

            <FooterColumn title="Resources">
              <FooterLink href="#">Events</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">ESNcard</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
            </FooterColumn>

            <FooterColumn title="Legal">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
            </FooterColumn>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} ESN Kaiserslautern. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <i className="fas fa-heart text-red-500 text-xs animate-pulse"></i>
            <span>by</span>
            <a
              href="https://github.com/dheerajkarwasra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Dheeraj Karwasra
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};