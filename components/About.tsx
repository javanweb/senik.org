import React from 'react';
import { CheckCircleIcon } from './Icons';
import type { SiteContent } from '../siteData';

interface AboutProps {
  content: SiteContent['about'];
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section className="py-24 bg-[var(--color-card-background)] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 w-full lg:pr-8">
            <span className="text-sm font-bold text-[var(--color-primary)] tracking-wider uppercase">تاریخچه ما</span>
            <h2 className="text-4xl font-extrabold my-4 text-[var(--color-text-primary)]">{content.title}</h2>
            <p className="text-[var(--color-text-secondary)] leading-loose mb-8">
              {content.paragraph}
            </p>
            
            <ul className="space-y-4 mb-10">
              {(content.timeline || []).map((event, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    <span className="font-semibold">{event.year}:</span> {event.description}
                  </p>
                </li>
              ))}
            </ul>

            <a href="#" className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-primary)] font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105">
                {content.cta}
            </a>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center mt-12 lg:mt-0">
            <img 
              src={content.imageUrl}
              alt="About Senik"
              className="rounded-2xl shadow-2xl object-contain max-h-[36rem] w-auto transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;