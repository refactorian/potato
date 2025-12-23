
import { Project } from '../../../types';

export const ECOMMERCE_STARTER_DATA: Partial<Project> = {
  "id": "ecommerce-starter",
  "name": "E-commerce Pro",
  "description": "Luxury Midnight Shopping Experience. High-fidelity product grids and flows.",
  "projectType": "mobile",
  "viewportWidth": 375,
  "viewportHeight": 812,
  "gridConfig": { "visible": false, "size": 10, "color": "rgba(255,255,255,0.05)", "snapToGrid": true },
  "activeScreenId": "sc-shop",
  "assets": [],
  "screenGroups": [
    { "id": "grp-shop", "name": "Storefront", "collapsed": false }
  ],
  "screens": [
    {
      "id": "sc-shop",
      "name": "Marketplace",
      "groupId": "grp-shop",
      "backgroundColor": "#050505",
      "viewportWidth": 375,
      "viewportHeight": 812,
      "gridConfig": { "visible": false, "size": 10, "color": "rgba(255,255,255,0.05)", "snapToGrid": true },
      "elements": [
        { "id": "nav-g", "type": "group", "name": "Header", "x": 0, "y": 0, "width": 375, "height": 60, "zIndex": 10, "props": {}, "style": { "backgroundColor": "transparent" }, "interactions": [] },
        { "id": "nav-bg", "parentId": "nav-g", "type": "container", "name": "BG", "x": 0, "y": 0, "width": 375, "height": 60, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#000000", "shadow": true }, "interactions": [] },
        { "id": "nav-t", "parentId": "nav-g", "type": "text", "name": "Logo", "x": 0, "y": 0, "width": 375, "height": 60, "zIndex": 2, "props": { "text": "BOUTIQUE" }, "style": { "fontSize": 18, "textAlign": "center", "fontWeight": "900", "color": "#eab308", "letterSpacing": 2 }, "interactions": [] },
        { "id": "nav-cart", "parentId": "nav-g", "type": "icon", "name": "Cart", "x": 335, "y": 18, "width": 24, "height": 24, "zIndex": 3, "props": { "iconName": "ShoppingCart" }, "style": { "color": "#eab308" }, "interactions": [{ "id": "int-cart", "trigger": "onClick", "action": "navigate", "payload": "sc-cart" }] },
        { "id": "banner", "type": "container", "name": "Hero Banner", "x": 16, "y": 76, "width": 343, "height": 160, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e1b4b", "borderRadius": 24, "shadow": true, "borderWidth": 1, "borderColor": "#312e81" }, "interactions": [] },
        { "id": "banner-txt", "type": "text", "name": "Offer", "x": 36, "y": 110, "width": 250, "height": 30, "zIndex": 2, "props": { "text": "NEW SEASON 2025" }, "style": { "fontSize": 24, "fontWeight": "900", "color": "#ffffff" }, "interactions": [] },
        { "id": "banner-sub", "type": "text", "name": "Sub", "x": 36, "y": 145, "width": 200, "height": 20, "zIndex": 2, "props": { "text": "Exclusive Drop Available" }, "style": { "fontSize": 14, "color": "#eab308", "fontWeight": "bold" }, "interactions": [] },
        { "id": "p-1-group", "type": "group", "name": "Product 1", "x": 16, "y": 252, "width": 164, "height": 240, "zIndex": 1, "props": {}, "style": { "backgroundColor": "transparent" }, "interactions": [{ "id": "to-det", "trigger": "onClick", "action": "navigate", "payload": "sc-detail" }] },
        { "id": "p-1-bg", "parentId": "p-1-group", "type": "container", "name": "BG", "x": 0, "y": 0, "width": 164, "height": 240, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#111111", "borderRadius": 20, "borderWidth": 1, "borderColor": "#222222" }, "interactions": [] },
        { "id": "p-1-title", "parentId": "p-1-group", "type": "text", "name": "Title", "x": 20, "y": 170, "width": 124, "height": 20, "zIndex": 2, "props": { "text": "Silk Blazer" }, "style": { "fontSize": 14, "fontWeight": "bold", "color": "#ffffff" }, "interactions": [] },
        { "id": "p-2-group", "type": "group", "name": "Product 2", "x": 195, "y": 252, "width": 164, "height": 240, "zIndex": 1, "props": {}, "style": { "backgroundColor": "transparent" }, "interactions": [] },
        { "id": "p-2-bg", "parentId": "p-2-group", "type": "container", "name": "BG", "x": 0, "y": 0, "width": 164, "height": 240, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#111111", "borderRadius": 20, "borderWidth": 1, "borderColor": "#222222" }, "interactions": [] }
      ]
    },
    {
      "id": "sc-detail",
      "name": "Product Details",
      "groupId": "grp-shop",
      "backgroundColor": "#000000",
      "viewportWidth": 375,
      "viewportHeight": 812,
      "gridConfig": { "visible": false, "size": 10, "color": "rgba(255,255,255,0.05)", "snapToGrid": true },
      "elements": [
        { "id": "det-img", "type": "image", "name": "Hero Image", "x": 0, "y": 0, "width": 375, "height": 450, "zIndex": 1, "props": { "src": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800" }, "style": { "backgroundColor": "#111111" }, "interactions": [] },
        { "id": "det-back", "type": "icon", "name": "Back Btn", "x": 20, "y": 40, "width": 44, "height": 44, "zIndex": 10, "props": { "iconName": "ArrowLeft" }, "style": { "backgroundColor": "#000000", "borderRadius": 22, "shadow": true, "padding": 12, "color": "#ffffff" }, "interactions": [{ "id": "back-1", "trigger": "onClick", "action": "back" }] },
        { "id": "det-title", "type": "text", "name": "Title", "x": 24, "y": 475, "width": 300, "height": 40, "zIndex": 1, "props": { "text": "Limited Edition Sneakers" }, "style": { "fontSize": 26, "fontWeight": "900", "color": "#ffffff" }, "interactions": [] },
        { "id": "det-price", "type": "text", "name": "Price", "x": 24, "y": 515, "width": 100, "height": 30, "zIndex": 1, "props": { "text": "€850" }, "style": { "fontSize": 22, "color": "#eab308", "fontWeight": "bold" }, "interactions": [] },
        { "id": "det-buy", "type": "button", "name": "Add Button", "x": 20, "y": 720, "width": 335, "height": 60, "zIndex": 5, "props": { "text": "ADD TO BASKET", "icon": "ShoppingBag" }, "style": { "backgroundColor": "#ffffff", "color": "#000000", "borderRadius": 18, "fontSize": 16, "fontWeight": "900" }, "interactions": [{ "id": "to-cart", "trigger": "onClick", "action": "navigate", "payload": "sc-cart" }] }
      ]
    }
  ]
};
