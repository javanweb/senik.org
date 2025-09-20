import { WidgetType } from '../types';

const defaultTypography = {
  fontSize: 16,
  fontWeight: '400',
  textTransform: 'none',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: 1.5,
  letterSpacing: 0,
};

const defaultTextShadow = { color: 'rgba(0,0,0,0.3)', blur: 0, horizontal: 0, vertical: 0 };
const defaultBoxShadow = { color: 'rgba(0,0,0,0.5)', blur: 10, spread: 0, horizontal: 0, vertical: 0, position: 'outline' };

export const defaultAdvancedSettings = {
  layout: {
    margin: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
    padding: { top: 10, right: 10, bottom: 10, left: 10, unit: 'px', isLinked: true },
    width: 'auto',
    position: 'default',
    zIndex: '',
  },
  motionEffects: {
    entranceAnimation: {
      animation: 'none',
      duration: 'normal',
      delay: 0,
    },
  },
  transform: {
    normal: { rotate: 0, scale: 1, offsetX: 0, offsetY: 0, skewX: 0, skewY: 0 },
    hover: { rotate: 0, scale: 1, offsetX: 0, offsetY: 0, skewX: 0, skewY: 0 },
  },
  background: {
    normal: { type: 'none', color: '', image: '', gradient: '' },
    hover: { type: 'none', color: '', image: '', gradient: '' },
  },
  border: {
    normal: { type: 'none', color: '', width: { top: 1, right: 1, bottom: 1, left: 1, unit: 'px', isLinked: true } },
    hover: { type: 'none', color: '' },
    radius: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true },
    boxShadow: '',
  },
  responsive: {
    hideDesktop: false,
    hideTablet: false,
    hideMobile: false,
  },
  attributes: {
    cssId: '',
    cssClasses: '',
    custom: '',
  },
  customCss: {
    css: '/* selector { } */',
  },
};

export const getWidgetDefaultSettings = (widgetType: WidgetType) => {
  const advanced = JSON.parse(JSON.stringify(defaultAdvancedSettings));
  let content: { [key: string]: any } = {};
  let style: { [key: string]: any } = {};

  switch (widgetType) {
    case 'inner-section':
      content = { columns: 2, column_gap: 'default', height: 'default', min_height: 400, content_position: 'default', html_tag: 'div' };
      style = {};
      break;
    case 'heading':
      content = { title: 'سرتیتر نمونه', link: { url: '', is_external: false, nofollow: false, open_in_new_tab: false }, size: 'default', html_tag: 'h2', alignment: 'right' };
      style = {
        textColor: '#333333',
        typography: { ...defaultTypography, fontSize: 32, fontWeight: '600' },
        textShadow: { ...defaultTextShadow },
        blendMode: 'normal',
      };
      break;
    case 'image':
      content = { image: { url: 'https://picsum.photos/600/400' }, image_size: 'full', alignment: 'center', caption: 'none', custom_caption: '', link_to: 'none', link: { url: '' }, lightbox: 'default' };
      style = {
          width: 100,
          width_unit: '%',
          objectFit: 'cover',
          transitionDuration: 0.3,
          normal: {
            opacity: 1,
            cssFilters: { blur: 0, brightness: 100, contrast: 100, saturation: 100, hue: 0 },
          },
          hover: {
            opacity: 1,
            cssFilters: { blur: 0, brightness: 100, contrast: 100, saturation: 100, hue: 0 },
            hoverAnimation: 'none',
          },
          border: {
              normal: { type: 'none', color: '', width: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true }, radius: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px', isLinked: true } },
              hover: { type: 'none', color: '' },
          },
          boxShadow: {
              normal: { ...defaultBoxShadow },
              hover: { ...defaultBoxShadow },
          }
      };
      break;
    case 'text-editor':
      content = { text: '<p>این یک ویرایشگر متن است. برای ویرایش کلیک کنید.</p>', columns: 1, column_gap: 'default', drop_cap: false };
      style = {
          alignment: 'right',
          textColor: '#333333',
          typography: { ...defaultTypography },
          textShadow: { ...defaultTextShadow },
      };
      break;
    case 'video':
        content = { source: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', self_hosted_url: '', start_time: 0, end_time: 0, cover_image: { url: '' }, play_on_mobile: false, privacy_mode: false, aspect_ratio: '16:9', autoplay: false, mute: false, loop: false, player_controls: true, modest_branding: false, lazy_load: false };
        style = {
            aspectRatio: '16:9',
            cssFilters: {
                normal: { blur: 0, brightness: 100, contrast: 100, saturation: 100, hue: 0 },
                hover: { blur: 0, brightness: 100, contrast: 100, saturation: 100, hue: 0 },
            },
            playIcon: { color: 'rgba(255,255,255,0.8)', size: 60, shadow: { ...defaultTextShadow } }
        };
        break;
    case 'button':
      content = { text: 'اینجا کلیک کنید', link: { url: '#', is_external: false, nofollow: false }, alignment: 'right', size: 'md', icon: { url: '' }, icon_position: 'before', icon_spacing: 5, button_id: '' };
      style = {
        typography: { ...defaultTypography, fontWeight: '500' },
        textShadow: { ...defaultTextShadow },
        normal: {
            textColor: '#FFFFFF',
            backgroundColor: '#54595F',
            border: { type: 'none', color: '', width: { top: 1, right: 1, bottom: 1, left: 1, unit: 'px', isLinked: true } },
            boxShadow: { ...defaultBoxShadow },
        },
        hover: {
            textColor: '#FFFFFF',
            backgroundColor: '#495157',
            border: { type: 'none', color: '', width: { top: 1, right: 1, bottom: 1, left: 1, unit: 'px', isLinked: true } },
            boxShadow: { ...defaultBoxShadow },
            hoverAnimation: 'none',
        },
        padding: { top: 12, right: 24, bottom: 12, left: 24, unit: 'px', isLinked: false },
        borderRadius: { top: 5, right: 5, bottom: 5, left: 5, unit: 'px', isLinked: true }
      };
      break;
    case 'star-rating':
        content = { rating: 4.5, icon: 'star', alignment: 'right' };
        style = {
            stars: { size: 24, spacing: 2, color: '#fdd835', unmarkedColor: '#ccd6e1' },
            title: { spacing: 10, color: '#333', typography: { ...defaultTypography } }
        };
        break;
    case 'divider':
      content = { style: 'solid', width: 100, alignment: 'center' };
      style = { color: '#DDDDDD', weight: 1, gap: 15 };
      break;
    case 'google-maps':
        content = { address: 'Tehran, Iran', zoom: 14, height: 400, prevent_scroll: true, view_type: 'roadmap' };
        style = {};
        break;
    case 'icon':
      content = { icon: { library: 'fa-solid', value: 'fa-star', url: '' }, link: { url: ''}, alignment: 'center' };
      style = {
          view: 'default', shape: 'circle',
          normal: { primaryColor: '#54595F', secondaryColor: '#ffffff' },
          hover: { primaryColor: '#495157', secondaryColor: '#ffffff' },
          size: 30,
          padding: 15,
          rotate: 0,
          borderWidth: 2,
          borderRadius: { top: 50, right: 50, bottom: 50, left: 50, unit: '%', isLinked: true },
          hoverAnimation: 'none'
      };
      break;
    case 'image-box':
        content = { image: { url: 'https://picsum.photos/400/300' }, image_size: 'full', title: 'عنوان جعبه تصویر', description: 'این یک توضیح کوتاه است.', link: { url: ''}, position: 'top', title_html_tag: 'h3' };
        style = {
            spacing: 15,
            image: { width: 100, borderRadius: 0 },
            content: {
                alignment: 'center',
                verticalAlignment: 'top',
                title: { spacing: 10, color: '#333', typography: { ...defaultTypography, fontSize: 22, fontWeight: '600' }, textShadow: { ...defaultTextShadow } },
                description: { color: '#777', typography: { ...defaultTypography } }
            }
        };
        break;
    case 'icon-box':
        content = { icon: { library: 'fa-solid', value: 'fa-star', url: '' }, title: 'عنوان جعبه آیکون', description: 'این یک توضیح کوتاه است.', link: { url: ''}, position: 'top', alignment: 'center', title_html_tag: 'h3' };
        style = {
            icon: {
                normal: { primaryColor: '#54595F' },
                hover: { primaryColor: '#495157' },
                hoverAnimation: 'none',
                size: 30,
                padding: 15,
                spacing: 15,
            },
            content: {
                alignment: 'center',
                verticalAlignment: 'top',
                title: { spacing: 10, color: '#333', typography: { ...defaultTypography, fontSize: 22, fontWeight: '600' }, textShadow: { ...defaultTextShadow } },
                description: { color: '#777', typography: { ...defaultTypography } }
            }
        };
        break;
    case 'basic-gallery':
        content = { images: [{id: 1, url: 'https://picsum.photos/300/300?random=1'}, {id: 2, url: 'https://picsum.photos/300/300?random=2'}, {id: 3, url: 'https://picsum.photos/300/300?random=3'}, {id: 4, url: 'https://picsum.photos/300/300?random=4'}], columns: 4, link_to: 'none', lazy_load: true };
        style = {
            spacing: 10,
            image: { border: { type: 'none', color: ''}, hoverAnimation: 'none' },
            overlay: { backgroundColor: 'rgba(0,0,0,0.5)', textColor: '#fff', typography: { ...defaultTypography } }
        };
        break;
    case 'image-carousel':
        content = { images: [{id: 1, url: 'https://picsum.photos/600/400?random=5'}, {id: 2, url: 'https://picsum.photos/600/400?random=6'}, {id: 3, url: 'https://picsum.photos/600/400?random=7'}], slides_to_show: 1, navigation: 'both', autoplay: true };
        style = {
            navigation: { arrowsSize: 20, arrowsColor: '#fff', dotsSize: 8, dotsColor: 'rgba(255,255,255,0.7)' },
            image: { spacing: 0, border: { type: 'none', color: '' } },
            caption: { alignment: 'center', textColor: '#fff', typography: { ...defaultTypography } }
        };
        break;
    case 'icon-list':
        content = { items: [{id: 1, text: 'آیتم لیست ۱', icon: { url: ''}, link: {url: ''}}, {id: 2, text: 'آیتم لیست ۲', icon: {url: ''}, link: {url: ''}}], divider: false };
        style = {
            list: { spaceBetween: 10, alignment: 'left', divider: { style: 'solid', color: '#ddd', weight: 1 } },
            icon: { size: 16, color: '#54595F', colorHover: '#605AFF', alignment: 'center' },
            text: { color: '#333', textColorHover: '#605AFF', typography: { ...defaultTypography }, indent: 5 }
        };
        break;
    case 'counter':
        content = { start_number: 0, end_number: 100, prefix: '', suffix: '', duration: 2000, thousand_separator: true, title: 'شمارنده جذاب' };
        style = {
            number: { color: '#333', typography: { ...defaultTypography, fontSize: 48, fontWeight: '600' } },
            title: { color: '#777', typography: { ...defaultTypography, fontSize: 18 }, spacing: 10, textShadow: { ...defaultTextShadow } },
        };
        break;
    case 'testimonial':
        content = { content: 'این یک متن نمونه عالی برای بخش نظرات است. بسیار تاثیرگذار و الهام‌بخش!', image: { url: 'https://picsum.photos/100/100' }, name: 'سارا احمدی', title: 'مدیر محصول', alignment: 'center' };
        style = {
            content: { spacing: 20, textColor: '#555', typography: { ...defaultTypography, fontSize: 18, fontStyle: 'italic' } },
            image: { size: 80, border: { type: 'solid', color: '#ddd', width: 2, radius: 50 } },
            name: { spacing: 10, textColor: '#333', typography: { ...defaultTypography, fontWeight: 'bold' }, textShadow: { ...defaultTextShadow } },
            title: { textColor: '#777', typography: { ...defaultTypography, fontSize: 14 }, textShadow: { ...defaultTextShadow } }
        };
        break;
    case 'tabs':
        content = { items: [{id: 1, title: 'تب ۱', content: 'محتوای تب اول در اینجا قرار می‌گیرد.'}, {id: 2, title: 'تب ۲', content: 'محتوای تب دوم در اینجا قرار می‌گیرد.'}], alignment: 'horizontal' };
        style = {
            tabs: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9' },
            title: {
                normal: { textColor: '#555', backgroundColor: 'transparent' },
                hover: { textColor: '#000', backgroundColor: '#f0f0f0' },
                active: { textColor: '#000', backgroundColor: '#fff' },
                typography: { ...defaultTypography },
                padding: { top: 10, right: 20, bottom: 10, left: 20, unit: 'px', isLinked: false },
                textShadow: { ...defaultTextShadow },
            },
            content: { spacing: 20, textColor: '#333', typography: { ...defaultTypography }, backgroundColor: '#fff', border: { type: 'solid', color: '#ddd' } }
        };
        break;
    case 'accordion':
         content = { items: [{id: 1, title: 'آیتم ۱', content: 'محتوای آیتم اول.'}, {id: 2, title: 'آیتم ۲', content: 'محتوای آیتم دوم.'}], icon: {normal: '', active: ''}, html_tag: 'div' };
        style = {
            accordion: { borderWidth: 1, borderColor: '#ddd' },
            title: {
                normal: { backgroundColor: 'transparent', textColor: '#333', iconColor: '#555' },
                hover: { backgroundColor: '#f9f9f9', textColor: '#000', iconColor: '#000' },
                active: { backgroundColor: '#f9f9f9', textColor: '#000', iconColor: '#000' },
                typography: { ...defaultTypography, fontWeight: '500' },
                padding: { top: 15, right: 15, bottom: 15, left: 15, unit: 'px', isLinked: true },
                iconAlignment: 'right',
                textShadow: { ...defaultTextShadow },
            },
            content: { backgroundColor: '#fff', textColor: '#333', typography: { ...defaultTypography }, padding: { top: 15, right: 15, bottom: 15, left: 15, unit: 'px', isLinked: true } }
        };
        break;
    case 'toggle':
        content = { items: [{id: 1, title: 'تاگل ۱', content: 'محتوای تاگل اول.'}, {id: 2, title: 'تاگل ۲', content: 'محتوای تاگل دوم.'}], icon: {normal: '', active: ''}, html_tag: 'div', state_on_load: 'first-expanded' };
        style = { ...getWidgetDefaultSettings('accordion').style }; // Inherits accordion styles
        break;
    case 'social-icons':
        content = { items: [{id: 1, network: 'facebook', link: {url: '#'}}, {id: 2, network: 'twitter', link: {url: '#'}}], shape: 'rounded', icon_color: 'official', alignment: 'center' };
        style = {
            icon: {
                normal: { primaryColor: '#fff', secondaryColor: '#54595F'},
                hover: { primaryColor: '#fff', secondaryColor: '#495157'},
                hoverAnimation: 'grow',
                size: 18,
                padding: 10,
                spacing: 10,
                border: { type: 'none', color: '' }
            }
        };
        break;
    case 'progress-bar':
        content = { title: 'توسعه وب', progress: 75, display_percentage: true, inner_text: 'مهارت' };
        style = {
            progressBar: { color: '#54595F', backgroundColor: '#eee', height: 20, radius: 5 },
            innerText: { color: '#fff', typography: { ...defaultTypography, fontSize: 12 } },
            title: { color: '#333', typography: { ...defaultTypography }, textShadow: { ...defaultTextShadow } }
        };
        break;
    case 'alert':
        content = { type: 'info', title: 'اطلاعیه', description: 'این یک پیام مهم برای شماست.', dismiss_button: true };
        style = {
            box: { backgroundColor: '#E6F7FF', borderColor: '#91D5FF', borderWidth: { top: 1, right: 1, bottom: 1, left: 4, unit: 'px', isLinked: false }, radius: 4, padding: 15 },
            title: { color: '#00529B', typography: { ...defaultTypography, fontWeight: 'bold' }, textShadow: { ...defaultTextShadow } },
            description: { color: '#00529B', typography: { ...defaultTypography } },
            closeButton: { color: '#00529B', size: 16 }
        };
        break;
    case 'soundcloud':
        content = { embed_code: 'https://soundcloud.com/oembed?url=https%3A//soundcloud.com/beo-demos/sets/c-of-love', visual_player: true, autoplay: false, buy_button: false, artwork: true, comments: false, users: false, height: 120 };
        style = {};
        break;
    case 'html':
        content = { code: '<h1>کد HTML سفارشی</h1>', fullWidthPage: false };
        style = {};
        break;
    case 'text-path':
        content = { text: 'متن در مسیر منحنی', path_type: 'circle', svg_path: '', align: 'center', size: 100, link: { url: '' }, orientation: 'clockwise' };
        style = {};
        break;
    case 'container':
        content = { container_type: 'flexbox', flex_direction: 'row', justify_content: 'start', align_items: 'stretch', width: 'boxed', content_width: 'boxed', min_height: 400, html_tag: 'div' };
        style = {};
        break;
    case 'spacer':
      content = { space: 50 };
      style = {};
      break;
    default:
      break;
  }

  return { content, style, advanced };
};
