import React, { useState, useRef, useEffect } from 'react';
import { LinkIcon, UnlinkIcon, UploadIcon, PlusIcon, TrashIcon } from './icons';

type ControlProps<T> = {
    label: string;
    value: T;
    onChange: (val: T) => void;
};

export const QuillEditorControl: React.FC<ControlProps<string>> = ({ label, value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);

    useEffect(() => {
        let quill: any;
        if (editorRef.current && !quillRef.current && (window as any).Quill) {
            quill = new (window as any).Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{ 'align': [] }],
                        ['link', 'clean']
                    ],
                },
            });
            quillRef.current = quill;

            if (value) {
                quill.clipboard.dangerouslyPasteHTML(0, value);
            }
            quill.formatLine(0, 1, 'align', 'right');

            quill.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                    onChange(quill.root.innerHTML);
                }
            });
        }
        
        return () => {
            if (quill) {
                quill.off('text-change');
            }
        };

    }, []);

    useEffect(() => {
        if (quillRef.current) {
            const editorHtml = quillRef.current.root.innerHTML;
            if (value !== editorHtml) {
                const selection = quillRef.current.getSelection();
                quillRef.current.clipboard.dangerouslyPasteHTML(0, value || '');
                if (selection) {
                    setTimeout(() => quillRef.current.setSelection(selection), 0);
                }
            }
        }
    }, [value]);

    return (
        <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
            <div className="bg-white border border-gray-300 rounded-md shadow-sm">
                <div ref={editorRef} />
            </div>
            <style>{`
                .ql-toolbar.ql-snow {
                    border-radius: 0.375rem 0.375rem 0 0;
                    border: none;
                    border-bottom: 1px solid #d1d5db;
                }
                .ql-container.ql-snow {
                    border: none;
                    min-height: 150px;
                }
                .ql-editor {
                    direction: rtl;
                    text-align: right;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 1.6;
                }
                .ql-editor.ql-blank::before {
                    right: 1rem;
                    left: auto;
                    font-style: normal;
                }
            `}</style>
        </div>
    );
};

export const Accordion: React.FC<{ title: string; children: React.ReactNode, startOpen?: boolean }> = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        <div className="border-b">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 px-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
                <span>{title}</span>
                <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="p-3 bg-gray-50">{children}</div>}
        </div>
    )
}

export const TabsControl: React.FC<{ tabs: string[]; activeTab: string; onTabChange: (tab: string) => void }> = ({ tabs, activeTab, onTabChange }) => (
    <div className="flex bg-gray-100 rounded-md p-0.5 mb-3">
        {tabs.map(tab => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 text-center text-xs font-semibold py-1.5 rounded-md transition-colors ${activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
                {tab}
            </button>
        ))}
    </div>
)

export const InputControl: React.FC<ControlProps<string | number> & { type?: string, placeholder?: string }> = ({ label, value, onChange, type = "text", placeholder }) => (
    <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : e.target.valueAsNumber) : e.target.value)} 
            placeholder={placeholder}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
        />
    </div>
);

export const SelectControl: React.FC<ControlProps<string> & { options: { value: string, label: string }[] }> = ({ label, value, onChange, options }) => (
    <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
        <select 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

export const ColorControl: React.FC<ControlProps<string>> = ({ label, value, onChange }) => (
     <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <input 
                type="color" 
                value={value || '#ffffff'} 
                onChange={e => onChange(e.target.value)} 
                className="w-8 h-8 p-0 border-none rounded-md cursor-pointer"
            />
            <input
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder="#RRGGBB"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
        </div>
    </div>
);

export const SliderControl: React.FC<ControlProps<number> & { min?: number, max?: number, step?: number, unit?: string }> = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) => (
    <div className="mb-3">
        <div className="flex justify-between items-baseline">
            <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
             <div className="flex items-baseline">
                <input 
                    type="number" 
                    value={value} 
                    onChange={e => onChange(e.target.value === '' ? 0 : e.target.valueAsNumber)}
                    className="w-16 px-1 py-0.5 border-b border-gray-300 focus:border-indigo-500 text-sm text-right"
                />
                {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
            </div>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step}
            value={value} 
            onChange={e => onChange(e.target.valueAsNumber)} 
            className="w-full mt-1"
        />
    </div>
);

export const CheckboxControl: React.FC<ControlProps<boolean> & { description?: string }> = ({ label, value, onChange, description }) => (
    <div className="mb-3">
        <label className="flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                checked={!!value} 
                onChange={e => onChange(e.target.checked)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
        </label>
        {description && <p className="text-xs text-gray-500 mt-1 ml-6">{description}</p>}
    </div>
);

export const TextareaControl: React.FC<ControlProps<string> & { rows?: number }> = ({ label, value, onChange, rows = 4 }) => (
    <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
    </div>
);

export const AlignmentControl: React.FC<ControlProps<string>> = ({ label, value, onChange }) => (
    <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
        <div className="flex border border-gray-200 bg-gray-100 rounded-md overflow-hidden p-0.5">
            <Button value="left" selected={value} onClick={onChange}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </Button>
            <Button value="center" selected={value} onClick={onChange}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </Button>
            <Button value="right" selected={value} onClick={onChange}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 10a1 1 0 01-1-1V5a1 1 0 012 0v4a1 1 0 01-1 1zm2 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zM3 15a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" transform="rotate(180 10 10)" /></svg>
            </Button>
        </div>
    </div>
);

type Dimension = { top: number; right: number; bottom: number; left: number; unit: string; isLinked: boolean; };
export const DimensionControl: React.FC<ControlProps<Dimension>> = ({ label, value, onChange }) => {
    const isLinked = value.isLinked;

    const handleSingleChange = (side: 'top' | 'right' | 'bottom' | 'left', newAmount: number) => {
        if (isLinked) {
            onChange({ ...value, top: newAmount, right: newAmount, bottom: newAmount, left: newAmount });
        } else {
            onChange({ ...value, [side]: newAmount });
        }
    };
    
    const toggleLink = () => {
        onChange({...value, isLinked: !value.isLinked});
    }

    const sides: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'right', 'bottom', 'left'];

    return (
        <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
            <div className="flex items-center justify-between">
                {sides.map(side => (
                    <input
                        key={side}
                        type="number"
                        value={value[side]}
                        onChange={e => handleSingleChange(side, e.target.valueAsNumber || 0)}
                        className="w-1/5 px-1 py-1 text-center border-b border-gray-300 focus:border-indigo-500 text-sm"
                        placeholder={side.charAt(0).toUpperCase()}
                    />
                ))}
                <button onClick={toggleLink} className="p-1 text-gray-500 hover:text-indigo-600">
                    {isLinked ? <LinkIcon className="w-4 h-4" /> : <UnlinkIcon className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

type BoxShadow = { h: number; v: number; blur: number; spread: number; color: string; position: 'outline' | 'inset'; };
export const BoxShadowControl: React.FC<ControlProps<BoxShadow>> = ({ label, value, onChange }) => {
     const update = (key: keyof BoxShadow, val: any) => onChange({ ...value, [key]: val });
    return (
         <div className="mb-3 p-3 border rounded-md">
            <label className="text-xs font-semibold text-gray-500 block mb-2">{label}</label>
            <ColorControl label="رنگ" value={value.color} onChange={val => update('color', val)} />
            <SliderControl label="افقی" value={value.h} onChange={val => update('h', val)} min={-50} max={50} unit="px" />
            <SliderControl label="عمودی" value={value.v} onChange={val => update('v', val)} min={-50} max={50} unit="px" />
            <SliderControl label="محو شدگی" value={value.blur} onChange={val => update('blur', val)} min={0} max={100} unit="px" />
            <SliderControl label="گسترش" value={value.spread} onChange={val => update('spread', val)} min={-50} max={50} unit="px" />
        </div>
    )
}

export const FileUploadControl: React.FC<ControlProps<string> & { accept?: string }> = ({ label, value, onChange, accept = 'image/*' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => inputRef.current?.click();

  return (
    <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                {value ? <img src={value} className="w-full h-full object-cover" /> : <UploadIcon className="w-8 h-8 text-gray-400" />}
            </div>
            <button onClick={triggerFileSelect} className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-md">
                انتخاب فایل
            </button>
            <input type="file" ref={inputRef} onChange={handleFileChange} accept={accept} className="hidden" />
        </div>
    </div>
  );
};

interface RepeaterControlProps {
    label: string;
    items: any[];
    onUpdate: (items: any[]) => void;
    defaultItem: object;
    renderItem: (item: any, onUpdateItem: (updatedItem: any) => void, index: number) => React.ReactNode;
}
export const RepeaterControl: React.FC<RepeaterControlProps> = ({ label, items, onUpdate, defaultItem, renderItem }) => {
  const handleAddItem = () => {
    onUpdate([...(items || []), { ...defaultItem, id: Date.now() }]);
  };

  const handleRemoveItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updatedItem: any) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onUpdate(newItems);
  };

  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-gray-500 block mb-2">{label}</label>
      <div className="space-y-3">
        {(items || []).map((item, index) => (
          <div key={item.id || index} className="p-3 bg-gray-50 border rounded-md relative group">
             <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleRemoveItem(index)} className="p-1 text-gray-400 hover:text-red-500">
                  <TrashIcon className="w-4 h-4" />
                </button>
            </div>
            {renderItem(item, (updated) => handleUpdateItem(index, updated), index)}
          </div>
        ))}
      </div>
      <button onClick={handleAddItem} className="mt-3 w-full text-center py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center gap-1">
        <PlusIcon className="w-4 h-4" />
        افزودن آیتم
      </button>
    </div>
  );
};


const Button: React.FC<{value: string, selected: string, onClick: (v:string)=>void, children: React.ReactNode}> = ({value, selected, onClick, children}) => (
    <button onClick={() => onClick(value)} className={`flex-1 p-1.5 text-gray-500 rounded-md transition-colors ${selected === value ? 'bg-white text-indigo-600 shadow-sm' : 'hover:bg-gray-200'}`}>
        {children}
    </button>
)

// New Controls
type Typography = {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textTransform?: string;
    fontStyle?: string;
    textDecoration?: string;
    lineHeight?: number; // em
    letterSpacing?: number; // px
};

export const TypographyControl: React.FC<ControlProps<Typography>> = ({ label, value, onChange }) => {
    const update = (key: keyof Typography, val: any) => onChange({ ...value, [key]: val });

    return (
        <Accordion title={label} startOpen>
            <div className="space-y-3">
                <SliderControl label="اندازه فونت" value={value.fontSize || 16} onChange={val => update('fontSize', val)} unit="px" max={100} />
                <SelectControl label="وزن فونت" value={value.fontWeight || '400'} onChange={val => update('fontWeight', val)} options={[
                    { value: '100', label: '100' }, { value: '200', label: '200' }, { value: '300', label: '300' },
                    { value: '400', label: '400 (Normal)' }, { value: '500', label: '500' }, { value: '600', label: '600' },
                    { value: '700', label: '700 (Bold)' }, { value: '800', label: '800' }, { value: '900', label: '900' }
                ]} />
                <SelectControl label="تبدیل متن" value={value.textTransform || 'none'} onChange={val => update('textTransform', val)} options={[
                    { value: 'none', label: 'هیچکدام' }, { value: 'uppercase', label: 'حروف بزرگ' },
                    { value: 'lowercase', label: 'حروف کوچک' }, { value: 'capitalize', label: 'حرف اول بزرگ' }
                ]} />
                <SelectControl label="استایل" value={value.fontStyle || 'normal'} onChange={val => update('fontStyle', val)} options={[
                    { value: 'normal', label: 'عادی' }, { value: 'italic', label: 'ایتالیک' }, { value: 'oblique', label: 'اریب' }
                ]} />
                <SelectControl label="دکوراسیون" value={value.textDecoration || 'none'} onChange={val => update('textDecoration', val)} options={[
                    { value: 'none', label: 'هیچکدام' }, { value: 'underline', label: 'زیر خط' },
                    { value: 'overline', label: 'بالا خط' }, { value: 'line-through', label: 'خط خورده' }
                ]} />
                <SliderControl label="ارتفاع خط" value={value.lineHeight || 1.5} onChange={val => update('lineHeight', val)} unit="em" min={0.5} max={3} step={0.1} />
                <SliderControl label="فاصله حروف" value={value.letterSpacing || 0} onChange={val => update('letterSpacing', val)} unit="px" min={-5} max={10} step={0.1} />
            </div>
        </Accordion>
    )
};

type TextShadow = {
    color: string;
    blur: number;
    horizontal: number;
    vertical: number;
};

export const TextShadowControl: React.FC<ControlProps<TextShadow>> = ({ label, value, onChange }) => {
    const update = (key: keyof TextShadow, val: any) => onChange({ ...value, [key]: val });
    return (
        <Accordion title={label}>
            <ColorControl label="رنگ" value={value.color} onChange={val => update('color', val)} />
            <SliderControl label="محو شدگی" value={value.blur} onChange={val => update('blur', val)} min={0} max={50} unit="px" />
            <SliderControl label="افقی" value={value.horizontal} onChange={val => update('horizontal', val)} min={-50} max={50} unit="px" />
            <SliderControl label="عمودی" value={value.vertical} onChange={val => update('vertical', val)} min={-50} max={50} unit="px" />
        </Accordion>
    )
};