import React from 'react';
import { PlayIcon } from './Icons';
import type { SiteContent } from '../siteData';

interface HeroProps {
  content: SiteContent['hero'];
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ content, onCtaClick }) => {
  return (
    <section className="relative hero-gradient text-[var(--color-text-primary)] pt-24 pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          
          <div className="lg:w-6/12 text-center lg:text-right">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-down">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[var(--color-text-secondary)] mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {content.subtitle}
            </p>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto lg:mx-0 mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={onCtaClick}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-primary)] font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 animate-pulse-glow"
              >
                {content.cta_primary}
              </button>
              <a
                href="#contact"
                className="bg-[var(--color-secondary)] hover:bg-gray-600 text-[var(--color-text-on-primary)] font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <PlayIcon className="w-6 h-6" />
                <span>{content.cta_secondary}</span>
              </a>
            </div>
          </div>
          
          <div className="lg:w-4/12 flex justify-center items-center mt-12 lg:mt-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative group">
                <div className="absolute -inset-4 bg-[var(--color-primary)]/30 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-all duration-300 animate-pulse-slow"></div>
                <img 
                    src={content.imageUrl} 
                    alt="Business software interaction" 
                    className="relative rounded-2xl shadow-2xl w-full max-w-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ aspectRatio: '4/3' }}
                />
            </div>
          </div>

        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]" style={{ transform: 'translateY(1px)' }}>
          <svg preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="block w-[calc(100%)] h-[120px]">
              <path d="M0 31.2543C288 -31.2543 576 93.7628 864 80.0107C1152 66.2586 1440 -1.25427 1440 47.4984V120H0V31.2543Z" style={{ fill: 'var(--color-background)' }}></path>
          </svg>
      </div>

    </section>
  );
};

export default Hero;