
import { LibraryItem } from '../../../types';

export const LAYOUT_COMPONENTS: LibraryItem[] = [
    {
        type: 'container',
        label: 'Generic Box',
        icon: 'Square',
        defaultWidth: 100,
        defaultHeight: 100,
        defaultProps: {},
        defaultStyle: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8 },
    },
    {
        type: 'circle',
        label: 'Circle Shape',
        icon: 'Circle',
        defaultWidth: 100, 
        defaultHeight: 100,
        defaultProps: {},
        defaultStyle: { backgroundColor: '#6366f1' },
    },
    {
        type: 'group',
        label: 'Section Header',
        icon: 'Type',
        defaultWidth: 343,
        defaultHeight: 80,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'text', name: 'Title', x: 0, y: 0, width: 250, height: 30, props: { text: 'Section Title' }, style: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' } },
            { type: 'text', name: 'Subtitle', x: 0, y: 35, width: 343, height: 20, props: { text: 'Brief description of this section' }, style: { fontSize: 14, color: '#64748b' } },
            { type: 'divider', name: 'Line', x: 0, y: 70, width: 60, height: 4, props: {}, style: { backgroundColor: '#4f46e5', borderRadius: 2 } }
        ]
    },
    {
        type: 'group',
        label: 'Feature Card (Vertical)',
        icon: 'Layout',
        defaultWidth: 260,
        defaultHeight: 220,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 260, height: 220, props: {}, style: { backgroundColor: '#fff', borderRadius: 16, shadow: true, borderWidth: 1, borderColor: '#f1f5f9' } },
            { type: 'container', name: 'Icon BG', x: 20, y: 20, width: 48, height: 48, props: {}, style: { backgroundColor: '#eef2ff', borderRadius: 12 } },
            { type: 'icon', name: 'Icon', x: 32, y: 32, width: 24, height: 24, props: { iconName: 'Zap' }, style: { color: '#4f46e5' } },
            { type: 'text', name: 'Title', x: 20, y: 85, width: 220, height: 24, props: { text: 'Lightning Fast' }, style: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' } },
            { type: 'text', name: 'Desc', x: 20, y: 115, width: 220, height: 80, props: { text: 'Optimized performance for a seamless user experience across all devices.' }, style: { fontSize: 14, color: '#64748b', lineHeight: 1.5 } }
        ]
    },
    {
        type: 'group',
        label: 'Horizontal Card',
        icon: 'Rows',
        defaultWidth: 343,
        defaultHeight: 110,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 343, height: 110, props: {}, style: { backgroundColor: '#fff', borderRadius: 16, shadow: true } },
            { type: 'image', name: 'Thumb', x: 12, y: 12, width: 86, height: 86, props: { src: 'https://picsum.photos/100' }, style: { borderRadius: 12 } },
            { type: 'text', name: 'Title', x: 115, y: 18, width: 200, height: 24, props: { text: 'Article Headline' }, style: { fontSize: 16, fontWeight: 'bold' } },
            { type: 'text', name: 'Meta', x: 115, y: 45, width: 200, height: 45, props: { text: 'A short summary of the content that fits here.' }, style: { fontSize: 13, color: '#64748b' } }
        ]
    },
    {
        type: 'divider',
        label: 'Horizontal Line',
        icon: 'Minus',
        defaultWidth: 300,
        defaultHeight: 1,
        defaultProps: {},
        defaultStyle: { backgroundColor: '#e2e8f0' },
    },
    {
        type: 'divider',
        label: 'Vertical Line',
        icon: 'SeparatorVertical',
        defaultWidth: 1,
        defaultHeight: 100,
        defaultProps: {},
        defaultStyle: { backgroundColor: '#e2e8f0' },
    }
];
