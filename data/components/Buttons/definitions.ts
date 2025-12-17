
import { LibraryItem } from '../../../types';

export const BUTTON_COMPONENTS: LibraryItem[] = [
    {
    type: 'button',
    label: 'Primary Solid',
    icon: 'MousePointerClick',
    defaultWidth: 160,
    defaultHeight: 48,
    defaultProps: { text: 'Primary Button' },
    defaultStyle: { backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: 8, fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
    },
    {
    type: 'button',
    label: 'Secondary Soft',
    icon: 'MousePointer2',
    defaultWidth: 160,
    defaultHeight: 48,
    defaultProps: { text: 'Secondary' },
    defaultStyle: { backgroundColor: '#eef2ff', color: '#4338ca', borderRadius: 8, fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
    },
    {
    type: 'button',
    label: 'Ghost Button',
    icon: 'Ghost',
    defaultWidth: 160,
    defaultHeight: 48,
    defaultProps: { text: 'Ghost Button' },
    defaultStyle: { backgroundColor: 'transparent', color: '#475569', borderRadius: 8, fontSize: 14, textAlign: 'center' },
    },
    {
    type: 'button',
    label: 'Outline Primary',
    icon: 'SquareDashed',
    defaultWidth: 160,
    defaultHeight: 48,
    defaultProps: { text: 'Learn More' },
    defaultStyle: { backgroundColor: 'transparent', color: '#4f46e5', borderRadius: 8, borderWidth: 2, borderColor: '#4f46e5', fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
    },
    {
    type: 'button',
    label: 'Destructive',
    icon: 'AlertTriangle',
    defaultWidth: 160,
    defaultHeight: 48,
    defaultProps: { text: 'Delete' },
    defaultStyle: { backgroundColor: '#ef4444', color: '#ffffff', borderRadius: 8, fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
    },
    {
    type: 'button',
    label: 'Icon Leading',
    icon: 'ArrowRightSquare',
    defaultWidth: 180,
    defaultHeight: 48,
    defaultProps: { text: 'Continue', icon: 'ArrowRight' },
    defaultStyle: { backgroundColor: '#10b981', color: '#ffffff', borderRadius: 8, fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
    },
    {
    type: 'circle',
    label: 'FAB / Action Circle',
    icon: 'PlusCircle',
    defaultWidth: 56,
    defaultHeight: 56,
    defaultProps: {},
    defaultStyle: { backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: 28, shadow: true },
    },
    {
    type: 'badge',
    label: 'Status Badge',
    icon: 'Tag',
    defaultWidth: 80,
    defaultHeight: 24,
    defaultProps: { text: 'Active' },
    defaultStyle: { backgroundColor: '#dcfce7', color: '#166534', borderRadius: 999, fontSize: 10, fontWeight: 'bold' },
    },
    {
    type: 'group',
    label: 'Button Group',
    icon: 'Rows',
    defaultWidth: 200,
    defaultHeight: 40,
    defaultProps: {},
    defaultStyle: { backgroundColor: 'transparent' },
    children: [
        {
            type: 'button', name: 'Left', x: 0, y: 0, width: 100, height: 40,
            props: { text: 'Left' }, style: { backgroundColor: '#fff', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 12 }
        },
        {
            type: 'button', name: 'Right', x: 100, y: 0, width: 100, height: 40,
            props: { text: 'Right' }, style: { backgroundColor: '#fff', borderTopRightRadius: 8, borderBottomRightRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 12, borderLeftWidth: 0 }
        }
    ]
    }
];
