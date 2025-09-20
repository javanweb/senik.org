export type WidgetType = 
  // Basic
  | 'heading' 
  | 'image' 
  | 'text-editor' 
  | 'button'
  | 'spacer'
  | 'divider'
  | 'icon'
  | 'inner-section'
  | 'video'
  | 'star-rating'
  | 'google-maps'
  | 'image-box'
  | 'icon-box'
  | 'basic-gallery'
  | 'image-carousel'
  | 'icon-list'
  | 'counter'
  | 'testimonial'
  | 'tabs'
  | 'accordion'
  | 'toggle'
  | 'social-icons'
  | 'progress-bar'
  | 'soundcloud'
  | 'html'
  | 'alert'
  | 'text-path'
  | 'container';

export type ElementType = 'section' | 'column' | 'widget';

export interface CanvasElement {
  id: string;
  type: ElementType;
  widgetType?: WidgetType;
  settings: { [key: string]: any };
  children: CanvasElement[];
}
