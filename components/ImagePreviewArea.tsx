
import React, { useState, useRef, useEffect } from 'react';
import { Project, ScreenImage, CanvasElement } from '../types';
import { X, Check, ZoomIn, ZoomOut, Crop as CropIcon, RotateCcw, Ratio, BoxSelect, Maximize } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImagePreviewAreaProps {
  image: ScreenImage;
  project: Project;
  setProject: (p: Project) => void;
  onClose: () => void;
}

export const ImagePreviewArea: React.FC<ImagePreviewAreaProps> = ({
  image,
  project,
  setProject,
  onClose,
}) => {
    const [scale, setScale] = useState(1);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [imgDimensions, setImgDimensions] = useState<{ width: number, height: number, naturalWidth: number, naturalHeight: number } | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial Zoom Fit
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight, width, height } = e.currentTarget;
        setImgDimensions({ width, height, naturalWidth, naturalHeight });
        
        // Calculate fit scale based on container
        if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            const widthRatio = (clientWidth - 80) / naturalWidth; // 80px padding
            const heightRatio = (clientHeight - 80) / naturalHeight;
            const fitScale = Math.min(widthRatio, heightRatio, 1);
            setScale(fitScale);
        }
    };

    // Recalculate crop when aspect changes
    useEffect(() => {
        if (imgRef.current && imgDimensions) {
            if (aspect) {
                const { width, height } = imgRef.current;
                const newCrop = centerCrop(
                    makeAspectCrop(
                        {
                            unit: '%',
                            width: 50,
                        },
                        aspect,
                        width,
                        height,
                    ),
                    width,
                    height,
                );
                setCrop(newCrop);
                setCompletedCrop(convertToPixelCrop(newCrop, width, height));
            } else {
                // Resetting aspect allows free form, keep current crop if exists
            }
        }
    }, [aspect, imgDimensions]);

    const convertToPixelCrop = (crop: Crop, imageWidth: number, imageHeight: number): PixelCrop => {
        return {
            unit: 'px',
            x: crop.unit === '%' ? (crop.x / 100) * imageWidth : crop.x,
            y: crop.unit === '%' ? (crop.y / 100) * imageHeight : crop.y,
            width: crop.unit === '%' ? (crop.width / 100) * imageWidth : crop.width,
            height: crop.unit === '%' ? (crop.height / 100) * imageHeight : crop.height,
        };
    };

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        // We want the cropped image to be at natural resolution
        const targetWidth = Math.floor(crop.width * scaleX);
        const targetHeight = Math.floor(crop.height * scaleY);

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        // Draw from the source image (using natural coordinates derived from the scale)
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            targetWidth,
            targetHeight,
            0,
            0,
            targetWidth,
            targetHeight
        );

        return canvas.toDataURL('image/png');
    };

    const handleAddLayer = async () => {
        const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
        if (!activeScreen || !imgRef.current) return;

        let finalSrc = image.src;
        let finalWidth = 300;
        let finalHeight = 200;

        try {
            // Check if we have a valid crop selection (width & height > 0)
            if (completedCrop?.width && completedCrop?.height) {
                // Generate cropped image
                finalSrc = getCroppedImg(imgRef.current, completedCrop);
                
                // Calculate dimensions for the new element on canvas
                // We map the natural pixel size of the crop to a reasonable screen size (e.g. fit within 375 width)
                // Or maintain 1:1 if it's small enough.
                
                // Let's use the natural dimensions of the crop, but cap it if it's huge.
                const naturalCropWidth = completedCrop.width * (imgRef.current.naturalWidth / imgRef.current.width);
                const naturalCropHeight = completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height);
                
                if (naturalCropWidth > 300) {
                    finalWidth = 300;
                    finalHeight = (naturalCropHeight / naturalCropWidth) * 300;
                } else {
                    finalWidth = naturalCropWidth;
                    finalHeight = naturalCropHeight;
                }

            } else {
                // Full Image
                finalSrc = image.src;
                const natW = imgRef.current.naturalWidth || 800;
                const natH = imgRef.current.naturalHeight || 600;
                
                // Scale down for canvas insertion if huge
                if (natW > 375) {
                    finalWidth = 375;
                    finalHeight = (natH / natW) * 375;
                } else {
                    finalWidth = natW;
                    finalHeight = natH;
                }
            }

            const newElement: CanvasElement = {
                id: uuidv4(),
                type: 'image',
                name: completedCrop ? 'Cropped Image' : image.name,
                x: 20, // Default position
                y: 20,
                width: finalWidth,
                height: finalHeight,
                zIndex: activeScreen.elements.length + 1,
                props: { src: finalSrc },
                style: { borderRadius: 0 },
                interactions: []
            };

            const updatedScreens = project.screens.map(s => 
                s.id === project.activeScreenId 
                ? { ...s, elements: [...s.elements, newElement] }
                : s
            );

            setProject({ ...project, screens: updatedScreens });
            onClose();

        } catch (e) {
            console.error("Crop failed:", e);
            alert("Failed to crop image. This might be due to CORS restrictions on the image source.");
        }
    };

    const toggleAspect = () => {
        if (aspect === undefined) setAspect(1);
        else if (aspect === 1) setAspect(16/9);
        else if (aspect === 16/9) setAspect(4/3);
        else setAspect(undefined);
    };

    const getAspectLabel = () => {
        if (aspect === undefined) return "Free";
        if (aspect === 1) return "1:1";
        if (aspect === 16/9) return "16:9";
        if (aspect === 4/3) return "4:3";
        return "Custom";
    }

  return (
    <div className="flex flex-col h-full w-full bg-gray-950 text-white animate-in fade-in duration-300 relative z-50">
        
        {/* Top Toolbar */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 shadow-lg z-20">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                    <span className="p-1.5 bg-indigo-600 rounded-lg"><CropIcon size={16} /></span>
                    <span className="opacity-90">Edit Image</span>
                </h2>
                <div className="h-6 w-px bg-gray-700 mx-2" />
                <span className="text-sm text-gray-400 truncate max-w-[200px]">{image.name}</span>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                >
                    <X size={16} /> Cancel
                </button>
                <button 
                    onClick={handleAddLayer} 
                    className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                    <Check size={18} /> {(completedCrop?.width && completedCrop?.height) ? 'Add Selection' : 'Add Original'}
                </button>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Controls */}
            <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-4 z-20 shadow-md">
                <div className="flex flex-col gap-1">
                    <button 
                        onClick={() => setScale(Math.min(3, scale + 0.1))} 
                        className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors tooltip-trigger"
                        title="Zoom In"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button 
                        onClick={() => setScale(Math.max(0.1, scale - 0.1))} 
                        className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button 
                        onClick={() => {
                            if (containerRef.current && imgDimensions) {
                                const { clientWidth, clientHeight } = containerRef.current;
                                const fitScale = Math.min((clientWidth - 80)/imgDimensions.naturalWidth, (clientHeight - 80)/imgDimensions.naturalHeight, 1);
                                setScale(fitScale);
                            }
                        }} 
                        className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                        title="Fit to Screen"
                    >
                        <Maximize size={20} />
                    </button>
                </div>

                <div className="w-8 h-px bg-gray-800" />

                <button 
                    onClick={toggleAspect} 
                    className={`p-3 rounded-xl transition-colors flex flex-col items-center gap-1 ${aspect !== undefined ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    title="Aspect Ratio"
                >
                    <Ratio size={20} />
                    <span className="text-[9px] font-bold">{getAspectLabel()}</span>
                </button>

                <button 
                    onClick={() => { setCrop(undefined); setCompletedCrop(undefined); setAspect(undefined); }} 
                    className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors mt-auto"
                    title="Reset Crop"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto bg-gray-950 relative flex items-center justify-center p-10"
                style={{
                    backgroundImage: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            >
                {/* Image Container */}
                <div 
                    style={{ 
                        // Using explicit dimensions instead of transform: scale for robust cropping coordinates
                        width: imgDimensions ? imgDimensions.naturalWidth * scale : 'auto',
                        height: imgDimensions ? imgDimensions.naturalHeight * scale : 'auto',
                        transition: 'width 0.2s, height 0.2s',
                        boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    className="relative"
                >
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        className="bg-black/20"
                    >
                        <img
                            ref={imgRef}
                            alt="Crop target"
                            src={image.src}
                            crossOrigin="anonymous" 
                            onLoad={onImageLoad}
                            style={{ 
                                display: 'block', 
                                width: '100%', 
                                height: '100%',
                                pointerEvents: 'none' // Let ReactCrop handle events
                            }}
                            draggable={false}
                        />
                    </ReactCrop>
                </div>

                {/* Floating Hint */}
                {(!completedCrop?.width || !completedCrop?.height) && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-gray-300 px-6 py-3 rounded-full text-sm font-medium shadow-xl backdrop-blur-md pointer-events-none animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 border border-gray-700">
                        <BoxSelect size={18} className="text-indigo-400"/>
                        Drag on the image to select an area
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
