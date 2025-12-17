
import { ProjectTemplate } from '../../types';
import { ECOMMERCE_TEMPLATES } from '../templates/Ecommerce/definitions';

export const ECOMMERCE_PROJECT_TEMPLATE: ProjectTemplate = {
  id: 'ecommerce-starter',
  name: 'E-commerce App',
  description: 'A complete e-commerce flow including Shop, Details, Cart, Checkout, and Profile screens.',
  thumbnail: 'ShoppingBag',
  projectData: {
    projectType: 'mobile',
    tags: ['E-commerce', 'Shopping', 'App', 'Retail', 'Mobile'],
    viewportWidth: 375,
    viewportHeight: 812,
    activeScreenId: 'screen-1',
    assets: [],
    screenGroups: [
        { id: 'group-shop', name: 'Shopping Flow', collapsed: false },
        { id: 'group-user', name: 'User Account', collapsed: false }
    ],
    gridConfig: {
      visible: false,
      size: 10,
      color: '#cbd5e1',
      snapToGrid: true,
    },
    screens: [
      {
        id: 'screen-1',
        name: 'Shop Home',
        groupId: 'group-shop',
        backgroundColor: '#0f172a',
        elements: ECOMMERCE_TEMPLATES.find(t => t.id === 'product-list')?.elements.map((el, i) => ({
            ...el,
            id: `el-home-${i}`,
            interactions: [
                { id: `int-home-${i}`, trigger: 'onClick', action: 'navigate', payload: 'screen-2' }
            ]
        })) || []
      },
      {
        id: 'screen-2',
        name: 'Product Details',
        groupId: 'group-shop',
        backgroundColor: '#0f172a',
        elements: ECOMMERCE_TEMPLATES.find(t => t.id === 'product-detail')?.elements.map((el, i) => ({
            ...el,
            id: `el-detail-${i}`,
            interactions: el.type === 'icon' && el.props.iconName === 'ArrowLeft' ? [
                 { id: `int-back-${i}`, trigger: 'onClick', action: 'navigate', payload: 'screen-1' }
            ] : el.type === 'button' ? [
                 { id: `int-cart-${i}`, trigger: 'onClick', action: 'navigate', payload: 'screen-3' }
            ] : []
        })) || []
      },
      {
        id: 'screen-3',
        name: 'Shopping Cart',
        groupId: 'group-shop',
        backgroundColor: '#0f172a',
        elements: ECOMMERCE_TEMPLATES.find(t => t.id === 'shopping-cart')?.elements.map((el, i) => ({
            ...el,
            id: `el-cart-${i}`,
            interactions: el.type === 'button' ? [
                 { id: `int-chk-${i}`, trigger: 'onClick', action: 'navigate', payload: 'screen-4' }
            ] : el.props.iconName === 'ArrowLeft' ? [
                 { id: `int-back-cart-${i}`, trigger: 'onClick', action: 'navigate', payload: 'screen-2' }
            ] : []
        })) || []
      },
      {
        id: 'screen-4',
        name: 'Checkout',
        groupId: 'group-shop',
        backgroundColor: '#0f172a',
        elements: ECOMMERCE_TEMPLATES.find(t => t.id === 'checkout')?.elements.map((el, i) => ({
            ...el,
            id: `el-chk-${i}`,
            interactions: el.type === 'button' ? [
                 { id: `int-pay-${i}`, trigger: 'onClick', action: 'alert', payload: 'Payment Processed!' }
            ] : el.props.iconName === 'ArrowLeft' ? [
                 { id: `int-back-chk-${i}`, trigger: 'onClick', action: 'navigate', payload: 'screen-3' }
            ] : []
        })) || []
      },
      {
        id: 'screen-5',
        name: 'My Profile',
        groupId: 'group-user',
        backgroundColor: '#0f172a',
        elements: ECOMMERCE_TEMPLATES.find(t => t.id === 'user-profile-ecommerce')?.elements.map((el, i) => ({
            ...el,
            id: `el-prof-${i}`,
            interactions: []
        })) || []
      }
    ],
  }
};
