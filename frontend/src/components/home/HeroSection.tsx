import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8NGslMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwNGt8ZW58MHx8MHx8fDA%3D",
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
            Welcome to ESN Kaiserslautern
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
          </div>
        </div>
      </div>
    </section>
  );
};
