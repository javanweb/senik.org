import React, { useState, useEffect } from 'react';
import type { SiteContent, CustomThemeColors } from '../../../siteData';
import { defaultThemeColors } from '../../../siteData';
import { CheckCircleIcon } from '../../Icons';

// --- Helper Functions for Colors ---
const lightenDarkenColor = (col: string, amt: number): string => {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    
    const toHex = (c: number) => ('00' + c.toString(16)).slice(-2);
    return (usePound ? "#" : "") + toHex(r) + toHex(b) + toHex(g);
};


const getContrastYIQ = (hexcolor: string): string => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1f2937' : '#ffffff';
};


// Pre-defined theme presets
const themes = [
    { id: 'default', name: 'پیش فرض سه نیک', colors: { primary: '#009688', secondary: '#263238', hero: '#E0F2F1' } },
    { id: 'blue', name: 'اقیانوس آبی', colors: { primary: '#3b82f6', secondary: '#1e3a8a', hero: '#dbeafe' } },
    { id: 'dark', name: 'تاریک نیمه‌شب', colors: { primary: '#f97316', secondary: '#4b5563', hero: '#1f2937' } },
    { id: 'orange', name: 'غروب گرم', colors: { primary: '#f97316', secondary: '#7c2d12', hero: '#ffedd5' } },
];

const presetThemeColors: Record<string, CustomThemeColors> = {
    default: defaultThemeColors,
    blue: { primary: '#3b82f6', primaryHover: '#2563eb', secondary: '#1e3a8a', background: '#eff6ff', cardBackground: '#ffffff', border: '#dbeafe', textPrimary: '#111827', textSecondary: '#374151', textOnPrimary: '#ffffff', heroGradient: '#dbeafe' },
    dark: { primary: '#f97316', primaryHover: '#ea580c', secondary: '#4b5563', background: '#111827', cardBackground: '#1f2937', border: '#374151', textPrimary: '#f9fafb', textSecondary: '#d1d5db', textOnPrimary: '#ffffff', heroGradient: '#1f2937' },
    orange: { primary: '#f97316', primaryHover: '#ea580c', secondary: '#7c2d12', background: '#fff7ed', cardBackground: '#ffffff', border: '#fed7aa', textPrimary: '#1c1917', textSecondary: '#44403c', textOnPrimary: '#ffffff', heroGradient: '#ffedd5' }
};

interface ThemeViewProps {
    content: SiteContent;
    setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
    onSave: () => Promise<boolean>;
}

const ColorPicker: React.FC<{ label: string; color: string; onChange: (color: string) => void; }> = ({ label, color, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-md p-1 bg-white shadow-sm">
            <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 border-none cursor-pointer bg-transparent" style={{'WebkitAppearance': 'none', 'appearance': 'none'}}/>
            <span className="text-sm font-mono text-gray-600 w-20 text-center">{color}</span>
        </div>
    </div>
);

const LivePreview: React.FC<{ colors: CustomThemeColors }> = ({ colors }) => (
    <div className="w-full h-full rounded-xl p-6 transition-colors duration-300 shadow-inner" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
        <div className="h-24 rounded-lg mb-6" style={{ backgroundColor: colors.heroGradient }}></div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>این یک عنوان نمونه است</h2>
            <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
                این پاراگراف برای نمایش رنگ متن ثانویه است. تغییرات شما به صورت زنده در اینجا اعمال می‌شود.
            </p>
            <button
                className="px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300"
                style={{
                    backgroundColor: colors.primary,
                    color: colors.textOnPrimary,
                    boxShadow: `0 4px 14px 0 ${colors.primary}55`
                }}
            >
                دکمه اصلی
            </button>
        </div>
    </div>
);

const ThemeView: React.FC<ThemeViewProps> = ({ content, setContent, onSave }) => {
    const [customColors, setCustomColors] = useState<CustomThemeColors>(content.themeColors || defaultThemeColors);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        setCustomColors(content.themeColors || defaultThemeColors);
    }, [content.themeColors]);

    const handleColorChange = (key: keyof CustomThemeColors, value: string) => {
        const newColors = { ...customColors, [key]: value };

        if (key === 'primary') {
            newColors.primaryHover = lightenDarkenColor(value, -20);
            newColors.textOnPrimary = getContrastYIQ(value);
        }
        
        setCustomColors(newColors);
        setContent(prev => ({ ...prev, theme: 'custom', themeColors: newColors }));
    };
    
    const handlePresetSelect = (themeId: string) => {
        const newColors = presetThemeColors[themeId];
        setCustomColors(newColors);
        setContent(prev => ({ ...prev, theme: themeId, themeColors: newColors }));
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

    const buttonState = {
        saving: { text: 'در حال ذخیره...', disabled: true, className: 'bg-teal-400 cursor-not-allowed' },
        saved: { text: 'تغییرات اعمال شد', disabled: true, className: 'bg-green-600' },
        error: { text: 'خطا در ذخیره', disabled: false, className: 'bg-red-600 hover:bg-red-700' },
        idle: { text: 'ذخیره و اعمال قالب', disabled: false, className: 'bg-[#263238] hover:bg-gray-900' }
    }[saveState];
    
    const isCustomThemeActive = content.theme === 'custom';

    return (
        <div className="flex flex-col bg-gray-50 h-full">
            <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200 flex-shrink-0 z-10 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">مدیریت قالب سایت</h1>
                <button onClick={handleSaveClick} disabled={buttonState.disabled} className={`px-6 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${buttonState.className}`}>
                    {buttonState.text}
                </button>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 overflow-y-auto">
                <div className="lg:col-span-1 space-y-8">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">انتخاب قالب آماده</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {themes.map(theme => (
                                <div key={theme.id} onClick={() => handlePresetSelect(theme.id)} className={`rounded-lg border-2 p-3 cursor-pointer transition-all ${content.theme === theme.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-blue-400'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-sm text-gray-700">{theme.name}</h3>
                                        {content.theme === theme.id && <CheckCircleIcon className="w-5 h-5 text-blue-500"/>}
                                    </div>
                                    <div className="h-12 flex rounded-md overflow-hidden">
                                        <div style={{ backgroundColor: theme.colors.primary }} className="w-1/3"></div>
                                        <div style={{ backgroundColor: theme.colors.secondary }} className="w-1/3"></div>
                                        <div style={{ backgroundColor: theme.colors.hero }} className="w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ${isCustomThemeActive ? 'ring-2 ring-blue-500' : ''}`}>
                         <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">ویرایشگر رنگ سفارشی</h2>
                            {isCustomThemeActive && <span className="text-xs font-bold text-white bg-blue-500 px-2 py-1 rounded-full">فعال</span>}
                        </div>
                        <p className="text-xs text-gray-500 mb-6">
                            {isCustomThemeActive ? 'شما در حال ویرایش قالب سفارشی هستید.' : 'برای فعال‌سازی، یکی از رنگ‌ها را تغییر دهید.'}
                        </p>
                        <div className="space-y-4">
                           <ColorPicker label="رنگ اصلی" color={customColors.primary} onChange={color => handleColorChange('primary', color)} />
                           <ColorPicker label="رنگ ثانویه" color={customColors.secondary} onChange={color => handleColorChange('secondary', color)} />
                           <ColorPicker label="رنگ پس‌زمینه" color={customColors.background} onChange={color => handleColorChange('background', color)} />
                           <ColorPicker label="پس‌زمینه کارت" color={customColors.cardBackground} onChange={color => handleColorChange('cardBackground', color)} />
                           <ColorPicker label="پس‌زمینه Hero" color={customColors.heroGradient} onChange={color => handleColorChange('heroGradient', color)} />
                           <ColorPicker label="متن اصلی" color={customColors.textPrimary} onChange={color => handleColorChange('textPrimary', color)} />
                           <ColorPicker label="متن ثانویه" color={customColors.textSecondary} onChange={color => handleColorChange('textSecondary', color)} />
                           <ColorPicker label="رنگ حاشیه" color={customColors.border} onChange={color => handleColorChange('border', color)} />
                        </div>
                        <button onClick={() => handlePresetSelect('default')} className="w-full mt-6 text-sm text-center text-gray-600 hover:text-red-500 transition-colors">بازنشانی به پیش‌فرض</button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="sticky top-8">
                         <h2 className="text-lg font-semibold text-gray-800 mb-4">پیش‌نمایش زنده</h2>
                        <LivePreview colors={customColors} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeView;