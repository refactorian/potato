
import { TemplateDefinition } from '../../../types';

export const ECOMMERCE_TEMPLATES: TemplateDefinition[] = [
    {
    id: 'product-list',
    name: 'Shop (Mobile)',
    category: 'Ecommerce',
    thumbnail: 'ShoppingBag',
    backgroundColor: '#0f172a',
    elements: [
      {
        type: 'navbar',
        name: 'Nav',
        x: 0,
        y: 0,
        width: 375,
        height: 60,
        zIndex: 10,
        props: { title: 'Shop', rightIcon: 'ShoppingCart' },
        style: { backgroundColor: '#1e293b', shadow: true, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'card',
        name: 'Prod 1',
        x: 16,
        y: 80,
        width: 165,
        height: 220,
        zIndex: 1,
        props: { title: 'T-Shirt', subtitle: '$25.00' },
        style: { backgroundColor: '#1e293b', borderRadius: 8, padding: 10, color: '#f8fafc' },
        interactions: []
      },
       {
        type: 'image',
        name: 'Img 1',
        x: 26,
        y: 90,
        width: 145,
        height: 140,
        zIndex: 2,
        props: { src: 'https://picsum.photos/150/150' },
        style: { borderRadius: 4 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Prod 2',
        x: 194,
        y: 80,
        width: 165,
        height: 220,
        zIndex: 1,
        props: { title: 'Sneakers', subtitle: '$80.00' },
        style: { backgroundColor: '#1e293b', borderRadius: 8, padding: 10, color: '#f8fafc' },
        interactions: []
      },
       {
        type: 'image',
        name: 'Img 2',
        x: 204,
        y: 90,
        width: 145,
        height: 140,
        zIndex: 2,
        props: { src: 'https://picsum.photos/150/151' },
        style: { borderRadius: 4 },
        interactions: []
      },
    ]
  },
  {
    id: 'product-detail',
    name: 'Product Detail (Mobile)',
    category: 'Ecommerce',
    thumbnail: 'Tag',
    backgroundColor: '#0f172a',
    elements: [
       {
        type: 'image',
        name: 'Hero Img',
        x: 0,
        y: 0,
        width: 375,
        height: 300,
        zIndex: 1,
        props: { src: 'https://picsum.photos/400/400' },
        style: { borderRadius: 0 },
        interactions: []
      },
      {
        type: 'icon',
        name: 'Back',
        x: 20,
        y: 40,
        width: 40,
        height: 40,
        zIndex: 2,
        props: { iconName: 'ArrowLeft' },
        style: { backgroundColor: '#1e293b', borderRadius: 20, shadow: true, padding: 8, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Title',
        x: 20,
        y: 320,
        width: 335,
        height: 30,
        zIndex: 1,
        props: { text: 'Modern Chair' },
        style: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Price',
        x: 20,
        y: 355,
        width: 100,
        height: 30,
        zIndex: 1,
        props: { text: '$149.00' },
        style: { fontSize: 20, color: '#818cf8', fontWeight: 'bold' },
        interactions: []
      },
      {
        type: 'text',
        name: 'Desc',
        x: 20,
        y: 390,
        width: 335,
        height: 80,
        zIndex: 1,
        props: { text: 'Ergonomic design with premium materials. Perfect for your home office or living room.' },
        style: { fontSize: 16, color: '#94a3b8', lineHeight: 1.5 },
        interactions: []
      },
      {
        type: 'button',
        name: 'Add Cart',
        x: 20,
        y: 500,
        width: 335,
        height: 50,
        zIndex: 1,
        props: { text: 'Add to Cart' },
        style: { backgroundColor: '#3b82f6', color: '#fff', borderRadius: 25 },
        interactions: []
      }
    ]
  },
  {
    id: 'shopping-cart',
    name: 'Cart (Mobile)',
    category: 'Ecommerce',
    thumbnail: 'ShoppingCart',
    backgroundColor: '#0f172a',
    elements: [
        {
            type: 'navbar',
            name: 'Nav',
            x: 0, y: 0, width: 375, height: 60, zIndex: 10,
            props: { title: 'My Cart', leftIcon: 'ArrowLeft' },
            style: { backgroundColor: '#1e293b', shadow: true, color: '#f8fafc' },
            interactions: []
        },
        // Item 1
        {
            type: 'container', name: 'Item 1 BG', x: 16, y: 80, width: 343, height: 100, zIndex: 1,
            props: {}, style: { backgroundColor: '#1e293b', borderRadius: 12, shadow: true },
            interactions: []
        },
        {
            type: 'image', name: 'Item 1 Img', x: 26, y: 90, width: 80, height: 80, zIndex: 2,
            props: { src: 'https://picsum.photos/100/100' }, style: { borderRadius: 8 },
            interactions: []
        },
        {
            type: 'text', name: 'Item 1 Title', x: 116, y: 90, width: 200, height: 20, zIndex: 2,
            props: { text: 'Modern Chair' }, style: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Item 1 Price', x: 116, y: 115, width: 200, height: 20, zIndex: 2,
            props: { text: '$149.00' }, style: { fontSize: 14, color: '#818cf8' },
            interactions: []
        },
        {
            type: 'icon', name: 'Item 1 Minus', x: 116, y: 145, width: 24, height: 24, zIndex: 2,
            props: { iconName: 'Minus' }, style: { backgroundColor: '#334155', borderRadius: 4, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Item 1 Qty', x: 145, y: 145, width: 30, height: 24, zIndex: 2,
            props: { text: '1' }, style: { fontSize: 14, textAlign: 'center', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'icon', name: 'Item 1 Plus', x: 180, y: 145, width: 24, height: 24, zIndex: 2,
            props: { iconName: 'Plus' }, style: { backgroundColor: '#334155', borderRadius: 4, color: '#f8fafc' },
            interactions: []
        },
        // Item 2
        {
            type: 'container', name: 'Item 2 BG', x: 16, y: 190, width: 343, height: 100, zIndex: 1,
            props: {}, style: { backgroundColor: '#1e293b', borderRadius: 12, shadow: true },
            interactions: []
        },
        {
            type: 'image', name: 'Item 2 Img', x: 26, y: 200, width: 80, height: 80, zIndex: 2,
            props: { src: 'https://picsum.photos/100/101' }, style: { borderRadius: 8 },
            interactions: []
        },
        {
            type: 'text', name: 'Item 2 Title', x: 116, y: 200, width: 200, height: 20, zIndex: 2,
            props: { text: 'Minimal Lamp' }, style: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Item 2 Price', x: 116, y: 225, width: 200, height: 20, zIndex: 2,
            props: { text: '$85.00' }, style: { fontSize: 14, color: '#818cf8' },
            interactions: []
        },
        // Footer Summary
        {
            type: 'container', name: 'Summary BG', x: 0, y: 600, width: 375, height: 212, zIndex: 10,
            props: {}, style: { backgroundColor: '#1e293b', shadow: true, borderRadius: 0 },
            interactions: []
        },
        {
            type: 'text', name: 'Subtotal Label', x: 20, y: 620, width: 100, height: 20, zIndex: 11,
            props: { text: 'Subtotal' }, style: { fontSize: 14, color: '#94a3b8' },
            interactions: []
        },
        {
            type: 'text', name: 'Subtotal Value', x: 255, y: 620, width: 100, height: 20, zIndex: 11,
            props: { text: '$234.00' }, style: { fontSize: 14, textAlign: 'right', fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Total Label', x: 20, y: 650, width: 100, height: 24, zIndex: 11,
            props: { text: 'Total' }, style: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Total Value', x: 255, y: 650, width: 100, height: 24, zIndex: 11,
            props: { text: '$234.00' }, style: { fontSize: 18, textAlign: 'right', fontWeight: 'bold', color: '#818cf8' },
            interactions: []
        },
        {
            type: 'button', name: 'Checkout Btn', x: 20, y: 700, width: 335, height: 50, zIndex: 11,
            props: { text: 'Proceed to Checkout' }, style: { backgroundColor: '#3b82f6', color: '#fff', borderRadius: 25, fontSize: 16 },
            interactions: []
        }
    ]
  },
  {
    id: 'checkout',
    name: 'Checkout (Mobile)',
    category: 'Ecommerce',
    thumbnail: 'CreditCard',
    backgroundColor: '#0f172a',
    elements: [
        {
            type: 'navbar', name: 'Nav', x: 0, y: 0, width: 375, height: 60, zIndex: 10,
            props: { title: 'Checkout', leftIcon: 'ArrowLeft' }, style: { backgroundColor: '#1e293b', shadow: true, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Shipping Header', x: 20, y: 80, width: 200, height: 24, zIndex: 1,
            props: { text: 'Shipping Address' }, style: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'input', name: 'Name Input', x: 20, y: 115, width: 335, height: 48, zIndex: 1,
            props: { placeholder: 'Full Name' }, style: { backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#334155', borderWidth: 1, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'input', name: 'Address Input', x: 20, y: 175, width: 335, height: 48, zIndex: 1,
            props: { placeholder: 'Street Address' }, style: { backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#334155', borderWidth: 1, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'input', name: 'City Input', x: 20, y: 235, width: 160, height: 48, zIndex: 1,
            props: { placeholder: 'City' }, style: { backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#334155', borderWidth: 1, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'input', name: 'Zip Input', x: 195, y: 235, width: 160, height: 48, zIndex: 1,
            props: { placeholder: 'Zip Code' }, style: { backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#334155', borderWidth: 1, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'text', name: 'Payment Header', x: 20, y: 310, width: 200, height: 24, zIndex: 1,
            props: { text: 'Payment Method' }, style: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'container', name: 'Card Option', x: 20, y: 345, width: 335, height: 60, zIndex: 1,
            props: {}, style: { backgroundColor: '#1e293b', borderColor: '#3b82f6', borderWidth: 2, borderRadius: 8 },
            interactions: []
        },
        {
            type: 'icon', name: 'Credit Card Icon', x: 40, y: 363, width: 24, height: 24, zIndex: 2,
            props: { iconName: 'CreditCard' }, style: { color: '#3b82f6' },
            interactions: []
        },
        {
            type: 'text', name: 'Credit Card Text', x: 80, y: 365, width: 200, height: 20, zIndex: 2,
            props: { text: 'Credit Card' }, style: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'radio', name: 'Card Radio', x: 320, y: 363, width: 24, height: 24, zIndex: 2,
            props: { checked: true }, style: { color: '#3b82f6' },
            interactions: []
        },
        {
            type: 'input', name: 'Card Number', x: 20, y: 420, width: 335, height: 48, zIndex: 1,
            props: { placeholder: '0000 0000 0000 0000' }, style: { backgroundColor: '#1e293b', borderRadius: 8, borderColor: '#334155', borderWidth: 1, color: '#f8fafc' },
            interactions: []
        },
        {
            type: 'button', name: 'Pay Button', x: 20, y: 500, width: 335, height: 50, zIndex: 1,
            props: { text: 'Pay $234.00' }, style: { backgroundColor: '#3b82f6', color: '#fff', borderRadius: 25, fontSize: 16 },
            interactions: []
        }
    ]
  },
  {
    id: 'user-profile-ecommerce',
    name: 'Profile (Mobile)',
    category: 'Ecommerce',
    thumbnail: 'User',
    backgroundColor: '#0f172a',
    elements: [
       {
        type: 'container', name: 'Header BG', x: 0, y: 0, width: 375, height: 200, zIndex: 1,
        props: {}, style: { backgroundColor: '#1e293b', borderRadius: 0 },
        interactions: []
      },
      {
        type: 'text', name: 'Page Title', x: 0, y: 30, width: 375, height: 30, zIndex: 2,
        props: { text: 'My Profile' }, style: { color: '#fff', textAlign: 'center', fontSize: 18 },
        interactions: []
      },
      {
        type: 'image', name: 'Avatar', x: 137, y: 80, width: 100, height: 100, zIndex: 2,
        props: { src: 'https://i.pravatar.cc/150?img=12' }, style: { borderRadius: 50, borderWidth: 4, borderColor: '#ffffff' },
        interactions: []
      },
      {
        type: 'text', name: 'User Name', x: 0, y: 190, width: 375, height: 30, zIndex: 2,
        props: { text: 'Alex Johnson' }, style: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#fff' },
        interactions: []
      },
      // Menu Items
      {
        type: 'container', name: 'Menu BG', x: 20, y: 240, width: 335, height: 300, zIndex: 1,
        props: {}, style: { backgroundColor: '#1e293b', borderRadius: 12, shadow: true },
        interactions: []
      },
      {
        type: 'icon', name: 'Order Icon', x: 40, y: 265, width: 24, height: 24, zIndex: 2,
        props: { iconName: 'Package' }, style: { color: '#94a3b8' },
        interactions: []
      },
      {
        type: 'text', name: 'Orders Text', x: 80, y: 265, width: 200, height: 24, zIndex: 2,
        props: { text: 'My Orders' }, style: { fontSize: 16, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'icon', name: 'Chevron 1', x: 310, y: 265, width: 20, height: 20, zIndex: 2,
        props: { iconName: 'ChevronRight' }, style: { color: '#64748b' },
        interactions: []
      },
      {
        type: 'container', name: 'Divider 1', x: 80, y: 305, width: 255, height: 1, zIndex: 2,
        props: {}, style: { backgroundColor: '#334155' },
        interactions: []
      },
      // Item 2
      {
        type: 'icon', name: 'Heart Icon', x: 40, y: 325, width: 24, height: 24, zIndex: 2,
        props: { iconName: 'Heart' }, style: { color: '#94a3b8' },
        interactions: []
      },
      {
        type: 'text', name: 'Wishlist Text', x: 80, y: 325, width: 200, height: 24, zIndex: 2,
        props: { text: 'Wishlist' }, style: { fontSize: 16, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'icon', name: 'Chevron 2', x: 310, y: 325, width: 20, height: 20, zIndex: 2,
        props: { iconName: 'ChevronRight' }, style: { color: '#64748b' },
        interactions: []
      },
       {
        type: 'container', name: 'Divider 2', x: 80, y: 365, width: 255, height: 1, zIndex: 2,
        props: {}, style: { backgroundColor: '#334155' },
        interactions: []
      },
      // Item 3
      {
        type: 'icon', name: 'Map Icon', x: 40, y: 385, width: 24, height: 24, zIndex: 2,
        props: { iconName: 'MapPin' }, style: { color: '#94a3b8' },
        interactions: []
      },
      {
        type: 'text', name: 'Address Text', x: 80, y: 385, width: 200, height: 24, zIndex: 2,
        props: { text: 'Shipping Addresses' }, style: { fontSize: 16, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'icon', name: 'Chevron 3', x: 310, y: 385, width: 20, height: 20, zIndex: 2,
        props: { iconName: 'ChevronRight' }, style: { color: '#64748b' },
        interactions: []
      },
       {
        type: 'container', name: 'Divider 3', x: 80, y: 425, width: 255, height: 1, zIndex: 2,
        props: {}, style: { backgroundColor: '#334155' },
        interactions: []
      },
      // Item 4
      {
        type: 'icon', name: 'Settings Icon', x: 40, y: 445, width: 24, height: 24, zIndex: 2,
        props: { iconName: 'Settings' }, style: { color: '#94a3b8' },
        interactions: []
      },
      {
        type: 'text', name: 'Settings Text', x: 80, y: 445, width: 200, height: 24, zIndex: 2,
        props: { text: 'Settings' }, style: { fontSize: 16, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'icon', name: 'Chevron 4', x: 310, y: 445, width: 20, height: 20, zIndex: 2,
        props: { iconName: 'ChevronRight' }, style: { color: '#64748b' },
        interactions: []
      },
    ]
  },
  {
    id: 'product-store-desktop',
    name: 'Store (Desktop)',
    category: 'Ecommerce',
    thumbnail: 'Monitor',
    backgroundColor: '#0f172a',
    elements: [
       {
        type: 'navbar',
        name: 'Header',
        x: 0,
        y: 0,
        width: 1280,
        height: 80,
        zIndex: 10,
        props: { title: 'Brand Store', rightIcon: 'ShoppingCart', leftIcon: 'Search' },
        style: { backgroundColor: '#1e293b', shadow: true, padding: 30, textAlign: 'center', fontSize: 24, color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'container',
        name: 'Hero Banner',
        x: 0,
        y: 80,
        width: 1280,
        height: 400,
        zIndex: 1,
        props: {},
        style: { backgroundColor: '#1e293b' },
        interactions: []
      },
       {
        type: 'text',
        name: 'Hero Title',
        x: 100,
        y: 200,
        width: 600,
        height: 60,
        zIndex: 2,
        props: { text: 'New Summer Collection' },
        style: { fontSize: 48, fontWeight: 'bold', color: '#f8fafc' },
        interactions: []
      },
      {
        type: 'button',
        name: 'CTA',
        x: 100,
        y: 300,
        width: 200,
        height: 60,
        zIndex: 2,
        props: { text: 'Shop Now' },
        style: { backgroundColor: '#3b82f6', color: '#fff', fontSize: 18, borderRadius: 0 },
        interactions: []
      },
      {
        type: 'text',
        name: 'Featured',
        x: 100,
        y: 520,
        width: 300,
        height: 40,
        zIndex: 1,
        props: { text: 'Featured Products' },
        style: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc' },
        interactions: []
      },
      // Product Grid Row
      {
        type: 'card',
        name: 'Prod 1',
        x: 100,
        y: 580,
        width: 300,
        height: 350,
        zIndex: 1,
        props: { title: 'Item One', subtitle: '$49.00' },
        style: { backgroundColor: '#1e293b', borderRadius: 8, shadow: true, padding: 15, color: '#f8fafc' },
        interactions: []
      },
       {
        type: 'image',
        name: 'Img 1',
        x: 115,
        y: 600,
        width: 270,
        height: 200,
        zIndex: 2,
        props: { src: 'https://picsum.photos/300/250' },
        style: { borderRadius: 4 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Prod 2',
        x: 440,
        y: 580,
        width: 300,
        height: 350,
        zIndex: 1,
        props: { title: 'Item Two', subtitle: '$59.00' },
        style: { backgroundColor: '#1e293b', borderRadius: 8, shadow: true, padding: 15, color: '#f8fafc' },
        interactions: []
      },
       {
        type: 'image',
        name: 'Img 2',
        x: 455,
        y: 600,
        width: 270,
        height: 200,
        zIndex: 2,
        props: { src: 'https://picsum.photos/300/251' },
        style: { borderRadius: 4 },
        interactions: []
      },
      {
        type: 'card',
        name: 'Prod 3',
        x: 780,
        y: 580,
        width: 300,
        height: 350,
        zIndex: 1,
        props: { title: 'Item Three', subtitle: '$29.00' },
        style: { backgroundColor: '#1e293b', borderRadius: 8, shadow: true, padding: 15, color: '#f8fafc' },
        interactions: []
      },
       {
        type: 'image',
        name: 'Img 3',
        x: 795,
        y: 600,
        width: 270,
        height: 200,
        zIndex: 2,
        props: { src: 'https://picsum.photos/300/252' },
        style: { borderRadius: 4 },
        interactions: []
      }
    ]
  }
];
