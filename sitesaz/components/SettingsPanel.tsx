import React, { useState } from 'react';
import { CanvasElement, WidgetType } from '../types';
import { 
    CloseIcon, 
    HeadingIcon, 
    ImageIcon, 
    TextEditorIcon, 
    VideoIcon, 
    ButtonIcon, 
    StarRatingIcon, 
    DividerIcon, 
    GoogleMapsIcon, 
    IconIcon, 
    ImageBoxIcon, 
    IconBoxIcon, 
    IconListIcon, 
    CounterIcon, 
    SpacerIcon, 
    GenericWidgetIcon,
    InnerSectionIcon,
    GalleryIcon,
    ImageCarouselIcon,
    TestimonialIcon,
    TabsIcon,
    AccordionIcon,
    ToggleIcon,
    SocialIconsIcon,
    ProgressBarIcon,
    HtmlIcon,
    AlertIcon,
    ContainerIcon,
} from './icons';
import * as WidgetSettingsComponents from '../widgets/settings';
import AdvancedSettings from './AdvancedSettings';

interface SettingsPanelProps {
  element: CanvasElement;
  onClose: () => void;
  onUpdate: (id: string, newSettings: { [key: string]: any }) => void;
}

const WIDGET_ICONS: { [key in WidgetType]?: React.FC } = {
  'inner-section': InnerSectionIcon,
  'heading': HeadingIcon,
  'image': ImageIcon,
  'text-editor': TextEditorIcon,
  'video': VideoIcon,
  'button': ButtonIcon,
  'star-rating': StarRatingIcon,
  'divider': DividerIcon,
  'google-maps': GoogleMapsIcon,
  'icon': IconIcon,
  'image-box': ImageBoxIcon,
  'icon-box': IconBoxIcon,
  'basic-gallery': GalleryIcon,
  'image-carousel': ImageCarouselIcon,
  'icon-list': IconListIcon,
  'counter': CounterIcon,
  'spacer': SpacerIcon,
  'testimonial': TestimonialIcon,
  'tabs': TabsIcon,
  'accordion': AccordionIcon,
  'toggle': ToggleIcon,
  'social-icons': SocialIconsIcon,
  'progress-bar': ProgressBarIcon,
  'soundcloud': GenericWidgetIcon,
  'html': HtmlIcon,
  'alert': AlertIcon,
  'text-path': GenericWidgetIcon,
  'container': ContainerIcon,
};

const WIDGET_SETTINGS_MAP: { [key: string]: React.FC<any> } = {
  'inner-section': WidgetSettingsComponents.InnerSectionSettings,
  'heading': WidgetSettingsComponents.HeadingSettings,
  'image': WidgetSettingsComponents.ImageSettings,
  'text-editor': WidgetSettingsComponents.TextEditorSettings,
  'video': WidgetSettingsComponents.VideoSettings,
  'button': WidgetSettingsComponents.ButtonSettings,
  'star-rating': WidgetSettingsComponents.StarRatingSettings,
  'divider': WidgetSettingsComponents.DividerSettings,
  'google-maps': WidgetSettingsComponents.GoogleMapsSettings,
  'icon': WidgetSettingsComponents.IconSettings,
  'image-box': WidgetSettingsComponents.ImageBoxSettings,
  'icon-box': WidgetSettingsComponents.IconBoxSettings,
  'basic-gallery': WidgetSettingsComponents.BasicGallerySettings,
  'image-carousel': WidgetSettingsComponents.ImageCarouselSettings,
  'icon-list': WidgetSettingsComponents.IconListSettings,
  'counter': WidgetSettingsComponents.CounterSettings,
  'spacer': WidgetSettingsComponents.SpacerSettings,
  'testimonial': WidgetSettingsComponents.TestimonialSettings,
  'tabs': WidgetSettingsComponents.TabsSettings,
  'accordion': WidgetSettingsComponents.AccordionSettings,
  'toggle': WidgetSettingsComponents.ToggleSettings,
  'social-icons': WidgetSettingsComponents.SocialIconsSettings,
  'progress-bar': WidgetSettingsComponents.ProgressBarSettings,
  'soundcloud': WidgetSettingsComponents.SoundCloudSettings,
  'html': WidgetSettingsComponents.HtmlSettings,
  'alert': WidgetSettingsComponents.AlertSettings,
  'text-path': WidgetSettingsComponents.TextPathSettings,
  'container': WidgetSettingsComponents.ContainerSettings,
};


const SettingsPanel: React.FC<SettingsPanelProps> = ({ element, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');
  
  const handleUpdate = (newSettings: any) => {
      onUpdate(element.id, newSettings);
  }

  const widgetType = element.widgetType || '';
  const SpecificSettingsComponent = WIDGET_SETTINGS_MAP[widgetType] || (() => <div className="text-center text-gray-500 p-4">تنظیمات این ابزارک در دسترس نیست.</div>);
  const WidgetIcon = WIDGET_ICONS[widgetType as WidgetType] || GenericWidgetIcon;

  return (
    <div className="w-[350px] bg-white flex flex-col shadow-lg flex-shrink-0">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
            <span className="text-gray-600"><WidgetIcon/></span>
            <h2 className="text-lg font-semibold capitalize">{element.widgetType}</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <CloseIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="border-b">
        <div className="flex justify-around">
            <TabButton name="محتوا" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
            <TabButton name="استایل" active={activeTab === 'style'} onClick={() => setActiveTab('style')} />
            <TabButton name="پیشرفته" active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {activeTab !== 'advanced' ? (
          <div className="p-4">
            <SpecificSettingsComponent 
                settings={element.settings} 
                onUpdate={handleUpdate} 
                activeTab={activeTab} 
            />
          </div>
        ) : (
            <AdvancedSettings
              settings={element.settings}
              onUpdate={handleUpdate}
              widgetType={element.widgetType as WidgetType}
            />
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{name: string, active: boolean, onClick: ()=>void}> = ({name, active, onClick}) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {name}
    </button>
)

export default SettingsPanel;
