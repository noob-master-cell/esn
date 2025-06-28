import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558228134-2e8a5f799298?q=80&w=2512&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518152006812-edab29b0a9ac?q=80&w=2512&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?q=80&w=2512&auto=format&fit=crop",
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
    <div
      id="hero-slideshow"
      className="lg:col-span-7 h-full min-h-[50vh] lg:min-h-[70vh]"
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`ESN Activity ${index + 1}`}
          className={index === currentIndex ? "active" : ""}
        />
      ))}
    </div>
  );
};

export const HeroSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 md:py-12">
      <div className="grid lg:grid-cols-10 gap-8 items-center min-h-[70vh]">
        <HeroSlideshow />
        <div className="lg:col-span-3 flex flex-col justify-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 text-center lg:text-left">
            Your Home Away From Home
          </h1>
          <div className="space-y-4">
            <a
              href="#"
              className="card bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 text-left hover:bg-gray-50 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=100&h=100&fit=crop"
                className="h-16 w-16 rounded-xl object-cover"
                alt="ESN Welcome Party"
              />
              <div>
                <p className="font-semibold text-black">Welcome Party</p>
                <p className="text-sm text-gray-600">
                  Meet new friends from all over the world.
                </p>
              </div>
            </a>
            <a
              href="#"
              className="card bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 text-left hover:bg-gray-50 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=100&h=100&fit=crop"
                className="h-16 w-16 rounded-xl object-cover"
                alt="ESN educational event"
              />
              <div>
                <p className="font-semibold text-black">Cultural Nights</p>
                <p className="text-sm text-gray-600">
                  Share your culture and discover others.
                </p>
              </div>
            </a>
            <a
              href="#"
              className="card bg-blue-500 p-4 rounded-2xl shadow-sm text-white hover:bg-blue-600 transition-all"
            >
              <p className="font-semibold">Join the ESN Community</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm opacity-90">
                  Become a member today!
                </span>
                <span className="card-arrow text-lg">&rarr;</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
