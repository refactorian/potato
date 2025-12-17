
import { TemplateDefinition } from '../../../types';

export const AUTH_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'login-screen',
    name: 'Login (Mobile)',
    category: 'Auth',
    thumbnail: 'Smartphone',
    backgroundColor: '#f3f4f6',
    elements: [
      {
        type: 'text',
        name: 'Header',
        x: 87,
        y: 100,
        width: 200,
        height: 40,
        zIndex: 1,
        props: { text: 'Welcome Back' },
        style: { fontSize: 24, textAlign: 'center', color: '#111827', backgroundColor: 'transparent' },
        interactions: []
      },
      {
        type: 'input',
        name: 'Email Input',
        x: 37,
        y: 180,
        width: 300,
        height: 45,
        zIndex: 2,
        props: { placeholder: 'Email Address' },
        style: { backgroundColor: '#fff', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, padding: 10 },
        interactions: []
      },
      {
        type: 'input',
        name: 'Password Input',
        x: 37,
        y: 240,
        width: 300,
        height: 45,
        zIndex: 3,
        props: { placeholder: 'Password' },
        style: { backgroundColor: '#fff', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, padding: 10 },
        interactions: []
      },
      {
        type: 'button',
        name: 'Login Button',
        x: 37,
        y: 310,
        width: 300,
        height: 50,
        zIndex: 4,
        props: { text: 'Sign In' },
        style: { backgroundColor: '#4f46e5', color: '#fff', borderRadius: 8, fontSize: 16, textAlign: 'center' },
        interactions: []
      }
    ]
  },
  {
    id: 'signup-screen',
    name: 'Sign Up (Mobile)',
    category: 'Auth',
    thumbnail: 'UserPlus',
    backgroundColor: '#ffffff',
    elements: [
      {
        type: 'text',
        name: 'Header',
        x: 87,
        y: 80,
        width: 200,
        height: 40,
        zIndex: 1,
        props: { text: 'Create Account' },
        style: { fontSize: 24, textAlign: 'center', color: '#111827', backgroundColor: 'transparent' },
        interactions: []
      },
      {
        type: 'input',
        name: 'Name Input',
        x: 37,
        y: 150,
        width: 300,
        height: 45,
        zIndex: 2,
        props: { placeholder: 'Full Name' },
        style: { backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, padding: 10 },
        interactions: []
      },
       {
        type: 'input',
        name: 'Email Input',
        x: 37,
        y: 210,
        width: 300,
        height: 45,
        zIndex: 3,
        props: { placeholder: 'Email Address' },
        style: { backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, padding: 10 },
        interactions: []
      },
      {
        type: 'input',
        name: 'Password Input',
        x: 37,
        y: 270,
        width: 300,
        height: 45,
        zIndex: 4,
        props: { placeholder: 'Password' },
        style: { backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, padding: 10 },
        interactions: []
      },
      {
        type: 'button',
        name: 'Register Button',
        x: 37,
        y: 340,
        width: 300,
        height: 50,
        zIndex: 5,
        props: { text: 'Register' },
        style: { backgroundColor: '#10b981', color: '#fff', borderRadius: 8, fontSize: 16, textAlign: 'center' },
        interactions: []
      }
    ]
  },
  {
    id: 'desktop-login',
    name: 'Login (Desktop)',
    category: 'Auth',
    thumbnail: 'Monitor',
    backgroundColor: '#f3f4f6',
    elements: [
       {
        type: 'container',
        name: 'Card BG',
        x: 440,
        y: 150,
        width: 400,
        height: 450,
        zIndex: 1,
        props: {},
        style: { backgroundColor: '#ffffff', borderRadius: 12, shadow: true },
        interactions: []
      },
      {
        type: 'text',
        name: 'Header',
        x: 540,
        y: 190,
        width: 200,
        height: 40,
        zIndex: 2,
        props: { text: 'Welcome Back' },
        style: { fontSize: 28, textAlign: 'center', color: '#1e293b', fontWeight: 'bold' },
        interactions: []
      },
       {
        type: 'text',
        name: 'Sub',
        x: 490,
        y: 230,
        width: 300,
        height: 20,
        zIndex: 2,
        props: { text: 'Sign in to access your dashboard' },
        style: { fontSize: 14, textAlign: 'center', color: '#64748b' },
        interactions: []
      },
      {
        type: 'input',
        name: 'Email',
        x: 465,
        y: 280,
        width: 350,
        height: 48,
        zIndex: 2,
        props: { placeholder: 'Email Address' },
        style: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 8, padding: 12 },
        interactions: []
      },
      {
        type: 'input',
        name: 'Password',
        x: 465,
        y: 340,
        width: 350,
        height: 48,
        zIndex: 2,
        props: { placeholder: 'Password', type: 'password' },
        style: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 8, padding: 12 },
        interactions: []
      },
      {
        type: 'button',
        name: 'Login Btn',
        x: 465,
        y: 420,
        width: 350,
        height: 48,
        zIndex: 2,
        props: { text: 'Login' },
        style: { backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: 8, fontSize: 16 },
        interactions: []
      }
    ]
  }
];
