
import { LibraryCategory } from '../../types';
import { LAYOUT_COMPONENTS } from './Layout/definitions';
import { NAVIGATION_COMPONENTS } from './Navigation/definitions';
import { BUTTON_COMPONENTS } from './Buttons/definitions';
import { FORM_COMPONENTS } from './Forms/definitions';
import { TYPOGRAPHY_COMPONENTS } from './Typography/definitions';
import { MEDIA_COMPONENTS } from './Media/definitions';

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { name: 'Layout & Containers', items: LAYOUT_COMPONENTS },
  { name: 'Navigation', items: NAVIGATION_COMPONENTS },
  { name: 'Buttons', items: BUTTON_COMPONENTS },
  { name: 'Forms & Inputs', items: FORM_COMPONENTS },
  { name: 'Typography', items: TYPOGRAPHY_COMPONENTS },
  { name: 'Icons & Media', items: MEDIA_COMPONENTS }
];
