
import React from 'react';
import type { NavLink, Sublink } from '../siteData';
import SiteSazRenderer from './SiteSazRenderer';
import type { CanvasElement } from '../sitesaz/types';

interface PageViewProps {
  page: NavLink | Sublink;
}

const isJsonString = (str: string | undefined): str is string => {
    if (typeof str !== 'string' || !str) return false;
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed);
    } catch (e) {
        return false;
    }
};

const PageView: React.FC<PageViewProps> = ({ page }) => {
  const content = page.content;
  const isSiteSazContent = isJsonString(content);

  // If content is from SiteSaz, render it in a container that can grow to fill the available space.
  // This allows full-width widgets to behave correctly without being constrained by padding.
  if (isSiteSazContent) {
    const elements: CanvasElement[] = JSON.parse(content);
    return (
      <div className="flex-grow">
        <SiteSazRenderer elements={elements} />
      </div>
    );
  }
  
  // Fallback for old Quill content, keeping the original padding and container structure.
  return (
    <div style={{ backgroundColor: 'var(--color-card-background)' }} className="py-16 sm:py-24">
      <style>{`
        /* Default styles for content rendered from Quill's delta format */
        .page-content-fallback h1 { font-size: 2.25rem; line-height: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; margin-top: 2.5rem; color: var(--color-text-primary); }
        .page-content-fallback h2 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; margin-bottom: 1.25rem; margin-top: 2rem; color: var(--color-text-primary); }
        .page-content-fallback h3 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; margin-bottom: 1rem; margin-top: 1.5rem; color: var(--color-text-primary); }
        .page-content-fallback p { font-size: 1.125rem; line-height: 1.75rem; margin-bottom: 1.25rem; color: var(--color-text-secondary); }
        .page-content-fallback a { color: var(--color-primary); text-decoration: underline; }
        .page-content-fallback { color: var(--color-text-secondary); }
      `}</style>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
             <>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8 pb-4 border-b-2" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-primary)'}}>
                    {page.name}
                </h1>
                <div
                    className="page-content-fallback prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content || '<p>این صفحه هنوز محتوایی ندارد.</p>' }}
                />
             </>
        </div>
      </div>
    </div>
  );
};

export default PageView;