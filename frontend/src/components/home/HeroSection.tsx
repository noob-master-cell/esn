import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

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
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40" />
        </div>
      ))}
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

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
            <span className="block text-cyan-400 font-semibold tracking-widest uppercase text-sm">
              Erasmus Student Network
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Discover Your <br />
              <span className="text-cyan-400">
                Global Family
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed font-normal">
              Join the heartbeat of international student life in Kaiserslautern.
              Create unforgettable memories, explore new cultures, and make friends that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate("/events")}
                className="px-8 py-4 !bg-cyan-600 !text-white rounded-xl font-semibold hover:!bg-cyan-500 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-lg"
              >
                Explore Events
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              {!isSignedIn && (
                <Button
                  onClick={() => navigate("/sign-up")}
                  variant="outline"
                  className="px-8 py-4 !bg-transparent !text-white border !border-white/30 rounded-xl font-semibold hover:!bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-lg"
                >
                  Become a Member
                </Button>
              )}
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Students</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Events/Year</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-white">1</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Family</div>
              </div>
            </div>
          </div>

          {/* Right Side - Clean Image Grid */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4 translate-y-8">
                <div className="h-64 rounded-2xl bg-gray-800 overflow-hidden relative shadow-xl">
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=3432&auto=format&fit=crop" alt="Friends" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="h-48 rounded-2xl bg-gray-800 overflow-hidden relative shadow-xl">
                  <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 rounded-2xl bg-gray-800 overflow-hidden relative shadow-xl">
                  <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop" alt="Party" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="h-64 rounded-2xl bg-gray-800 overflow-hidden relative shadow-xl">
                  <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" alt="Group" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
