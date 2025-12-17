
export type ComponentType = 'group' | 'container' | 'button' | 'text' | 'input' | 'textarea' | 'image' | 'video' | 'navbar' | 'card' | 'icon' | 'circle' | 'checkbox' | 'radio' | 'toggle';

export type LeftSidebarTab = 'screens' | 'layers' | 'canvas' | 'project' | 'settings';

export interface ComponentStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  padding?: number;
  shadow?: boolean;
  opacity?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold';
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  lineHeight?: number;
  borderStyle?: string;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  textDecoration?: string;
}

export interface IconStyle {
  color?: string;
  size?: number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}

export interface Interaction {
  id: string;
  trigger: 'onClick';
  action: 'navigate' | 'alert';
  payload?: string; // e.g., screenId for navigation
}

export interface CanvasElement {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  props: Record<string, any>; // Component specific props. Icons may have keys like 'leftIconStyle': IconStyle
  style: ComponentStyle;
  interactions: Interaction[];
  parentId?: string; // For grouping/containers
  collapsed?: boolean; // UI state for layer tree
  locked?: boolean; // New locking feature
  hidden?: boolean; // New visibility feature
}

export interface ScreenGroup {
  id: string;
  name: string;
  collapsed?: boolean;
  locked?: boolean;
  hidden?: boolean; // New visibility feature
  parentId?: string; // New field for nested screen groups
}

export interface Screen {
  id: string;
  name: string;
  groupId?: string; // Link to ScreenGroup
  backgroundColor: string;
  elements: CanvasElement[];
  locked?: boolean; // New locking feature
  hidden?: boolean; // New visibility feature
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  src: string; // Base64 or URL
}

export interface GridConfig {
  visible: boolean;
  size: number;
  color: string;
  snapToGrid: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  projectType?: 'mobile' | 'tablet' | 'desktop'; // New field
  tags?: string[]; // New field
  icon?: string; // New field for Project Icon
  lastModified: number;
  screenGroups: ScreenGroup[]; // Added screen groups
  screens: Screen[];
  assets: Asset[];
  activeScreenId: string;
  viewportWidth: number;
  viewportHeight: number;
  gridConfig: GridConfig;
}

export interface LibraryItem {
  type: ComponentType;
  label: string;
  icon: string; // Lucide icon name for the library UI
  defaultWidth: number;
  defaultHeight: number;
  defaultProps: Record<string, any>;
  defaultStyle: ComponentStyle;
  children?: {
      type: ComponentType;
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      props: Record<string, any>;
      style: ComponentStyle;
  }[];
}

export interface LibraryCategory {
  name: string;
  items: LibraryItem[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string; // Added category
  thumbnail: string;
  elements: Omit<CanvasElement, 'id'>[]; // Elements without ID (generated on use)
  backgroundColor: string;
}

export interface ScreenImage {
  id: string;
  name: string;
  category: string;
  src: string;
  screenType?: 'mobile' | 'tablet' | 'desktop';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string; // Lucide icon name or image url
  projectData: Omit<Project, 'id' | 'lastModified' | 'name' | 'description'>;
}

export interface AppSettings {
  autoNavigateToLayers: boolean;
  showTooltips: boolean;
  defaultGridVisible: boolean;
  defaultSnapToGrid: boolean;
  deleteScreensWithGroup: boolean;
  deleteLayersWithGroup: boolean;
}

export interface ExportConfig {
    isOpen: boolean;
    type: 'project' | 'screen' | 'layer' | 'all-screens' | 'screen-group';
    targetId?: string;
    targetIds?: string[]; // Added for multi-select export
}
