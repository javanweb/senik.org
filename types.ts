

import type React from 'react';

export interface Feature {
  icon: React.ElementType;
  title: string;
  points: string[];
}

export interface FeatureData {
  icon: string;
  title: string;
  points: string[];
}

export interface TimelineEvent {
  year: string;
  description: string;
}

export type DashboardViewType = 'dashboard' | 'users' | 'reports' | 'tutorials' | 'settings' | 'siteData' | 'pageEditor' | 'theme';

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
}

// FIX: Add missing types for PageEditorView
export type Device = 'desktop' | 'tablet' | 'mobile';

export type Responsive<T> = {
    desktop: T;
    tablet?: T;
    mobile?: T;
};

export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'divider' | 'video' | 'container';

export type SpacingValue = { top: string; right: string; bottom: string; left: string; };

export interface BlockSettings {
    // Common
    textAlign?: Responsive<'left' | 'center' | 'right'>;
    padding?: Responsive<SpacingValue>;
    margin?: Responsive<SpacingValue>;
    color?: string;
    backgroundColor?: string;
    width?: Responsive<string>;
    height?: string;
    fontSize?: Responsive<string>;
    
    // Heading
    text?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    // Text
    html?: string;
    
    // Image
    src?: string;
    alt?: string;

    // Button
    href?: string;
    variant?: 'primary' | 'secondary';

    // Divider
    dividerStyle?: 'solid' | 'dashed' | 'dotted';

    // Video
    url?: string;
}

export interface Block {
    id: string;
    type: BlockType;
    settings: BlockSettings;
    children?: Block[];
}
