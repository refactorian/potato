
import { LibraryItem } from '../../../types';

export const FEEDBACK_COMPONENTS: LibraryItem[] = [
    {
        type: 'group',
        label: 'Success Toast',
        icon: 'CheckCircle',
        defaultWidth: 320,
        defaultHeight: 56,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 320, height: 56, props: {}, style: { backgroundColor: '#fff', borderRadius: 12, shadow: true, borderWidth: 1, borderColor: '#bbf7d0' } },
            { type: 'icon', name: 'I', x: 16, y: 16, width: 24, height: 24, props: { iconName: 'CheckCircle' }, style: { color: '#16a34a' } },
            { type: 'text', name: 'T', x: 52, y: 18, width: 240, height: 20, props: { text: 'Payment successful!' }, style: { fontSize: 14, fontWeight: 'bold', color: '#166534' } }
        ]
    },
    {
        type: 'group',
        label: 'Step Indicator',
        icon: 'ListOrdered',
        defaultWidth: 300,
        defaultHeight: 40,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'circle', name: 'S1', x: 0, y: 0, width: 24, height: 24, props: {}, style: { backgroundColor: '#4f46e5' } },
            { type: 'divider', name: 'D1', x: 24, y: 11, width: 60, height: 2, props: {}, style: { backgroundColor: '#4f46e5' } },
            { type: 'circle', name: 'S2', x: 84, y: 0, width: 24, height: 24, props: {}, style: { backgroundColor: '#4f46e5' } },
            { type: 'divider', name: 'D2', x: 108, y: 11, width: 60, height: 2, props: {}, style: { backgroundColor: '#e2e8f0' } },
            { type: 'circle', name: 'S3', x: 168, y: 0, width: 24, height: 24, props: {}, style: { backgroundColor: '#e2e8f0' } }
        ]
    },
    {
        type: 'group',
        label: 'Empty State Placeholder',
        icon: 'Inbox',
        defaultWidth: 300,
        defaultHeight: 200,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'icon', name: 'I', x: 125, y: 20, width: 50, height: 50, props: { iconName: 'Search' }, style: { color: '#cbd5e1' } },
            { type: 'text', name: 'T', x: 0, y: 80, width: 300, height: 30, props: { text: 'No Results Found' }, style: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#64748b' } },
            { type: 'text', name: 'D', x: 20, y: 110, width: 260, height: 40, props: { text: 'Try searching for another keyword or adjust your filters.' }, style: { textAlign: 'center', fontSize: 14, color: '#94a3b8' } }
        ]
    },
    {
        type: 'container',
        label: 'Circular Progress',
        icon: 'Loader2',
        defaultWidth: 60,
        defaultHeight: 60,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent', borderRadius: 30, borderWidth: 4, borderColor: '#eef2ff', borderTopColor: '#4f46e5' }
    }
];
