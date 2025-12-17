
import { TemplateDefinition } from '../../types';
import { AUTH_TEMPLATES } from './Auth/definitions';
import { DASHBOARD_TEMPLATES } from './Dashboard/definitions';
import { PROFILE_TEMPLATES } from './Profile/definitions';
import { ECOMMERCE_TEMPLATES } from './Ecommerce/definitions';

export const TEMPLATES: TemplateDefinition[] = [
  ...AUTH_TEMPLATES,
  ...DASHBOARD_TEMPLATES,
  ...PROFILE_TEMPLATES,
  ...ECOMMERCE_TEMPLATES
];
