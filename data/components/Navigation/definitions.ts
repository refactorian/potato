
import { LibraryItem } from '../../../types';

export const NAVIGATION_COMPONENTS: LibraryItem[] = [
    {
        type: 'group',
        label: 'App Bar (Mobile)',
        icon: 'Smartphone',
        defaultWidth: 375,
        defaultHeight: 56,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 375, height: 56, props: {}, style: { backgroundColor: '#ffffff', shadow: true } },
            { type: 'text', name: 'Title', x: 0, y: 0, width: 375, height: 56, props: { text: 'Home' }, style: { fontSize: 18, textAlign: 'center', fontWeight: 'bold', color: '#0f172a' } }
        ]
    },
    {
        type: 'group',
        label: 'App Bar (Action)',
        icon: 'Smartphone',
        defaultWidth: 375,
        defaultHeight: 56,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 375, height: 56, props: {}, style: { backgroundColor: '#3b82f6', shadow: true } },
            { type: 'icon', name: 'Left Icon', x: 16, y: 16, width: 24, height: 24, props: { iconName: 'ArrowLeft' }, style: { color: '#ffffff' } },
            { type: 'text', name: 'Title', x: 0, y: 0, width: 375, height: 56, props: { text: 'Profile' }, style: { fontSize: 18, textAlign: 'center', color: '#ffffff', fontWeight: 'bold' } },
            { type: 'icon', name: 'Right Icon', x: 335, y: 16, width: 24, height: 24, props: { iconName: 'MoreVertical' }, style: { color: '#ffffff' } }
        ]
    },
    {
        type: 'group',
        label: 'Navbar (Desktop)',
        icon: 'Monitor',
        defaultWidth: 1280,
        defaultHeight: 72,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 1280, height: 72, props: {}, style: { backgroundColor: '#1e293b', shadow: true } },
            { type: 'icon', name: 'Logo', x: 32, y: 24, width: 24, height: 24, props: { iconName: 'Zap' }, style: { color: '#ffffff' } },
            { type: 'text', name: 'Brand', x: 68, y: 24, width: 150, height: 24, props: { text: 'Brand Logo' }, style: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' } },
            { type: 'icon', name: 'User', x: 1224, y: 24, width: 24, height: 24, props: { iconName: 'User' }, style: { color: '#ffffff' } }
        ]
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
