import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    {...props}
  >
    {props.children}
  </svg>
);

export const AccordionIcon: React.FC = () => (
    <Icon>
        <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
    </Icon>
);

export const AlertIcon: React.FC = () => (
    <Icon>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </Icon>
);

export const ButtonIcon: React.FC = () => (
    <Icon>
        <path d="M20.5 2H3.5A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM19 19H5V5h14v14Z"/>
        <path d="M12 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
    </Icon>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Icon>
);

export const ContainerIcon: React.FC = () => (
    <Icon>
        <path d="M4 2h16v2H4zM4 20h16v2H4zM2 7h2v10H2zm18 0h2v10h-2z" />
    </Icon>
);

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </Icon>
);

export const CounterIcon: React.FC = () => (
    <Icon>
        <path d="M12 11h2v2h-2v2h2v2h-2v2h4V9h-4zm-4 0h2v2H8v2h2v2H8v2h4V9H8zm-2 2H4v-2h2v2zm-2-2H2v2h2V9h2v2H4zm14 8H2V4h20v14h-4v4l-4-4zm-2-2V6H4v12h14z" />
    </Icon>
);

export const DividerIcon: React.FC = () => (
    <Icon>
        <path d="M21 11H3v2h18z"/>
    </Icon>
);

export const GalleryIcon: React.FC = () => (
    <Icon>
        <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
    </Icon>
);

export const GenericWidgetIcon: React.FC = () => (
    <Icon>
        <path d="M3,3V21H21V3ZM19,19H5V5H19Z"/>
    </Icon>
);

export const GoogleMapsIcon: React.FC = () => (
    <Icon>
        <path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,1.56,5.32L12,22l8.44-4.68A9.89,9.89,0,0,0,22,12,10,10,0,0,0,12,2Zm0,12.5A2.5,2.5,0,1,1,14.5,12,2.5,2.5,0,0,1,12,14.5Z"/>
    </Icon>
);

export const HeadingIcon: React.FC = () => (
  <Icon>
    <path d="M20.18,8.27a8.5,8.5,0,0,0-16.36,0H2V6.5h3.35a7,7,0,0,1,13.3,0H22V8.27ZM12,17.27a.75.75,0,0,0,.75-.75V7.5a.75.75,0,0,0-1.5,0v9A.75.75,0,0,0,12,17.27Z" />
  </Icon>
);

export const HtmlIcon: React.FC = () => (
    <Icon>
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
    </Icon>
);

export const IconBoxIcon: React.FC = () => (
    <Icon>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-1-7v4h2v-4h-2z"/>
        <path d="M3 20h18v2H3z" />
    </Icon>
);

export const IconIcon: React.FC = () => (
    <Icon>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z"/>
    </Icon>
);

export const IconListIcon: React.FC = () => (
    <Icon>
        <path d="M7 11h11v2H7zm0 4h11v2H7zm0-8h11v2H7zM3 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
    </Icon>
);

export const ImageCarouselIcon: React.FC = () => (
    <Icon>
        <path d="M7 19h10V5H7v14zm-4-4h2v2H3v-2zm0-4h2v2H3v-2zm0-4h2v2H3V7zm18 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7zM23 3H1v18h22V3zm-2 16H3V5h18v14z"/>
    </Icon>
);

export const ImageIcon: React.FC = () => (
  <Icon>
    <path d="M21,3H3A2,2,0,0,0,1,5V19a2,2,0,0,0,2,2H21a2,2,0,0,0,2-2V5A2,2,0,0,0,21,3ZM3,19V5H21l0,14Z" />
    <path d="M10,12a2,2,0,1,0-2-2A2,2,0,0,0,10,12Zm0-2.5A.5.5,0,1,1,9.5,10,.5.5,0,0,1,10,9.5Z" />
    <path d="M19,17H5l4-5,3,4,2-2,5,3Z" />
  </Icon>
);

export const ImageBoxIcon: React.FC = () => (
    <Icon>
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        <path d="M15 11l-3 4-2-2-4 5h12z"/>
    </Icon>
);

export const InnerSectionIcon: React.FC = () => (
    <Icon>
        <path d="M11 5H3v6h8V5zm-2 4H5V7h4v2zm10-4h-8v6h8V5zm-2 4h-4V7h4v2zM3 13h8v6H3v-6zm2 4h4v-2H5v2zm16-4h-8v6h8v-6zm-2 4h-4v-2h4v2z"/>
    </Icon>
);

export const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24 5-5s2.24 5 5 5h4v-2zM8 11h8v2H8v-2z"/>
  </Icon>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </Icon>
);

export const ProgressBarIcon: React.FC = () => (
    <Icon>
        <path d="M4 14h16v-4H4v4zm0 4h10v-2H4v2zM4 8h12V6H4v2z"/>
    </Icon>
);

export const SocialIconsIcon: React.FC = () => (
    <Icon>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 11h-2.5v7h-3v-7h-2v-3h2V8.5C11 6.57 12.57 5 14.5 5h2.5v3h-1.5c-.5 0-.5.5-.5 1v1.5h2.5l-.5 3z"/>
    </Icon>
);

export const SpacerIcon: React.FC = () => (
    <Icon>
        <path d="M12 9h9v6h-9zM3 9h9v6H3z"/>
    </Icon>
);

export const StarRatingIcon: React.FC = () => (
    <Icon>
        <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z"/>
    </Icon>
);

export const TabsIcon: React.FC = () => (
    <Icon>
        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/>
    </Icon>
);

export const TestimonialIcon: React.FC = () => (
    <Icon>
        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </Icon>
);

export const TextEditorIcon: React.FC = () => (
  <Icon>
    <path d="M10.15,18.84H8.44L4.7,6.4H6.53l2.8,9.75,2.8-9.75h1.83l-3.74,12.44Z" />
    <path d="M19.3,17.38H13.88V15.75h5.27V14.12H13.88V12.49h5.42V10.87H13.88V9.24h5.27V7.61H12.05v11.2H19.3Z" />
  </Icon>
);

export const ToggleIcon: React.FC = () => (
    <Icon>
        <path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    </Icon>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </Icon>
);

export const UnlinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 9h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2H7c-1.65 0-3-1.35-3-3s1.35-3 3-3zm-1 5h12v-2H6v2z"/>
  </Icon>
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M9 16h6v-6h4l-8-8-8 8h4v6zm-4 2h14v2H5v-2z"/>
    </Icon>
);

export const VideoIcon: React.FC = () => (
    <Icon>
        <path d="M17,10.5V7A1,1,0,0,0,16,6H4A1,1,0,0,0,3,7v10a1,1,0,0,0,1,1H16a1,1,0,0,0,1-1V13.5L21,16V8Z"/>
    </Icon>
);
