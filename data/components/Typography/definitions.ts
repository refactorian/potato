
import { LibraryItem } from '../../../types';

export const TYPOGRAPHY_COMPONENTS: LibraryItem[] = [
    {
    type: 'text',
    label: 'Display Title',
    icon: 'Heading1',
    defaultWidth: 350,
    defaultHeight: 60,
    defaultProps: { text: 'Welcome.' },
    defaultStyle: { color: '#0f172a', fontSize: 48, textAlign: 'left', fontWeight: 'bold', backgroundColor: 'transparent' },
    },
    {
    type: 'text',
    label: 'Heading 2',
    icon: 'Heading2',
    defaultWidth: 300,
    defaultHeight: 40,
    defaultProps: { text: 'Section Title' },
    defaultStyle: { color: '#334155', fontSize: 24, textAlign: 'left', fontWeight: 'bold', backgroundColor: 'transparent' },
    },
    {
    type: 'text',
    label: 'Heading 3',
    icon: 'Heading3',
    defaultWidth: 250,
    defaultHeight: 30,
    defaultProps: { text: 'Subsection' },
    defaultStyle: { color: '#334155', fontSize: 20, textAlign: 'left', fontWeight: 'bold', backgroundColor: 'transparent' },
    },
    {
    type: 'text',
    label: 'Body Text',
    icon: 'Pilcrow',
    defaultWidth: 320,
    defaultHeight: 100,
    defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    defaultStyle: { color: '#475569', fontSize: 16, textAlign: 'left', backgroundColor: 'transparent' },
    },
    {
    type: 'text',
    label: 'Label / Caption',
    icon: 'Type',
    defaultWidth: 100,
    defaultHeight: 20,
    defaultProps: { text: 'Form Label' },
    defaultStyle: { color: '#64748b', fontSize: 12, textAlign: 'left', fontWeight: 'bold', backgroundColor: 'transparent' },
    },
    {
    type: 'text',
    label: 'Link',
    icon: 'Link',
    defaultWidth: 100,
    defaultHeight: 24,
    defaultProps: { text: 'Read more' },
    defaultStyle: { color: '#3b82f6', fontSize: 14, textAlign: 'left', backgroundColor: 'transparent' },
    },
];
