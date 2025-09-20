import React from 'react';
import { CanvasElement, WidgetType } from '../types';
import * as WidgetDisplays from '../widgets/WidgetDisplay';
import { CopyIcon, TrashIcon } from './icons';

interface RenderedWidgetProps {
  element: CanvasElement;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddWidget: (parentId: string, widgetType: WidgetType) => void;
  isSelected: boolean;
  ElementRenderer: React.ForwardRefExoticComponent<any>;
}

const toPascalCase = (str: string) => {
  if (!str) return '';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const WidgetDropZone: React.FC<{ onDrop: (widgetType: WidgetType) => void }> = ({ onDrop }) => {
  const [isOver, setIsOver] = React.useState(false);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsOver(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.stopPropagation(); setIsOver(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    const widgetType = e.dataTransfer.getData('widgetType') as WidgetType;
    if (widgetType) onDrop(widgetType);
  };
  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`my-4 py-8 border-2 border-dashed rounded-md text-center transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
      <p className="text-gray-500 text-xs">ابزارک را اینجا بکشید</p>
    </div>
  );
};


const RenderedWidget: React.FC<RenderedWidgetProps> = ({ element, onSelect, onDelete, onDuplicate, isSelected, onAddWidget, ElementRenderer, ...props }) => {
  if (!element.widgetType) return null;

  const WidgetComponentName = toPascalCase(element.widgetType);
  const WidgetComponent = (WidgetDisplays as any)[WidgetComponentName] || WidgetDisplays.FallbackDisplay;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };
  
  const getAdvancedStyles = () => {
    const { advanced } = element.settings;
    if (!advanced) return {};
    const styles: React.CSSProperties = {};
    const { layout, background, border, transform } = advanced;
    if (layout?.padding) styles.padding = `${layout.padding.top}${layout.padding.unit} ${layout.padding.right}${layout.padding.unit} ${layout.padding.bottom}${layout.padding.unit} ${layout.padding.left}${layout.padding.unit}`;
    if (layout?.margin) styles.margin = `${layout.margin.top}${layout.margin.unit} ${layout.margin.right}${layout.margin.unit} ${layout.margin.bottom}${layout.margin.unit} ${layout.margin.left}${layout.margin.unit}`;
    if (layout?.width && layout.width !== 'auto') styles.width = layout.width === 'full-width' ? '100%' : 'auto';
    if (layout?.position && layout.position !== 'default') styles.position = layout.position as any;
    if (layout?.zIndex) styles.zIndex = layout.zIndex;
    if (background?.normal?.type === 'classic' && background.normal.color) styles.backgroundColor = background.normal.color;
    if (border?.normal?.type && border.normal.type !== 'none') {
        styles.borderStyle = border.normal.type;
        styles.borderColor = border.normal.color;
        styles.borderWidth = `${border.normal.width.top}${border.normal.width.unit} ${border.normal.width.right}${border.normal.width.unit} ${border.normal.width.bottom}${border.normal.width.unit} ${border.normal.width.left}${border.normal.width.unit}`;
    }
    if (border?.radius) styles.borderRadius = `${border.radius.top}${border.radius.unit} ${border.radius.right}${border.radius.unit} ${border.radius.bottom}${border.radius.unit} ${border.radius.left}${border.radius.unit}`;
    if (transform?.normal) {
        const t = transform.normal;
        const transforms = [];
        if (t.rotate) transforms.push(`rotate(${t.rotate}deg)`);
        if (t.scale && t.scale !== 1) transforms.push(`scale(${t.scale})`);
        if (t.offsetX || t.offsetY) transforms.push(`translate(${t.offsetX || 0}px, ${t.offsetY || 0}px)`);
        if (t.skewX || t.skewY) transforms.push(`skew(${t.skewX || 0}deg, ${t.skewY || 0}deg)`);
        if (transforms.length > 0) styles.transform = transforms.join(' ');
    }
    return styles;
  };

  const isHtmlFullPage = element.widgetType === 'html' && element.settings.content?.fullWidthPage;

  const styles = {
    ...getAdvancedStyles(),
    ...(isHtmlFullPage && {
        position: 'relative' as 'relative',
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '100vw'
    })
  };
  
  const animationClass = element.settings.advanced?.motionEffects?.entranceAnimation?.animation !== 'none'
    ? `anim-${element.settings.advanced.motionEffects.entranceAnimation.animation}`
    : '';

  const isContainerLike = element.widgetType === 'inner-section' || element.widgetType === 'container';
  const rendererProps = { ...props, onSelect, onDelete, onDuplicate, onAddWidget };

  return (
    <div
      onClick={handleClick}
      style={styles}
      className={`relative group p-1 cursor-pointer ${animationClass} ${isSelected ? 'outline outline-2 outline-blue-500' : 'hover:outline hover:outline-1 hover:outline-blue-300'}`}
    >
      <div className="absolute top-0 right-0 -mt-8 hidden group-hover:flex group-focus:flex items-center bg-blue-500 text-white rounded-t-md px-2 py-1 z-10" style={{ ...(isSelected && { display: 'flex' }) }}>
        <span className="text-xs font-bold ml-2">{element.widgetType}</span>
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }} className="p-1 hover:bg-blue-600 rounded"><CopyIcon className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(element.id); }} className="p-1 hover:bg-blue-600 rounded"><TrashIcon className="w-4 h-4" /></button>
      </div>

      <WidgetComponent settings={element.settings} widgetType={element.widgetType} element={element}>
        {isContainerLike && (
          <>
            {element.children.map(child => <ElementRenderer key={child.id} element={child} {...rendererProps} />)}
            {element.widgetType === 'container' && <WidgetDropZone onDrop={(type) => onAddWidget(element.id, type)} />}
          </>
        )}
      </WidgetComponent>
    </div>
  );
};

export default RenderedWidget;
