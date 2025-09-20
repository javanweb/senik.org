import React from 'react';
import type { FeatureData } from '../types';
import { PlusIcon } from './Icons';
import type { SiteContent } from '../siteData';

interface FeaturesProps {
  content: SiteContent['features'];
}

const FeatureCard: React.FC<{ feature: FeatureData }> = ({ feature }) => (
  <div className="bg-[var(--color-card-background)] rounded-3xl p-8 shadow-lg shadow-gray-200/50 transition-all duration-300 flex flex-col h-full border border-[var(--color-border)] hover:shadow-xl hover:-translate-y-1">
    <div className="flex flex-col items-center text-center mb-6">
      <img src={feature.icon} alt={feature.title} className="w-16 h-16 object-contain mb-4" />
      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{feature.title}</h3>
    </div>
    <ul className="space-y-4 text-[var(--color-text-secondary)] list-disc pr-5 flex-grow">
      {feature.points.map((point, index) => (
        <li key={index} className="text-right">{point}</li>
      ))}
    </ul>
    <div className="mt-auto pt-6">
      <a href="#" className="group text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors flex items-center justify-end">
        <PlusIcon className="w-5 h-5 ml-2" />
        <span className="text-base font-medium">بیشتر بدانید</span>
      </a>
    </div>
  </div>
);

const Features: React.FC<FeaturesProps> = ({ content }) => {
  return (
    <section id="features" className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">{content.title}</h2>
          <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(content.items || []).map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;