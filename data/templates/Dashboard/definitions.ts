
import { TemplateDefinition } from '../../../types';

export const DASHBOARD_TEMPLATES: TemplateDefinition[] = [
    {
    id: 'dashboard-mobile',
    name: 'Dashboard (Mobile)',
    category: 'Dashboard',
    thumbnail: 'Smartphone',
    backgroundColor: '#ffffff',
    elements: [
      {
        type: 'navbar',
        name: 'Top Nav',
        x: 0,
        y: 0,
        width: 375,
        height: 60,
        zIndex: 10,
        props: { title: 'Dashboard' },
        style: { backgroundColor: '#fff', shadow: true, color: '#000', textAlign: 'center' },
        interactions: []
      },
      {
        type: 'card',
        name: 'Stats Card 1',
        x: 20,
        y: 80,
        width: 160,
        height: 120,
        zIndex: 1,
        props: { title: 'Users', subtitle: '1,234' },
        style: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Stats Card 2',
        x: 195,
        y: 80,
        width: 160,
        height: 120,
        zIndex: 1,
        props: { title: 'Revenue', subtitle: '$45k' },
        style: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
        interactions: []
      },
      {
        type: 'image',
        name: 'Chart',
        x: 20,
        y: 220,
        width: 335,
        height: 200,
        zIndex: 2,
        props: { src: 'https://picsum.photos/400/200' },
        style: { borderRadius: 8, backgroundColor: '#eee' },
        interactions: []
      }
    ]
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics (Mobile)',
    category: 'Dashboard',
    thumbnail: 'BarChart',
    backgroundColor: '#f8fafc',
    elements: [
      {
        type: 'text',
        name: 'Header',
        x: 20,
        y: 20,
        width: 200,
        height: 30,
        zIndex: 1,
        props: { text: 'Analytics' },
        style: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
        interactions: []
      },
      {
        type: 'container',
        name: 'Graph Area',
        x: 20,
        y: 70,
        width: 335,
        height: 250,
        zIndex: 1,
        props: {},
        style: { backgroundColor: '#fff', borderRadius: 12, shadow: true, borderColor: '#e2e8f0', borderWidth: 1 },
        interactions: []
      },
      {
        type: 'text',
        name: 'Visitors',
        x: 35,
        y: 90,
        width: 100,
        height: 20,
        zIndex: 2,
        props: { text: 'Visitors' },
        style: { fontSize: 14, color: '#64748b' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Visitor Count',
        x: 35,
        y: 110,
        width: 150,
        height: 40,
        zIndex: 2,
        props: { text: '24.5k' },
        style: { fontSize: 32, fontWeight: 'bold', color: '#0f172a' },
        interactions: []
      },
      {
        type: 'image',
        name: 'Graph Image',
        x: 35,
        y: 160,
        width: 305,
        height: 140,
        zIndex: 2,
        props: { src: 'https://picsum.photos/305/140' },
        style: { borderRadius: 8, opacity: 0.8 },
        interactions: []
      }
    ]
  },
  {
    id: 'dashboard-desktop',
    name: 'Dashboard (Desktop)',
    category: 'Dashboard',
    thumbnail: 'Monitor',
    backgroundColor: '#f1f5f9',
    elements: [
       {
        type: 'container',
        name: 'Sidebar',
        x: 0,
        y: 0,
        width: 260,
        height: 800,
        zIndex: 10,
        props: {},
        style: { backgroundColor: '#0f172a', borderRadius: 0 },
        interactions: []
      },
      {
        type: 'text',
        name: 'Logo',
        x: 30,
        y: 30,
        width: 150,
        height: 40,
        zIndex: 11,
        props: { text: 'Admin Panel' },
        style: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
        interactions: []
      },
      {
        type: 'navbar',
        name: 'Top Header',
        x: 260,
        y: 0,
        width: 1020,
        height: 70,
        zIndex: 5,
        props: { title: 'Overview', rightIcon: 'Bell' },
        style: { backgroundColor: '#ffffff', shadow: true, padding: 30, textAlign: 'left', fontSize: 18 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Stat 1',
        x: 290,
        y: 100,
        width: 220,
        height: 140,
        zIndex: 1,
        props: { title: 'Total Revenue', subtitle: '$120,400' },
        style: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true, padding: 20 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Stat 2',
        x: 530,
        y: 100,
        width: 220,
        height: 140,
        zIndex: 1,
        props: { title: 'Active Users', subtitle: '3,450' },
        style: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true, padding: 20 },
        interactions: []
      },
       {
        type: 'card',
        name: 'Stat 3',
        x: 770,
        y: 100,
        width: 220,
        height: 140,
        zIndex: 1,
        props: { title: 'New Orders', subtitle: '432' },
        style: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true, padding: 20 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Main Chart',
        x: 290,
        y: 260,
        width: 700,
        height: 400,
        zIndex: 1,
        props: { title: 'Performance', subtitle: 'Last 30 days' },
        style: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true, padding: 20 },
        interactions: []
      }
    ]
  }
];
