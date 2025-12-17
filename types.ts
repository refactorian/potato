
export type ComponentType = 'group' | 'container' | 'button' | 'text' | 'input' | 'textarea' | 'image' | 'video' | 'navbar' | 'card' | 'icon' | 'circle' | 'checkbox' | 'radio' | 'toggle';

export type LeftSidebarTab = 'screens' | 'layers' | 'canvas' | 'project' | 'settings';

export interface ComponentStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  padding?: number;
  shadow?: boolean;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowColor?: string;
  opacity?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: number;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  lineHeight?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
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

export type InteractionAction = 'navigate' | 'back' | 'alert' | 'url' | 'none';

export interface Interaction {
  id: string;
  trigger: 'onClick';
  action: InteractionAction;
  payload?: string; // e.g., screenId, message, or url
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
  parentId?: string; // For nested elements (groups)
  props: Record<string, any>;
  style: ComponentStyle;
  interactions: Interaction[];
  collapsed?: boolean; // For groups in the layer tree
  locked?: boolean;
  hidden?: boolean;
}

export interface Screen {
  id: string;
  name: string;
  backgroundColor: string;
  elements: CanvasElement[];
  locked?: boolean;
  hidden?: boolean;
  groupId?: string; // ID of the ScreenGroup this screen belongs to
}

export interface ScreenGroup {
    id: string;
    name: string;
    collapsed: boolean;
    locked?: boolean;
    hidden?: boolean;
    parentId?: string; // Allow nested screen groups
}

export interface GridConfig {
  visible: boolean;
  size: number;
  color: string;
  snapToGrid: boolean;
}

export interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video';
    src: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  projectType?: 'mobile' | 'tablet' | 'desktop';
  tags?: string[];
  icon?: string; // Lucide icon name
  lastModified: number;
  viewportWidth: number;
  viewportHeight: number;
  activeScreenId: string;
  gridConfig: GridConfig;
  screens: Screen[];
  assets: Asset[];
  screenGroups: ScreenGroup[];
}

export interface LibraryItemChild {
    type: ComponentType;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    props: Record<string, any>;
    style: ComponentStyle;
}

export interface LibraryItem {
  type: ComponentType;
  label: string;
  icon: string; // Lucide icon name
  defaultWidth: number;
  defaultHeight: number;
  defaultProps: Record<string, any>;
  defaultStyle: ComponentStyle;
  children?: LibraryItemChild[]; // For hybrid components that come with pre-defined children (e.g. Card with text/buttons)
}

export interface LibraryCategory {
  name: string;
  items: LibraryItem[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string; // Lucide icon name
  projectData: Partial<Project> & { screens: Screen[] }; // Partial project data to merge
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  thumbnail: string; // Lucide icon name
  backgroundColor: string;
  elements: (Omit<CanvasElement, 'id'> & { id?: string })[];
}

export interface AppSettings {
    autoNavigateToLayers: boolean;
    showTooltips: boolean;
    defaultGridVisible: boolean;
    defaultSnapToGrid: boolean;
    showHotspots: boolean;
}

export interface ExportConfig {
    isOpen: boolean;
    type: 'project' | 'screen' | 'screen-group' | 'layer' | 'all-screens';
    targetId?: string; // ID of screen or layer to export
    targetIds?: string[]; // IDs for bulk export
}

export interface ScreenImage {
    id: string;
    name: string;
    category: string;
    screenType: 'mobile' | 'tablet' | 'desktop';
    src: string;
}
