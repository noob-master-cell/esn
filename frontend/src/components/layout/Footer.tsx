import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logos/star-color.svg";
import unifiedBg from "../../assets/images/unified-bg.png";

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a
    href={href}
    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 text-white hover:bg-white hover:text-black transition-all duration-300"
    aria-label={label}
  >
    {icon}
  </a>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <Link
      to={href}
      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
    >
      {children}
    </Link>
  </li>
);

const FooterColumn: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="text-base font-bold text-white">
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
    <footer
      className="w-full py-12 relative"
      style={{
        backgroundImage: `url(${unifiedBg})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-[90rem] mx-auto px-4 md:px-6">
        <div className="bg-[#0f1115] rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Left Column - Brand & Newsletter */}
            <div className="lg:col-span-5 space-y-8">
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="ESN Logo" className="w-10 h-10" />
                <span className="text-2xl font-bold tracking-tight">ESN Kaiserslautern</span>
              </Link>

              <p className="text-gray-400 text-base leading-relaxed max-w-md">
                Subscribe to our newsletter to get the latest ESN news, event updates, and community stories delivered straight to your inbox.
              </p>

              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <SocialLink href="#" icon={<i className="fab fa-facebook-f"></i>} label="Facebook" />
                <SocialLink href="#" icon={<i className="fab fa-linkedin-in"></i>} label="LinkedIn" />
                <SocialLink href="#" icon={<i className="fab fa-twitter"></i>} label="Twitter" />
                <SocialLink href="https://www.instagram.com/esn_kaiserslautern/?hl=en" icon={<i className="fab fa-instagram"></i>} label="Instagram" />
              </div>
            </div>

            {/* Right Columns - Links Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
              <FooterColumn title="Organization">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/team">Our Team</FooterLink>
                <FooterLink href="/partners">Partners</FooterLink>
                <FooterLink href="/causes">ESN Causes</FooterLink>
              </FooterColumn>

              <FooterColumn title="Resources">
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="/blog">Stories</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/esncard">ESNcard</FooterLink>
              </FooterColumn>

              <FooterColumn title="Get Involved">
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/join">Join the Team</FooterLink>
                <FooterLink href="/feedback">Feedback</FooterLink>
              </FooterColumn>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p className="flex items-center gap-1">
              Made with <span className="text-red-500 animate-pulse">❤️</span> by <a href="https://github.com/dheerajkarwasra" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dheeraj Karwasra</a>
            </p>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of use</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy policy</Link>
              <span>© {currentYear} ESN Kaiserslautern</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};