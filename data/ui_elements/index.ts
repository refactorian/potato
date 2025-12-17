
import { ScreenImage } from '../../types';
import { LOCAL_NAVBAR_IMG, LOCAL_BUTTON_SET_IMG } from './images/placeholders';

export const UI_ELEMENTS: ScreenImage[] = [
  // Navigation
  {
    id: 'ui-nav-1',
    name: 'Modern Navbar',
    category: 'Navigation',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1493723843684-a63bc8419313?auto=format&fit=crop&q=80&w=600&h=150'
  },
  {
    id: 'ui-nav-2',
    name: 'App Header',
    category: 'Navigation',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600&h=150'
  },
  {
    id: 'ui-nav-3',
    name: 'Sidebar Menu',
    category: 'Navigation',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=300&h=600'
  },
  {
    id: 'ui-nav-4',
    name: 'Desktop Topbar',
    category: 'Navigation',
    screenType: 'desktop',
    src: 'https://images.unsplash.com/photo-1481487484168-9b930d55208d?auto=format&fit=crop&q=80&w=1000&h=150'
  },
  {
    id: 'ui-nav-local',
    name: 'Vector Header',
    category: 'Navigation',
    screenType: 'desktop',
    src: LOCAL_NAVBAR_IMG // Local import usage
  },

  // Buttons
  {
    id: 'ui-btn-1',
    name: 'Gradient Actions',
    category: 'Buttons',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'ui-btn-2',
    name: 'Tech Buttons',
    category: 'Buttons',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'ui-btn-3',
    name: 'Dark UI Buttons',
    category: 'Buttons',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1628258867550-bd46866f7f3d?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'ui-btn-local',
    name: 'Button Set',
    category: 'Buttons',
    screenType: 'desktop',
    src: LOCAL_BUTTON_SET_IMG // Local import usage
  },

  // Cards
  {
    id: 'ui-card-1',
    name: 'Product Card',
    category: 'Cards',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-card-2',
    name: 'Profile Card',
    category: 'Cards',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-card-3',
    name: 'News Card',
    category: 'Cards',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-card-4',
    name: 'Desktop Card',
    category: 'Cards',
    screenType: 'desktop',
    src: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800&h=400'
  },

  // Forms
  {
    id: 'ui-form-1',
    name: 'Login Form',
    category: 'Forms',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-form-2',
    name: 'Sign Up',
    category: 'Forms',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-form-3',
    name: 'Checklist',
    category: 'Forms',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=500&h=400'
  },

  // Widgets
  {
    id: 'ui-widget-1',
    name: 'Chart Widget',
    category: 'Widgets',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-widget-2',
    name: 'Analytics Graph',
    category: 'Widgets',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-widget-3',
    name: 'Stats Overview',
    category: 'Widgets',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500&h=400'
  },
  {
    id: 'ui-widget-4',
    name: 'Admin Widget',
    category: 'Widgets',
    screenType: 'desktop',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=400'
  }
];
