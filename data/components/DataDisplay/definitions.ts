
import { LibraryItem } from '../../../types';

export const DATA_DISPLAY_COMPONENTS: LibraryItem[] = [
    {
        type: 'card',
        label: 'Simple Stat Card',
        icon: 'TrendingUp',
        defaultWidth: 160,
        defaultHeight: 100,
        defaultProps: { title: 'Active Users', subtitle: '12,450' },
        defaultStyle: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true, padding: 16 },
    },
    {
        type: 'group',
        label: 'User Detail Card',
        icon: 'User',
        defaultWidth: 280,
        defaultHeight: 320,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 280, height: 320, props: {}, style: { backgroundColor: '#fff', borderRadius: 24, shadow: true } },
            { type: 'container', name: 'Header', x: 0, y: 0, width: 280, height: 100, props: {}, style: { backgroundColor: '#4f46e5', borderTopLeftRadius: 24, borderTopRightRadius: 24 } },
            { type: 'circle', name: 'Avatar', x: 90, y: 50, width: 100, height: 100, props: {}, style: { backgroundColor: '#cbd5e1', borderWidth: 4, borderColor: '#fff' } },
            { type: 'text', name: 'Name', x: 0, y: 160, width: 280, height: 30, props: { text: 'Sarah Jenkins' }, style: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#1e293b' } },
            { type: 'text', name: 'Role', x: 0, y: 190, width: 280, height: 20, props: { text: 'Product Designer' }, style: { textAlign: 'center', fontSize: 14, color: '#64748b' } },
            { type: 'button', name: 'CTA', x: 60, y: 240, width: 160, height: 44, props: { text: 'Follow' }, style: { backgroundColor: '#4f46e5', color: '#fff', borderRadius: 22, fontWeight: 'bold' } }
        ]
    },
    {
        type: 'group',
        label: 'Pricing Tier',
        icon: 'CreditCard',
        defaultWidth: 300,
        defaultHeight: 400,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 300, height: 400, props: {}, style: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: '#4f46e5', shadow: true } },
            { type: 'text', name: 'Tier', x: 0, y: 30, width: 300, height: 30, props: { text: 'Professional' }, style: { textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase' } },
            { type: 'text', name: 'Price', x: 0, y: 60, width: 300, height: 60, props: { text: '$49/mo' }, style: { textAlign: 'center', fontSize: 40, fontWeight: '900', color: '#1e293b' } },
            { type: 'divider', name: 'D', x: 40, y: 130, width: 220, height: 1, props: {}, style: { backgroundColor: '#e2e8f0' } },
            { type: 'text', name: 'F1', x: 40, y: 150, width: 220, height: 24, props: { text: '✓ Unlimited Projects' }, style: { fontSize: 14, color: '#475569' } },
            { type: 'text', name: 'F2', x: 40, y: 180, width: 220, height: 24, props: { text: '✓ Priority Support' }, style: { fontSize: 14, color: '#475569' } },
            { type: 'text', name: 'F3', x: 40, y: 210, width: 220, height: 24, props: { text: '✓ Custom Domains' }, style: { fontSize: 14, color: '#475569' } },
            { type: 'button', name: 'Buy', x: 40, y: 320, width: 220, height: 50, props: { text: 'Get Started' }, style: { backgroundColor: '#4f46e5', color: '#fff', borderRadius: 8, fontWeight: 'bold' } }
        ]
    },
    {
        type: 'group',
        label: 'Notification Chip',
        icon: 'Bell',
        defaultWidth: 240,
        defaultHeight: 40,
        defaultProps: {},
        defaultStyle: { backgroundColor: 'transparent' },
        children: [
            { type: 'container', name: 'BG', x: 0, y: 0, width: 240, height: 40, props: {}, style: { backgroundColor: '#1e293b', borderRadius: 20 } },
            { type: 'circle', name: 'Dot', x: 12, y: 12, width: 16, height: 16, props: {}, style: { backgroundColor: '#10b981' } },
            { type: 'text', name: 'Msg', x: 40, y: 10, width: 180, height: 20, props: { text: 'Database is now online' }, style: { color: '#fff', fontSize: 12, fontWeight: 'medium' } }
        ]
    },
    {
        type: 'badge',
        label: 'Status Pill',
        icon: 'Tag',
        defaultWidth: 80,
        defaultHeight: 24,
        defaultProps: { text: 'Active' },
        defaultStyle: { backgroundColor: '#dcfce7', color: '#166534', borderRadius: 999, fontSize: 10, fontWeight: 'bold' }
    }
];
