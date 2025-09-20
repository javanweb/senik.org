import React from 'react';
import { WidgetType } from '../types';
import { 
  AccordionIcon,
  AlertIcon,
  ButtonIcon,
  ContainerIcon,
  CounterIcon,
  DividerIcon,
  GalleryIcon,
  GenericWidgetIcon,
  GoogleMapsIcon,
  HeadingIcon,
  HtmlIcon,
  IconBoxIcon,
  IconIcon,
  IconListIcon,
  ImageCarouselIcon,
  ImageIcon,
  ImageBoxIcon,
  InnerSectionIcon,
  ProgressBarIcon,
  SocialIconsIcon,
  SpacerIcon,
  StarRatingIcon,
  TabsIcon,
  TestimonialIcon,
  TextEditorIcon,
  ToggleIcon,
  VideoIcon
} from './icons';

interface WidgetButtonProps {
  label: string;
  type: WidgetType;
  icon: React.ReactNode;
  isPro?: boolean;
}

const WidgetButton: React.FC<WidgetButtonProps> = ({ label, type, icon, isPro = false }) => {
  const onDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData('widgetType', type);
  };

  return (
    <button
      draggable="true"
      onDragStart={onDragStart}
      className="relative flex flex-col items-center justify-center p-2 text-center bg-gray-100 rounded-md hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200 cursor-grab"
    >
      <div className="w-8 h-8 text-gray-600">{icon}</div>
      <span className="mt-1 text-xs font-medium">{label}</span>
    </button>
  );
};

const WIDGETS: { [key: string]: WidgetButtonProps[] } = {
  basic: [
    { label: 'بخش داخلی', type: 'inner-section', icon: <InnerSectionIcon /> },
    { label: 'سرتیتر', type: 'heading', icon: <HeadingIcon /> },
    { label: 'تصویر', type: 'image', icon: <ImageIcon /> },
    { label: 'ویرایشگر متن', type: 'text-editor', icon: <TextEditorIcon /> },
    { label: 'ویدئو', type: 'video', icon: <VideoIcon /> },
    { label: 'دکمه', type: 'button', icon: <ButtonIcon /> },
    { label: 'امتیاز ستاره‌ای', type: 'star-rating', icon: <StarRatingIcon /> },
    { label: 'جداکننده', type: 'divider', icon: <DividerIcon /> },
    { label: 'نقشه گوگل', type: 'google-maps', icon: <GoogleMapsIcon /> },
    { label: 'آیکون', type: 'icon', icon: <IconIcon /> },
    { label: 'جعبه تصویر', type: 'image-box', icon: <ImageBoxIcon /> },
    { label: 'جعبه آیکون', type: 'icon-box', icon: <IconBoxIcon /> },
    { label: 'گالری پایه', type: 'basic-gallery', icon: <GalleryIcon /> },
    { label: 'کروسل تصویر', type: 'image-carousel', icon: <ImageCarouselIcon /> },
    { label: 'لیست آیکون', type: 'icon-list', icon: <IconListIcon /> },
    { label: 'شمارنده', type: 'counter', icon: <CounterIcon /> },
    { label: 'فاصله‌انداز', type: 'spacer', icon: <SpacerIcon /> },
    { label: 'نقل قول', type: 'testimonial', icon: <TestimonialIcon /> },
    { label: 'تب‌ها', type: 'tabs', icon: <TabsIcon /> },
    { label: 'آکاردئون', type: 'accordion', icon: <AccordionIcon /> },
    { label: 'تاگل', type: 'toggle', icon: <ToggleIcon /> },
    { label: 'آیکون‌های اجتماعی', type: 'social-icons', icon: <SocialIconsIcon /> },
    { label: 'نوار پیشرفت', type: 'progress-bar', icon: <ProgressBarIcon /> },
    { label: 'SoundCloud', type: 'soundcloud', icon: <GenericWidgetIcon /> },
    { label: 'HTML', type: 'html', icon: <HtmlIcon /> },
    { label: 'هشدار', type: 'alert', icon: <AlertIcon /> },
    { label: 'مسیر متن', type: 'text-path', icon: <GenericWidgetIcon /> },
    { label: 'کانتینر', type: 'container', icon: <ContainerIcon /> },
  ],
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-[350px] bg-white flex flex-col shadow-lg flex-shrink-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">ابزارک‌ها</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-6">
          <WidgetGroup title="ویجت‌های پایه" widgets={WIDGETS.basic} />
        </div>
      </div>
    </div>
  );
};

interface WidgetGroupProps {
    title: string;
    widgets: WidgetButtonProps[];
}

const WidgetGroup: React.FC<WidgetGroupProps> = ({ title, widgets }) => {
    if (widgets.length === 0) return null;
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">{title}</h3>
            <div className="grid grid-cols-3 gap-2">
                {widgets.map((widget) => (
                    <WidgetButton key={widget.type} {...widget} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar;
