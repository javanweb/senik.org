import React from 'react';
import { SenikLogo } from './Icons';
import type { SiteContent } from '../siteData';

interface AnalyticsProps {
  content: SiteContent['analytics'];
}

const Analytics: React.FC<AnalyticsProps> = ({ content }) => {
  return (
    <section className="py-20 bg-[var(--color-card-background)] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-text-primary)]">{content.title1}</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {content.paragraph1}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[var(--color-background)] p-2 rounded-full shadow-md">
                    <SenikLogo className="w-8 h-8 text-[var(--color-primary)]"/>
                  </div>
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">{content.title2}</h2>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {content.paragraph2}
              </p>
                 <a href="#" className="inline-block mt-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-primary)] font-bold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105">
                    {content.cta}
                </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <img 
              src={content.imageUrl}
              alt="Analytics visual representation"
              className="rounded-2xl shadow-lg border border-[var(--color-border)] object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;