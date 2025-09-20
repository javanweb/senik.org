import React, { useEffect, useState, useRef, useMemo } from 'react';
import { CanvasElement } from '../types';

interface WidgetDisplayProps {
  settings: { [key: string]: any };
  widgetType?: string;
  element?: CanvasElement;
  children?: React.ReactNode;
}

// Style Helper Functions
const getTypographyStyles = (typography: any): React.CSSProperties => {
    if (!typography) return {};
    return {
        fontSize: typography.fontSize ? `${typography.fontSize}px` : undefined,
        fontWeight: typography.fontWeight,
        textTransform: typography.textTransform as any,
        fontStyle: typography.fontStyle,
        textDecoration: typography.textDecoration,
        lineHeight: typography.lineHeight ? `${typography.lineHeight}em` : undefined,
        letterSpacing: typography.letterSpacing ? `${typography.letterSpacing}px` : undefined,
    };
};

const getTextShadowStyles = (shadow: any): React.CSSProperties => {
    if (!shadow || !shadow.color || (shadow.blur === 0 && shadow.horizontal === 0 && shadow.vertical === 0)) return {};
    return {
        textShadow: `${shadow.horizontal}px ${shadow.vertical}px ${shadow.blur}px ${shadow.color}`,
    };
};


export const Heading: React.FC<WidgetDisplayProps> = ({ settings }) => {
  const { content, style } = settings;
  const Tag = content.html_tag || 'h2';
  
  const styles: React.CSSProperties = {
    color: style.textColor,
    textAlign: content.alignment as 'right' | 'left' | 'center',
    ...getTypographyStyles(style.typography),
    ...getTextShadowStyles(style.textShadow),
    mixBlendMode: style.blendMode !== 'normal' ? style.blendMode : undefined,
  };

  const Inner = () => <Tag style={styles}>{content.title}</Tag>;

  if(content.link?.url) {
    return <a href={content.link.url} style={{textDecoration: 'none'}}><Inner /></a>
  }
  return <Inner />;
};

export const Image: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const styles: React.CSSProperties = {
        width: `${style.width}${style.width_unit || '%'}`,
        opacity: style.normal.opacity,
        borderRadius: `${style.border?.normal?.radius?.top || 0}px`,
        display: 'block',
        marginLeft: content.alignment === 'center' ? 'auto' : content.alignment === 'left' ? '' : '0',
        marginRight: content.alignment === 'center' ? 'auto' : content.alignment === 'right' ? '' : '0',
    };

    const ImageTag = () => <img src={content.image?.url} alt={content.custom_caption} style={styles} className={style.hover.hoverAnimation ? `transition-transform duration-300 hover:scale-110` : ''} />;

    const LinkedImage = () => {
        if(content.link_to === 'none' || !content.link?.url) return <ImageTag />;
        return <a href={content.link.url}><ImageTag/></a>
    }

    return (
        <figure style={{textAlign: content.alignment as any}}>
            <LinkedImage />
            {content.caption === 'custom' && content.custom_caption && <figcaption className="text-center text-sm text-gray-600 mt-2">{content.custom_caption}</figcaption>}
        </figure>
    );
};

export const TextEditor: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const styles: React.CSSProperties = {
        color: style.textColor,
        textAlign: style.alignment as 'right' | 'left' | 'center',
        columns: `${content.columns || 1}`,
        columnGap: `${content.column_gap || 10}px`,
        ...getTypographyStyles(style.typography),
        ...getTextShadowStyles(style.textShadow),
    };
    return <div style={styles} dangerouslySetInnerHTML={{ __html: content.text }} />;
};

export const Video: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content } = settings;
    let embedUrl = '';

    if (content.source === 'self-hosted' && content.self_hosted_url) {
        return (
             <div className="relative" style={{ aspectRatio: content.aspect_ratio || '16/9' }}>
                <video 
                    className="absolute top-0 left-0 w-full h-full"
                    src={content.self_hosted_url}
                    poster={content.cover_image?.url}
                    controls={content.player_controls}
                    autoPlay={content.autoplay}
                    muted={content.mute}
                    loop={content.loop}
                />
            </div>
        )
    }

    if (content.source === 'youtube' && content.url) {
        const videoIdMatch = content.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
        if(videoIdMatch && videoIdMatch[1]) {
            const videoId = videoIdMatch[1];
            let params = `?start=${content.start_time}&end=${content.end_time}&autoplay=${content.autoplay ? 1 : 0}&mute=${content.mute ? 1 : 0}&loop=${content.loop ? 1 : 0}&controls=${content.player_controls ? 1 : 0}`;
            if (content.privacy_mode) params += '&rel=0';
            embedUrl = `https://www.youtube.com/embed/${videoId}${params}`;
        }
    } else if (content.source === 'vimeo' && content.url) {
        const videoIdMatch = content.url.match(/vimeo.com\/(\d+)/);
        if (videoIdMatch && videoIdMatch[1]) {
            const videoId = videoIdMatch[1];
            embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${content.autoplay ? 1 : 0}&muted=${content.mute ? 1 : 0}&loop=${content.loop ? 1 : 0}`;
        }
    }

    const ratio = (content.aspect_ratio || '16:9').split(':').map(Number);
    const paddingBottom = (ratio[1] / ratio[0]) * 100;

    return (
        <div className="relative" style={{ paddingBottom: `${paddingBottom}%`}}>
            {embedUrl ? (
                <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">ویدئو نامعتبر</div>
            )}
        </div>
    );
};

export const Button: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const wrapperStyles: React.CSSProperties = {
        textAlign: content.alignment as any
    };
    
    const normalStyles = style.normal || {};
    const borderRadius = style.borderRadius;
    const padding = style.padding;

    const styles: React.CSSProperties = {
        backgroundColor: normalStyles.backgroundColor,
        color: normalStyles.textColor,
        borderRadius: `${borderRadius.top}${borderRadius.unit} ${borderRadius.right}${borderRadius.unit} ${borderRadius.bottom}${borderRadius.unit} ${borderRadius.left}${borderRadius.unit}`,
        padding: `${padding.top}${padding.unit} ${padding.right}${padding.unit} ${padding.bottom}${padding.unit} ${padding.left}${padding.unit}`,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${content.icon_spacing || 5}px`,
        flexDirection: content.icon_position === 'after' ? 'row-reverse' : 'row',
        ...getTypographyStyles(style.typography),
        ...getTextShadowStyles(style.textShadow),
        transition: 'all 0.3s ease',
    };
    
    // Note: Hover styles are not applied via inline styles in this simulation.
    // A real implementation would use CSS classes or a CSS-in-JS solution.

    return (
        <div style={wrapperStyles}>
            <a href={content.link?.url} style={styles}>
                {content.icon?.url && <img src={content.icon.url} className="w-5 h-5" />}
                <span>{content.text}</span>
            </a>
        </div>
    );
};

export const StarRating: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const fullStars = Math.floor(content.rating);
    const halfStar = content.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    const starStyles: React.CSSProperties = {
        color: style.stars.color,
        fontSize: `${style.stars.size}px`,
        display: 'inline-block',
        margin: `0 ${style.stars.spacing}px`,
    };
    const unmarkedStyle = '★'; // Always solid for simplicity
    const unmarkedCss: React.CSSProperties = {...starStyles, color: style.stars.unmarkedColor};

    return (
        <div style={{ textAlign: content.alignment as any }}>
            {[...Array(fullStars)].map((_, i) => <span key={`f-${i}`} style={starStyles}>★</span>)}
            {halfStar && <span style={{...starStyles, position: 'relative'}}><span style={{position:'absolute', overflow: 'hidden', width: '50%'}}>★</span><span style={{color: style.stars.unmarkedColor}}>☆</span></span>}
            {[...Array(emptyStars)].map((_, i) => <span key={`e-${i}`} style={unmarkedCss}>{unmarkedStyle}</span>)}
        </div>
    );
};

export const Divider: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    return <div style={{textAlign: content.alignment as any, padding: `${style.gap}px 0`}}><hr style={{ borderColor: style.color, borderTopStyle: content.style, borderWidth: `${style.weight}px`, width: `${content.width}%`, margin: `0 auto` }} /></div>;
};

export const GoogleMaps: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content } = settings;
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(content.address)}&t=&z=${content.zoom}&ie=UTF8&iwloc=&output=embed`;
    return <iframe title="Google Map" width="100%" height={content.height} src={mapUrl} frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0}></iframe>;
};

export const Icon: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
     const wrapperStyles: React.CSSProperties = {
        textAlign: content.alignment as any,
     };
     const styles: React.CSSProperties = {
        display: 'inline-flex',
        padding: `${style.padding}px`,
        backgroundColor: style.view === 'stacked' ? style.normal.primaryColor : 'transparent',
        border: style.view === 'framed' ? `${style.borderWidth}px solid ${style.normal.primaryColor}` : 'none',
        borderRadius: style.shape === 'circle' ? '50%' : `${style.borderRadius.top}${style.borderRadius.unit}`,
        transform: `rotate(${style.rotate}deg)`
    };
    const iconStyles: React.CSSProperties = {
        width: `${style.size}px`, 
        height: `${style.size}px`,
        color: style.view === 'stacked' ? style.normal.secondaryColor : style.normal.primaryColor,
    };

    return (
        <div style={wrapperStyles}>
            <a href={content.link?.url}>
                <div style={styles}>
                   {content.icon?.url ? <img src={content.icon.url} style={iconStyles} /> : <svg xmlns="http://www.w3.org/2000/svg" style={iconStyles} fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>}
                </div>
            </a>
        </div>
    );
};

export const ImageBox: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const TitleTag = content.title_html_tag || 'h3';
    return (
        <a href={content.link?.url} style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{textAlign: style.content.alignment as any}}>
                <img src={content.image?.url} style={{width: `${style.image.width}%`, borderRadius: `${style.image.borderRadius}px`, marginBottom: `${style.spacing}px`}} alt={content.title} />
                <TitleTag style={{ color: style.content.title.color, marginBottom: `${style.content.title.spacing}px`, ...getTypographyStyles(style.content.title.typography), ...getTextShadowStyles(style.content.title.textShadow) }}>{content.title}</TitleTag>
                <p style={{ color: style.content.description.color, margin: 0, ...getTypographyStyles(style.content.description.typography) }}>{content.description}</p>
            </div>
        </a>
    );
};

export const IconBox: React.FC<WidgetDisplayProps> = ({ settings }) => {
     const { content, style } = settings;
    const TitleTag = content.title_html_tag || 'h3';
    
    const iconSettings = {
        content: { ...content, alignment: 'center' },
        style: {
             ...style.icon, 
             view: 'stacked', 
             shape: 'circle', 
             normal: { primaryColor: style.icon.normal.primaryColor, secondaryColor: '#fff'},
             borderRadius: { top: 50, right: 50, bottom: 50, left: 50, unit: '%', isLinked: true }
        }
    }

    return (
        <a href={content.link?.url} style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{textAlign: content.alignment as any}}>
                <div style={{marginBottom: `${style.icon.spacing}px`}}>
                    <Icon settings={iconSettings} />
                </div>
                <TitleTag style={{ color: style.content.title.color, marginBottom: `${style.content.title.spacing}px`, ...getTypographyStyles(style.content.title.typography), ...getTextShadowStyles(style.content.title.textShadow) }}>{content.title}</TitleTag>
                <p style={{ color: style.content.description.color, margin: 0, ...getTypographyStyles(style.content.description.typography) }}>{content.description}</p>
            </div>
        </a>
    );
};

export const BasicGallery: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content } = settings;
    return (
        <div className={`grid gap-4`} style={{gridTemplateColumns: `repeat(${content.columns}, 1fr)`}}>
            {content.images.map((img: any) => <img key={img.id} src={img.url} className="w-full h-full object-cover" alt="" />)}
        </div>
    );
};

export const ImageCarousel: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content } = settings;
    return (
        <div className="relative p-4 bg-gray-200 border border-dashed border-gray-400 text-center">
            <p className="font-bold">کروسل تصویر</p>
            <p className="text-sm">{content.images.length} تصویر, {content.slides_to_show} اسلاید برای نمایش</p>
        </div>
    );
};

export const IconList: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    return (
        <ul className="list-none p-0 m-0">
            {content.items.map((item: any, index: number) => (
                <li key={item.id} className={`flex items-center py-2 ${content.divider && index < content.items.length - 1 ? 'border-b border-gray-200' : ''}`} style={{ marginBottom: `${style.list.spaceBetween}px`}}>
                    <a href={item.link?.url} className="flex items-center gap-2" style={{color: 'inherit', textDecoration: 'none'}}>
                        {item.icon?.url ? <img src={item.icon.url} style={{width: `${style.icon.size}px`, height: `${style.icon.size}px`}} /> : <svg xmlns="http://www.w3.org/2000/svg" style={{width: `${style.icon.size}px`, height: `${style.icon.size}px`}} fill={style.icon.color} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                        <span style={{color: style.text.color, marginLeft: `${style.text.indent}px`, ...getTypographyStyles(style.text.typography)}}>{item.text}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
};

export const Counter: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const formattedNumber = (content.prefix || '') + (content.thousand_separator ? Number(content.end_number).toLocaleString() : content.end_number) + (content.suffix || '');
    return (
        <div style={{textAlign: 'center'}}>
            <div style={{ color: style.number.color, ...getTypographyStyles(style.number.typography) }}>{formattedNumber}</div>
            {content.title && <div style={{ color: style.title.color, marginTop: `${style.title.spacing}px`, ...getTypographyStyles(style.title.typography), ...getTextShadowStyles(style.title.textShadow) }}>{content.title}</div>}
        </div>
    );
};

export const Spacer: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content } = settings;
    return <div style={{ height: `${content.space}px` }} />;
};

export const Testimonial: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const alignClass = content.alignment === 'center' ? 'flex-col items-center' : content.alignment === 'left' ? 'flex-row' : 'flex-row-reverse';
    
    const nameStyles: React.CSSProperties = {
        color: style.name.textColor,
        ...getTypographyStyles(style.name.typography),
        ...getTextShadowStyles(style.name.textShadow),
    };
    
    const titleStyles: React.CSSProperties = {
        color: style.title.textColor,
        ...getTypographyStyles(style.title.typography),
        ...getTextShadowStyles(style.title.textShadow),
    };

    return (
        <div style={{ textAlign: content.alignment as any }}>
            <p className="italic mb-4" style={{ color: style.content.textColor, ...getTypographyStyles(style.content.typography) }}>"{content.content}"</p>
            <div className={`flex gap-4 ${alignClass}`}>
                {content.image?.url && <img src={content.image.url} className="w-12 h-12 rounded-full" alt={content.name} />}
                <div>
                    <div style={nameStyles}>{content.name}</div>
                    <div style={titleStyles}>{content.title}</div>
                </div>
            </div>
        </div>
    );
};

export const Tabs: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const [activeTab, setActiveTab] = useState(0);
    if (!content.items || content.items.length === 0) {
        return <div className="p-4 bg-gray-200 text-center">ویجت تب‌ها - آیتمی اضافه نشده</div>
    }
    const isVertical = content.alignment === 'vertical';

    const titleStyles: React.CSSProperties = {
        ...getTypographyStyles(style.title.typography),
        ...getTextShadowStyles(style.title.textShadow)
    };

    return (
        <div className={`flex ${isVertical ? 'flex-row' : 'flex-col'}`}>
            <div className={`flex ${isVertical ? 'flex-col border-l' : 'border-b'}`}>
                {content.items.map((item: any, index: number) => (
                    <button key={item.id} onClick={() => setActiveTab(index)} style={titleStyles} className={`px-4 py-2 text-sm transition-colors ${activeTab === index ? (isVertical ? 'border-l-2' : 'border-b-2') + ' border-indigo-500 text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}>
                        {item.title}
                    </button>
                ))}
            </div>
            <div className="p-4 flex-1" style={{color: style.content.textColor, ...getTypographyStyles(style.content.typography)}}>
                {content.items[activeTab]?.content}
            </div>
        </div>
    );
};

export const Accordion: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const [openIndex, setOpenIndex] = useState<number|null>(0);

     if (!content.items || content.items.length === 0) {
        return <div className="p-4 bg-gray-200 text-center">ویجت آکاردئون - آیتمی اضافه نشده</div>
    }

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    const titleStyles: React.CSSProperties = {
        ...getTypographyStyles(style.title.typography),
        ...getTextShadowStyles(style.title.textShadow)
    };
    
    const contentStyles: React.CSSProperties = {
        color: style.content.textColor,
        backgroundColor: style.content.backgroundColor,
        padding: `${style.content.padding.top}px`,
         ...getTypographyStyles(style.content.typography)
    }

    const getIcon = (index: number) => {
        const isOpen = openIndex === index;
        const activeIcon = content.icon?.active;
        const normalIcon = content.icon?.normal;

        if (isOpen && activeIcon) {
            return <img src={activeIcon} alt="Active Icon" className="w-4 h-4" />;
        }
        if (!isOpen && normalIcon) {
            return <img src={normalIcon} alt="Normal Icon" className="w-4 h-4" />;
        }
        return <span>{isOpen ? '−' : '+'}</span>;
    };

    return (
        <div className="border rounded-md">
            {content.items.map((item: any, index: number) => (
                <div key={item.id} className={`border-b last:border-b-0`}>
                    <button onClick={() => toggleItem(index)} className="w-full flex justify-between items-center p-4 text-right">
                        <span style={titleStyles}>{item.title}</span>
                        {getIcon(index)}
                    </button>
                    {openIndex === index && <div className="p-4 bg-gray-50" style={contentStyles}>{item.content}</div>}
                </div>
            ))}
        </div>
    );
};

export const Toggle = Accordion; // Same display logic

export const SocialIcons: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content } = settings;
    const shapeClass = content.shape === 'circle' ? 'rounded-full' : content.shape === 'rounded' ? 'rounded-md' : '';
    const colors = { facebook: '#1877F2', twitter: '#1DA1F2', youtube: '#FF0000' };

    return (
        <div className="flex gap-2" style={{justifyContent: content.alignment}}>
            {content.items.map((item:any) => (
                <a href={item.link.url} key={item.id} className={`p-2 text-white w-8 h-8 flex items-center justify-center text-sm ${shapeClass}`} style={{backgroundColor: colors[item.network as keyof typeof colors]}}>
                    {item.network.substring(0,1).toUpperCase()}
                </a>
            ))}
        </div>
    );
}

export const ProgressBar: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const titleStyles: React.CSSProperties = {
        color: style.title.color,
        ...getTypographyStyles(style.title.typography),
        ...getTextShadowStyles(style.title.textShadow)
    };
    return (
        <div style={{textAlign: content.alignment as any}}>
            <div className="flex justify-between mb-1">
                <span className="text-base" style={titleStyles}>{content.title}</span>
                {content.display_percentage && <span className="text-sm font-medium text-blue-700">{content.progress}%</span>}
            </div>
            <div className="w-full rounded-full h-4 relative" style={{backgroundColor: style.progressBar.backgroundColor, height: `${style.progressBar.height}px`}}>
                <div className="h-4 rounded-full" style={{width: `${content.progress}%`, backgroundColor: style.progressBar.color, height: `${style.progressBar.height}px`}}></div>
                {content.inner_text && <span className="absolute inset-0 text-center text-xs leading-4" style={{color: style.innerText.color, ...getTypographyStyles(style.innerText.typography)}}>{content.inner_text}</span>}
            </div>
        </div>
    );
}

export const Alert: React.FC<WidgetDisplayProps> = ({ settings }) => {
    const { content, style } = settings;
    const colors = {
        info: 'bg-blue-100 border-blue-500',
        success: 'bg-green-100 border-green-500',
        warning: 'bg-yellow-100 border-yellow-500',
        danger: 'bg-red-100 border-red-500',
    }
    const titleStyles: React.CSSProperties = {
        color: style.title.color,
        ...getTypographyStyles(style.title.typography),
        ...getTextShadowStyles(style.title.textShadow)
    };
    const descriptionStyles: React.CSSProperties = {
        color: style.description.color,
        ...getTypographyStyles(style.description.typography)
    };
    return (
        <div className={`p-4 border-r-4 ${colors[content.type as keyof typeof colors]} flex justify-between items-start`} role="alert">
            <div>
                <p className="font-bold" style={titleStyles}>{content.title}</p>
                <p style={descriptionStyles}>{content.description}</p>
            </div>
            {content.dismiss_button && <button className="p-1 -mr-2 -mt-2">×</button>}
        </div>
    )
}

export const SoundCloud: React.FC<WidgetDisplayProps> = ({ settings }) => {
    return (
        <div className="p-4 bg-gray-100 border border-dashed border-gray-400 text-gray-600 rounded-md text-center">
            <p className="font-bold">ویجت SoundCloud</p>
            <p className="text-xs break-all">{settings.content.embed_code}</p>
        </div>
    );
};

export const Html: React.FC<WidgetDisplayProps> = ({ settings }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const htmlContent = settings.content.code || '';
  const iframeId = useMemo(() => `html-widget-${Math.random().toString(36).substr(2, 9)}`, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === 'htmlWidgetResize' &&
        event.data.iframeId === iframeId &&
        iframeRef.current
      ) {
        const newHeight = event.data.height;
        iframeRef.current.style.height = `${Math.max(newHeight, 20)}px`;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [iframeId]);

  const injectedScript = `
    <script>
      (function() {
        if (window.frameElement) {
            const iframeId = '${iframeId}';
            const sendHeight = () => {
                const height = document.documentElement.scrollHeight;
                window.parent.postMessage({
                    type: 'htmlWidgetResize',
                    height: height,
                    iframeId: iframeId
                }, '*');
            };
            
            const observer = new ResizeObserver(sendHeight);
            observer.observe(document.documentElement);
            
            window.addEventListener('load', sendHeight);
            
            if (document.readyState === 'complete') {
              sendHeight();
            } else {
              document.addEventListener('DOMContentLoaded', sendHeight);
            }
        }
      })();
    </script>
  `;

  const srcDocContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; overflow: hidden; }</style>
      </head>
      <body>
        ${htmlContent}
        ${injectedScript}
      </body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDocContent}
      style={{
        width: '100%',
        border: 'none',
        display: 'block',
        height: '20px',
        transition: 'height 0.2s ease-out'
      }}
      title="Custom HTML Content"
      scrolling="no"
    />
  );
};

export const TextPath: React.FC<WidgetDisplayProps> = ({ settings }) => {
    return (
        <div className="p-4 bg-gray-100 border border-dashed border-gray-400 text-gray-600 rounded-md text-center">
             <p className="font-bold">ویجت مسیر متن</p>
            <svg viewBox="0 0 100 100" className="w-full h-auto">
                <path id="curve" d="M10,50 A40,40 0 1,1 90,50" fill="transparent" />
                <text>
                    <textPath href="#curve" startOffset="50%" textAnchor="middle" fill="#333">
                        {settings.content.text}
                    </textPath>
                </text>
            </svg>
        </div>
    );
};

export const InnerSection: React.FC<WidgetDisplayProps> = ({ children, settings }) => {
    const { content } = settings;
    const gapMap = { 'default': '1rem', 'narrow': '0.5rem', 'extended': '1.5rem', 'wide': '2.5rem' };
    const gap = gapMap[content.column_gap as keyof typeof gapMap] || '1rem';

    return (
        <div className="border border-dashed border-blue-300 p-2 min-h-[100px] flex" style={{ gap }}>
            {children}
        </div>
    );
};

export const Container: React.FC<WidgetDisplayProps> = ({ children, settings }) => {
    const { content } = settings;
    const styles: React.CSSProperties = {
        display: content.container_type === 'flexbox' ? 'flex' : 'grid',
        flexDirection: content.flex_direction,
        justifyContent: content.justify_content,
        alignItems: content.align_items,
        minHeight: `${content.min_height}px`,
        width: '100%', // Container should fill its parent column
        border: '1px dashed #f59e0b',
        padding: '1rem',
        backgroundColor: '#fffbeb'
    };

    return (
        <div style={styles}>
            {children}
        </div>
    );
};

// Fallback for widgets without a specific display component yet
export const FallbackDisplay: React.FC<WidgetDisplayProps> = ({ settings, widgetType }) => {
  return (
    <div className="p-4 bg-gray-100 border border-dashed border-gray-400 text-gray-600 rounded-md text-center">
      <p className="font-bold">ابزارک {widgetType}</p>
      <p className="text-sm">نمایش این ابزارک در حال حاضر پشتیبانی نمی‌شود.</p>
    </div>
  );
};
