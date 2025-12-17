
import { TemplateDefinition } from '../../types';

const WIREFRAME_STYLE = {
    borderColor: '#000000',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: 4
};

const TEXT_STYLE = {
    color: '#000000',
    fontFamily: 'monospace', // Monospace gives a more technical/wireframe feel
    backgroundColor: 'transparent'
};

const PLACEHOLDER_BG = '#e5e7eb';

export const WIREFRAME_TEMPLATES: TemplateDefinition[] = [
  // --- LISTS CATEGORY ---
  {
    id: 'wf-mobile-list',
    name: 'List View (Mobile)',
    category: 'Lists',
    thumbnail: 'List',
    backgroundColor: '#ffffff',
    elements: [
      // Header
      {
        type: 'container', name: 'Header', x: 0, y: 0, width: 375, height: 60, zIndex: 10,
        props: {}, style: { ...WIREFRAME_STYLE, borderBottomWidth: 2, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 },
        interactions: []
      },
      {
        type: 'icon', name: 'Menu Icon', x: 20, y: 18, width: 24, height: 24, zIndex: 11,
        props: { iconName: 'Menu' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'text', name: 'App Name', x: 130, y: 18, width: 115, height: 24, zIndex: 11,
        props: { text: 'GymPro' }, style: { ...TEXT_STYLE, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
        interactions: []
      },
      {
        type: 'icon', name: 'Notif Icon', x: 330, y: 18, width: 24, height: 24, zIndex: 11,
        props: { iconName: 'Bell' }, style: { color: '#000' },
        interactions: []
      },
      
      // Filter Row
      {
        type: 'text', name: 'Label', x: 20, y: 80, width: 200, height: 20, zIndex: 1,
        props: { text: 'Select program' }, style: { ...TEXT_STYLE, fontSize: 14 },
        interactions: []
      },
      {
        type: 'container', name: 'Filter 1', x: 20, y: 110, width: 40, height: 40, zIndex: 1,
        props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 20, borderWidth: 2 },
        interactions: []
      },
      {
        type: 'icon', name: 'Icon 1', x: 28, y: 118, width: 24, height: 24, zIndex: 2,
        props: { iconName: 'Dumbbell' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'container', name: 'Filter 2', x: 70, y: 110, width: 40, height: 40, zIndex: 1,
        props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 20, borderWidth: 2, borderColor: '#cbd5e1' },
        interactions: []
      },
      {
        type: 'container', name: 'Filter 3', x: 120, y: 110, width: 40, height: 40, zIndex: 1,
        props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 20, borderWidth: 2, borderColor: '#cbd5e1' },
        interactions: []
      },
      {
        type: 'container', name: 'Filter 4', x: 170, y: 110, width: 40, height: 40, zIndex: 1,
        props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 20, borderWidth: 2, borderColor: '#cbd5e1' },
        interactions: []
      },

      // List Item 1
      {
        type: 'container', name: 'Card 1', x: 20, y: 170, width: 335, height: 100, zIndex: 1,
        props: {}, style: { ...WIREFRAME_STYLE },
        interactions: []
      },
      {
        type: 'container', name: 'Avatar 1', x: 35, y: 185, width: 50, height: 50, zIndex: 2,
        props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 25 },
        interactions: []
      },
      {
        type: 'icon', name: 'Icon Av 1', x: 48, y: 198, width: 24, height: 24, zIndex: 3,
        props: { iconName: 'Dumbbell' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'text', name: 'Title 1', x: 100, y: 185, width: 200, height: 20, zIndex: 2,
        props: { text: 'Strength Class' }, style: { ...TEXT_STYLE, fontSize: 16, fontWeight: 'bold' },
        interactions: []
      },
      {
        type: 'text', name: 'Time 1', x: 100, y: 215, width: 200, height: 16, zIndex: 2,
        props: { text: '8:30AM - 9:30AM' }, style: { ...TEXT_STYLE, fontSize: 12 },
        interactions: []
      },
      
      // List Item 2
      {
        type: 'container', name: 'Card 2', x: 20, y: 290, width: 335, height: 100, zIndex: 1,
        props: {}, style: { ...WIREFRAME_STYLE },
        interactions: []
      },
      {
        type: 'container', name: 'Avatar 2', x: 35, y: 305, width: 50, height: 50, zIndex: 2,
        props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 25 },
        interactions: []
      },
      {
        type: 'icon', name: 'Icon Av 2', x: 48, y: 318, width: 24, height: 24, zIndex: 3,
        props: { iconName: 'Dumbbell' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'text', name: 'Title 2', x: 100, y: 305, width: 200, height: 20, zIndex: 2,
        props: { text: 'Cardio Blast' }, style: { ...TEXT_STYLE, fontSize: 16, fontWeight: 'bold' },
        interactions: []
      },
      {
        type: 'text', name: 'Time 2', x: 100, y: 335, width: 200, height: 16, zIndex: 2,
        props: { text: '10:00AM - 11:00AM' }, style: { ...TEXT_STYLE, fontSize: 12 },
        interactions: []
      },

      // Footer Nav
      {
        type: 'container', name: 'Footer', x: 0, y: 732, width: 375, height: 80, zIndex: 10,
        props: {}, style: { ...WIREFRAME_STYLE, borderTopWidth: 2, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 },
        interactions: []
      },
      {
        type: 'icon', name: 'Home', x: 40, y: 750, width: 24, height: 24, zIndex: 11,
        props: { iconName: 'Home' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'icon', name: 'Cal', x: 130, y: 750, width: 24, height: 24, zIndex: 11,
        props: { iconName: 'Calendar' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'icon', name: 'List', x: 220, y: 750, width: 24, height: 24, zIndex: 11,
        props: { iconName: 'List' }, style: { color: '#000' },
        interactions: []
      },
      {
        type: 'icon', name: 'User', x: 310, y: 750, width: 24, height: 24, zIndex: 11,
        props: { iconName: 'User' }, style: { color: '#000' },
        interactions: []
      },
    ]
  },

  // --- AUTH CATEGORY ---
  {
    id: 'wf-mobile-auth',
    name: 'Login Wireframe',
    category: 'Auth',
    thumbnail: 'LogIn',
    backgroundColor: '#ffffff',
    elements: [
        {
            type: 'container', name: 'Logo Box', x: 137, y: 100, width: 100, height: 100, zIndex: 1,
            props: {}, style: { ...WIREFRAME_STYLE, backgroundColor: PLACEHOLDER_BG },
            interactions: []
        },
        {
            type: 'icon', name: 'X Icon', x: 137, y: 100, width: 100, height: 100, zIndex: 2,
            props: { iconName: 'X' }, style: { color: '#9ca3af', strokeWidth: 1 },
            interactions: []
        },
        {
            type: 'text', name: 'Title', x: 87, y: 220, width: 200, height: 30, zIndex: 1,
            props: { text: 'LOG IN' }, style: { ...TEXT_STYLE, fontSize: 24, textAlign: 'center', fontWeight: 'bold' },
            interactions: []
        },
        {
            type: 'input', name: 'Email Input', x: 37, y: 300, width: 300, height: 50, zIndex: 1,
            props: { placeholder: 'Email Address' }, style: { ...WIREFRAME_STYLE, backgroundColor: '#fff', color: '#000' },
            interactions: []
        },
        {
            type: 'input', name: 'Pass Input', x: 37, y: 370, width: 300, height: 50, zIndex: 1,
            props: { placeholder: 'Password' }, style: { ...WIREFRAME_STYLE, backgroundColor: '#fff', color: '#000' },
            interactions: []
        },
        {
            type: 'button', name: 'Login Btn', x: 37, y: 450, width: 300, height: 50, zIndex: 1,
            props: { text: 'SUBMIT' }, style: { backgroundColor: '#000000', color: '#ffffff', borderRadius: 4, borderWidth: 0, fontSize: 16 },
            interactions: []
        },
        {
            type: 'text', name: 'Forgot', x: 37, y: 520, width: 300, height: 20, zIndex: 1,
            props: { text: 'Forgot Password?' }, style: { ...TEXT_STYLE, fontSize: 14, textAlign: 'center', textDecoration: 'underline' },
            interactions: []
        }
    ]
  },

  // --- DASHBOARD CATEGORY ---
  {
    id: 'wf-desktop-dash',
    name: 'Dashboard (Desktop)',
    category: 'Dashboard',
    thumbnail: 'LayoutDashboard',
    backgroundColor: '#ffffff',
    elements: [
        {
            type: 'container', name: 'Sidebar', x: 0, y: 0, width: 250, height: 800, zIndex: 10,
            props: {}, style: { ...WIREFRAME_STYLE, borderRightWidth: 2, borderTopWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderRadius: 0 },
            interactions: []
        },
        {
            type: 'circle', name: 'User Icon', x: 20, y: 40, width: 50, height: 50, zIndex: 11,
            props: {}, style: { ...WIREFRAME_STYLE, borderRadius: 25, backgroundColor: PLACEHOLDER_BG },
            interactions: []
        },
        {
            type: 'text', name: 'User Name', x: 80, y: 55, width: 150, height: 20, zIndex: 11,
            props: { text: 'Admin User' }, style: { ...TEXT_STYLE, fontSize: 16, fontWeight: 'bold' },
            interactions: []
        },
        {
            type: 'container', name: 'Nav Item 1', x: 20, y: 120, width: 210, height: 40, zIndex: 11,
            props: {}, style: { ...WIREFRAME_STYLE, backgroundColor: PLACEHOLDER_BG, borderWidth: 0 },
            interactions: []
        },
        {
            type: 'container', name: 'Nav Item 2', x: 20, y: 170, width: 210, height: 40, zIndex: 11,
            props: {}, style: { ...WIREFRAME_STYLE, borderWidth: 1 },
            interactions: []
        },
        // Top Bar
        {
            type: 'container', name: 'Top Bar', x: 250, y: 0, width: 1030, height: 80, zIndex: 5,
            props: {}, style: { ...WIREFRAME_STYLE, borderBottomWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderRadius: 0 },
            interactions: []
        },
        {
            type: 'text', name: 'Page Title', x: 280, y: 30, width: 200, height: 30, zIndex: 6,
            props: { text: 'Overview' }, style: { ...TEXT_STYLE, fontSize: 24, fontWeight: 'bold' },
            interactions: []
        },
        // Cards
        {
            type: 'container', name: 'Stat 1', x: 280, y: 110, width: 300, height: 150, zIndex: 1,
            props: {}, style: { ...WIREFRAME_STYLE },
            interactions: []
        },
        {
            type: 'container', name: 'Stat 2', x: 610, y: 110, width: 300, height: 150, zIndex: 1,
            props: {}, style: { ...WIREFRAME_STYLE },
            interactions: []
        },
        {
            type: 'container', name: 'Stat 3', x: 940, y: 110, width: 300, height: 150, zIndex: 1,
            props: {}, style: { ...WIREFRAME_STYLE },
            interactions: []
        },
        // Big Chart
        {
            type: 'container', name: 'Main Chart', x: 280, y: 290, width: 960, height: 400, zIndex: 1,
            props: {}, style: { ...WIREFRAME_STYLE },
            interactions: []
        },
        {
            type: 'container', name: 'Chart Line', x: 300, y: 450, width: 920, height: 2, zIndex: 2,
            props: {}, style: { backgroundColor: '#000' },
            interactions: []
        },
        {
            type: 'icon', name: 'ZigZag', x: 300, y: 350, width: 920, height: 200, zIndex: 2,
            props: { iconName: 'Activity' }, style: { color: '#cbd5e1', strokeWidth: 1 },
            interactions: []
        }
    ]
  }
];
