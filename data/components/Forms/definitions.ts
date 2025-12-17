
import { LibraryItem } from '../../../types';

export const FORM_COMPONENTS: LibraryItem[] = [
    {
        type: 'group',
        label: 'Search Bar',
        icon: 'Search',
        defaultWidth: 320,
        defaultHeight: 44,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'input', name: 'In', x: 0, y: 0, width: 320, height: 44, props: { placeholder: 'Search anything...' }, style: { backgroundColor: '#f1f5f9', borderRadius: 22, padding: '0 16px 0 44px', borderWidth: 0 } },
            { type: 'icon', name: 'Ic', x: 14, y: 10, width: 24, height: 24, props: { iconName: 'Search' }, style: { color: '#94a3b8' } }
        ]
    },
    {
        type: 'group',
        label: 'Icon Input Field',
        icon: 'User',
        defaultWidth: 320,
        defaultHeight: 50,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 320, height: 50, props: {}, style: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' } },
            { type: 'icon', name: 'Ic', x: 12, y: 13, width: 24, height: 24, props: { iconName: 'User' }, style: { color: '#94a3b8' } },
            { type: 'input', name: 'Field', x: 44, y: 1, width: 275, height: 48, props: { placeholder: 'Username' }, style: { backgroundColor: 'transparent', borderWidth: 0 } }
        ]
    },
    {
        type: 'toggle',
        label: 'iOS Switch',
        icon: 'ToggleRight',
        defaultWidth: 52,
        defaultHeight: 31,
        defaultProps: { checked: true },
        defaultStyle: { backgroundColor: '#34c759' },
    },
    {
        type: 'textarea',
        label: 'Multi-line Input',
        icon: 'AlignLeft',
        defaultWidth: 320,
        defaultHeight: 120,
        defaultProps: { placeholder: 'Start typing...' },
        defaultStyle: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 8, padding: 12 },
    }
];
