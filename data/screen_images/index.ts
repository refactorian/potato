
import { ScreenImage } from '../../types';
import { LOCAL_DASHBOARD_IMG, LOCAL_MOBILE_HOME_IMG } from './images/placeholders';

export const SCREEN_IMAGES: ScreenImage[] = [
  // Home Category
  {
    id: 'img-home-1',
    name: 'Modern Home',
    category: 'Home',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=400&h=800'
  },
  {
    id: 'img-home-2',
    name: 'Clean Feed',
    category: 'Home',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400&h=800'
  },
  {
    id: 'img-home-3',
    name: 'Desktop Dashboard',
    category: 'Home',
    screenType: 'desktop',
    src: 'https://images.unsplash.com/photo-1481487484168-9b930d55208d?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'img-home-local',
    name: 'Local Dark Home',
    category: 'Home',
    screenType: 'mobile',
    src: LOCAL_MOBILE_HOME_IMG // Local import usage
  },

  // Dashboard Category
  {
    id: 'img-dash-1',
    name: 'Analytics Dark',
    category: 'Dashboard',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=800'
  },
  {
    id: 'img-dash-2',
    name: 'Finance Light',
    category: 'Dashboard',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=800'
  },
  {
    id: 'img-dash-3',
    name: 'SaaS Overview',
    category: 'Dashboard',
    screenType: 'desktop',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'img-dash-local',
    name: 'Vector Dashboard',
    category: 'Dashboard',
    screenType: 'desktop',
    src: LOCAL_DASHBOARD_IMG // Local import usage
  },

  // Profile Category
  {
    id: 'img-profile-1',
    name: 'User Details',
    category: 'Profile',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=800'
  },
  {
    id: 'img-profile-2',
    name: 'Settings List',
    category: 'Profile',
    screenType: 'mobile',
    src: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=400&h=800'
  },
  {
    id: 'img-profile-3',
    name: 'Tablet Profile',
    category: 'Profile',
    screenType: 'tablet',
    src: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=800&h=1000'
  }
];
