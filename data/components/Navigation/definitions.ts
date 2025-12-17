
import { LibraryItem } from '../../../types';

export const NAVIGATION_COMPONENTS: LibraryItem[] = [
    {
    type: 'navbar',
    label: 'App Bar (Mobile)',
    icon: 'Smartphone',
    defaultWidth: 375,
    defaultHeight: 56,
    defaultProps: { title: 'Home' },
    defaultStyle: { backgroundColor: '#ffffff', shadow: true, color: '#0f172a', fontSize: 18, textAlign: 'center' },
    },
    {
    type: 'navbar',
    label: 'App Bar (Action)',
    icon: 'Smartphone',
    defaultWidth: 375,
    defaultHeight: 56,
    defaultProps: { title: 'Profile', leftIcon: 'ArrowLeft', rightIcon: 'MoreVertical' },
    defaultStyle: { backgroundColor: '#3b82f6', shadow: true, color: '#ffffff', fontSize: 18, textAlign: 'center' },
    },
    {
    type: 'navbar',
    label: 'Navbar (Tablet)',
    icon: 'Tablet',
    defaultWidth: 768,
    defaultHeight: 64,
    defaultProps: { title: 'Tablet App', rightIcon: 'Menu' },
    defaultStyle: { backgroundColor: '#ffffff', shadow: true, color: '#0f172a', fontSize: 20, textAlign: 'left', padding: 24 },
    },
    {
    type: 'navbar',
    label: 'Navbar (Desktop)',
    icon: 'Monitor',
    defaultWidth: 1280,
    defaultHeight: 72,
    defaultProps: { title: 'Brand Logo', rightIcon: 'User', leftIcon: 'Menu' },
    defaultStyle: { backgroundColor: '#1e293b', shadow: true, color: '#ffffff', fontSize: 20, textAlign: 'left', padding: 32 },
    },
    {
    type: 'container',
    label: 'Bottom Tab Bar',
    icon: 'GalleryHorizontalEnd',
    defaultWidth: 375,
    defaultHeight: 65,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#ffffff', shadow: true, borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0 },
    },
    {
    type: 'container',
    label: 'Sidebar (Desktop)',
    icon: 'PanelLeft',
    defaultWidth: 260,
    defaultHeight: 800,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#1e293b', shadow: true, borderRadius: 0 },
    },
];
