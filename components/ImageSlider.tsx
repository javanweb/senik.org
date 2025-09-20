import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ImageSliderProps {
  slides: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 4000); // Changed to 4 seconds
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="h-full w-full relative group overflow-hidden rounded-lg">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out" // Slide animation
        style={{ transform: `translateX(${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{ backgroundImage: `url(${slide})` }}
            className="w-full h-full flex-shrink-0 bg-center bg-cover"
          ></div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            aria-label="Previous image"
            className="rounded-full p-2 bg-[#009688]/60 text-white cursor-pointer hover:bg-[#009688] transition-all duration-300 transform hover:scale-110" 
            onClick={goToPrevious}>
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          <button
            aria-label="Next image" 
            className="rounded-full p-2 bg-[#009688]/60 text-white cursor-pointer hover:bg-[#009688] transition-all duration-300 transform hover:scale-110" 
            onClick={goToNext}>
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center space-x-2" dir="ltr">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            aria-label={`Go to slide ${slideIndex + 1}`}
            onClick={() => goToSlide(slideIndex)}
            className={`cursor-pointer h-2.5 w-2.5 rounded-full transition-all duration-500 ease-in-out ${
              currentIndex === slideIndex ? 'bg-[#009688] w-6' : 'bg-white/70 hover:bg-white'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;