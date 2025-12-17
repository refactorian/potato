
import { LibraryItem } from '../../../types';

export const MEDIA_COMPONENTS: LibraryItem[] = [
    {
    type: 'image',
    label: 'Standard Image',
    icon: 'Image',
    defaultWidth: 300,
    defaultHeight: 200,
    defaultProps: { src: 'https://picsum.photos/600/400' },
    defaultStyle: { borderRadius: 12, backgroundColor: '#e2e8f0' },
    },
    {
    type: 'image',
    label: 'User Avatar',
    icon: 'UserCircle',
    defaultWidth: 80,
    defaultHeight: 80,
    defaultProps: { src: 'https://i.pravatar.cc/150' },
    defaultStyle: { borderRadius: 40, backgroundColor: '#cbd5e1' },
    },
    {
    type: 'icon',
    label: 'Customizable Icon',
    icon: 'Sparkles',
    defaultWidth: 48,
    defaultHeight: 48,
    defaultProps: { iconName: 'Star' },
    defaultStyle: { color: '#4f46e5', backgroundColor: 'transparent' },
    },
    {
    type: 'video',
    label: 'Video Frame',
    icon: 'Video',
    defaultWidth: 343,
    defaultHeight: 200,
    defaultProps: { src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    defaultStyle: { borderRadius: 12, backgroundColor: '#000000' },
    }
];
