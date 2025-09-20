

import React from 'react';
import type { CanvasElement } from '../sitesaz/types';
import * as WidgetDisplays from '../sitesaz/widgets/WidgetDisplay';

const getAdvancedStyles = (element: CanvasElement): React.CSSProperties => {
    const { advanced } = element.settings;
    if (!advanced) return {};

    const styles: React.CSSProperties = {};
    const { layout, background, border, transform } = advanced;

    if (layout?.padding) {
        styles.padding = `${layout.padding.top}${layout.padding.unit} ${layout.padding.right}${layout.padding.unit} ${layout.padding.bottom}${layout.padding.unit} ${layout.padding.left}${layout.padding.unit}`;
    }
    if (layout?.margin) {
        styles.margin = `${layout.margin.top}${layout.margin.unit} ${layout.margin.right}${layout.margin.unit} ${layout.margin.bottom}${layout.margin.unit} ${layout.margin.left}${layout.margin.unit}`;
    }
    if (layout?.width && layout.width !== 'auto') {
        styles.width = layout.width === 'full-width' ? '100%' : 'auto';
    }
    if (layout?.position && layout.position !== 'default') {
        styles.position = layout.position as any;
    }
    if (layout?.zIndex) {
        styles.zIndex = layout.zIndex;
    }
    if (background?.normal?.type === 'classic' && background.normal.color) {
        styles.backgroundColor = background.normal.color;
    }
    if (border?.normal?.type && border.normal.type !== 'none') {
        styles.borderStyle = border.normal.type;
        styles.borderColor = border.normal.color;
        styles.borderWidth = `${border.normal.width.top}${border.normal.width.unit} ${border.normal.width.right}${border.normal.width.unit} ${border.normal.width.bottom}${border.normal.width.unit} ${border.normal.width.left}${border.normal.width.unit}`;
    }
    if (border?.radius) {
        styles.borderRadius = `${border.radius.top}${border.radius.unit} ${border.radius.right}${border.radius.unit} ${border.radius.bottom}${border.radius.unit} ${border.radius.left}${border.radius.unit}`;
    }
    if (transform?.normal) {
        const t = transform.normal;
        const transforms = [];
        if (t.rotate) transforms.push(`rotate(${t.rotate}deg)`);
        if (t.scale && t.scale !== 1) transforms.push(`scale(${t.scale})`);
        if (t.offsetX || t.offsetY) transforms.push(`translate(${t.offsetX || 0}px, ${t.offsetY || 0}px)`);
        if (t.skewX || t.skewY) transforms.push(`skew(${t.skewX || 0}deg, ${t.skewY || 0}deg)`);
        if (transforms.length > 0) {
            styles.transform = transforms.join(' ');
        }
    }
    return styles;
};

const toPascalCase = (str: string) => {
    if (!str) return '';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const ElementRenderer: React.FC<{ element: CanvasElement }> = ({ element }) => {
    const styles = getAdvancedStyles(element);

    const isHtmlFullPage = element.widgetType === 'html' && element.settings.content?.fullWidthPage;
    if (isHtmlFullPage) {
        styles.height = '100%';
    }

    if (element.type === 'section') {
        return (
            <div className="flex flex-wrap gap-4 my-4 w-full" style={styles}>
                {element.children.map(column => <ElementRenderer key={column.id} element={column} />)}
            </div>
        )
    }

    if (element.type === 'column') {
        return (
            <div className="flex-1" style={styles}>
                {element.children.map(widget => <ElementRenderer key={widget.id} element={widget} />)}
            </div>
        )
    }

    if (element.type === 'widget' && element.widgetType) {
        const WidgetComponentName = toPascalCase(element.widgetType);
        const WidgetComponent = (WidgetDisplays as any)[WidgetComponentName] || WidgetDisplays.FallbackDisplay;
        
        const isContainerLike = element.widgetType === 'inner-section' || element.widgetType === 'container';

        const animationClass = element.settings.advanced?.motionEffects?.entranceAnimation?.animation !== 'none'
            ? `anim-${element.settings.advanced.motionEffects.entranceAnimation.animation}`
            : '';
        
        return (
            <div style={styles} className={animationClass}>
                <WidgetComponent settings={element.settings} widgetType={element.widgetType} element={element}>
                   {isContainerLike && element.children.map(child => <ElementRenderer key={child.id} element={child} />)}
                </WidgetComponent>
            </div>
        );
    }

    return null;
}

const SiteSazRenderer: React.FC<{ elements: CanvasElement[] }> = ({ elements }) => {
    const hasFullPageHtml = elements.some(el => 
        el.widgetType === 'html' && el.settings.content?.fullWidthPage
    );
    return (
        <div className={hasFullPageHtml ? 'h-full' : ''}>
            {elements.map(element => <ElementRenderer key={element.id} element={element} />)}
        </div>
    );
};

export default SiteSazRenderer;