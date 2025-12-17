
import { TemplateDefinition } from '../../../types';

export const PROFILE_TEMPLATES: TemplateDefinition[] = [
    {
    id: 'user-profile',
    name: 'User Profile',
    category: 'Profile',
    thumbnail: 'User',
    backgroundColor: '#ffffff',
    elements: [
       {
        type: 'container',
        name: 'Header BG',
        x: 0,
        y: 0,
        width: 375,
        height: 150,
        zIndex: 1,
        props: {},
        style: { backgroundColor: '#3b82f6' },
        interactions: []
      },
      {
        type: 'image',
        name: 'Avatar',
        x: 137,
        y: 100,
        width: 100,
        height: 100,
        zIndex: 2,
        props: { src: 'https://i.pravatar.cc/150' },
        style: { borderRadius: 50, borderWidth: 4, borderColor: '#ffffff' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Name',
        x: 0,
        y: 210,
        width: 375,
        height: 30,
        zIndex: 2,
        props: { text: 'Jane Doe' },
        style: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Bio',
        x: 40,
        y: 245,
        width: 295,
        height: 40,
        zIndex: 2,
        props: { text: 'Product Designer at Tech Co. Loves coffee and pixels.' },
        style: { fontSize: 14, color: '#64748b', textAlign: 'center' },
        interactions: []
      },
      {
        type: 'button',
        name: 'Edit Button',
        x: 110,
        y: 300,
        width: 155,
        height: 40,
        zIndex: 2,
        props: { text: 'Edit Profile' },
        style: { backgroundColor: '#fff', color: '#334155', borderRadius: 20, borderWidth: 1, borderColor: '#cbd5e1' },
        interactions: []
      }
    ]
  },
  {
    id: 'settings-screen',
    name: 'Settings',
    category: 'Profile',
    thumbnail: 'Settings',
    backgroundColor: '#f8fafc',
    elements: [
       {
        type: 'navbar',
        name: 'Nav',
        x: 0,
        y: 0,
        width: 375,
        height: 60,
        zIndex: 10,
        props: { title: 'Settings', leftIcon: 'ArrowLeft' },
        style: { backgroundColor: '#fff', shadow: true },
        interactions: []
      },
      {
        type: 'text',
        name: 'Section 1',
        x: 20,
        y: 80,
        width: 200,
        height: 20,
        zIndex: 1,
        props: { text: 'Account' },
        style: { fontSize: 12, fontWeight: 'bold', color: '#64748b',  },
        interactions: []
      },
      {
        type: 'container',
        name: 'Option 1',
        x: 0,
        y: 110,
        width: 375,
        height: 50,
        zIndex: 1,
        props: {},
        style: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Opt 1 Text',
        x: 20,
        y: 125,
        width: 200,
        height: 20,
        zIndex: 2,
        props: { text: 'Change Password' },
        style: { fontSize: 16 },
        interactions: []
      },
      {
        type: 'icon',
        name: 'Chevron',
        x: 340,
        y: 125,
        width: 20,
        height: 20,
        zIndex: 2,
        props: { iconName: 'ChevronRight' },
        style: { color: '#cbd5e1' },
        interactions: []
      },
       {
        type: 'container',
        name: 'Option 2',
        x: 0,
        y: 160,
        width: 375,
        height: 50,
        zIndex: 1,
        props: {},
        style: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9' },
        interactions: []
      },
       {
        type: 'text',
        name: 'Opt 2 Text',
        x: 20,
        y: 175,
        width: 200,
        height: 20,
        zIndex: 2,
        props: { text: 'Notifications' },
        style: { fontSize: 16 },
        interactions: []
      },
      {
        type: 'toggle',
        name: 'Notif Toggle',
        x: 310,
        y: 170,
        width: 50,
        height: 30,
        zIndex: 2,
        props: { checked: true },
        style: { backgroundColor: '#3b82f6', borderRadius: 15 },
        interactions: []
      }
    ]
  }
];
