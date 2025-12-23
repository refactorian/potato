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
        { "id": "nav-1", "type": "navbar", "name": "App Bar", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 10, "props": { "title": "Overview", "rightIcon": "Bell" }, "style": { "backgroundColor": "#1e293b", "shadow": true, "color": "#f8fafc", "fontWeight": "bold" }, "interactions": [] },
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
        { "id": "nav-2", "type": "navbar", "name": "App Bar", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 10, "props": { "title": "Discover", "leftIcon": "ArrowLeft" }, "style": { "backgroundColor": "#1e293b", "shadow": true, "color": "#f8fafc" }, "interactions": [{ "id": "int-back", "trigger": "onClick", "action": "back" }] },
        { "id": "search-box", "type": "input", "name": "Search", "x": 16, "y": 80, "width": 343, "height": 52, "zIndex": 1, "props": { "placeholder": "Search components..." }, "style": { "borderRadius": 16, "backgroundColor": "#1e293b", "borderWidth": 1, "borderColor": "#334155", "padding": "0 20px", "color": "#f8fafc" }, "interactions": [] },
        { "id": "feat-1", "type": "card", "name": "Feature 1", "x": 16, "y": 148, "width": 164, "height": 220, "zIndex": 1, "props": { "title": "Components", "subtitle": "v1.0" }, "style": { "backgroundColor": "#1e1b4b", "borderRadius": 24, "padding": 20, "color": "#c7d2fe", "borderWidth": 1, "borderColor": "#312e81" }, "interactions": [] },
        { "id": "feat-2", "type": "card", "name": "Feature 2", "x": 195, "y": 148, "width": 164, "height": 220, "zIndex": 1, "props": { "title": "Templates", "subtitle": "v2.0" }, "style": { "backgroundColor": "#450a0a", "borderRadius": 24, "padding": 20, "color": "#fecaca", "borderWidth": 1, "borderColor": "#7f1d1d" }, "interactions": [] }
      ]
    },
    {
      "id": "sc-profile",
      "name": "Profile",
      "groupId": "grp-core",
      "backgroundColor": "#0f172a",
      "viewportWidth": 375,
      "viewportHeight": 812,
      "gridConfig": { "visible": false, "size": 20, "color": "rgba(255,255,255,0.1)", "snapToGrid": true },
      "elements": [
        { "id": "p-bg", "type": "container", "name": "Header BG", "x": 0, "y": 0, "width": 375, "height": 220, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e293b", "borderBottomWidth": 1, "borderColor": "#334155" }, "interactions": [] },
        { "id": "avatar", "type": "circle", "name": "Avatar", "x": 127, "y": 80, "width": 120, "height": 120, "zIndex": 2, "props": {}, "style": { "backgroundColor": "#6366f1", "borderWidth": 4, "borderColor": "#0f172a", "shadow": true }, "interactions": [] },
        { "id": "p-name", "type": "text", "name": "User Name", "x": 0, "y": 215, "width": 375, "height": 30, "zIndex": 2, "props": { "text": "Potato Dev" }, "style": { "fontSize": 24, "fontWeight": "bold", "textAlign": "center", "color": "#f8fafc" }, "interactions": [] },
        { "id": "set-btn", "type": "button", "name": "Settings Nav", "x": 37, "y": 300, "width": 300, "height": 56, "zIndex": 2, "props": { "text": "Preferences", "icon": "Settings" }, "style": { "backgroundColor": "#1e293b", "color": "#f8fafc", "borderRadius": 16, "fontWeight": "bold", "borderWidth": 1, "borderColor": "#334155" }, "interactions": [{ "id": "int-set", "trigger": "onClick", "action": "navigate", "payload": "sc-settings" }] }
      ]
    },
    {
      "id": "sc-settings",
      "name": "Settings",
      "groupId": "grp-core",
      "backgroundColor": "#0f172a",
      "viewportWidth": 375,
      "viewportHeight": 812,
      "gridConfig": { "visible": false, "size": 20, "color": "rgba(255,255,255,0.1)", "snapToGrid": true },
      "elements": [
        { "id": "nav-s", "type": "navbar", "name": "App Bar", "x": 0, "y": 0, "width": 375, "height": 64, "zIndex": 10, "props": { "title": "Settings", "leftIcon": "ArrowLeft" }, "style": { "backgroundColor": "#1e293b", "shadow": true, "color": "#f8fafc" }, "interactions": [{ "id": "int-back-s", "trigger": "onClick", "action": "back" }] },
        { "id": "opt-1-bg", "type": "container", "name": "Option 1", "x": 16, "y": 80, "width": 343, "height": 64, "zIndex": 1, "props": {}, "style": { "backgroundColor": "#1e293b", "borderRadius": 16, "borderWidth": 1, "borderColor": "#334155" }, "interactions": [] },
        { "id": "opt-1-text", "type": "text", "name": "Dark Mode", "x": 40, "y": 102, "width": 200, "height": 20, "zIndex": 2, "props": { "text": "OLED Dark Mode" }, "style": { "fontSize": 16, "fontWeight": "bold", "color": "#f8fafc" }, "interactions": [] },
        { "id": "opt-1-toggle", "type": "toggle", "name": "Toggle", "x": 290, "y": 97, "width": 50, "height": 30, "zIndex": 2, "props": { "checked": true }, "style": { "backgroundColor": "#6366f1" }, "interactions": [] }
      ]
    }
  ]
};