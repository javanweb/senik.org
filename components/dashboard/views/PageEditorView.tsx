import React, { useState, useEffect, useRef } from 'react';
import type { NavLink, Sublink } from '../../../siteData';
// FIX: Import SpacingValue and other new types
import type { Block, BlockType, Device, BlockSettings, Responsive, SpacingValue } from '../../../types';
import { 
    ArrowUturnLeftIcon, PlusIcon, TrashIcon, HeadingIcon, TypeIcon, ImageIcon, ButtonIcon, DividerIcon, 
    TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon, VideoCameraIcon, ContainerIcon,
    EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, PaintBrushIcon, CogIcon,
    PencilIcon,
    DesktopComputerIcon, DeviceTabletIcon, DevicePhoneMobileIcon
} from '../../Icons';

// --- HELPER FUNCTIONS & DATA ---
const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const isJsonString = (str: string) => {
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed);
    } catch (e) {
        return false;
    }
};

const getDefaultSettings = (type: BlockType): Block['settings'] => {
    const responsiveAlign: Responsive<'right'> = { desktop: 'right' as const };
    const responsivePadding: Responsive<SpacingValue> = { desktop: { top: '16px', right: '16px', bottom: '16px', left: '16px' } };
    const responsiveMargin: Responsive<SpacingValue> = { desktop: { top: '0', right: 'auto', bottom: '0', left: 'auto' } };

    switch (type) {
        case 'heading': return { text: 'سرتیتر جدید', level: 'h2', color: '#1f2937', fontSize: { desktop: '2.25rem' }, textAlign: responsiveAlign, margin: responsiveMargin };
        case 'text': return { html: '<p>این یک پاراگراف جدید است. برای ویرایش کلیک کنید.</p>', textAlign: responsiveAlign, margin: responsiveMargin };
        case 'image': return { src: 'https://via.placeholder.com/800x400/e0f2f1/009688?text=تصویر', alt: 'تصویر', width: { desktop: '100%' }, margin: responsiveMargin };
        case 'button': return { text: 'متن دکمه', href: '#', variant: 'primary', margin: responsiveMargin };
        case 'divider': return { height: '1px', dividerStyle: 'solid', color: '#e5e7eb', margin: { desktop: { top: '16px', right: 'auto', bottom: '16px', left: 'auto' } }};
        case 'video': return { url: 'https://www.aparat.com/v/q1b2c', margin: responsiveMargin };
        case 'container': return { backgroundColor: 'transparent', padding: responsivePadding };
        default: return {};
    }
};

const findBlockAndParent = (blocks: Block[], blockId: string, parent: Block | null = null): { block: Block, parent: Block | null, index: number } | null => {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.id === blockId) {
            return { block, parent, index: i };
        }
        if (block.children) {
            const found = findBlockAndParent(block.children, blockId, block);
            if (found) return found;
        }
    }
    return null;
};

// --- NEW SETTING INPUT COMPONENTS ---
const TextareaSetting: React.FC<{label: string, value: string, onChange: (val: string) => void}> = ({label, value, onChange}) => (
    <div className="p-3">
        <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={6} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#009688]"/>
    </div>
);

const ImageUploadSetting: React.FC<{label: string, src: string, onUpload: (base64: string) => void}> = ({label, src, onUpload}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { onUpload(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="p-3">
            <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
            {src && <img src={src} alt="Preview" className="w-full h-auto rounded-md mb-2 border" />}
            <div className="mt-1">
                 <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"/>
            </div>
        </div>
    );
};

const ResponsiveSpacingInput: React.FC<any> = ({ label, property, settings, update, device }) => {
    const defaultValues = { top: '', right: '', bottom: '', left: '' };
    const desktopValues = settings[property]?.desktop || defaultValues;
    const currentValues = settings[property]?.[device] || {};
    
    const handleChange = (side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
        const newDeviceValues = { ...(settings[property]?.[device] || desktopValues), [side]: value };
        update(property, newDeviceValues);
    };

    return (
        <div className="p-3">
            <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
            <div className="grid grid-cols-4 gap-2 text-center">
                 {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                    <div key={side}>
                        <label className="text-xs text-gray-500 capitalize">{side}</label>
                        <input
                            type="text"
                            value={currentValues[side] ?? ''}
                            onChange={e => handleChange(side, e.target.value)}
                            placeholder={desktopValues[side]}
                            className="w-full mt-1 px-2 py-1 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#009688] text-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN EDITOR COMPONENT ---
interface PageEditorViewProps {
  page: NavLink | Sublink;
  onSave: (newContent: string) => Promise<boolean>;
  onBack: () => void;
}

const PageEditorView: React.FC<PageEditorViewProps> = ({ page, onSave, onBack }) => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [device, setDevice] = useState<Device | 'preview'>('desktop');

    const [draggedBlock, setDraggedBlock] = useState<Block | { type: BlockType } | null>(null);
    const [dropIndicator, setDropIndicator] = useState<{ parentId: string | null; index: number } | null>(null);

    useEffect(() => {
        const content = page.content;
        if (content && isJsonString(content)) {
            setBlocks(JSON.parse(content));
        } else {
            const initialBlocks: Block[] = [ { id: generateId(), type: 'heading', settings: { text: page.name, level: 'h1', textAlign: { desktop: 'right' }, color: '#111827', fontSize: { desktop: '2.5rem' } } } ];
            if (content && content.trim() !== '' && content.trim() !== '<p><br></p>') {
                initialBlocks.push({ id: generateId(), type: 'text', settings: { html: content, textAlign: { desktop: 'right' } } });
            }
            setBlocks(initialBlocks);
        }
    }, [page]);

    // --- Block Manipulation ---
    const updateBlockSettings = (blockId: string, newSettings: Partial<BlockSettings>) => {
        const updateRecursively = (currentBlocks: Block[]): Block[] => currentBlocks.map(block => {
            if (block.id === blockId) return { ...block, settings: { ...block.settings, ...newSettings } };
            if (block.children) return { ...block, children: updateRecursively(block.children) };
            return block;
        });
        setBlocks(updateRecursively);
    };

    const addBlock = (item: Block | { type: BlockType }, parentId: string | null, index: number) => {
        const newBlock: Block = 'id' in item ? item : { id: generateId(), type: item.type, settings: getDefaultSettings(item.type) };
        if (newBlock.type === 'container' && !newBlock.children) newBlock.children = [];

        const addRecursively = (currentBlocks: Block[]): Block[] => {
            if (parentId) {
                return currentBlocks.map(block => {
                    if (block.id === parentId) {
                        const children = block.children || [];
                        return { ...block, children: [...children.slice(0, index), newBlock, ...children.slice(index)] };
                    }
                    if (block.children) return { ...block, children: addRecursively(block.children) };
                    return block;
                });
            }
            return [...currentBlocks.slice(0, index), newBlock, ...currentBlocks.slice(index)];
        };
        setBlocks(prev => addRecursively(prev));
        setSelectedBlockId(newBlock.id);
    };

    const deleteBlock = (blockId: string) => {
        const deleteRecursively = (currentBlocks: Block[]): Block[] => {
            return currentBlocks.filter(b => b.id !== blockId).map(b => {
                if (b.children) return { ...b, children: deleteRecursively(b.children) };
                return b;
            });
        };
        setBlocks(deleteRecursively);
        if (selectedBlockId === blockId) setSelectedBlockId(null);
    };

    const moveBlock = (dragged: Block, dropTarget: { parentId: string | null; index: number }) => {
        // First, remove the block from its original position
        let tempBlocks = blocks;
        const deleteRecursively = (currentBlocks: Block[]): Block[] => {
            return currentBlocks.filter(b => b.id !== dragged.id).map(b => {
                if (b.children) return { ...b, children: deleteRecursively(b.children) };
                return b;
            });
        };
        tempBlocks = deleteRecursively(tempBlocks);

        // Then, add it to the new position
        const addRecursively = (currentBlocks: Block[]): Block[] => {
            if (dropTarget.parentId) {
                return currentBlocks.map(block => {
                    if (block.id === dropTarget.parentId) {
                        const children = block.children || [];
                        return { ...block, children: [...children.slice(0, dropTarget.index), dragged, ...children.slice(dropTarget.index)] };
                    }
                    if (block.children) return { ...block, children: addRecursively(block.children) };
                    return block;
                });
            }
            return [...currentBlocks.slice(0, dropTarget.index), dragged, ...currentBlocks.slice(dropTarget.index)];
        };
        setBlocks(addRecursively(tempBlocks));
    };
    
    const duplicateBlock = (blockId: string) => {
        const found = findBlockAndParent(blocks, blockId);
        if (!found) return;

        const { block, parent, index } = found;
        const newBlock = JSON.parse(JSON.stringify(block));
        
        const regenerateIds = (b: Block) => {
            b.id = generateId();
            if(b.children) b.children.forEach(regenerateIds);
        }
        regenerateIds(newBlock);
        
        addBlock(newBlock, parent ? parent.id : null, index + 1);
    };
    
    const handleSave = async () => {
        setSaveState('saving');
        try {
            const success = await onSave(JSON.stringify(blocks));
            setSaveState(success ? 'saved' : 'error');
        } catch (e) {
            console.error("Save failed:", e);
            setSaveState('error');
        }
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (saveState === 'saved' || saveState === 'error') {
            timer = setTimeout(() => setSaveState('idle'), 2000);
        }
        return () => clearTimeout(timer);
    }, [saveState]);

    const buttonState = {
        saving: { text: 'در حال ذخیره...', disabled: true, className: '!bg-yellow-500' },
        saved: { text: 'ذخیره شد!', disabled: true, className: '!bg-green-600' },
        error: { text: 'خطا', disabled: false, className: '!bg-red-600' },
        idle: { text: 'ذخیره محتوا', disabled: false, className: '' }
    }[saveState];

    return (
        <div className="flex flex-col bg-gray-100 h-full text-gray-800" dir="rtl">
            <header className="flex justify-between items-center p-3 bg-white border-b border-gray-200 flex-shrink-0 z-20 shadow-sm">
                 <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><ArrowUturnLeftIcon className="w-5 h-5" /></button>
                    <div>
                        <h1 className="text-md font-bold text-gray-800">سازنده صفحه</h1>
                        <p className="text-xs text-gray-500">{page.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
                        <DeviceButton type="desktop" activeDevice={device} setDevice={setDevice} />
                        <DeviceButton type="tablet" activeDevice={device} setDevice={setDevice} />
                        <DeviceButton type="mobile" activeDevice={device} setDevice={setDevice} />
                    </div>
                     <button onClick={() => setDevice(device === 'preview' ? 'desktop' : 'preview')} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors border border-gray-300 shadow-sm">
                        {device === 'preview' ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                        <span>{device === 'preview' ? 'ویرایش' : 'پیش‌نمایش'}</span>
                    </button>
                    <button onClick={handleSave} disabled={buttonState.disabled} className={`px-4 py-2 rounded-md text-white text-sm font-semibold transition-all duration-300 bg-[#009688] hover:bg-[#00796B] disabled:opacity-50 ${buttonState.className}`}>
                        {buttonState.text}
                    </button>
                </div>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                {device !== 'preview' && <Palette setDraggedBlock={setDraggedBlock}/>}
                <Canvas device={device} blocks={blocks} selectedBlockId={selectedBlockId} setSelectedBlockId={setSelectedBlockId} 
                    draggedBlock={draggedBlock} setDraggedBlock={setDraggedBlock} dropIndicator={dropIndicator} setDropIndicator={setDropIndicator}
                    onDropBlock={moveBlock} onAddBlock={addBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock}
                />
                {device !== 'preview' && <SettingsPanel key={selectedBlockId} blocks={blocks} selectedBlockId={selectedBlockId} updateSettings={updateBlockSettings} activeDevice={device} />}
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---
const DeviceButton: React.FC<{type: Device, activeDevice: Device | 'preview', setDevice: (d: Device) => void}> = ({type, activeDevice, setDevice}) => {
    const icons = { desktop: DesktopComputerIcon, tablet: DeviceTabletIcon, mobile: DevicePhoneMobileIcon };
    const Icon = icons[type];
    return (
        <button onClick={() => setDevice(type)} className={`p-1.5 rounded ${activeDevice === type ? 'bg-white shadow' : 'hover:bg-gray-200/50'}`}>
            <Icon className={`w-5 h-5 ${activeDevice === type ? 'text-teal-600' : 'text-gray-500'}`} />
        </button>
    )
}

const Palette: React.FC<{setDraggedBlock: (b: { type: BlockType }) => void}> = ({setDraggedBlock}) => (
    <aside className="w-64 bg-white p-4 border-l border-gray-200 overflow-y-auto flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">المان ها</h2>
        <div className="grid grid-cols-2 gap-2">
            <PaletteButton type="heading" Icon={HeadingIcon} label="سرتیتر" onDragStart={() => setDraggedBlock({type: 'heading'})} />
            <PaletteButton type="text" Icon={TypeIcon} label="متن" onDragStart={() => setDraggedBlock({type: 'text'})} />
            <PaletteButton type="image" Icon={ImageIcon} label="تصویر" onDragStart={() => setDraggedBlock({type: 'image'})} />
            <PaletteButton type="button" Icon={ButtonIcon} label="دکمه" onDragStart={() => setDraggedBlock({type: 'button'})} />
            <PaletteButton type="video" Icon={VideoCameraIcon} label="ویدیو" onDragStart={() => setDraggedBlock({type: 'video'})} />
            <PaletteButton type="container" Icon={ContainerIcon} label="بخش" onDragStart={() => setDraggedBlock({type: 'container'})} />
            <PaletteButton type="divider" Icon={DividerIcon} label="جداکننده" onDragStart={() => setDraggedBlock({type: 'divider'})} />
        </div>
    </aside>
);

const PaletteButton: React.FC<{ type: BlockType, Icon: React.ElementType, label: string, onDragStart: () => void }> = ({ Icon, label, onDragStart }) => (
    <div draggable onDragStart={onDragStart} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md cursor-grab hover:bg-teal-50 hover:text-teal-700 border border-gray-200 transition-colors">
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
    </div>
);

const Canvas: React.FC<any> = ({device, blocks, selectedBlockId, setSelectedBlockId, draggedBlock, setDraggedBlock, dropIndicator, setDropIndicator, onDropBlock, onAddBlock, deleteBlock, duplicateBlock}) => {
    const canvasWidths: Record<Device | 'preview', string> = { desktop: '100%', tablet: '768px', mobile: '375px', preview: '100%' };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedBlock && dropIndicator) {
            if ('id' in draggedBlock) { // Moving an existing block
                onDropBlock(draggedBlock, dropIndicator);
            } else { // Adding a new block from palette
                onAddBlock({ type: draggedBlock.type }, dropIndicator.parentId, dropIndicator.index);
            }
        }
        setDraggedBlock(null);
        setDropIndicator(null);
    };

    return (
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
            <div style={{ maxWidth: canvasWidths[device], margin: '0 auto' }} className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${device === 'preview' ? 'p-0' : 'p-2'}`}>
                <BlockContainer parentId={null} blocks={blocks} setSelectedBlockId={setSelectedBlockId} selectedBlockId={selectedBlockId} setDraggedBlock={setDraggedBlock} 
                    dropIndicator={dropIndicator} setDropIndicator={setDropIndicator} isPreview={device === 'preview'} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} device={device}
                 />
                {blocks.length === 0 && device !== 'preview' && (
                     <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-md">
                        <p className="text-gray-500">یک المان از پنل کناری به اینجا بکشید</p>
                    </div>
                )}
            </div>
        </main>
    );
};

const BlockContainer: React.FC<any> = ({ parentId, blocks, ...props }) => {
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        props.setDropIndicator({ parentId, index });
    };
    return (
        <div className="w-full">
            {blocks.map((block: Block, index: number) => (
                <div key={block.id} onDragOver={(e) => handleDragOver(e, index)}>
                    {props.dropIndicator?.parentId === parentId && props.dropIndicator?.index === index && <DropIndicator />}
                    <BlockWrapper block={block} {...props} />
                </div>
            ))}
            <div onDragOver={(e) => handleDragOver(e, blocks.length)} className="h-4">
                 {props.dropIndicator?.parentId === parentId && props.dropIndicator?.index === blocks.length && <DropIndicator />}
            </div>
        </div>
    )
}

const DropIndicator = () => <div className="h-1 my-1 bg-teal-400 rounded-full" />;

const BlockWrapper: React.FC<any> = ({block, isPreview, selectedBlockId, setSelectedBlockId, deleteBlock, duplicateBlock, setDraggedBlock, dropIndicator, setDropIndicator, device}) => (
    <div 
        draggable={!isPreview}
        onDragStart={(e) => { e.stopPropagation(); setDraggedBlock(block); }}
        onDragEnd={() => setDraggedBlock(null)}
        className={`relative group transition-all ${!isPreview ? 'my-1 p-2 rounded-md' : ''} ${selectedBlockId === block.id && !isPreview ? 'ring-2 ring-offset-2 ring-[#009688]' : 'ring-2 ring-transparent'}`}
        onClick={(e) => { e.stopPropagation(); if (!isPreview) setSelectedBlockId(block.id); }}
    >
        {!isPreview && (
            <div className="absolute top-0 -left-8 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button title="Duplicate" onClick={(e) => {e.stopPropagation(); duplicateBlock(block.id)}} className="p-1.5 bg-white text-gray-600 rounded-md shadow border hover:bg-blue-100 hover:text-blue-600"><DocumentDuplicateIcon className="w-4 h-4" /></button>
                <button title="Delete" onClick={(e) => {e.stopPropagation(); deleteBlock(block.id)}} className="p-1.5 bg-white text-gray-600 rounded-md shadow border hover:bg-red-100 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
            </div>
        )}
        <BlockRenderer block={block} device={device}>
            {block.children && (
                 <div className="min-h-[80px] transition-all rounded-md">
                     <BlockContainer parentId={block.id} blocks={block.children} setSelectedBlockId={setSelectedBlockId} selectedBlockId={selectedBlockId} setDraggedBlock={setDraggedBlock} 
                        dropIndicator={dropIndicator} setDropIndicator={setDropIndicator} isPreview={isPreview} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} device={device}
                     />
                 </div>
            )}
        </BlockRenderer>
    </div>
);

const BlockRenderer: React.FC<{ block: Block, children?: React.ReactNode, device: Device | 'preview' }> = ({ block, children, device }) => {
    const { type, settings } = block;
    const currentDevice = device === 'preview' ? 'desktop' : device;

    const getResponsiveValue = <T,>(prop: Responsive<T> | undefined): T | undefined => {
        if (!prop) return undefined;
        if (prop[currentDevice]) return prop[currentDevice];
        if (currentDevice === 'mobile' && prop['tablet']) return prop['tablet'];
        return prop['desktop'];
    };

    const baseStyle: React.CSSProperties = {};
    if (settings.color) baseStyle.color = settings.color;
    if (settings.backgroundColor) baseStyle.backgroundColor = settings.backgroundColor;
    if (settings.height) baseStyle.height = settings.height;
    if (settings.fontSize) baseStyle.fontSize = getResponsiveValue(settings.fontSize);
    if (settings.textAlign) baseStyle.textAlign = getResponsiveValue(settings.textAlign) as React.CSSProperties['textAlign'];
    if (settings.width) baseStyle.width = getResponsiveValue(settings.width);

    // FIX: Explicitly type padding and margin to resolve compiler error
    const padding: SpacingValue | undefined = getResponsiveValue(settings.padding);
    if (padding) baseStyle.padding = `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`;
    const margin: SpacingValue | undefined = getResponsiveValue(settings.margin);
    if (margin) baseStyle.margin = `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`;

    switch(type) {
        case 'heading':
            const Tag = settings.level || 'h2';
            return <Tag style={baseStyle}>{settings.text}</Tag>;
        case 'text':
            return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: settings.html || '' }} />;
        case 'image':
            const justifyClassImg = { left: 'flex-start', center: 'center', right: 'flex-end' }[baseStyle.textAlign as string || 'right'] || 'flex-end';
            return <div style={{display: 'flex', justifyContent: justifyClassImg, margin: baseStyle.margin}}><img src={settings.src} alt={settings.alt} style={{width: baseStyle.width, height: baseStyle.height, borderRadius: '0.5rem'}} /></div>;
        case 'button':
            const justifyClassBtn = { left: 'flex-start', center: 'center', right: 'flex-end' }[baseStyle.textAlign as string || 'right'] || 'flex-end';
            const variantClasses = settings.variant === 'primary' 
                ? 'bg-[#009688] text-white hover:bg-[#00796B]' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
            const {color, backgroundColor, ...buttonStyle} = baseStyle;
            return <div style={{display: 'flex', justifyContent: justifyClassBtn, margin: buttonStyle.margin}}><a href={settings.href} style={buttonStyle} className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm ${variantClasses}`}>{settings.text}</a></div>;
        case 'divider':
            return <hr style={{ height: settings.height, borderTopStyle: settings.dividerStyle as any, borderColor: settings.color, margin: baseStyle.margin }} />;
        case 'video':
            const getEmbedUrl = (url: string = '') => {
                if (!url) return '';
                try {
                    // YouTube
                    if (url.includes('youtube.com/watch?v=')) {
                        const videoId = new URL(url).searchParams.get('v');
                        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
                    }
                    if (url.includes('youtu.be/')) {
                        const videoId = new URL(url).pathname.slice(1);
                        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
                    }
                    // Aparat
                    if (url.includes('aparat.com/v/')) {
                        const videoId = url.split('/v/')[1].split('/')[0];
                        return videoId ? `https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame` : '';
                    }
                } catch (e) {
                    console.error("Invalid URL for video embed:", e);
                    return '';
                }
                return '';
            };
            const embedUrl = getEmbedUrl(settings.url);
            return embedUrl ? <div style={{margin: baseStyle.margin}} className="aspect-video"><iframe src={embedUrl} title="Embedded Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-md"></iframe></div> : <div className="text-center p-4 bg-gray-100 text-gray-500 rounded-md">لینک ویدیو نامعتبر است.</div>;
        case 'container':
            return <div style={baseStyle}>{children}</div>;
        default: 
            return <div style={baseStyle}>{children}</div>;
    }
};

const SettingsPanel: React.FC<any> = ({ blocks, selectedBlockId, updateSettings, activeDevice }) => {
    const [activeTab, setActiveTab] = useState('content');
    
    const selectedBlock = selectedBlockId ? findBlockAndParent(blocks, selectedBlockId)?.block : null;
    
    useEffect(() => {
        setActiveTab('content');
    }, [selectedBlockId]);

    if (!selectedBlock) return (
        <aside className="w-80 bg-white border-r border-gray-200 p-4 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500">برای مشاهده تنظیمات، یک المان را انتخاب کنید.</p>
        </aside>
    );

    const { id, type, settings } = selectedBlock;
    const update = (key: string, value: any) => {
        const newSettings = { ...settings, [key]: value };
        updateSettings(id, newSettings);
    };

    const updateResponsive = (key: string, value: any) => {
        const newResponsiveSettings = { ...(settings[key] || {}), [activeDevice]: value };
        update(key, newResponsiveSettings);
    };

    const renderSettings = () => {
        const commonAdvanced = (
            <>
                <ResponsiveSpacingInput label="فاصله خارجی (Margin)" property="margin" settings={settings} update={updateResponsive} device={activeDevice} />
            </>
        );
        const containerAdvanced = (
             <>
                <ResponsiveSpacingInput label="فاصله داخلی (Padding)" property="padding" settings={settings} update={updateResponsive} device={activeDevice} />
                <ResponsiveSpacingInput label="فاصله خارجی (Margin)" property="margin" settings={settings} update={updateResponsive} device={activeDevice} />
            </>
        );

        switch(type) {
            case 'heading': return <>
                {activeTab === 'content' && <>
                    <SettingInput label="متن سرتیتر" value={settings.text || ''} onChange={val => update('text', val)} />
                    <SettingSelect label="سطح" value={settings.level || 'h2'} onChange={val => update('level', val)} options={[ {label: 'H1', value: 'h1'}, {label: 'H2', value: 'h2'}, {label: 'H3', value: 'h3'}, {label: 'H4', value: 'h4'} ]} />
                </>}
                {activeTab === 'style' && <>
                    <SettingInput type="color" label="رنگ متن" value={settings.color || '#000000'} onChange={val => update('color', val)} />
                    <ResponsiveStringInput label="اندازه فونت" property="fontSize" settings={settings} update={updateResponsive} device={activeDevice} />
                    <ResponsiveAlign label="چینش" property="textAlign" settings={settings} update={updateResponsive} device={activeDevice} />
                </>}
                {activeTab === 'advanced' && commonAdvanced}
            </>;
            case 'text': return <>
                {activeTab === 'content' && <>
                    <TextareaSetting label="محتوای متنی (HTML)" value={settings.html || ''} onChange={val => update('html', val)} />
                </>}
                {activeTab === 'style' && <>
                    <ResponsiveAlign label="چینش" property="textAlign" settings={settings} update={updateResponsive} device={activeDevice} />
                </>}
                {activeTab === 'advanced' && commonAdvanced}
            </>;
            case 'image': return <>
                {activeTab === 'content' && <>
                    <ImageUploadSetting label="تصویر" src={settings.src || ''} onUpload={base64 => update('src', base64)} />
                    <SettingInput label="متن جایگزین (Alt)" value={settings.alt || ''} onChange={val => update('alt', val)} />
                </>}
                {activeTab === 'style' && <>
                    <ResponsiveStringInput label="عرض" property="width" settings={settings} update={updateResponsive} device={activeDevice} />
                    <ResponsiveAlign label="چینش" property="textAlign" settings={settings} update={updateResponsive} device={activeDevice} />
                </>}
                {activeTab === 'advanced' && commonAdvanced}
            </>;
            case 'button': return <>
                {activeTab === 'content' && <>
                    <SettingInput label="متن دکمه" value={settings.text || ''} onChange={val => update('text', val)} />
                    <SettingInput label="لینک (URL)" value={settings.href || ''} onChange={val => update('href', val)} />
                </>}
                {activeTab === 'style' && <>
                    <SettingSelect label="نوع" value={settings.variant || 'primary'} onChange={val => update('variant', val)} options={[ {label: 'اصلی', value: 'primary'}, {label: 'ثانویه', value: 'secondary'} ]} />
                    <ResponsiveAlign label="چینش" property="textAlign" settings={settings} update={updateResponsive} device={activeDevice} />
                </>}
                {activeTab === 'advanced' && commonAdvanced}
            </>;
            case 'video': return <>
                {activeTab === 'content' && <>
                    <SettingInput label="آدرس ویدیو (YouTube or Aparat)" value={settings.url || ''} onChange={val => update('url', val)} />
                </>}
                {activeTab === 'advanced' && commonAdvanced}
            </>;
            case 'divider': return <>
                {activeTab === 'style' && <>
                    <SettingInput type="color" label="رنگ" value={settings.color || '#e5e7eb'} onChange={val => update('color', val)} />
                    <SettingInput label="ارتفاع" value={settings.height || '1px'} onChange={val => update('height', val)} />
                    <SettingSelect label="استایل" value={settings.dividerStyle || 'solid'} onChange={val => update('dividerStyle', val)} options={[{label: 'خط ممتد', value: 'solid'}, {label: 'خط‌چین', value: 'dashed'}, {label: 'نقطه‌چین', value: 'dotted'}]} />
                </>}
                {activeTab === 'advanced' && <>
                    <ResponsiveSpacingInput label="فاصله خارجی (Margin)" property="margin" settings={settings} update={updateResponsive} device={activeDevice} />
                </>}
            </>;
            case 'container': return <>
                {activeTab === 'style' && <>
                    <SettingInput type="color" label="رنگ پس‌زمینه" value={settings.backgroundColor || 'transparent'} onChange={val => update('backgroundColor', val)} />
                </>}
                {activeTab === 'advanced' && containerAdvanced}
            </>;
            default: return null;
        }
    }

    const blockNameMap: Record<BlockType, string> = { heading: 'سرتیتر', text: 'متن', image: 'تصویر', button: 'دکمه', divider: 'جداکننده', video: 'ویدیو', container: 'بخش' };

    return (
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold">تنظیمات: {blockNameMap[type]}</h3>
            </div>
            <div className="border-b border-gray-200 flex">
                <TabButton label="محتوا" icon={PencilIcon} isActive={activeTab==='content'} onClick={()=>setActiveTab('content')} />
                <TabButton label="استایل" icon={PaintBrushIcon} isActive={activeTab==='style'} onClick={()=>setActiveTab('style')} />
                <TabButton label="پیشرفته" icon={CogIcon} isActive={activeTab==='advanced'} onClick={()=>setActiveTab('advanced')} />
            </div>
            <div className="divide-y divide-gray-200">
                {renderSettings()}
            </div>
        </aside>
    )
}

const TabButton: React.FC<any> = ({ label, icon: Icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center p-2 text-xs font-medium border-b-2 ${isActive ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}>
        <Icon className="w-5 h-5 mb-1" />
        <span>{label}</span>
    </button>
)

const SettingInput: React.FC<{label: string, value: string, onChange: (val: string) => void, type?: string}> = ({label, value, onChange, type='text'}) => (
    <div className="p-3">
        <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#009688]"/>
    </div>
);

const SettingSelect: React.FC<{label: string, value: string, onChange: (val: string) => void, options: {label: string, value: string}[]}> = ({label, value, onChange, options}) => (
    <div className="p-3">
        <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#009688]">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const ResponsiveStringInput: React.FC<any> = ({ label, property, settings, update, device }) => (
    <div className="p-3">
        <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
        <input type="text" value={settings[property]?.[device] || ''} onChange={e => update(property, e.target.value)} placeholder={settings[property]?.desktop || 'Default'} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#009688]"/>
    </div>
)

const ResponsiveAlign: React.FC<any> = ({ label, property, settings, update, device }) => (
    <div className="p-3">
        <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
            <button onClick={() => update(property, 'right')} className={`flex-1 p-1 rounded ${settings[property]?.[device] === 'right' || (!settings[property]?.[device] && settings[property]?.desktop === 'right') ? 'bg-white shadow' : ''}`}><TextAlignRightIcon className="w-5 h-5 mx-auto"/></button>
            <button onClick={() => update(property, 'center')} className={`flex-1 p-1 rounded ${settings[property]?.[device] === 'center' ? 'bg-white shadow' : ''}`}><TextAlignCenterIcon className="w-5 h-5 mx-auto"/></button>
            <button onClick={() => update(property, 'left')} className={`flex-1 p-1 rounded ${settings[property]?.[device] === 'left' ? 'bg-white shadow' : ''}`}><TextAlignLeftIcon className="w-5 h-5 mx-auto"/></button>
        </div>
    </div>
)


export default PageEditorView;
