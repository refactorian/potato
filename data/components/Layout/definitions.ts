
import { LibraryItem } from '../../../types';

export const LAYOUT_COMPONENTS: LibraryItem[] = [
    {
    type: 'container',
    label: 'Box (Mobile)',
    icon: 'Square',
    defaultWidth: 100,
    defaultHeight: 100,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#e5e7eb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 0 },
    },
    {
    type: 'container',
    label: 'Hero Section (Desk)',
    icon: 'Monitor',
    defaultWidth: 1280,
    defaultHeight: 400,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#1e293b', borderRadius: 0 },
    },
    {
    type: 'container',
    label: 'Rounded Container',
    icon: 'Square',
    defaultWidth: 120,
    defaultHeight: 120,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, shadow: true },
    },
    {
    type: 'circle',
    label: 'Circle Shape',
    icon: 'Circle',
    defaultWidth: 80,
    defaultHeight: 80,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#3b82f6', borderRadius: 50 },
    },
    {
    type: 'card',
    label: 'Card (Mobile)',
    icon: 'Smartphone',
    defaultWidth: 320,
    defaultHeight: 200,
    defaultProps: { title: 'Card Title', subtitle: 'This is a description inside the card.' },
    defaultStyle: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true, padding: 20 },
    },
    {
    type: 'card',
    label: 'Card (Desktop)',
    icon: 'Monitor',
    defaultWidth: 400,
    defaultHeight: 300,
    defaultProps: { title: 'Feature Card', subtitle: 'Extended description for larger screens.' },
    defaultStyle: { backgroundColor: '#ffffff', borderRadius: 16, shadow: true, padding: 32 },
    },
    {
    type: 'container',
    label: 'Divider (Line)',
    icon: 'Minus',
    defaultWidth: 300,
    defaultHeight: 1,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#cbd5e1', borderRadius: 0 },
    },
    {
    type: 'container',
    label: 'Modal / Overlay',
    icon: 'Copy',
    defaultWidth: 300,
    defaultHeight: 180,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#ffffff', borderRadius: 8, shadow: true, borderWidth: 0, opacity: 1 },
    },
    {
    type: 'group',
    label: 'Hybrid Info Card',
    icon: 'CreditCard',
    defaultWidth: 300,
    defaultHeight: 120,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true },
    children: [
        {
            type: 'image',
            name: 'Thumbnail',
            x: 10, y: 10, width: 100, height: 100,
            props: { src: 'https://picsum.photos/100/100' },
            style: { borderRadius: 8, backgroundColor: '#e2e8f0' }
        },
        {
            type: 'text',
            name: 'Title',
            x: 120, y: 15, width: 160, height: 30,
            props: { text: 'Hybrid Card' },
            style: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' }
        },
        {
            type: 'text',
            name: 'Description',
            x: 120, y: 45, width: 160, height: 40,
            props: { text: 'This component consists of multiple layers in a group.' },
            style: { fontSize: 12, color: '#64748b' }
        },
        {
            type: 'button',
            name: 'Action',
            x: 120, y: 85, width: 80, height: 25,
            props: { text: 'View' },
            style: { backgroundColor: '#3b82f6', color: '#fff', fontSize: 12, borderRadius: 4 }
        }
    ]
    }
];
