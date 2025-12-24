
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CanvasElement, IconStyle } from '../types';

interface ElementRendererProps {
  element: CanvasElement;
  isPreview: boolean;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isPreview }) => {
  const { type, style, props } = element;

  // Global border check
  const hasBorder = style.borderWidth || style.borderTopWidth !== undefined || style.borderBottomWidth !== undefined || style.borderLeftWidth !== undefined || style.borderRightWidth !== undefined;

  // Shadow generation
  const boxShadow = style.shadow ? 
    `${style.shadowOffsetX || 0}px ${style.shadowOffsetY || 4}px ${style.shadowBlur || 12}px ${style.shadowSpread || -2}px ${style.shadowColor || 'rgba(0,0,0,0.15)'}` : 
    'none';

  // Filter generation
  const filters = [];
  if (style.filterBlur) filters.push(`blur(${style.filterBlur}px)`);
  if (style.filterBrightness !== undefined) filters.push(`brightness(${style.filterBrightness}%)`);
  if (style.filterContrast !== undefined) filters.push(`contrast(${style.filterContrast}%)`);
  if (style.filterSaturate !== undefined) filters.push(`saturate(${style.filterSaturate}%)`);
  if (style.filterGrayscale) filters.push(`grayscale(${style.filterGrayscale}%)`);
  const filterString = filters.join(' ') || 'none';

  const commonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: style.backgroundColor,
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textTransform: style.textTransform as any,
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
    borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : undefined,
    borderTopLeftRadius: style.borderTopLeftRadius !== undefined ? `${style.borderTopLeftRadius}px` : undefined,
    borderTopRightRadius: style.borderTopRightRadius !== undefined ? `${style.borderTopRightRadius}px` : undefined,
    borderBottomLeftRadius: style.borderBottomLeftRadius !== undefined ? `${style.borderBottomLeftRadius}px` : undefined,
    borderBottomRightRadius: style.borderBottomRightRadius !== undefined ? `${style.borderBottomRightRadius}px` : undefined,
    borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
    borderTopWidth: style.borderTopWidth !== undefined ? `${style.borderTopWidth}px` : undefined,
    borderBottomWidth: style.borderBottomWidth !== undefined ? `${style.borderBottomWidth}px` : undefined,
    borderLeftWidth: style.borderLeftWidth !== undefined ? `${style.borderLeftWidth}px` : undefined,
    borderRightWidth: style.borderRightWidth !== undefined ? `${style.borderRightWidth}px` : undefined,
    borderColor: style.borderColor,
    borderTopColor: style.borderTopColor,
    borderBottomColor: style.borderBottomColor,
    borderLeftColor: style.borderLeftColor,
    borderRightColor: style.borderRightColor,
    borderStyle: style.borderStyle || (hasBorder ? 'solid' : undefined),
    boxShadow: boxShadow,
    opacity: style.opacity,
    fontFamily: style.fontFamily,
    textAlign: style.textAlign,
    textDecoration: style.textDecoration,
    padding: typeof style.padding === 'number' ? `${style.padding}px` : style.padding,
    lineHeight: style.lineHeight,
    filter: filterString,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    pointerEvents: isPreview ? 'auto' : 'none',
    boxSizing: 'border-box'
  };

  const getIcon = (name: string) => (LucideIcons as any)[name] || null;

  const getIconProps = (specificStyle?: IconStyle) => {
      return {
          color: specificStyle?.color || style.color,
          size: specificStyle?.size || (style.fontSize || 16) + 4,
          strokeWidth: specificStyle?.strokeWidth ?? style.strokeWidth ?? 2,
          absoluteStrokeWidth: specificStyle?.absoluteStrokeWidth ?? style.absoluteStrokeWidth,
      };
  };

  const DynamicIcon = props.iconName ? getIcon(props.iconName) : null;
  const BtnIcon = props.icon ? getIcon(props.icon) : null;

  const iconStyle = props.iconStyle as IconStyle | undefined;

  switch (type) {
    case 'button':
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
        <div style={{ ...commonStyle, alignItems: 'flex-start', justifyContent: 'flex-start', overflow: 'visible', whiteSpace: 'pre-wrap' }}>
          {props.text}
        </div>
      );
    case 'navbar':
      const NavLeftIcon = props.leftIcon ? getIcon(props.leftIcon) : null;
      const NavRightIcon = props.rightIcon ? getIcon(props.rightIcon) : null;
      return (
        <div style={{ 
          ...commonStyle, 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: style.padding || '0 16px'
        }}>
          <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
            {NavLeftIcon && React.createElement(NavLeftIcon, { size: 20 })}
          </div>
          <div style={{ 
            flex: 1, 
            textAlign: style.textAlign || 'center', 
            fontWeight: style.fontWeight || 'bold',
            fontSize: style.fontSize || 18
          }}>
            {props.title}
          </div>
          <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
            {NavRightIcon && React.createElement(NavRightIcon, { size: 20 })}
          </div>
        </div>
      );
    case 'card':
      return (
        <div style={{ 
          ...commonStyle, 
          padding: style.padding || 16, 
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: (style.fontSize || 14) + 2, marginBottom: 4 }}>
            {props.title}
          </div>
          <div style={{ fontSize: style.fontSize || 12, opacity: 0.7 }}>
            {props.subtitle}
          </div>
        </div>
      );
    case 'input':
      return (
        <input
          type={props.type || 'text'}
          placeholder={props.placeholder}
          style={{ ...commonStyle, cursor: isPreview ? 'text' : 'default' }}
          disabled={!isPreview}
          value={isPreview ? undefined : ''}
          readOnly={!isPreview}
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={props.placeholder}
          rows={props.rows || 3}
          style={{ ...commonStyle, cursor: isPreview ? 'text' : 'default', resize: 'none' }}
          disabled={!isPreview}
          value={isPreview ? undefined : ''}
          readOnly={!isPreview}
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
                <div style={{ height: Math.min(element.height, element.width) - 8, width: Math.min(element.height, element.width) - 8, backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
            </div>
        )
    case 'divider':
        const isHorizontal = element.width >= element.height;
        return (
            <div style={{ 
                ...commonStyle, 
                backgroundColor: style.backgroundColor || '#e2e8f0',
                height: isHorizontal ? (style.borderWidth || 1) : '100%',
                width: isHorizontal ? '100%' : (style.borderWidth || 1)
            }} />
        );
    case 'progress':
        const progress = Math.min(100, Math.max(0, props.value || 0));
        return (
            <div style={{ ...commonStyle, backgroundColor: props.trackColor || '#f1f5f9', padding: 0, justifyContent: 'flex-start', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: style.backgroundColor || '#3b82f6', transition: 'width 0.3s ease' }} />
            </div>
        );
    case 'badge':
        return (
            <div style={{ ...commonStyle, padding: '2px 8px', borderRadius: style.borderRadius ?? 9999, alignItems: 'center', justifyContent: 'center', fontSize: style.fontSize || 10, fontWeight: 'bold' }}>
                {props.text}
            </div>
        );
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
    case 'circle':
        return (
            <div style={{
                ...commonStyle, 
                borderRadius: '50%',
                borderTopLeftRadius: '50%',
                borderTopRightRadius: '50%',
                borderBottomLeftRadius: '50%',
                borderBottomRightRadius: '50%',
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden'
            }} />
        );
    case 'group':
    case 'container':
    default:
      return <div style={commonStyle} />;
  }
};
