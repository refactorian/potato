
export interface ColorSwatch {
  hex: string;
  name: string;
  style: 'flat' | 'material' | 'neo' | 'pastel' | 'brand';
}

export const COLOR_PALETTES: ColorSwatch[] = [
  // Flat UI
  { hex: '#1abc9c', name: 'Turquoise', style: 'flat' },
  { hex: '#2ecc71', name: 'Emerland', style: 'flat' },
  { hex: '#3498db', name: 'Peter River', style: 'flat' },
  { hex: '#9b59b6', name: 'Amethyst', style: 'flat' },
  { hex: '#34495e', name: 'Wet Asphalt', style: 'flat' },
  { hex: '#16a085', name: 'Green Sea', style: 'flat' },
  { hex: '#27ae60', name: 'Nephritis', style: 'flat' },
  { hex: '#2980b9', name: 'Belize Hole', style: 'flat' },
  { hex: '#8e44ad', name: 'Wisteria', style: 'flat' },
  { hex: '#2c3e50', name: 'Midnight Blue', style: 'flat' },
  { hex: '#f1c40f', name: 'Sunflower', style: 'flat' },
  { hex: '#e67e22', name: 'Carrot', style: 'flat' },
  { hex: '#e74c3c', name: 'Alizarin', style: 'flat' },
  { hex: '#ecf0f1', name: 'Clouds', style: 'flat' },
  { hex: '#95a5a6', name: 'Concrete', style: 'flat' },
  { hex: '#f39c12', name: 'Orange', style: 'flat' },
  { hex: '#d35400', name: 'Pumpkin', style: 'flat' },
  { hex: '#c0392b', name: 'Pomegranate', style: 'flat' },
  { hex: '#bdc3c7', name: 'Silver', style: 'flat' },
  { hex: '#7f8c8d', name: 'Asbestos', style: 'flat' },

  // Material Design 500s
  { hex: '#F44336', name: 'Red 500', style: 'material' },
  { hex: '#E91E63', name: 'Pink 500', style: 'material' },
  { hex: '#9C27B0', name: 'Purple 500', style: 'material' },
  { hex: '#673AB7', name: 'Deep Purple 500', style: 'material' },
  { hex: '#3F51B5', name: 'Indigo 500', style: 'material' },
  { hex: '#2196F3', name: 'Blue 500', style: 'material' },
  { hex: '#03A9F4', name: 'Light Blue 500', style: 'material' },
  { hex: '#00BCD4', name: 'Cyan 500', style: 'material' },
  { hex: '#009688', name: 'Teal 500', style: 'material' },
  { hex: '#4CAF50', name: 'Green 500', style: 'material' },
  { hex: '#8BC34A', name: 'Light Green 500', style: 'material' },
  { hex: '#CDDC39', name: 'Lime 500', style: 'material' },
  { hex: '#FFEB3B', name: 'Yellow 500', style: 'material' },
  { hex: '#FFC107', name: 'Amber 500', style: 'material' },
  { hex: '#FF9800', name: 'Orange 500', style: 'material' },
  { hex: '#FF5722', name: 'Deep Orange 500', style: 'material' },
  { hex: '#795548', name: 'Brown 500', style: 'material' },
  { hex: '#9E9E9E', name: 'Grey 500', style: 'material' },
  { hex: '#607D8B', name: 'Blue Grey 500', style: 'material' },

  // Neo-Brutalism (Saturated/Bold)
  { hex: '#FF0000', name: 'Neo Red', style: 'neo' },
  { hex: '#00FF00', name: 'Neo Green', style: 'neo' },
  { hex: '#0000FF', name: 'Neo Blue', style: 'neo' },
  { hex: '#FFFF00', name: 'Neo Yellow', style: 'neo' },
  { hex: '#FF00FF', name: 'Neo Magenta', style: 'neo' },
  { hex: '#00FFFF', name: 'Neo Cyan', style: 'neo' },
  { hex: '#FF90E8', name: 'Brutal Pink', style: 'neo' },
  { hex: '#FFBD12', name: 'Brutal Yellow', style: 'neo' },
  { hex: '#1947E5', name: 'Brutal Blue', style: 'neo' },
  { hex: '#F95A2C', name: 'Brutal Orange', style: 'neo' },
  { hex: '#00C6AE', name: 'Brutal Teal', style: 'neo' },
  { hex: '#8000FF', name: 'Brutal Violet', style: 'neo' },

  // Pastels
  { hex: '#FFB7B2', name: 'Melon', style: 'pastel' },
  { hex: '#FFDAC1', name: 'Apricot', style: 'pastel' },
  { hex: '#E2F0CB', name: 'Mint', style: 'pastel' },
  { hex: '#B5EAD7', name: 'Seafoam', style: 'pastel' },
  { hex: '#C7CEEA', name: 'Lavender', style: 'pastel' },
  { hex: '#FADADD', name: 'Pale Pink', style: 'pastel' },
  { hex: '#D1E8E2', name: 'Muted Teal', style: 'pastel' },
  { hex: '#B6CFB6', name: 'Sage', style: 'pastel' },
  { hex: '#FFF5BA', name: 'Soft Yellow', style: 'pastel' },
  { hex: '#E0BBE4', name: 'Orchid', style: 'pastel' },

  // Brand Colors
  { hex: '#3b82f6', name: 'Potato Primary', style: 'brand' },
  { hex: '#6366f1', name: 'Indigo Accent', style: 'brand' },
  { hex: '#8b5cf6', name: 'Violet Accent', style: 'brand' },
  { hex: '#10b981', name: 'Success Green', style: 'brand' },
  { hex: '#ef4444', name: 'Danger Red', style: 'brand' },
];
