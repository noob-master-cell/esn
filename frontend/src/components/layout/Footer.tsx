import React from "react";

const ESNLogo = () => (
  <a href="#" className="flex items-center gap-2">
    <svg
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="14" cy="14" r="14" fill="white" />
      <circle cx="14" cy="14" r="10" fill="#1E1E1E" />
      <circle cx="14" cy="14" r="6" fill="white" />
    </svg>
    <span className="text-xl font-bold text-white tracking-tighter">ESN</span>
  </a>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-8 mt-8">
          <div className="space-y-3">
            <a href="#" className="hover:text-white">
              Events
            </a>
          </div>
          <div className="space-y-3">
            <a href="#" className="hover:text-white">
              About Us
            </a>
          </div>
          <div className="space-y-3">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </div>
          <div className="space-y-3">
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Website by</p>
            <p className="font-bold text-white">Your Name</p>
          </div>
          <div className="flex items-center gap-4">
            <ESNLogo />
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
