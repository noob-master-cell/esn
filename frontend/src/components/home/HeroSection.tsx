import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop", // Students studying/talking
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=3432&auto=format&fit=crop", // Group of friends
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop", // Party/Social
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop", // Students group
];

const HeroSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={src}
            alt={`ESN Moment ${index + 1}`}
            className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
          />
          {/* Enhanced Gradient Overlays for Visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40" />
        </div>
      ))}
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden flex items-center">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <HeroSlideshow />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
              Welcome to <br />
              <span className="text-cyan-400 drop-shadow-md">
                ESN Kaiserslautern
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed font-medium drop-shadow-lg bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              Join a vibrant community of international students. Create unforgettable memories, explore new cultures, and make friends for life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/events")}
                className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-bold hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-cyan-400/30"
              >
                Explore Events
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/30 rounded-2xl font-bold hover:bg-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Become a Member
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white drop-shadow-md">500+</div>
                <div className="text-sm text-cyan-200 font-medium">Students</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div>
                <div className="text-3xl font-bold text-white drop-shadow-md">50+</div>
                <div className="text-sm text-pink-200 font-medium">Events/Year</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div>
                <div className="text-3xl font-bold text-white drop-shadow-md">1</div>
                <div className="text-sm text-orange-200 font-medium">Family</div>
              </div>
            </div>
          </div>

          {/* Right Side - Decorative Image Grid */}
          <div className="hidden lg:block relative">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen animate-blob" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4 translate-y-8">
                <div className="h-48 rounded-2xl bg-gray-800 overflow-hidden relative border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                <div className="h-64 rounded-2xl bg-gray-800 overflow-hidden relative border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop" alt="Party" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 rounded-2xl bg-gray-800 overflow-hidden relative border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=3432&auto=format&fit=crop" alt="Friends" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                <div className="h-48 rounded-2xl bg-gray-800 overflow-hidden relative border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" alt="Group" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
