import React, { useState } from 'react';
import { InputControl, SelectControl, ColorControl, SliderControl, CheckboxControl, TextareaControl, AlignmentControl, FileUploadControl, RepeaterControl, Accordion, TypographyControl, TextShadowControl, TabsControl, DimensionControl, QuillEditorControl } from '../components/SettingsControls';

interface SettingsComponentProps {
    settings: { [key: string]: any };
    onUpdate: (newSettings: any) => void;
    activeTab: 'content' | 'style' | 'advanced';
}

const updateContent = (currentSettings: any, key: string, value: any) => ({ ...currentSettings, content: { ...currentSettings.content, [key]: value }});
const updateStyle = (currentSettings: any, key: string, value: any) => ({ ...currentSettings, style: { ...currentSettings.style, [key]: value }});
const updateLink = (currentSettings: any, key: string, value: any) => ({ ...currentSettings, content: { ...currentSettings.content, link: { ...currentSettings.content.link, [key]: value }}});

export const InnerSectionSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <SliderControl label="ستون‌ها" min={1} max={12} value={settings.content.columns} onChange={val => onUpdate(updateContent(settings, 'columns', val))} />
                <SelectControl label="فاصله ستون‌ها" value={settings.content.column_gap} onChange={val => onUpdate(updateContent(settings, 'column_gap', val))} options={[{value: 'default', label: 'پیش‌فرض'}, {value: 'narrow', label: 'کم'}, {value: 'extended', label: 'متوسط'}, {value: 'wide', label: 'زیاد'}]} />
                <SelectControl label="ارتفاع" value={settings.content.height} onChange={val => onUpdate(updateContent(settings, 'height', val))} options={[{value: 'default', label: 'پیش‌فرض'}, {value: 'fit_to_content', label: 'هم اندازه محتوا'}, {value: 'min_height', label: 'حداقل ارتفاع'}]} />
                {settings.content.height === 'min_height' && <SliderControl label="حداقل ارتفاع (vh)" value={settings.content.min_height} min={10} max={100} unit="vh" onChange={val => onUpdate(updateContent(settings, 'min_height', val))} />}
                <SelectControl label="موقعیت محتوا" value={settings.content.content_position} onChange={val => onUpdate(updateContent(settings, 'content_position', val))} options={[{value: 'default', label: 'پیش‌فرض'}, {value: 'top', label: 'بالا'}, {value: 'center', label: 'وسط'}, {value: 'bottom', label: 'پایین'}]} />
                <SelectControl label="تگ HTML" value={settings.content.html_tag} onChange={val => onUpdate(updateContent(settings, 'html_tag', val))} options={[{value: 'div', label: 'div'},{value: 'section', label: 'section'},{value: 'article', label: 'article'}]} />
            </>
        )
    }
    return null;
}

export const HeadingSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <InputControl label="عنوان" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
                <InputControl label="لینک" placeholder="https://example.com" value={settings.content.link?.url} onChange={val => onUpdate(updateLink(settings, 'url', val))} />
                <SelectControl label="اندازه" value={settings.content.size} onChange={val => onUpdate(updateContent(settings, 'size', val))} options={[{value: 'default', label: 'پیش‌فرض'},{value: 'sm', label: 'کوچک'},{value: 'md', label: 'متوسط'},{value: 'lg', label: 'بزرگ'},{value: 'xl', label: 'خیلی بزرگ'}]} />
                <SelectControl label="تگ HTML" value={settings.content.html_tag} onChange={val => onUpdate(updateContent(settings, 'html_tag', val))} options={[{value: 'h1', label: 'H1'},{value: 'h2', label: 'H2'},{value: 'h3', label: 'H3'},{value: 'h4', label: 'H4'},{value: 'h5', label: 'H5'},{value: 'h6', label: 'H6'}]} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <ColorControl label="رنگ متن" value={settings.style.textColor} onChange={val => onUpdate(updateStyle(settings, 'textColor', val))} />
                <TypographyControl label="تایپوگرافی" value={settings.style.typography} onChange={val => onUpdate(updateStyle(settings, 'typography', val))} />
                <TextShadowControl label="سایه متن" value={settings.style.textShadow} onChange={val => onUpdate(updateStyle(settings, 'textShadow', val))} />
                 <SelectControl label="حالت ترکیبی" value={settings.style.blendMode} onChange={val => onUpdate(updateStyle(settings, 'blendMode', val))} options={[{value: 'normal', label: 'عادی'}, {value: 'multiply', label: 'Multiply'}, {value: 'screen', label: 'Screen'}]} />
            </>
        )
    }
    return null;
}

export const ImageSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
     if (activeTab === 'content') {
        return (
            <>
                <FileUploadControl label="انتخاب تصویر" value={settings.content.image?.url} onChange={val => onUpdate(updateContent(settings, 'image', { url: val }))} />
                <SelectControl label="اندازه تصویر" value={settings.content.image_size} onChange={val => onUpdate(updateContent(settings, 'image_size', val))} options={[{value: 'full', label: 'کامل'},{value: 'large', label: 'بزرگ'},{value: 'medium', label: 'متوسط'}, {value: 'thumbnail', label: 'بند انگشتی'}]} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
                <SelectControl label="کپشن" value={settings.content.caption} onChange={val => onUpdate(updateContent(settings, 'caption', val))} options={[{value: 'none', label: 'هیچکدام'}, {value: 'custom', label: 'سفارشی'}]} />
                {settings.content.caption === 'custom' && <TextareaControl label="کپشن سفارشی" value={settings.content.custom_caption} onChange={val => onUpdate(updateContent(settings, 'custom_caption', val))} rows={2} />}
                <SelectControl label="لینک" value={settings.content.link_to} onChange={val => onUpdate(updateContent(settings, 'link_to', val))} options={[{value: 'none', label: 'هیچکدام'}, {value: 'media-file', label: 'فایل رسانه'}, {value: 'custom-url', label: 'URL سفارشی'}]} />
                 {settings.content.link_to === 'custom-url' && <InputControl label="آدرس لینک" value={settings.content.link?.url} onChange={val => onUpdate(updateLink(settings, 'url', val))} />}
                 {settings.content.link_to === 'media-file' && <CheckboxControl label="لایت‌باکس" value={settings.content.lightbox === 'yes'} onChange={val => onUpdate(updateContent(settings, 'lightbox', val ? 'yes' : 'no'))} />}
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <SliderControl label="عرض" value={settings.style.width} onChange={val => onUpdate(updateStyle(settings, 'width', val))} unit="%" />
                 <SliderControl label="مدت زمان انتقال" value={settings.style.transitionDuration} min={0} max={3} step={0.1} unit="s" onChange={val => onUpdate(updateStyle(settings, 'transitionDuration', val))} />
                {/* Add more style controls like border, box-shadow etc. here */}
            </>
        )
    }
    return null;
}

export const TextEditorSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <QuillEditorControl label="محتوا" value={settings.content.text} onChange={val => onUpdate(updateContent(settings, 'text', val))} />
                <CheckboxControl label="حرف اول بزرگ" value={settings.content.drop_cap} onChange={val => onUpdate(updateContent(settings, 'drop_cap', val))} />
                <SliderControl label="تعداد ستون‌ها" min={1} max={10} value={settings.content.columns} onChange={val => onUpdate(updateContent(settings, 'columns', val))} />
                <SliderControl label="فاصله ستون‌ها" min={0} max={50} value={settings.content.column_gap} onChange={val => onUpdate(updateContent(settings, 'column_gap', val))} unit="px" />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <AlignmentControl label="چینش" value={settings.style.alignment} onChange={val => onUpdate(updateStyle(settings, 'alignment', val))} />
                <ColorControl label="رنگ متن" value={settings.style.textColor} onChange={val => onUpdate(updateStyle(settings, 'textColor', val))} />
                 <TypographyControl label="تایپوگرافی" value={settings.style.typography} onChange={val => onUpdate(updateStyle(settings, 'typography', val))} />
                <TextShadowControl label="سایه متن" value={settings.style.textShadow} onChange={val => onUpdate(updateStyle(settings, 'textShadow', val))} />
            </>
        )
    }
    return null;
}

export const VideoSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <SelectControl label="منبع" value={settings.content.source} onChange={val => onUpdate(updateContent(settings, 'source', val))} options={[{value: 'youtube', label: 'یوتیوب'}, {value: 'vimeo', label: 'Vimeo'}, {value: 'self-hosted', label: 'خودی'}]} />
                {settings.content.source !== 'self-hosted' ?
                    <InputControl label="URL" value={settings.content.url} onChange={val => onUpdate(updateContent(settings, 'url', val))} />
                    : <FileUploadControl label="انتخاب ویدئو" value={settings.content.self_hosted_url} onChange={val => onUpdate(updateContent(settings, 'self_hosted_url', val))} accept="video/*" />
                }
                <InputControl label="زمان شروع (ثانیه)" type="number" value={settings.content.start_time} onChange={val => onUpdate(updateContent(settings, 'start_time', val))} />
                <InputControl label="زمان پایان (ثانیه)" type="number" value={settings.content.end_time} onChange={val => onUpdate(updateContent(settings, 'end_time', val))} />
                <FileUploadControl label="تصویر کاور" value={settings.content.cover_image?.url} onChange={val => onUpdate(updateContent(settings, 'cover_image', {url: val}))} />
                <CheckboxControl label="پخش در موبایل" value={settings.content.play_on_mobile} onChange={val => onUpdate(updateContent(settings, 'play_on_mobile', val))} />
                {settings.content.source === 'youtube' && <CheckboxControl label="حالت حریم خصوصی" value={settings.content.privacy_mode} onChange={val => onUpdate(updateContent(settings, 'privacy_mode', val))} description="کوکی‌گذاری غیرفعال می‌شود." />}
                <SelectControl label="نسبت تصویر" value={settings.content.aspect_ratio} onChange={val => onUpdate(updateContent(settings, 'aspect_ratio', val))} options={[{value: '16:9', label: '16:9'}, {value: '4:3', label: '4:3'}, {value: '1:1', label: '1:1'}]} />
                <CheckboxControl label="پخش خودکار" value={settings.content.autoplay} onChange={val => onUpdate(updateContent(settings, 'autoplay', val))} />
                <CheckboxControl label="بی‌صدا" value={settings.content.mute} onChange={val => onUpdate(updateContent(settings, 'mute', val))} />
                <CheckboxControl label="حلقه" value={settings.content.loop} onChange={val => onUpdate(updateContent(settings, 'loop', val))} />
                <CheckboxControl label="کنترل‌های پخش‌کننده" value={settings.content.player_controls} onChange={val => onUpdate(updateContent(settings, 'player_controls', val))} />
                <CheckboxControl label="بارگذاری تنبل" value={settings.content.lazy_load} onChange={val => onUpdate(updateContent(settings, 'lazy_load', val))} />
            </>
        )
    }
    return null;
}

export const ButtonSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    const [buttonTab, setButtonTab] = useState('normal');

    if (activeTab === 'content') {
        return (
            <>
                <InputControl label="متن" value={settings.content.text} onChange={val => onUpdate(updateContent(settings, 'text', val))} />
                <InputControl label="لینک" value={settings.content.link?.url} onChange={val => onUpdate(updateLink(settings, 'url', val))} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
                <SelectControl label="اندازه" value={settings.content.size} onChange={val => onUpdate(updateContent(settings, 'size', val))} options={[{value: 'xs', label: 'خیلی کوچک'}, {value: 'sm', label: 'کوچک'}, {value: 'md', label: 'متوسط'}, {value: 'lg', label: 'بزرگ'}, {value: 'xl', label: 'خیلی بزرگ'}]} />
                <FileUploadControl label="آیکون" value={settings.content.icon?.url} onChange={val => onUpdate(updateContent(settings, 'icon', { url: val }))} accept=".svg,image/*" />
                <SelectControl label="موقعیت آیکون" value={settings.content.icon_position} onChange={val => onUpdate(updateContent(settings, 'icon_position', val))} options={[{value: 'before', label: 'قبل از متن'}, {value: 'after', label: 'بعد از متن'}]} />
                <SliderControl label="فاصله آیکون" value={settings.content.icon_spacing} onChange={val => onUpdate(updateContent(settings, 'icon_spacing', val))} unit="px" />
                <InputControl label="ID دکمه" value={settings.content.button_id} onChange={val => onUpdate(updateContent(settings, 'button_id', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <TypographyControl label="تایپوگرافی" value={settings.style.typography} onChange={val => onUpdate(updateStyle(settings, 'typography', val))} />
                <TextShadowControl label="سایه متن" value={settings.style.textShadow} onChange={val => onUpdate(updateStyle(settings, 'textShadow', val))} />
                
                <TabsControl tabs={['عادی', 'هاور']} activeTab={buttonTab} onTabChange={setButtonTab} />
                <ColorControl label="رنگ متن" value={settings.style[buttonTab].textColor} onChange={val => onUpdate(updateStyle(settings, buttonTab, {...settings.style[buttonTab], textColor: val}))} />
                <ColorControl label="رنگ پس‌زمینه" value={settings.style[buttonTab].backgroundColor} onChange={val => onUpdate(updateStyle(settings, buttonTab, {...settings.style[buttonTab], backgroundColor: val}))} />
                
                <DimensionControl label="پدینگ" value={settings.style.padding} onChange={val => onUpdate(updateStyle(settings, 'padding', val))} />
                <DimensionControl label="انحنای حاشیه" value={settings.style.borderRadius} onChange={val => onUpdate(updateStyle(settings, 'borderRadius', val))} />
            </>
        )
    }
    return null;
}

export const StarRatingSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
              <SliderControl label="امتیاز" min={0} max={5} step={0.1} value={settings.content.rating} onChange={val => onUpdate(updateContent(settings, 'rating', val))} />
              <SelectControl label="آیکون" value={settings.content.icon} onChange={val => onUpdate(updateContent(settings, 'icon', val))} options={[{value: 'star', label: 'ستاره'}, {value: 'heart', label: 'قلب'}]} />
              <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <SliderControl label="اندازه" min={10} max={100} value={settings.style.stars.size} onChange={val => onUpdate(updateStyle(settings, 'stars', {...settings.style.stars, size: val}))} unit="px" />
                <SliderControl label="فاصله" min={0} max={20} value={settings.style.stars.spacing} onChange={val => onUpdate(updateStyle(settings, 'stars', {...settings.style.stars, spacing: val}))} unit="px" />
                <ColorControl label="رنگ" value={settings.style.stars.color} onChange={val => onUpdate(updateStyle(settings, 'stars', {...settings.style.stars, color: val}))} />
                <ColorControl label="رنگ ستاره خالی" value={settings.style.stars.unmarkedColor} onChange={val => onUpdate(updateStyle(settings, 'stars', {...settings.style.stars, unmarkedColor: val}))} />
            </>
        )
    }
    return null;
}

export const DividerSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <SelectControl label="استایل" value={settings.content.style} onChange={val => onUpdate(updateContent(settings, 'style', val))} options={[{value: 'solid', label: 'یکپارچه'},{value: 'double', label: 'دوبل'},{value: 'dotted', label: 'نقطه‌چین'},{value: 'dashed', label: 'خط‌چین'}]} />
                <SliderControl label="عرض" value={settings.content.width} onChange={val => onUpdate(updateContent(settings, 'width', val))} unit="%" />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <SliderControl label="ضخامت" min={1} max={20} value={settings.style.weight} onChange={val => onUpdate(updateStyle(settings, 'weight', val))} unit="px" />
                <SliderControl label="فاصله" min={0} max={100} value={settings.style.gap} onChange={val => onUpdate(updateStyle(settings, 'gap', val))} unit="px" />
                <ColorControl label="رنگ" value={settings.style.color} onChange={val => onUpdate(updateStyle(settings, 'color', val))} />
            </>
        )
    }
    return null;
}

export const GoogleMapsSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <InputControl label="آدرس" value={settings.content.address} onChange={val => onUpdate(updateContent(settings, 'address', val))} />
                <SliderControl label="بزرگنمایی" min={1} max={20} value={settings.content.zoom} onChange={val => onUpdate(updateContent(settings, 'zoom', val))} />
                <SliderControl label="ارتفاع" min={100} max={1000} value={settings.content.height} onChange={val => onUpdate(updateContent(settings, 'height', val))} unit="px" />
                <CheckboxControl label="جلوگیری از اسکرول" value={settings.content.prevent_scroll} onChange={val => onUpdate(updateContent(settings, 'prevent_scroll', val))} />
                <SelectControl label="نوع نقشه" value={settings.content.view_type} onChange={val => onUpdate(updateContent(settings, 'view_type', val))} options={[{value: 'roadmap', label: 'Roadmap'}, {value: 'satellite', label: 'Satellite'}]} />
            </>
        )
    }
    return null;
}

export const IconSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <FileUploadControl label="آیکون" value={settings.content.icon?.url} onChange={val => onUpdate(updateContent(settings, 'icon', { ...settings.content.icon, url: val }))} accept=".svg,image/*" />
                <InputControl label="لینک" value={settings.content.link?.url} onChange={val => onUpdate(updateLink(settings, 'url', val))} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <SelectControl label="نما" value={settings.style.view} onChange={val => onUpdate(updateStyle(settings, 'view', val))} options={[{value: 'default', label: 'پیش‌فرض'}, {value: 'stacked', label: 'پشته‌ای'}, {value: 'framed', label: 'قاب‌دار'}]} />
                <SelectControl label="شکل" value={settings.style.shape} onChange={val => onUpdate(updateStyle(settings, 'shape', val))} options={[{value: 'circle', label: 'دایره'}, {value: 'square', label: 'مربع'}]} />
                <ColorControl label="رنگ اصلی" value={settings.style.normal.primaryColor} onChange={val => onUpdate(updateStyle(settings, 'normal', {...settings.style.normal, primaryColor: val}))} />
                <SliderControl label="اندازه" min={10} max={100} value={settings.style.size} onChange={val => onUpdate(updateStyle(settings, 'size', val))} unit="px" />
                <SliderControl label="فاصله داخلی" min={0} max={50} value={settings.style.padding} onChange={val => onUpdate(updateStyle(settings, 'padding', val))} unit="px" />
                <SliderControl label="چرخش" min={0} max={360} value={settings.style.rotate} onChange={val => onUpdate(updateStyle(settings, 'rotate', val))} unit="deg" />
            </>
        )
    }
    return null;
}

export const ImageBoxSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <FileUploadControl label="انتخاب تصویر" value={settings.content.image?.url} onChange={val => onUpdate(updateContent(settings, 'image', { url: val }))} />
                <InputControl label="عنوان" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
                <TextareaControl label="توضیحات" value={settings.content.description} onChange={val => onUpdate(updateContent(settings, 'description', val))} rows={3} />
                <InputControl label="لینک" value={settings.content.link.url} onChange={val => onUpdate(updateContent(settings, 'link', {url: val}))} />
                <SelectControl label="موقعیت تصویر" value={settings.content.position} onChange={val => onUpdate(updateContent(settings, 'position', val))} options={[{value: 'top', label: 'بالا'}, {value: 'left', label: 'چپ'}, {value: 'right', label: 'راست'}]} />
                <SelectControl label="تگ HTML عنوان" value={settings.content.title_html_tag} onChange={val => onUpdate(updateContent(settings, 'title_html_tag', val))} options={[{value: 'h2', label: 'H2'},{value: 'h3', label: 'H3'},{value: 'h4', label: 'H4'}]} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="تصویر">
                    <SliderControl label="فاصله" value={settings.style.spacing} onChange={val => onUpdate(updateStyle(settings, 'spacing', val))} unit="px" />
                    <SliderControl label="عرض" value={settings.style.image.width} onChange={val => onUpdate(updateStyle(settings, 'image', {...settings.style.image, width: val}))} unit="%" />
                    <SliderControl label="انحنای حاشیه" value={settings.style.image.borderRadius} max={100} onChange={val => onUpdate(updateStyle(settings, 'image', {...settings.style.image, borderRadius: val}))} unit="px" />
                </Accordion>
                <Accordion title="محتوا">
                    <AlignmentControl label="چینش" value={settings.style.content.alignment} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, alignment: val}))} />
                    <ColorControl label="رنگ عنوان" value={settings.style.content.title.color} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, color: val}}))} />
                    <TypographyControl label="تایپوگرافی عنوان" value={settings.style.content.title.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, typography: val}}))} />
                    <TextShadowControl label="سایه متن عنوان" value={settings.style.content.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, textShadow: val}}))} />
                    <ColorControl label="رنگ توضیحات" value={settings.style.content.description.color} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, description: {...settings.style.content.description, color: val}}))} />
                    <TypographyControl label="تایپوگرافی توضیحات" value={settings.style.content.description.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, description: {...settings.style.content.description, typography: val}}))} />
                </Accordion>
            </>
        )
    }
    return null;
}
export const IconBoxSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <FileUploadControl label="آیکون" value={settings.content.icon?.url} onChange={val => onUpdate(updateContent(settings, 'icon', { ...settings.content.icon, url: val }))} accept=".svg,image/*" />
                <InputControl label="عنوان" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
                <TextareaControl label="توضیحات" value={settings.content.description} onChange={val => onUpdate(updateContent(settings, 'description', val))} rows={3} />
                <InputControl label="لینک" value={settings.content.link.url} onChange={val => onUpdate(updateContent(settings, 'link', {url: val}))} />
                <SelectControl label="موقعیت آیکون" value={settings.content.position} onChange={val => onUpdate(updateContent(settings, 'position', val))} options={[{value: 'top', label: 'بالا'}, {value: 'left', label: 'چپ'}, {value: 'right', label: 'راست'}]} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="آیکون">
                    <ColorControl label="رنگ اصلی" value={settings.style.icon.normal.primaryColor} onChange={val => onUpdate(updateStyle(settings, 'icon', {...settings.style.icon, normal: {...settings.style.icon.normal, primaryColor: val}}))} />
                    <SliderControl label="اندازه" value={settings.style.icon.size} onChange={val => onUpdate(updateStyle(settings, 'icon', {...settings.style.icon, size: val}))} min={10} max={100} unit="px" />
                    <SliderControl label="فاصله داخلی" value={settings.style.icon.padding} onChange={val => onUpdate(updateStyle(settings, 'icon', {...settings.style.icon, padding: val}))} min={0} max={50} unit="px" />
                    <SliderControl label="فاصله" value={settings.style.icon.spacing} onChange={val => onUpdate(updateStyle(settings, 'icon', {...settings.style.icon, spacing: val}))} min={0} max={50} unit="px" />
                </Accordion>
                <Accordion title="محتوا">
                    <AlignmentControl label="چینش" value={settings.style.content.alignment} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, alignment: val}))} />
                    <SliderControl label="فاصله عنوان" value={settings.style.content.title.spacing} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, spacing: val}}))} min={0} max={50} unit="px" />
                    <ColorControl label="رنگ عنوان" value={settings.style.content.title.color} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, color: val}}))} />
                    <TypographyControl label="تایپوگرافی عنوان" value={settings.style.content.title.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, typography: val}}))} />
                    <TextShadowControl label="سایه متن عنوان" value={settings.style.content.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, title: {...settings.style.content.title, textShadow: val}}))} />
                    <ColorControl label="رنگ توضیحات" value={settings.style.content.description.color} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, description: {...settings.style.content.description, color: val}}))} />
                    <TypographyControl label="تایپوگرافی توضیحات" value={settings.style.content.description.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, description: {...settings.style.content.description, typography: val}}))} />
                </Accordion>
            </>
        )
    }
    return null;
}
export const BasicGallerySettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <RepeaterControl
                    label="تصاویر گالری"
                    items={settings.content.images}
                    onUpdate={items => onUpdate(updateContent(settings, 'images', items))}
                    defaultItem={{ url: '' }}
                    renderItem={(item, onUpdateItem) => (
                        <FileUploadControl label="تصویر" value={item.url} onChange={val => onUpdateItem({ ...item, url: val })} />
                    )}
                />
                <SliderControl label="ستون‌ها" min={1} max={12} value={settings.content.columns} onChange={val => onUpdate(updateContent(settings, 'columns', val))} />
                <SelectControl label="لینک" value={settings.content.link_to} onChange={val => onUpdate(updateContent(settings, 'link_to', val))} options={[{value: 'none', label: 'هیچکدام'}, {value: 'media-file', label: 'فایل رسانه'}]} />
                <CheckboxControl label="بارگذاری تنبل" value={settings.content.lazy_load} onChange={val => onUpdate(updateContent(settings, 'lazy_load', val))} />
            </>
        )
    }
    return null;
}
export const ImageCarouselSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <RepeaterControl
                    label="تصاویر کروسل"
                    items={settings.content.images}
                    onUpdate={items => onUpdate(updateContent(settings, 'images', items))}
                    defaultItem={{ url: '' }}
                    renderItem={(item, onUpdateItem) => (
                        <FileUploadControl label="تصویر" value={item.url} onChange={val => onUpdateItem({ ...item, url: val })} />
                    )}
                />
                <SliderControl label="اسلاید برای نمایش" min={1} max={10} value={settings.content.slides_to_show} onChange={val => onUpdate(updateContent(settings, 'slides_to_show', val))} />
                <SelectControl label="ناوبری" value={settings.content.navigation} onChange={val => onUpdate(updateContent(settings, 'navigation', val))} options={[{value: 'none', label: 'هیچکدام'}, {value: 'arrows', label: 'فلش‌ها'}, {value: 'dots', label: 'نقطه‌ها'}, {value: 'both', label: 'هر دو'}]} />
                <CheckboxControl label="پخش خودکار" value={settings.content.autoplay} onChange={val => onUpdate(updateContent(settings, 'autoplay', val))} />
            </>
        )
    }
    return null;
}
export const IconListSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <RepeaterControl
                    label="آیتم‌ها"
                    items={settings.content.items}
                    onUpdate={items => onUpdate(updateContent(settings, 'items', items))}
                    defaultItem={{ text: 'آیتم جدید', icon: { url: '' }, link: { url: '' } }}
                    renderItem={(item, onUpdateItem) => (
                        <>
                            <InputControl label="متن" value={item.text} onChange={val => onUpdateItem({ ...item, text: val })} />
                            <FileUploadControl label="آیکون" value={item.icon.url} onChange={val => onUpdateItem({ ...item, icon: {url: val}})} accept=".svg,image/*"/>
                            <InputControl label="لینک" value={item.link.url} onChange={val => onUpdateItem({ ...item, link: { ...item.link, url: val } })} />
                        </>
                    )}
                />
                 <CheckboxControl label="جداکننده" value={settings.content.divider} onChange={val => onUpdate(updateContent(settings, 'divider', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
             <>
                <Accordion title="لیست">
                    <SliderControl label="فاصله بین آیتم‌ها" value={settings.style.list.spaceBetween} onChange={val => onUpdate(updateStyle(settings, 'list', {...settings.style.list, spaceBetween: val}))} unit="px" />
                </Accordion>
                <Accordion title="آیکون">
                    <ColorControl label="رنگ" value={settings.style.icon.color} onChange={val => onUpdate(updateStyle(settings, 'icon', {...settings.style.icon, color: val}))} />
                    <SliderControl label="اندازه" value={settings.style.icon.size} onChange={val => onUpdate(updateStyle(settings, 'icon', {...settings.style.icon, size: val}))} unit="px" />
                </Accordion>
                <Accordion title="متن">
                    <ColorControl label="رنگ" value={settings.style.text.color} onChange={val => onUpdate(updateStyle(settings, 'text', {...settings.style.text, color: val}))} />
                    <SliderControl label="تورفتگی" value={settings.style.text.indent} onChange={val => onUpdate(updateStyle(settings, 'text', {...settings.style.text, indent: val}))} unit="px" />
                    <TypographyControl label="تایپوگرافی" value={settings.style.text.typography} onChange={val => onUpdate(updateStyle(settings, 'text', {...settings.style.text, typography: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}
export const CounterSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <InputControl label="عدد شروع" type="number" value={settings.content.start_number} onChange={val => onUpdate(updateContent(settings, 'start_number', val))} />
                <InputControl label="عدد پایان" type="number" value={settings.content.end_number} onChange={val => onUpdate(updateContent(settings, 'end_number', val))} />
                <InputControl label="پیشوند عدد" value={settings.content.prefix} onChange={val => onUpdate(updateContent(settings, 'prefix', val))} />
                <InputControl label="پسوند عدد" value={settings.content.suffix} onChange={val => onUpdate(updateContent(settings, 'suffix', val))} />
                <InputControl label="مدت زمان انیمیشن (ms)" type="number" value={settings.content.duration} onChange={val => onUpdate(updateContent(settings, 'duration', val))} />
                <CheckboxControl label="جداکننده هزارگان" value={settings.content.thousand_separator} onChange={val => onUpdate(updateContent(settings, 'thousand_separator', val))} />
                <InputControl label="عنوان" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
            </>
        )
    }
     if (activeTab === 'style') {
        return (
            <>
                <Accordion title="عدد">
                    <ColorControl label="رنگ" value={settings.style.number.color} onChange={val => onUpdate(updateStyle(settings, 'number', {...settings.style.number, color: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.number.typography} onChange={val => onUpdate(updateStyle(settings, 'number', {...settings.style.number, typography: val}))} />
                </Accordion>
                <Accordion title="عنوان">
                    <ColorControl label="رنگ" value={settings.style.title.color} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, color: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                    <SliderControl label="فاصله" value={settings.style.title.spacing} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, spacing: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}

export const SpacerSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return <SliderControl label="فاصله" min={0} max={300} unit="px" value={settings.content.space} onChange={val => onUpdate(updateContent(settings, 'space', val))} />
    }
    return null;
}

export const TestimonialSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <TextareaControl label="محتوا" value={settings.content.content} onChange={val => onUpdate(updateContent(settings, 'content', val))} rows={5} />
                <FileUploadControl label="تصویر" value={settings.content.image?.url} onChange={val => onUpdate(updateContent(settings, 'image', { url: val }))} />
                <InputControl label="نام" value={settings.content.name} onChange={val => onUpdate(updateContent(settings, 'name', val))} />
                <InputControl label="عنوان شغلی" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="محتوا">
                    <ColorControl label="رنگ متن" value={settings.style.content.textColor} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, textColor: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.content.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, typography: val}))} />
                </Accordion>
                <Accordion title="نام">
                    <ColorControl label="رنگ متن" value={settings.style.name.textColor} onChange={val => onUpdate(updateStyle(settings, 'name', {...settings.style.name, textColor: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.name.typography} onChange={val => onUpdate(updateStyle(settings, 'name', {...settings.style.name, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.name.textShadow} onChange={val => onUpdate(updateStyle(settings, 'name', {...settings.style.name, textShadow: val}))} />
                </Accordion>
                <Accordion title="عنوان شغلی">
                    <ColorControl label="رنگ متن" value={settings.style.title.textColor} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textColor: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}

const RepeaterWithTitleAndContent: React.FC<any> = ({settings, onUpdate, label}) => (
    <RepeaterControl
        label={label}
        items={settings.content.items}
        onUpdate={items => onUpdate(updateContent(settings, 'items', items))}
        defaultItem={{ title: 'عنوان جدید', content: 'محتوای جدید' }}
        renderItem={(item, onUpdateItem) => (
            <>
                <InputControl label="عنوان" value={item.title} onChange={val => onUpdateItem({ ...item, title: val })} />
                <TextareaControl label="محتوا" value={item.content} onChange={val => onUpdateItem({ ...item, content: val })} rows={3} />
            </>
        )}
    />
);

export const TabsSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <RepeaterWithTitleAndContent settings={settings} onUpdate={onUpdate} label="آیتم‌های تب" />
                <SelectControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} options={[{value: 'horizontal', label: 'افقی'}, {value: 'vertical', label: 'عمودی'}]} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="عنوان تب‌ها">
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                </Accordion>
                <Accordion title="محتوا">
                    <ColorControl label="رنگ متن" value={settings.style.content.textColor} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, textColor: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.content.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, typography: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}
export const AccordionSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <RepeaterWithTitleAndContent settings={settings} onUpdate={onUpdate} label="آیتم‌های آکاردئون" />
                <FileUploadControl label="آیکون عادی" value={settings.content.icon?.normal} onChange={val => onUpdate(updateContent(settings, 'icon', {...settings.content.icon, normal: val}))} />
                <FileUploadControl label="آیکون فعال" value={settings.content.icon?.active} onChange={val => onUpdate(updateContent(settings, 'icon', {...settings.content.icon, active: val}))} />
                <SelectControl label="تگ HTML" value={settings.content.html_tag} onChange={val => onUpdate(updateContent(settings, 'html_tag', val))} options={[{value: 'div', label: 'div'},{value: 'h2', label: 'H2'},{value: 'h3', label: 'H3'}]} />
            </>
        );
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="عنوان">
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                </Accordion>
                <Accordion title="محتوا">
                     <ColorControl label="رنگ متن" value={settings.style.content.textColor} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, textColor: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.content.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, typography: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}

export const ToggleSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <RepeaterWithTitleAndContent settings={settings} onUpdate={onUpdate} label="آیتم‌های تاگل" />
                <FileUploadControl label="آیکون عادی" value={settings.content.icon?.normal} onChange={val => onUpdate(updateContent(settings, 'icon', {...settings.content.icon, normal: val}))} />
                <FileUploadControl label="آیکون فعال" value={settings.content.icon?.active} onChange={val => onUpdate(updateContent(settings, 'icon', {...settings.content.icon, active: val}))} />
                <SelectControl label="تگ HTML" value={settings.content.html_tag} onChange={val => onUpdate(updateContent(settings, 'html_tag', val))} options={[{value: 'div', label: 'div'},{value: 'h2', label: 'H2'},{value: 'h3', label: 'H3'}]} />
                <SelectControl label="حالت در زمان بارگذاری" value={settings.content.state_on_load} onChange={val => onUpdate(updateContent(settings, 'state_on_load', val))} options={[{value: 'first-expanded', label: 'اولی باز'}, {value: 'all-collapsed', label: 'همه بسته'}]} />
            </>
        );
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="عنوان">
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                </Accordion>
                <Accordion title="محتوا">
                     <ColorControl label="رنگ متن" value={settings.style.content.textColor} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, textColor: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.content.typography} onChange={val => onUpdate(updateStyle(settings, 'content', {...settings.style.content, typography: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}

export const SocialIconsSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <RepeaterControl
                    label="آیتم‌ها"
                    items={settings.content.items}
                    onUpdate={items => onUpdate(updateContent(settings, 'items', items))}
                    defaultItem={{ network: 'facebook', link: { url: '#' } }}
                    renderItem={(item, onUpdateItem) => (
                        <>
                            <SelectControl label="شبکه" value={item.network} onChange={val => onUpdateItem({ ...item, network: val })} options={[{value: 'facebook', label: 'Facebook'}, {value: 'twitter', label: 'Twitter'}, {value: 'youtube', label: 'YouTube'}]} />
                            <InputControl label="لینک" value={item.link.url} onChange={val => onUpdateItem({ ...item, link: { ...item.link, url: val } })} />
                        </>
                    )}
                />
                <SelectControl label="شکل" value={settings.content.shape} onChange={val => onUpdate(updateContent(settings, 'shape', val))} options={[{value: 'rounded', label: 'گرد'}, {value: 'square', label: 'مربع'}, {value: 'circle', label: 'دایره'}]} />
                <AlignmentControl label="چینش" value={settings.content.alignment} onChange={val => onUpdate(updateContent(settings, 'alignment', val))} />
            </>
        )
    }
     if (activeTab === 'style') {
        return <SelectControl label="رنگ آیکون" value={settings.content.icon_color} onChange={val => onUpdate(updateContent(settings, 'icon_color', val))} options={[{value: 'official', label: 'رسمی'}, {value: 'custom', label: 'سفارشی'}]} />
     }
    return null;
}

export const ProgressBarSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <InputControl label="عنوان" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
                <SliderControl label="پیشرفت" value={settings.content.progress} onChange={val => onUpdate(updateContent(settings, 'progress', val))} />
                <CheckboxControl label="نمایش درصد" value={settings.content.display_percentage} onChange={val => onUpdate(updateContent(settings, 'display_percentage', val))} />
                <InputControl label="متن داخلی" value={settings.content.inner_text} onChange={val => onUpdate(updateContent(settings, 'inner_text', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="نوار پیشرفت">
                    <ColorControl label="رنگ" value={settings.style.progressBar.color} onChange={val => onUpdate(updateStyle(settings, 'progressBar', {...settings.style.progressBar, color: val}))} />
                    <ColorControl label="رنگ پس‌زمینه" value={settings.style.progressBar.backgroundColor} onChange={val => onUpdate(updateStyle(settings, 'progressBar', {...settings.style.progressBar, backgroundColor: val}))} />
                    <SliderControl label="ارتفاع" value={settings.style.progressBar.height} max={50} onChange={val => onUpdate(updateStyle(settings, 'progressBar', {...settings.style.progressBar, height: val}))} unit="px"/>
                </Accordion>
                <Accordion title="عنوان">
                     <ColorControl label="رنگ متن" value={settings.style.title.color} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, color: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}

export const AlertSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <SelectControl label="نوع" value={settings.content.type} onChange={val => onUpdate(updateContent(settings, 'type', val))} options={[{value: 'info', label: 'اطلاع'}, {value: 'success', label: 'موفقیت'}, {value: 'warning', label: 'هشدار'}, {value: 'danger', label: 'خطر'}]} />
                <InputControl label="عنوان" value={settings.content.title} onChange={val => onUpdate(updateContent(settings, 'title', val))} />
                <TextareaControl label="توضیحات" value={settings.content.description} onChange={val => onUpdate(updateContent(settings, 'description', val))} rows={3} />
                <CheckboxControl label="دکمه بستن" value={settings.content.dismiss_button} onChange={val => onUpdate(updateContent(settings, 'dismiss_button', val))} />
            </>
        )
    }
    if (activeTab === 'style') {
        return (
            <>
                <Accordion title="عنوان">
                     <ColorControl label="رنگ متن" value={settings.style.title.color} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, color: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.title.typography} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, typography: val}))} />
                    <TextShadowControl label="سایه متن" value={settings.style.title.textShadow} onChange={val => onUpdate(updateStyle(settings, 'title', {...settings.style.title, textShadow: val}))} />
                </Accordion>
                 <Accordion title="توضیحات">
                     <ColorControl label="رنگ متن" value={settings.style.description.color} onChange={val => onUpdate(updateStyle(settings, 'description', {...settings.style.description, color: val}))} />
                    <TypographyControl label="تایپوگرافی" value={settings.style.description.typography} onChange={val => onUpdate(updateStyle(settings, 'description', {...settings.style.description, typography: val}))} />
                </Accordion>
            </>
        )
    }
    return null;
}

export const SoundCloudSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <InputControl label="کد Embed" value={settings.content.embed_code} onChange={val => onUpdate(updateContent(settings, 'embed_code', val))} />
                <CheckboxControl label="پلیر تصویری" value={settings.content.visual_player} onChange={val => onUpdate(updateContent(settings, 'visual_player', val))} />
                <CheckboxControl label="پخش خودکار" value={settings.content.autoplay} onChange={val => onUpdate(updateContent(settings, 'autoplay', val))} />
                 <CheckboxControl label="دکمه خرید" value={settings.content.buy_button} onChange={val => onUpdate(updateContent(settings, 'buy_button', val))} />
                 <CheckboxControl label="تصویر" value={settings.content.artwork} onChange={val => onUpdate(updateContent(settings, 'artwork', val))} />
            </>
        )
    }
    return null;
}

export const HtmlSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <TextareaControl label="کد HTML" value={settings.content.code} onChange={val => onUpdate(updateContent(settings, 'code', val))} rows={10} />
                <div className="mt-4 p-3 border-t">
                    <CheckboxControl 
                        label="محتوای تمام عرض" 
                        description="این گزینه باعث می‌شود ویجت از کانتینر خود خارج شده و تمام عرض صفحه را اشغال کند."
                        value={settings.content.fullWidthPage} 
                        onChange={val => onUpdate(updateContent(settings, 'fullWidthPage', val))} 
                    />
                </div>
            </>
        );
    }
    return null;
}

export const TextPathSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
             <>
                <InputControl label="متن" value={settings.content.text} onChange={val => onUpdate(updateContent(settings, 'text', val))} />
                <SelectControl label="نوع مسیر" value={settings.content.path_type} onChange={val => onUpdate(updateContent(settings, 'path_type', val))} options={[{value: 'circle', label: 'دایره'}, {value: 'svg', label: 'SVG سفارشی'}]} />
                {settings.content.path_type === 'svg' && <FileUploadControl label="آپلود SVG" value={settings.content.svg_path} onChange={val => onUpdate(updateContent(settings, 'svg_path', val))} accept=".svg"/> }
                <SliderControl label="اندازه" value={settings.content.size} onChange={val => onUpdate(updateContent(settings, 'size', val))} unit="px" />
                <SelectControl label="جهت" value={settings.content.orientation} onChange={val => onUpdate(updateContent(settings, 'orientation', val))} options={[{value: 'clockwise', label: 'ساعتگرد'}, {value: 'counter-clockwise', label: 'پادساعتگرد'}]} />

            </>
        )
    }
    return null;
}
export const ContainerSettings: React.FC<SettingsComponentProps> = ({ settings, onUpdate, activeTab }) => {
    if (activeTab === 'content') {
        return (
            <>
                <SelectControl label="نوع کانتینر" value={settings.content.container_type} onChange={val => onUpdate(updateContent(settings, 'container_type', val))} options={[{value: 'flexbox', label: 'Flexbox'}, {value: 'grid', label: 'Grid'}]} />
                <SelectControl label="جهت" value={settings.content.flex_direction} onChange={val => onUpdate(updateContent(settings, 'flex_direction', val))} options={[{value: 'row', label: 'ردیفی'}, {value: 'column', label: 'ستونی'}]} />
                <SelectControl label="تراز محتوا" value={settings.content.justify_content} onChange={val => onUpdate(updateContent(settings, 'justify_content', val))} options={[{value: 'start', label: 'شروع'}, {value: 'center', label: 'وسط'}, {value: 'end', label: 'پایان'}]} />
                <SelectControl label="تراز آیتم‌ها" value={settings.content.align_items} onChange={val => onUpdate(updateContent(settings, 'align_items', val))} options={[{value: 'stretch', label: 'کشیده'}, {value: 'start', label: 'شروع'}, {value: 'center', label: 'وسط'}, {value: 'end', label: 'پایان'}]} />
                <SelectControl label="عرض" value={settings.content.width} onChange={val => onUpdate(updateContent(settings, 'width', val))} options={[{value: 'boxed', label: 'جعبه‌ای'}, {value: 'full-width', label: 'عرض کامل'}]} />
                <SliderControl label="حداقل ارتفاع" value={settings.content.min_height} onChange={val => onUpdate(updateContent(settings, 'min_height', val))} min={100} max={1000} unit="px" />
                <SelectControl label="تگ HTML" value={settings.content.html_tag} onChange={val => onUpdate(updateContent(settings, 'html_tag', val))} options={[{value: 'div', label: 'div'},{value: 'section', label: 'section'}]} />
            </>
        );
    }
    return null;
}
