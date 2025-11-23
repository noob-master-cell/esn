// src/components/ui/Carousel.tsx
import React, { useEffect, useState } from "react";

interface CarouselProps {
    images: string[]; // absolute URLs or imported assets
    intervalMs?: number; // time between slides
}

export const Carousel: React.FC<CarouselProps> = ({ images, intervalMs = 5000 }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return undefined;
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, intervalMs);
        return () => clearInterval(id);
    }, [images, intervalMs]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {images.map((src, idx) => (
                <img
                    key={idx}
                    src={src}
                    alt={`slide-${idx}`}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${idx === current ? "opacity-100" : "opacity-0"}`}
                />
            ))}
            {/* Simple indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`block w-2 h-2 rounded-full ${idx === current ? "bg-white" : "bg-white/40"}`}
                    />
                ))}
            </div>
        </div>
    );
};
