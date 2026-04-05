import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

const Hero = () => {
  const images = ["/hero1.png", "/hero2.png", "/hero3.png"];
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Manual controls
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section className="group relative w-full h-[40vh] md:h-[65vh] overflow-hidden bg-gray-900">
      {/* Slides Wrapper */}
      <div
        className="flex h-full transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={img} className="relative min-w-full h-full">
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
            {/* Elegant dark gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 p-2 md:p-3 rounded-full 
        bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white 
        transition-all duration-300 opacity-0 md:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 p-2 md:p-3 rounded-full 
        bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white 
        transition-all duration-300 opacity-0 md:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Modern Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out
              ${
                current === idx
                  ? "w-8 md:w-10 bg-white" // Active: Pill shape
                  : "w-2 md:w-2.5 bg-white/50 hover:bg-white/80" // Inactive: Circle
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;