import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, AlertCircle, RotateCcw } from 'lucide-react';
import { useLazyLoad, preloadImage } from '../hooks/useLazyLoad';
import { Theme } from '../types';

interface LazyImageProps {
  src: string;
  alt: string;
  thumbnail?: string; // 缩略图URL，用于快速显示
  className?: string;
  placeholder?: React.ReactNode; // 自定义占位符
  errorPlaceholder?: React.ReactNode; // 自定义错误占位符
  onLoad?: () => void;
  onError?: (error: Error) => void;
  threshold?: number; // 懒加载阈值
  theme?: Theme;
  showRetry?: boolean; // 是否显示重试按钮
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  thumbnail,
  className = '',
  placeholder,
  errorPlaceholder,
  onLoad,
  onError,
  threshold = 200,
  theme = 'light',
  showRetry = true
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  
  const { 
    ref, 
    isInView, 
    hasError, 
    retry,
    markAsLoaded,
    markAsError 
  } = useLazyLoad({ 
    threshold,
    triggerOnce: true 
  }) as any;

  // 当元素进入视口时开始加载图片
  useEffect(() => {
    if (!isInView) return;

    const loadImage = async () => {
      try {
        setImageState('loading');
        
        // 如果有缩略图，先显示缩略图
        if (thumbnail && !currentSrc) {
          await preloadImage(thumbnail);
          setCurrentSrc(thumbnail);
        }
        
        // 然后加载高清图片
        await preloadImage(src);
        setCurrentSrc(src);
        setImageState('loaded');
        markAsLoaded();
        onLoad?.();
        
      } catch (error) {
        setImageState('error');
        markAsError();
        onError?.(error as Error);
      }
    };

    loadImage();
  }, [isInView, src, thumbnail, currentSrc, markAsLoaded, markAsError, onLoad, onError]);

  // 重试加载
  const handleRetry = () => {
    setImageState('loading');
    setCurrentSrc(null);
    retry();
  };

  // 默认占位符
  const defaultPlaceholder = (
    <div className={`flex flex-col items-center justify-center h-full min-h-[200px] transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800/50 text-gray-400' 
        : 'bg-gray-100 text-gray-500'
    }`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-3"
      >
        <ImageIcon size={32} />
      </motion.div>
      <p className="text-sm font-medium">加载中...</p>
    </div>
  );

  // 默认错误占位符
  const defaultErrorPlaceholder = (
    <div className={`flex flex-col items-center justify-center h-full min-h-[200px] transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-red-900/20 text-red-400 border border-red-800/30' 
        : 'bg-red-50 text-red-600 border border-red-200'
    }`}>
      <AlertCircle size={32} className="mb-3" />
      <p className="text-sm font-medium mb-3">图片加载失败</p>
      {showRetry && (
        <button
          onClick={handleRetry}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-red-800/30 hover:bg-red-800/50 text-red-300'
              : 'bg-red-100 hover:bg-red-200 text-red-700'
          }`}
        >
          <RotateCcw size={14} />
          重试
        </button>
      )}
    </div>
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {imageState === 'loading' && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {placeholder || defaultPlaceholder}
          </motion.div>
        )}
        
        {imageState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {errorPlaceholder || defaultErrorPlaceholder}
          </motion.div>
        )}
        
        {imageState === 'loaded' && currentSrc && (
          <motion.img
            key="image"
            src={currentSrc}
            alt={alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-full h-full object-cover"
            loading="lazy" // 浏览器原生懒加载作为备选
          />
        )}
      </AnimatePresence>
      
      {/* 加载进度指示器 */}
      {imageState === 'loading' && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className={`h-1 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              className={`h-full ${
                theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};