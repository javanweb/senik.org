import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, GripVerticalIcon, ChevronDownIcon } from '../../Icons';
import type { SiteContent, NavLink, Sublink } from '../../../siteData';
import type { DashboardViewType } from '../../../types';


interface SiteDataViewProps {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  onSave: () => Promise<boolean>;
  setActiveView: (view: DashboardViewType) => void;
  setEditingPage: (page: NavLink | Sublink) => void;
  setEditingPagePath: (path: string) => void;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]" />
    </div>
);

const TextareaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; }> = ({ label, value, onChange, rows = 5 }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={rows} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]" />
    </div>
);

const ImageUploadField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-4 mt-2">
            <img src={value} alt="Preview" className="w-32 h-20 p-1 border rounded-md object-cover bg-white shadow-sm" />
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009688]">
                <span>تغییر تصویر</span>
                <input type="file" className="sr-only" accept="image/png, image/jpeg, image/gif, image/webp" onChange={onChange} />
            </label>
        </div>
    </div>
);

const SiteDataView: React.FC<SiteDataViewProps> = ({ content, setContent, onSave, setActiveView, setEditingPage, setEditingPagePath }) => {
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [activeSection, setActiveSection] = useState<string>('header');
    const [collapsedItems, setCollapsedItems] = useState<Record<number, boolean>>({});
    
    const mainContentRef = useRef<HTMLElement>(null);
    
    // Drag and Drop State
    type DraggedInfo = { mainIndex: number; subIndex?: number; };
    type DropTargetInfo = { mainIndex: number; subIndex?: number; position: 'before' | 'after'; };
    
    const [draggedInfo, setDraggedInfo] = useState<DraggedInfo | null>(null);
    const [dropTargetInfo, setDropTargetInfo] = useState<DropTargetInfo | null>(null);

    const toggleCollapse = (index: number) => {
        setCollapsedItems(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const InlineEditField: React.FC<{ value: string; onSave: (newValue: string) => void; isSublink?: boolean }> = ({ value, onSave, isSublink = false }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [text, setText] = useState(value);
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (isEditing) {
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        }, [isEditing]);

        const handleSave = () => {
            if (text.trim() === '') {
                setText(value); // Reset if empty
            } else {
                onSave(text);
            }
            setIsEditing(false);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleSave();
            else if (e.key === 'Escape') {
                setText(value);
                setIsEditing(false);
            }
        };

        if (isEditing) {
            return (
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-2 py-1 bg-white border border-[#009688] rounded-md shadow-sm ${isSublink ? 'text-sm font-medium' : 'text-base font-semibold'}`}
                />
            );
        }

        return (
            <div onClick={() => setIsEditing(true)} className="group flex items-center gap-2 cursor-pointer p-1 -m-1 rounded-md hover:bg-gray-200/50 w-full">
                <span className={`${isSublink ? 'text-sm font-medium' : 'text-base font-semibold'} text-gray-800`}>{value}</span>
                <PencilIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        );
    };


    const placeholderIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iI2E1YjRjZCI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtMi4yNSAxNS43NSA3LjUtNy41IDMgMy43NSA1LjI1LTZMMjEuNzUgMTIiIC8+PC9zdmc+';

    const sections = [
        { id: 'header', title: 'منوی اصلی' },
        { id: 'hero', title: 'بخش Hero' },
        { id: 'clients', title: 'بخش مشتریان' },
        { id: 'features', title: 'امکانات اصلی' },
        { id: 'softwareShowcase', title: 'نمایش نرم‌افزار' },
        { id: 'analytics', title: 'تحلیل و اهداف' },
        { id: 'stats', title: 'آمار' },
        { id: 'moreFeatures', title: 'امکانات بیشتر' },
        { id: 'about', title: 'درباره ما' },
        { id: 'footer', title: 'فوتر' },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setActiveSection(sectionId);
    };

    const handleInputChange = (path: string, value: any) => {
        const keys = path.split('.');
        setContent(prev => {
            const newContent = JSON.parse(JSON.stringify(prev));
            let current: any = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                const arrayIndex = parseInt(key, 10);
                if (!isNaN(arrayIndex) && Array.isArray(current)) {
                    current = current[arrayIndex];
                } else if (current[key] === undefined || typeof current[key] !== 'object' || current[key] === null) {
                    current[key] = {};
                } else {
                    current = current[key];
                }
            }
            const lastKey = keys[keys.length - 1];
            const lastKeyIndex = parseInt(lastKey, 10);
            if (!isNaN(lastKeyIndex) && Array.isArray(current)) {
                current[lastKeyIndex] = value;
            } else {
                current[lastKey] = value;
            }
            return newContent;
        });
    };

    const handleIconChange = (section: 'features' | 'moreFeatures', index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            const currentItems = content[section]?.items || [];
            const newItems = [...currentItems];
            if (newItems[index]) {
                newItems[index].icon = base64String;
                handleInputChange(`${section}.items`, newItems);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (path: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            handleInputChange(path, base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveClick = async () => {
        setSaveState('saving');
        const success = await onSave();
        setSaveState(success ? 'saved' : 'error');
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (saveState === 'saved' || saveState === 'error') {
            timer = setTimeout(() => setSaveState('idle'), 3000);
        }
        return () => clearTimeout(timer);
    }, [saveState]);

    const getButtonState = () => {
        switch (saveState) {
            case 'saving': return { text: 'در حال ذخیره...', disabled: true, className: 'bg-teal-400 cursor-not-allowed' };
            case 'saved': return { text: 'تغییرات اعمال شد', disabled: true, className: 'bg-green-600' };
            case 'error': return { text: 'خطا در ذخیره', disabled: false, className: 'bg-red-600 hover:bg-red-700 focus:ring-red-500' };
            default: return { text: 'ذخیره تغییرات', disabled: false, className: 'bg-[#009688] hover:bg-[#00796B] focus:ring-[#009688]' };
        }
    };
    const buttonState = getButtonState();

    // --- Drag and Drop Logic ---
    const handleContainerDragOver = (e: React.DragEvent) => {
        // Only scroll if an item is being dragged
        if (!draggedInfo || !mainContentRef.current) return;

        const container = mainContentRef.current;
        const rect = container.getBoundingClientRect();
        
        const scrollZoneHeight = 80; // The height of the "hot zone" at the top and bottom
        const scrollSpeed = 15; // Pixels to scroll per frame

        // Check if cursor is in the top scroll zone
        if (e.clientY < rect.top + scrollZoneHeight) {
            container.scrollTop -= scrollSpeed;
        } 
        // Check if cursor is in the bottom scroll zone
        else if (e.clientY > rect.bottom - scrollZoneHeight) {
            container.scrollTop += scrollSpeed;
        }
    };

    const handleDragStart = (e: React.DragEvent, info: DraggedInfo) => {
        setDraggedInfo(info);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, mainIndex: number, subIndex?: number) => {
        e.preventDefault();
        if (!draggedInfo) return;

        // Prevent dropping main items on sub-items and vice-versa
        const isDraggingMain = draggedInfo.subIndex === undefined;
        const isOverMain = subIndex === undefined;
        if (isDraggingMain !== isOverMain) {
            setDropTargetInfo(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const position = e.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
        
        setDropTargetInfo({ mainIndex, subIndex, position });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedInfo || !dropTargetInfo) return;

        const newNavLinks = JSON.parse(JSON.stringify(content.header.navLinks));

        // 1. Remove dragged item
        let draggedItem: NavLink | Sublink;
        if (draggedInfo.subIndex !== undefined) {
            draggedItem = newNavLinks[draggedInfo.mainIndex].sublinks.splice(draggedInfo.subIndex, 1)[0];
        } else {
            draggedItem = newNavLinks.splice(draggedInfo.mainIndex, 1)[0];
        }
        
        // 2. Add to new position
        let { mainIndex, subIndex, position } = dropTargetInfo;
        
        if (subIndex !== undefined) { // Dropping on a sub-item
            if (draggedInfo.mainIndex !== mainIndex) return; // Disallow moving between parents for now
            let dropIdx = subIndex + (position === 'after' ? 1 : 0);
            if (draggedInfo.subIndex < dropIdx) dropIdx--;
            newNavLinks[mainIndex].sublinks.splice(dropIdx, 0, draggedItem);

        } else { // Dropping on a main item
            let dropIdx = mainIndex + (position === 'after' ? 1 : 0);
            if (draggedInfo.mainIndex < dropIdx) dropIdx--;
            newNavLinks.splice(dropIdx, 0, draggedItem);
        }

        handleInputChange('header.navLinks', newNavLinks);
    };

    const handleDragEnd = () => {
        setDraggedInfo(null);
        setDropTargetInfo(null);
    };
    
    const DropIndicator: React.FC = () => <div className="h-1 my-1 bg-blue-500 rounded-full transition-all" />;
    
    const isDragging = (mainIndex: number, subIndex?: number) => {
      if (!draggedInfo) return false;
      return draggedInfo.mainIndex === mainIndex && draggedInfo.subIndex === subIndex;
    }

    const renderSectionContent = (id: string) => {
      switch(id) {
        case 'header':
          return <>
            <div 
              className="space-y-4"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleDragEnd}
            >
              {(content.header?.navLinks || []).map((link, linkIndex) => {
                const isCollapsed = collapsedItems[linkIndex];
                const showTopIndicator = dropTargetInfo && dropTargetInfo.mainIndex === linkIndex && dropTargetInfo.subIndex === undefined && dropTargetInfo.position === 'before';
                const showBottomIndicator = dropTargetInfo && dropTargetInfo.mainIndex === linkIndex && dropTargetInfo.subIndex === undefined && dropTargetInfo.position === 'after';

                return (
                  <div key={linkIndex}>
                    {showTopIndicator && <DropIndicator />}
                    <div 
                      draggable
                      onDragStart={(e) => handleDragStart(e, { mainIndex: linkIndex })}
                      onDragOver={(e) => handleDragOver(e, linkIndex)}
                      className={`border border-gray-200 rounded-lg bg-gray-50/50 transition-opacity duration-200 ${isDragging(linkIndex) ? 'opacity-30' : ''}`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div className="cursor-move text-gray-400 hover:text-gray-600 pt-1.5" title="برای جابجایی بکشید">
                            <GripVerticalIcon className="w-5 h-5"/>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 flex-grow">
                                {(link.sublinks && link.sublinks.length > 0) && (
                                  <button onClick={() => toggleCollapse(linkIndex)} className="p-1 -mr-1 text-gray-400 hover:text-gray-700">
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                                  </button>
                                )}
                                <InlineEditField
                                  value={link.name}
                                  onSave={newValue => handleInputChange(`header.navLinks.${linkIndex}.name`, newValue)}
                                />
                            </div>
                            <div className="flex items-center flex-shrink-0">
                              <button onClick={() => { const newNavLinks = [...(content.header.navLinks || [])]; if (!newNavLinks[linkIndex].sublinks) { newNavLinks[linkIndex].sublinks = []; } newNavLinks[linkIndex].sublinks?.push({ name: 'زیرمنوی جدید', href: '#', content: '' }); handleInputChange('header.navLinks', newNavLinks); }} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors" title="افزودن زیرمنو" aria-label="Add sublink" ><PlusIcon className="w-5 h-5" /></button>
                              <button onClick={() => { const newNavLinks = (content.header.navLinks || []).filter((_, i) => i !== linkIndex); handleInputChange('header.navLinks', newNavLinks); }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" title="حذف آیتم" aria-label="Remove link"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                          </div>
                          
                          <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-4 items-end mt-3`}>
                            <InputField
                              label="URL (لینک)"
                              value={link.href}
                              onChange={e => handleInputChange(`header.navLinks.${linkIndex}.href`, e.target.value)}
                            />
                            <div className="mt-2 md:mt-0">
                              {link.content && link.content.trim() !== '' && link.content.trim() !== '<p><br></p>' ? (
                                <button 
                                  onClick={() => {
                                    setEditingPage(link);
                                    setEditingPagePath(`header.navLinks.${linkIndex}`);
                                    setActiveView('pageEditor');
                                  }}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors border border-gray-300 shadow-sm"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  <span>ادیتور صفحه</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    const newContent = '[]';
                                    const updatedLink = { ...link, content: newContent };
                                    handleInputChange(`header.navLinks.${linkIndex}`, updatedLink);
                                    setEditingPage(updatedLink);
                                    setEditingPagePath(`header.navLinks.${linkIndex}`);
                                    setActiveView('pageEditor');
                                  }}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors border border-blue-300 shadow-sm"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                  <span>ایجاد صفحه</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
                            {(link.sublinks && link.sublinks.length > 0) && (
                              <div className="ml-6 mt-4 pt-4 border-t border-gray-200 space-y-3">
                                <h4 className="font-semibold text-sm text-gray-600">زیرمنوها:</h4>
                                {link.sublinks.map((sublink, sublinkIndex) => {
                                  const showSubTopIndicator = dropTargetInfo && dropTargetInfo.mainIndex === linkIndex && dropTargetInfo.subIndex === sublinkIndex && dropTargetInfo.position === 'before';
                                  const showSubBottomIndicator = dropTargetInfo && dropTargetInfo.mainIndex === linkIndex && dropTargetInfo.subIndex === sublinkIndex && dropTargetInfo.position === 'after';

                                  return (
                                    <div key={sublinkIndex}>
                                      {showSubTopIndicator && <DropIndicator />}
                                      <div 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, { mainIndex: linkIndex, subIndex: sublinkIndex })}
                                        onDragOver={(e) => handleDragOver(e, linkIndex, sublinkIndex)}
                                        className={`p-3 bg-white rounded-md border flex items-start gap-2 transition-opacity duration-200 ${isDragging(linkIndex, sublinkIndex) ? 'opacity-30' : ''}`}
                                      >
                                          <div className="cursor-move text-gray-400 hover:text-gray-600 pt-1" title="برای جابجایی بکشید">
                                              <GripVerticalIcon className="w-4 h-4"/>
                                          </div>
                                          <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                              <InlineEditField
                                                value={sublink.name}
                                                onSave={newValue => handleInputChange(`header.navLinks.${linkIndex}.sublinks.${sublinkIndex}.name`, newValue)}
                                                isSublink={true}
                                              />
                                              <button onClick={() => { const newNavLinks = [...(content.header.navLinks || [])]; newNavLinks[linkIndex].sublinks = (newNavLinks[linkIndex].sublinks || []).filter((_, i) => i !== sublinkIndex); handleInputChange('header.navLinks', newNavLinks); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0" title="حذف زیرمنو" aria-label="Remove sublink"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 items-end mt-2">
                                              <InputField label="URL (لینک)" value={sublink.href} onChange={e => handleInputChange(`header.navLinks.${linkIndex}.sublinks.${sublinkIndex}.href`, e.target.value)} />
                                              <div className="mt-2 md:mt-0">
                                                {sublink.content && sublink.content.trim() !== '' && sublink.content.trim() !== '<p><br></p>' ? (
                                                  <button 
                                                    onClick={() => {
                                                      setEditingPage(sublink);
                                                      setEditingPagePath(`header.navLinks.${linkIndex}.sublinks.${sublinkIndex}`);
                                                      setActiveView('pageEditor');
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors border border-gray-300 shadow-sm"
                                                  >
                                                    <PencilIcon className="w-4 h-4" />
                                                    <span>ادیتور صفحه</span>
                                                  </button>
                                                ) : (
                                                  <button
                                                    onClick={() => {
                                                      const newContent = '[]';
                                                      const updatedSublink = { ...sublink, content: newContent };
                                                      handleInputChange(`header.navLinks.${linkIndex}.sublinks.${sublinkIndex}`, updatedSublink);
                                                      setEditingPage(updatedSublink);
                                                      setEditingPagePath(`header.navLinks.${linkIndex}.sublinks.${sublinkIndex}`);
                                                      setActiveView('pageEditor');
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors border border-blue-300 shadow-sm"
                                                  >
                                                    <PlusIcon className="w-4 h-4" />
                                                    <span>ایجاد صفحه</span>
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                      </div>
                                      {showSubBottomIndicator && <DropIndicator />}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {showBottomIndicator && <DropIndicator />}
                  </div>
                )
              })}
            </div>
            <button onClick={() => { const newLink = { name: 'لینک جدید', href: '#', content: '', sublinks: [] }; handleInputChange('header.navLinks', [...(content.header?.navLinks || []), newLink]); }} className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-[#009688] hover:text-[#009688] transition-all duration-200 font-semibold"><PlusIcon className="w-5 h-5" /><span>افزودن آیتم به منو</span></button>
          </>
        case 'hero':
          return <>
            <ImageUploadField label="تصویر Hero" value={content.hero?.imageUrl || ''} onChange={e => handleImageChange('hero.imageUrl', e)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4"><InputField label="عنوان اصلی" value={content.hero?.title || ''} onChange={e => handleInputChange('hero.title', e.target.value)} /></div>
              <div className="mb-4"><InputField label="زیر عنوان" value={content.hero?.subtitle || ''} onChange={e => handleInputChange('hero.subtitle', e.target.value)} /></div>
              <div className="md:col-span-2"><TextareaField label="توضیحات" value={content.hero?.description || ''} onChange={e => handleInputChange('hero.description', e.target.value)} rows={3} /></div>
              <div className="mb-4"><InputField label="متن دکمه اصلی" value={content.hero?.cta_primary || ''} onChange={e => handleInputChange('hero.cta_primary', e.target.value)} /></div>
              <div className="mb-4"><InputField label="متن دکمه دوم" value={content.hero?.cta_secondary || ''} onChange={e => handleInputChange('hero.cta_secondary', e.target.value)} /></div>
            </div>
          </>
        case 'clients':
          return <>
            <div className="mb-4"><InputField label="عنوان" value={content.clients?.title || ''} onChange={e => handleInputChange('clients.title', e.target.value)} /></div>
            <div className="mb-4"><InputField label="زیر عنوان" value={content.clients?.subtitle || ''} onChange={e => handleInputChange('clients.subtitle', e.target.value)} /></div>
          </>
        case 'features':
        case 'moreFeatures':
          const sectionKey = id as 'features' | 'moreFeatures';
          return <>
            <div className="mb-4"><InputField label="عنوان بخش" value={content[sectionKey]?.title || ''} onChange={e => handleInputChange(`${sectionKey}.title`, e.target.value)} /></div>
            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">لیست امکانات</h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 mb-4">
              {(content[sectionKey]?.items || []).map((item, index) => (
                <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50/50 relative pt-10">
                  <button onClick={() => { const newItems = (content[sectionKey]?.items || []).filter((_, i) => i !== index); handleInputChange(`${sectionKey}.items`, newItems); }} className="absolute top-2 left-2 text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100" aria-label="Remove feature"><TrashIcon className="w-5 h-5" /></button>
                  <div className="mb-4"><InputField label={`عنوان ویژگی #${index + 1}`} value={item.title} onChange={e => { const newItems = [...(content[sectionKey]?.items || [])]; newItems[index].title = e.target.value; handleInputChange(`${sectionKey}.items`, newItems); }}/></div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">آیکون</label>
                    <div className="flex items-center gap-4 mt-2">
                      <img src={item.icon || placeholderIcon} alt="Icon preview" className="w-16 h-16 p-1 border rounded-md object-contain bg-white shadow-sm" />
                      <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009688]"><span>تغییر تصویر</span><input type="file" className="sr-only" accept="image/png, image/jpeg, image/gif, image/svg+xml" onChange={e => handleIconChange(sectionKey, index, e)} /></label>
                    </div>
                  </div>
                  <TextareaField label="نکات (هر نکته در یک خط مجزا)" value={item.points.join('\n')} onChange={e => { const newItems = [...(content[sectionKey]?.items || [])]; newItems[index].points = e.target.value.split('\n'); handleInputChange(`${sectionKey}.items`, newItems); }} rows={3}/>
                </div>
              ))}
            </div>
            <button onClick={() => { const newItem = { icon: placeholderIcon, title: 'ویژگی جدید', points: ['نکته ۱'] }; handleInputChange(`${sectionKey}.items`, [...(content[sectionKey]?.items || []), newItem]); }} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-[#009688] hover:text-[#009688] transition-all duration-200 font-semibold"><PlusIcon className="w-5 h-5" /><span>افزودن ویژگی</span></button>
          </>
        case 'softwareShowcase':
          return <>
            <div className="mb-4"><InputField label="عنوان" value={content.softwareShowcase?.title || ''} onChange={e => handleInputChange('softwareShowcase.title', e.target.value)} /></div>
            <div className="mb-4"><InputField label="زیر عنوان" value={content.softwareShowcase?.subtitle || ''} onChange={e => handleInputChange('softwareShowcase.subtitle', e.target.value)} /></div>
            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">اسلایدهای تصویر</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(content.softwareShowcase?.slides || []).map((slide, index) => (
                <div key={index} className="relative group">
                  <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-24 object-cover rounded-md border" />
                  <button onClick={() => { const newSlides = (content.softwareShowcase?.slides || []).filter((_, i) => i !== index); handleInputChange('softwareShowcase.slides', newSlides); }} className="absolute top-1 right-1 bg-red-600/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove slide"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <div>
                <label className="cursor-pointer w-full h-24 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 hover:border-[#009688] hover:text-[#009688] transition-all">
                  <PlusIcon className="w-6 h-6" />
                  <span className="text-sm font-medium mt-1">افزودن تصویر</span>
                  <input type="file" className="sr-only" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const base64String = reader.result as string; const newSlides = [...(content.softwareShowcase?.slides || []), base64String]; handleInputChange('softwareShowcase.slides', newSlides); }; reader.readAsDataURL(file); e.target.value = ''; }}/>
                </label>
              </div>
            </div>
          </>
        case 'analytics':
          return <>
            <ImageUploadField label="تصویر بخش تحلیل" value={content.analytics?.imageUrl || ''} onChange={e => handleImageChange('analytics.imageUrl', e)} />
            <div className="mb-4"><InputField label="عنوان اول" value={content.analytics?.title1 || ''} onChange={e => handleInputChange('analytics.title1', e.target.value)} /></div>
            <TextareaField label="پاراگراف اول" value={content.analytics?.paragraph1 || ''} onChange={e => handleInputChange('analytics.paragraph1', e.target.value)} />
            <div className="mb-4"><InputField label="عنوان دوم" value={content.analytics?.title2 || ''} onChange={e => handleInputChange('analytics.title2', e.target.value)} /></div>
            <TextareaField label="پاراگراف دوم" value={content.analytics?.paragraph2 || ''} onChange={e => handleInputChange('analytics.paragraph2', e.target.value)} />
            <div className="mb-4"><InputField label="متن دکمه" value={content.analytics?.cta || ''} onChange={e => handleInputChange('analytics.cta', e.target.value)} /></div>
          </>
        case 'stats':
          return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="mb-4">
              <InputField label="مقدار تجربه" value={content.stats?.experience?.value || ''} onChange={e => handleInputChange('stats.experience.value', e.target.value)} />
              <InputField label="برچسب تجربه" value={content.stats?.experience?.label || ''} onChange={e => handleInputChange('stats.experience.label', e.target.value)} />
            </div>
            <div className="mb-4">
              <InputField label="مقدار مشتریان" value={content.stats?.customers?.value || ''} onChange={e => handleInputChange('stats.customers.value', e.target.value)} />
              <InputField label="برچسب مشتریان" value={content.stats?.customers?.label || ''} onChange={e => handleInputChange('stats.customers.label', e.target.value)} />
            </div>
            <div className="mb-4">
              <InputField label="مقدار تیم" value={content.stats?.team?.value || ''} onChange={e => handleInputChange('stats.team.value', e.target.value)} />
              <InputField label="برچسب تیم" value={content.stats?.team?.label || ''} onChange={e => handleInputChange('stats.team.label', e.target.value)} />
            </div>
            <div className="mb-4">
              <InputField label="مقدار رضایت" value={content.stats?.satisfaction?.value || ''} onChange={e => handleInputChange('stats.satisfaction.value', e.target.value)} />
              <InputField label="برچسب رضایت" value={content.stats?.satisfaction?.label || ''} onChange={e => handleInputChange('stats.satisfaction.label', e.target.value)} />
            </div>
          </div>
        case 'about':
          return <>
            <ImageUploadField label="تصویر درباره ما" value={content.about?.imageUrl || ''} onChange={e => handleImageChange('about.imageUrl', e)} />
            <div className="mb-4"><InputField label="عنوان" value={content.about?.title || ''} onChange={e => handleInputChange('about.title', e.target.value)} /></div>
            <TextareaField label="پاراگراف" value={content.about?.paragraph || ''} onChange={e => handleInputChange('about.paragraph', e.target.value)} rows={8} />
            <div className="mb-4"><InputField label="متن دکمه" value={content.about?.cta || ''} onChange={e => handleInputChange('about.cta', e.target.value)} /></div>
            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">گاه‌شمار تاریخچه</h3>
            {(content.about?.timeline || []).map((item, index) => (
              <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50/50 relative pt-10">
                <button onClick={() => { const newItems = (content.about?.timeline || []).filter((_, i) => i !== index); handleInputChange('about.timeline', newItems); }} className="absolute top-2 left-2 text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100" aria-label="Remove timeline event"><TrashIcon className="w-5 h-5" /></button>
                <div className="mb-4"><InputField label="سال" value={item.year} onChange={e => { const newItems = [...(content.about?.timeline || [])]; newItems[index].year = e.target.value; handleInputChange('about.timeline', newItems); }}/></div>
                <TextareaField label="توضیحات" value={item.description} onChange={e => { const newItems = [...(content.about?.timeline || [])]; newItems[index].description = e.target.value; handleInputChange('about.timeline', newItems); }} rows={2}/>
              </div>
            ))}
            <button onClick={() => { const newItem = { year: 'سال جدید', description: 'رویداد جدید.' }; handleInputChange('about.timeline', [...(content.about?.timeline || []), newItem]); }} className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm font-medium"><PlusIcon className="w-5 h-5" /><span>افزودن رویداد</span></button>
          </>
        case 'footer':
          return <>
            <TextareaField label="توضیحات کوتاه" value={content.footer?.description || ''} onChange={e => handleInputChange('footer.description', e.target.value)} rows={3}/>
            <div className="mb-4"><InputField label="عنوان تماس با ما" value={content.footer?.contact?.title || ''} onChange={e => handleInputChange('footer.contact.title', e.target.value)} /></div>
            <div className="mb-4"><InputField label="شماره تماس" value={content.footer?.contact?.phone || ''} onChange={e => handleInputChange('footer.contact.phone', e.target.value)} /></div>
            <div className="mb-4"><InputField label="ایمیل" value={content.footer?.contact?.email || ''} onChange={e => handleInputChange('footer.contact.email', e.target.value)} /></div>
            <div className="mb-4"><InputField label="متن کپی‌رایت" value={content.footer?.copyright || ''} onChange={e => handleInputChange('footer.copyright', e.target.value)} /></div>
          </>
        default:
          return null;
      }
    };
    
    const activeSectionData = sections.find(section => section.id === activeSection);

    return (
        <div className="flex flex-col bg-gray-50 h-full">
            <div className="flex justify-between items-center p-6 bg-white border-b border-gray-200 flex-shrink-0 z-10 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">مدیریت محتوای سایت</h1>
                <button
                    onClick={handleSaveClick}
                    className={`px-6 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${buttonState.className}`}
                    disabled={buttonState.disabled}
                >
                    {buttonState.text}
                </button>
            </div>

            <div className="flex flex-row-reverse flex-grow overflow-hidden">
                <main 
                    ref={mainContentRef}
                    onDragOver={handleContainerDragOver}
                    className="flex-1 p-8 overflow-y-auto"
                >
                    {activeSectionData && (
                        <section
                            key={activeSectionData.id}
                            id={activeSectionData.id}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                            aria-labelledby={`${activeSectionData.id}-heading`}
                        >
                            <h2 id={`${activeSectionData.id}-heading`} className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#009688]/50">
                                {activeSectionData.title}
                            </h2>
                            {renderSectionContent(activeSectionData.id)}
                        </section>
                    )}
                </main>

                <aside className="w-60 bg-white p-6 border-l border-gray-200 flex-shrink-0">
                    <nav>
                        <h3 className="font-semibold text-gray-500 mb-4 text-sm uppercase tracking-wider">فهرست بخش ها</h3>
                        <ul className="space-y-1">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        onClick={(e) => handleNavClick(e, section.id)}
                                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-r-4 ${
                                            activeSection === section.id
                                                ? 'bg-teal-50 text-[#00796B] border-[#009688]'
                                                : 'text-gray-600 hover:bg-gray-100 border-transparent'
                                        }`}
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            </div>
        </div>
    );
};

export default SiteDataView;