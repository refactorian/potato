
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CanvasElement, IconStyle } from '../types';

interface ElementRendererProps {
  element: CanvasElement;
  isPreview: boolean;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isPreview }) => {
  const { type, style, props } = element;

  const hasBorder = style.borderWidth || style.borderTopWidth !== undefined || style.borderBottomWidth !== undefined || style.borderLeftWidth !== undefined || style.borderRightWidth !== undefined;

  const commonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: style.backgroundColor,
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    borderRadius: style.borderRadius,
    borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
    borderTopWidth: style.borderTopWidth !== undefined ? `${style.borderTopWidth}px` : undefined,
    borderBottomWidth: style.borderBottomWidth !== undefined ? `${style.borderBottomWidth}px` : undefined,
    borderLeftWidth: style.borderLeftWidth !== undefined ? `${style.borderLeftWidth}px` : undefined,
    borderRightWidth: style.borderRightWidth !== undefined ? `${style.borderRightWidth}px` : undefined,
    borderColor: style.borderColor,
    borderStyle: style.borderStyle || (hasBorder ? 'solid' : undefined), // Check specifically for group/container style logic later
    boxShadow: style.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
    opacity: style.opacity,
    fontFamily: style.fontFamily,
    textAlign: style.textAlign,
    textDecoration: style.textDecoration,
    padding: style.padding,
    lineHeight: style.lineHeight,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    pointerEvents: isPreview ? 'auto' : 'none', // Allow events in preview, block in editor (parent handles selection)
  };

  // Special handling for container/group to allow dashed borders if specified (visual grouping)
  if ((type === 'container' || type === 'group') && style.borderStyle) {
      commonStyle.borderStyle = style.borderStyle;
  }

  const getIcon = (name: string) => (LucideIcons as any)[name] || null;

  // Helper to extract specific icon props or fallback to global
  const getIconProps = (specificStyle?: IconStyle) => {
      return {
          color: specificStyle?.color || style.color,
          size: specificStyle?.size || (style.fontSize || 16) + 4, // Default sizing logic
          strokeWidth: specificStyle?.strokeWidth ?? style.strokeWidth ?? 2,
          absoluteStrokeWidth: specificStyle?.absoluteStrokeWidth ?? style.absoluteStrokeWidth,
      };
  };

  const DynamicIcon = props.iconName ? getIcon(props.iconName) : null;
  const LeftIcon = props.leftIcon ? getIcon(props.leftIcon) : null;
  const RightIcon = props.rightIcon ? getIcon(props.rightIcon) : null;
  const BtnIcon = props.icon ? getIcon(props.icon) : null;

  // Icon Styles
  const iconStyle = props.iconStyle as IconStyle | undefined;
  const leftIconStyle = props.leftIconStyle as IconStyle | undefined;
  const rightIconStyle = props.rightIconStyle as IconStyle | undefined;

  switch (type) {
    case 'button':
      // Button icon uses 'icon' prop and 'iconStyle' (mapped from properties panel logic)
      const btnIconProps = getIconProps(iconStyle);
      return (
        <button style={{ 
          ...commonStyle, 
          cursor: isPreview ? 'pointer' : 'default', 
          flexDirection: 'row', 
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {BtnIcon && <BtnIcon size={btnIconProps.size} color={btnIconProps.color} strokeWidth={btnIconProps.strokeWidth} absoluteStrokeWidth={btnIconProps.absoluteStrokeWidth} />}
          {props.text}
        </button>
      );
    case 'text':
      return (
        <div style={{ ...commonStyle, alignItems: 'flex-start', justifyContent: 'flex-start', overflow: 'visible' }}>
          {props.text}
        </div>
      );
    case 'input':
      return (
        <input
          type={props.type || 'text'}
          placeholder={props.placeholder}
          style={{ ...commonStyle, cursor: isPreview ? 'text' : 'default' }}
          disabled={!isPreview}
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={props.placeholder}
          rows={props.rows || 3}
          style={{ ...commonStyle, cursor: isPreview ? 'text' : 'default', resize: 'none' }}
          disabled={!isPreview}
        />
      );
    case 'checkbox':
        return (
            <div style={{...commonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {props.checked && <LucideIcons.Check size={element.width * 0.8} color={style.color} strokeWidth={3} />}
            </div>
        )
    case 'radio':
        return (
             <div style={{...commonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {props.checked && <div style={{width: '50%', height: '50%', backgroundColor: style.color, borderRadius: '50%'}} />}
            </div>
        )
    case 'toggle':
        return (
            <div style={{...commonStyle, display: 'flex', alignItems: 'center', padding: 4, justifyContent: props.checked ? 'flex-end' : 'flex-start', backgroundColor: props.checked ? style.backgroundColor : '#cbd5e1' }}>
                <div style={{ height: element.height - 8, width: element.height - 8, backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
            </div>
        )
    case 'image':
      return (
        <img
          src={props.src}
          alt={element.name}
          style={{ ...commonStyle, objectFit: 'cover' }}
          draggable={false}
        />
      );
    case 'video':
      return (
        <div style={{...commonStyle, backgroundColor: '#000'}}>
          <video
            src={props.src}
            controls={isPreview}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            draggable={false}
          />
          {!isPreview && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <LucideIcons.PlayCircle size={48} className="text-white/50" />
             </div>
          )}
        </div>
      );
    case 'icon':
      const standaloneIconProps = getIconProps(iconStyle);
      // For standalone icon, default to filling the box if no size set, or use prop size
      const iconSize = iconStyle?.size || Math.min(element.width, element.height) * 0.8;
      
      return (
         <div style={{ ...commonStyle, alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            {DynamicIcon ? (
                <DynamicIcon 
                    size={iconSize} 
                    color={standaloneIconProps.color} 
                    strokeWidth={standaloneIconProps.strokeWidth} 
                    absoluteStrokeWidth={standaloneIconProps.absoluteStrokeWidth} 
                />
            ) : <LucideIcons.HelpCircle size={iconSize} color={standaloneIconProps.color} />}
         </div>
      );
    case 'navbar':
      const lProps = getIconProps(leftIconStyle);
      const rProps = getIconProps(rightIconStyle);

      return (
        <div style={{ ...commonStyle, flexDirection: 'row', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
          {LeftIcon ? <LeftIcon size={lProps.size} color={lProps.color} strokeWidth={lProps.strokeWidth} absoluteStrokeWidth={lProps.absoluteStrokeWidth} /> : <div className="w-6" />}
          <div className="font-bold">{props.title}</div>
          {RightIcon ? <RightIcon size={rProps.size} color={rProps.color} strokeWidth={rProps.strokeWidth} absoluteStrokeWidth={rProps.absoluteStrokeWidth} /> : <div className="w-6" />}
        </div>
      );
    case 'card':
      return (
        <div style={{ ...commonStyle, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <h3 className="font-bold text-lg mb-2">{props.title}</h3>
          <p className="text-sm opacity-75">{props.subtitle}</p>
        </div>
      );
    case 'circle':
        return <div style={{...commonStyle, borderRadius: '50%'}} />;
    case 'group':
    case 'container':
    default:
      return <div style={commonStyle} />;
  }
};
