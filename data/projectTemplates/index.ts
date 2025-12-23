import { ProjectTemplate } from '../../types';
import { BLANK_STARTER_DATA } from './starter/blank.ts';
import { ECOMMERCE_STARTER_DATA } from './ecommerce/ecommerce.ts';

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'starter-blank',
    name: 'Starter Framework',
    description: 'Polished Midnight Slate foundation with 5 essential screens and functional navigation flows.',
    category: 'Starter Templates',
    tags: ['Mobile', 'Dark Mode', 'Framework', 'Interactive'],
    thumbnail: 'Layout',
    projectData: BLANK_STARTER_DATA as any
  },
  {
    id: 'ecommerce-deluxe',
    name: 'E-commerce Pro',
    description: 'Premium Midnight & Gold shopping experience. Features immersive product grids, cart logic, and payment screens.',
    category: 'Retail',
    tags: ['E-commerce', 'Dark Mode', 'High Fidelity', 'Luxury'],
    thumbnail: 'ShoppingBag',
    projectData: ECOMMERCE_STARTER_DATA as any
  }
];