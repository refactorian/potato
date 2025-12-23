
import { Project } from '../../../types';

export const BLANK_STARTER_DATA: Partial<Project> = {
  "id": "starter-blank",
  "name": "Starter Framework",
  "description": "A comprehensive foundation in Midnight Slate. Includes Home, Explore, Search, Profile, and Settings.",
  "projectType": "mobile",
  "viewportWidth": 375,
  "viewportHeight": 812,
  "gridConfig": {
    "visible": false,
    "size": 20,
    "color": "rgba(255,255,255,0.1)",
    "snapToGrid": true
  },
  "activeScreenId": "sc-home",
  "assets": [],
  "screenGroups": [
    { "id": "grp-core", "name": "Core Flow", "collapsed": false }
  ],
  "screens": [
    {
      "id": "sc-home",
      "name": "Home",
      "groupId": "grp-core",
      "backgroundColor": "#0f172a",
      "viewportWidth": 375,
      "viewportHeight": 812,
      "gridConfig": { "visible": false, "size": 20, "color": "rgba(255,255,255,0.1)", "snapToGrid": true },
      "elements": [
        { "id": "nav-group", "type": "group", "name": "App Bar", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 10, "props": {}, "style": { "backgroundColor": "transparent" }, "interactions": [] },
        { "id": "nav-bg", "parentId": "nav-group", "type": "container", "name": "BG", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e293b", "shadow": true }, "interactions": [] },
        { "id": "nav-title", "parentId": "nav-group", "type": "text", "name": "Title", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 2, "props": { "text": "Overview" }, "style": { "fontSize": 18, "textAlign": "center", "fontWeight": "bold", "color": "#f8fafc" }, "interactions": [] },
        { "id": "hero-bg", "type": "container", "name": "Hero Card", "x": 16, "y": 80, "width": 343, "height": 180, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#4f46e5", "borderRadius": 24, "shadow": true }, "interactions": [] },
        { "id": "hero-text", "type": "text", "name": "Welcome", "x": 36, "y": 105, "width": 200, "height": 30, "zIndex": 2, "props": { "text": "Welcome Alex" }, "style": { "fontSize": 26, "fontWeight": "900", "color": "#ffffff" }, "interactions": [] },
        { "id": "hero-sub", "type": "text", "name": "Status", "x": 36, "y": 140, "width": 260, "height": 40, "zIndex": 2, "props": { "text": "Your system is optimized and secure." }, "style": { "fontSize": 14, "color": "#c7d2fe" }, "interactions": [] },
        { "id": "start-btn", "type": "button", "name": "Explore Button", "x": 36, "y": 190, "width": 140, "height": 44, "zIndex": 2, "props": { "text": "Explore Kit", "icon": "ArrowRight" }, "style": { "backgroundColor": "#ffffff", "color": "#4f46e5", "borderRadius": 14, "fontSize": 14, "fontWeight": "bold" }, "interactions": [{ "id": "int-1", "trigger": "onClick", "action": "navigate", "payload": "sc-explore" }] },
        { "id": "label-1", "type": "text", "name": "Section Label", "x": 20, "y": 285, "width": 200, "height": 20, "zIndex": 1, "props": { "text": "SYSTEM UPDATES" }, "style": { "fontSize": 10, "fontWeight": "900", "color": "#64748b", "letterSpacing": 1.5 }, "interactions": [] },
        { "id": "card-1", "type": "container", "name": "Activity Card", "x": 16, "y": 315, "width": 343, "height": 84, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e293b", "borderRadius": 20, "borderWidth": 1, "borderColor": "#334155" }, "interactions": [] },
        { "id": "card-1-text", "type": "text", "name": "Activity Title", "x": 40, "y": 345, "width": 200, "height": 20, "zIndex": 2, "props": { "text": "UI Engine v2.4 Ready" }, "style": { "fontSize": 16, "fontWeight": "bold", "color": "#f8fafc" }, "interactions": [] }
      ]
    },
    {
      "id": "sc-explore",
      "name": "Explore",
      "groupId": "grp-core",
      "backgroundColor": "#0f172a",
      "viewportWidth": 375,
      "viewportHeight": 812,
      "gridConfig": { "visible": false, "size": 20, "color": "rgba(255,255,255,0.1)", "snapToGrid": true },
      "elements": [
        { "id": "nav-group-2", "type": "group", "name": "App Bar", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 10, "props": {}, "style": { "backgroundColor": "transparent" }, "interactions": [] },
        { "id": "nav-bg-2", "parentId": "nav-group-2", "type": "container", "name": "BG", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e293b", "shadow": true }, "interactions": [] },
        { "id": "nav-back", "parentId": "nav-group-2", "type": "icon", "name": "Back", "x": 16, "y": 20, "width": 24, "height": 24, "zIndex": 3, "props": { "iconName": "ArrowLeft" }, "style": { "color": "#ffffff" }, "interactions": [{ "id": "int-back", "trigger": "onClick", "action": "back" }] },
        { "id": "nav-title-2", "parentId": "nav-group-2", "type": "text", "name": "Title", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 2, "props": { "text": "Discover" }, "style": { "fontSize": 18, "textAlign": "center", "fontWeight": "bold", "color": "#f8fafc" }, "interactions": [] },
        { "id": "search-box", "type": "input", "name": "Search", "x": 16, "y": 80, "width": 343, "height": 52, "zIndex": 1, "props": { "placeholder": "Search components..." }, "style": { "borderRadius": 16, "backgroundColor": "#1e293b", "borderWidth": 1, "borderColor": "#334155", "padding": "0 20px", "color": "#f8fafc" }, "interactions": [] },
        { "id": "feat-group-1", "type": "group", "name": "Feature 1", "x": 16, "y": 148, "width": 164, "height": 220, "zIndex": 1, "props": {}, "style": { "backgroundColor": "transparent" }, "interactions": [] },
        { "id": "feat-bg-1", "parentId": "feat-group-1", "type": "container", "name": "BG", "x": 0, "y": 0, "width": 164, "height": 220, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e1b4b", "borderRadius": 24, "borderWidth": 1, "borderColor": "#312e81" }, "interactions": [] },
        { "id": "feat-t-1", "parentId": "feat-group-1", "type": "text", "name": "Title", "x": 20, "y": 20, "width": 124, "height": 24, "zIndex": 2, "props": { "text": "Components" }, "style": { "fontSize": 14, "fontWeight": "bold", "color": "#c7d2fe" }, "interactions": [] }
      ]
    }
  ]
};
