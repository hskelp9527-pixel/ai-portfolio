import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ProjectImage, Theme } from '../types';

interface ImageModalProps {
  image: ProjectImage | null;
  images?: ProjectImage[]; // 图片列表，用于导航
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  theme: Theme;
}

interface TransformState {
  scale: number;
  x: number;
  y: number;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  image,
  images = [],
  isOpen,
  onClose,
  onNext,
  onPrev,
  theme
}) => {
  const [transform, setTransform] = useState<TransformState>({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 重置变换状态
  const resetTransform = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  // 当图片改变时重置变换
  useEffect(() => {
    if (image) {
      resetTransform();
    }
  }, [image, resetTransform]);

  // 键盘事件处理
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext?.();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          resetTransform();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setShowInfo(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, resetTransform]);

  // 缩放功能
  const handleZoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.25, 5) // 最大5倍缩放
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.25, 0.3) // 最小0.3倍缩放
    }));
  }, []);

  // 鼠标滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * delta))
    }));
  }, []);

  // 拖拽处理
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (transform.scale <= 1) return; // 只有放大时才允许拖拽

    setTransform(prev => ({
      ...prev,
      x: prev.x + info.delta.x,
      y: prev.y + info.delta.y
    }));
  }, [transform.scale]);

  // 双击缩放
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (transform.scale === 1) {
      // 放大到点击位置
      const rect = imageRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        setTransform({
          scale: 2,
          x: (centerX - clickX) * 2,
          y: (centerY - clickY) * 2
        });
      }
    } else {
      resetTransform();
    }
  }, [transform.scale, resetTransform]);

  // 触摸手势处理（简化版）
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setTouchStart({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStart) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = Math.max(0.5, Math.min(3, transform.scale * (distance / touchStart.distance)));
      setTransform(prev => ({ ...prev, scale }));
    }
  }, [touchStart, transform.scale]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  if (!image) return null;

  const currentIndex = images.findIndex(img => img.id === image.id);
  const hasNavigation = images.length > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] backdrop-blur-[50px] flex items-center justify-center no-print transition-colors duration-500 ${
            theme === 'dark' ? 'bg-[#010409]/95' : 'bg-white/95'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* 关闭按钮 - 移动端触摸目标更大 */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-3 glass rounded-full transition-all border z-50 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
              theme === 'dark'
                ? 'text-white border-white/20 bg-white/10 hover:bg-white/20'
                : 'text-black border-black/10 bg-black/5 hover:bg-black/10'
            }`}
          >
            <X size={20} />
          </button>

          {/* 左右切换按钮 - 移动端触摸目标更大 */}
          {hasNavigation && (
            <>
              <button
                onClick={onPrev}
                className={`absolute left-4 top-1/2 -translate-y-1/2 sm:left-6 p-4 sm:p-4 glass rounded-full transition-all border shadow-2xl z-10 min-w-[48px] min-h-[48px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                  theme === 'dark'
                    ? 'text-white border-white/20 bg-white/10 hover:bg-white/20'
                    : 'text-black border-black/10 bg-black/5 hover:bg-black/10'
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={onNext}
                className={`absolute right-4 top-1/2 -translate-y-1/2 sm:right-6 p-4 sm:p-4 glass rounded-full transition-all border shadow-2xl z-10 min-w-[48px] min-h-[48px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                  theme === 'dark'
                    ? 'text-white border-white/20 bg-white/10 hover:bg-white/20'
                    : 'text-black border-black/10 bg-black/5 hover:bg-black/10'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* 图片容器 */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-20">
            <motion.img
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-full object-contain select-none cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};