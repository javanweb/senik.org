import React, { useState } from 'react';
import { WidgetType } from '../types';
import { Accordion, TabsControl, DimensionControl, SelectControl, InputControl, SliderControl, CheckboxControl, TextareaControl, ColorControl, BoxShadowControl } from './SettingsControls';
import { defaultAdvancedSettings } from '../utils/defaults';

interface AdvancedSettingsProps {
  settings: { [key: string]: any };
  onUpdate: (newSettings: any) => void;
  widgetType: WidgetType;
}

const ADVANCED_TIPS: { [key in WidgetType]?: string } = {
  'inner-section': 'برای Equal Height Column، Display=Flex → Align Items=Stretch بزنید؛ سپس در ستون‌ها Height=100٪ تا ارتفاع یکسان شود.',
  'heading': 'برای Typewriter Effect، در Custom CSS::after بنویسید `content: " "; animation: blink 1s infinite;` و keyframes blink تعریف کنید.',
  'image': 'برای Parallax On Scroll، Motion Effects → Vertical Scroll → Speed=0.3 و Direction=Opposite بدهید.',
  'text-editor': 'اگر می‌خواهید ستون‌های روزنامه‌ای در موبایل به خط بیفتند، در Responsive → Columns=1 و Column Gap=۰ بگذارید.',
  'video': 'برای Lazy-Load، در «Custom Attributes» بنویسید: loading=lazy و data-src=URL سپس با JS کوچک swap کنید.',
  'button': 'برای Pulse Effect، در Hover → Transform → Scale=1.1 + Transition Duration=300ms و در Border → Box-Shadow با Infinite Animation.',
  'star-rating': 'برای Half-Star SVG، در Custom CSS svg path:last-child را clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%); بدهید.',
  'divider': 'برای Animated Gradient Line، از Background → Gradient دو رنگ + Background Size=400% 100% و انیمیشن CSS استفاده کنید.',
  'google-maps': 'برای Custom Style، در Attributes بنویسید: data-style="YOUR_JSON_HERE" و با JS به iframe inject کنید.',
  'icon': 'برای 360° Rotate On Hover، Transform → Rotate Z=360 + Transition Duration=600ms.',
  'image-box': 'برای Overlay Gradient on Image، Background → Hover → Gradient از بالا به پایین مشکی شفاف بدهید تا عنوان خوانا شود.',
  'icon-box': 'برای Hover Lift، Transform → Translate Y=-10px + Box-Shadow بزرگ‌تر در Hover.',
  'basic-gallery': 'برای Masonry، از Custom CSS با display:flex و flex-wrap:wrap استفاده کنید.',
  'image-carousel': 'برای Center Mode + Partial Slide، از Custom CSS با Slides to Show=1.5 و Center Padding=20% استفاده کنید.',
  'icon-list': 'برای Replace Bullet با SVG، در Custom CSS سلکتور آیکون را هدف قرار دهید و آیکون سفارشی بارگذاری کنید.',
  'counter': 'برای Add "+" after number، در Custom CSS از псевдоэлемент ::after با content:"+"; استفاده کنید.',
  'spacer': 'برای Dynamic VH، Height=10vh و در Tablet=5vh تا فضای نسبی حفظ شود.',
  'testimonial': 'برای Add Quote SVG، در Custom CSS از псевдоэлемент ::before با background-image استفاده کنید.',
  'tabs': 'برای Vertical Tabs in Desktop → Accordion in Mobile، دو ویجت جداگانه با نمایش ریسپانسیو بسازید.',
  'accordion': 'برای Auto-Close Others، در Attributes بنویسید data-auto-close=yes و با JS کنترل کنید.',
  'toggle': 'برای Icon Change (+ → −)، در Custom CSS نمایش آیکون‌های باز و بسته را کنترل کنید.',
  'social-icons': 'برای Custom Brand Color، در Custom CSS سلکتور هر آیکون را هدف گرفته و background دلخواه بدهید.',
  'progress-bar': 'برای Gradient Striped، از repeating-linear-gradient در Custom CSS استفاده کنید.',
  'alert': 'برای Auto-Close After 5s، در Attributes بنویسید data-auto-close=5000 و با JS کنترل کنید.',
  // FIX: Removed 'sidebar' as it's not a valid WidgetType.
  'container': 'برای Nested Container Query، در Attributes بنویسید data-container-name=card و از @container در CSS استفاده کنید.',
};


const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ settings, onUpdate, widgetType }) => {
  const [transformTab, setTransformTab] = useState('normal');
  const [backgroundTab, setBackgroundTab] = useState('normal');
  const [borderTab, setBorderTab] = useState('normal');
  
  const tip = ADVANCED_TIPS[widgetType];

  const updateAdvanced = (path: string, value: any) => {
    const keys = path.split('.');
    const newAdvanced = JSON.parse(JSON.stringify(settings.advanced || {}));
    let current = newAdvanced;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === undefined || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    onUpdate({ ...settings, advanced: newAdvanced });
  };

  const s = settings.advanced || {};
  const d = defaultAdvancedSettings;

  return (
    <div className="text-sm">
        {tip && (
            <div className="p-3 m-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
                <p className="font-bold text-xs mb-1">💡 نکته پیشرفته:</p>
                <p className="text-xs">{tip}</p>
            </div>
        )}

      <Accordion title="Layout">
        <DimensionControl label="حاشیه خارجی (Margin)" value={s.layout?.margin ?? d.layout.margin} onChange={val => updateAdvanced('layout.margin', val)} />
        <DimensionControl label="حاشیه داخلی (Padding)" value={s.layout?.padding ?? d.layout.padding} onChange={val => updateAdvanced('layout.padding', val)} />
        <SelectControl label="عرض" value={s.layout?.width ?? d.layout.width} onChange={val => updateAdvanced('layout.width', val)} options={[{value: 'auto', label: 'خودکار'}, {value: 'full-width', label: 'عرض کامل (100%)'}, {value: 'inline', label: 'درون خطی'}]} />
        <SelectControl label="موقعیت" value={s.layout?.position ?? d.layout.position} onChange={val => updateAdvanced('layout.position', val)} options={[{value: 'default', label: 'پیش‌فرض'}, {value: 'absolute', label: 'مطلق'}, {value: 'fixed', label: 'ثابت'}]} />
        <InputControl label="Z-Index" type="number" value={s.layout?.zIndex ?? d.layout.zIndex} onChange={val => updateAdvanced('layout.zIndex', val)} />
      </Accordion>

      <Accordion title="Motion Effects">
        <SelectControl label="انیمیشن ورودی" value={s.motionEffects?.entranceAnimation?.animation ?? d.motionEffects.entranceAnimation.animation} onChange={val => updateAdvanced('motionEffects.entranceAnimation.animation', val)} options={[{value: 'none', label: 'هیچکدام'},{value: 'fadeIn', label: 'Fade In'}, {value: 'zoomIn', label: 'Zoom In'}, {value: 'slideInUp', label: 'Slide In Up'}]} />
      </Accordion>
      
      <Accordion title="Transform">
        <TabsControl tabs={['عادی', 'هاور']} activeTab={transformTab} onTabChange={setTransformTab} />
        <SliderControl label="چرخش" value={s.transform?.[transformTab]?.rotate ?? 0} onChange={val => updateAdvanced(`transform.${transformTab}.rotate`, val)} min={-180} max={180} unit="deg" />
        <SliderControl label="مقیاس" value={s.transform?.[transformTab]?.scale ?? 1} onChange={val => updateAdvanced(`transform.${transformTab}.scale`, val)} min={0} max={2} step={0.1} />
        <SliderControl label="آفست افقی" value={s.transform?.[transformTab]?.offsetX ?? 0} onChange={val => updateAdvanced(`transform.${transformTab}.offsetX`, val)} min={-100} max={100} unit="px" />
        <SliderControl label="آفست عمودی" value={s.transform?.[transformTab]?.offsetY ?? 0} onChange={val => updateAdvanced(`transform.${transformTab}.offsetY`, val)} min={-100} max={100} unit="px" />
      </Accordion>

       <Accordion title="Background">
        <TabsControl tabs={['عادی', 'هاور']} activeTab={backgroundTab} onTabChange={setBackgroundTab} />
        <ColorControl label="رنگ پس‌زمینه" value={s.background?.[backgroundTab]?.color ?? ''} onChange={val => updateAdvanced(`background.${backgroundTab}.color`, val)} />
      </Accordion>

      <Accordion title="Border">
        <TabsControl tabs={['عادی', 'هاور']} activeTab={borderTab} onTabChange={setBorderTab} />
        <SelectControl label="نوع حاشیه" value={s.border?.[borderTab]?.type ?? 'none'} onChange={val => updateAdvanced(`border.${borderTab}.type`, val)} options={[{value: 'none', label: 'هیچکدام'},{value: 'solid', label: 'یکپارچه'},{value: 'double', label: 'دوبل'},{value: 'dotted', label: 'نقطه‌چین'},{value: 'dashed', label: 'خط‌چین'}]} />
        <ColorControl label="رنگ حاشیه" value={s.border?.[borderTab]?.color ?? ''} onChange={val => updateAdvanced(`border.${borderTab}.color`, val)} />
        { borderTab === 'normal' && <DimensionControl label="ضخامت حاشیه" value={s.border?.normal?.width ?? d.border.normal.width} onChange={val => updateAdvanced('border.normal.width', val)} /> }
        { borderTab === 'normal' && <DimensionControl label="انحنای حاشیه" value={s.border?.radius ?? d.border.radius} onChange={val => updateAdvanced('border.radius', val)} /> }
      </Accordion>
      
      <Accordion title="Responsive">
        <CheckboxControl label="مخفی در دسکتاپ" value={s.responsive?.hideDesktop ?? d.responsive.hideDesktop} onChange={val => updateAdvanced('responsive.hideDesktop', val)} />
        <CheckboxControl label="مخفی در تبلت" value={s.responsive?.hideTablet ?? d.responsive.hideTablet} onChange={val => updateAdvanced('responsive.hideTablet', val)} />
        <CheckboxControl label="مخفی در موبایل" value={s.responsive?.hideMobile ?? d.responsive.hideMobile} onChange={val => updateAdvanced('responsive.hideMobile', val)} />
      </Accordion>
      
      <Accordion title="Attributes & Custom CSS">
          <InputControl label="کلاس‌های CSS" value={s.attributes?.cssClasses ?? d.attributes.cssClasses} onChange={val => updateAdvanced('attributes.cssClasses', val)} placeholder="my-class another-class" />
          <TextareaControl label="CSS سفارشی" value={s.customCss?.css ?? d.customCss.css} onChange={val => updateAdvanced('customCss.css', val)} rows={6} />
      </Accordion>

    </div>
  );
};

export default AdvancedSettings;
