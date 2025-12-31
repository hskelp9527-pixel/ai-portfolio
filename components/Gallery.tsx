
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../data';
import { ParallaxCard } from './ParallaxCard';
import { LazyImage } from './LazyImage';
import { ImageModal } from './ImageModal';
import { Maximize2, Grid, Columns2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectImage, Theme } from '../types';

interface GalleryProps {
  theme: Theme;
  onModalStateChange?: (isOpen: boolean) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ theme, onModalStateChange }) => {
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (viewMode === 'carousel' && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % IMAGES.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewMode, isPaused]);

  // 通知父组件模态框状态变化
  useEffect(() => {
    onModalStateChange?.(!!selectedImage);
  }, [selectedImage, onModalStateChange]);

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  // 模态框导航
  const handleModalNext = () => {
    if (!selectedImage) return;
    const currentIndex = IMAGES.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % IMAGES.length;
    setSelectedImage(IMAGES[nextIndex]);
  };

  const handleModalPrev = () => {
    if (!selectedImage) return;
    const currentIndex = IMAGES.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
    setSelectedImage(IMAGES[prevIndex]);
  };

  const switchBg = theme === 'dark' ? 'bg-[#0a1628]/90 border-white/20' : 'bg-white/30 border-white/40';

  return (
    <section id="gallery" className="py-8 sm:py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>AIGC 作品集</h2>
          <p className={`text-lg max-w-xl font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white/80' : 'text-[#1D1D1F]/80'}`}>精选的高保真 AIGC 探索系列。</p>
        </div>
        
        {/* 视图切换按钮 */}
        <div className={`flex glass rounded-2xl p-1 items-center no-print shadow-2xl border transition-all duration-700 ${switchBg}`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold hover:bg-blue-500 hover:text-white ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-white text-[#020617] shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'opacity-60 text-white' : 'opacity-60 text-black')}`}
          >
            <Grid size={18} /> 平铺
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold hover:bg-blue-500 hover:text-white ${viewMode === 'carousel' ? (theme === 'dark' ? 'bg-white text-[#020617] shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'opacity-60 text-white' : 'opacity-60 text-black')}`}
          >
            <Columns2 size={18} /> 轮播
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {IMAGES.map((img) => (
                <ParallaxCard key={img.id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className={`relative aspect-[4/3] rounded-[2.5rem] overflow-hidden group shadow-2xl border h-full transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'border-white/10 bg-[#0a1628]/90' : 'border-white/20'}`}
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setSelectedImage(img)}
                  >
                    {/* 使用 LazyImage 组件 */}
                    <LazyImage
                      src={img.url}
                      thumbnail={img.thumbnail}
                      alt={img.title}
                      theme={theme}
                      className="w-full h-full"
                      onLoad={() => console.log(`Loaded: ${img.title}`)}
                      onError={(error) => console.error(`Failed to load: ${img.title}`, error)}
                    />
                    
                    {/* 悬停 3D 文字遮罩 */}
                    <div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 cursor-pointer"
                      style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}
                    >
                      <motion.div style={{ transform: 'translateZ(20px)' }}>
                        <h3 className="text-white font-bold text-xl">{img.title}</h3>
                        <p className="text-white/70 text-xs mt-1">{img.description}</p>
                        {img.category && (
                          <span className="inline-block mt-2 px-2 py-1 bg-white/20 rounded-md text-white/80 text-xs">
                            {img.category}
                          </span>
                        )}
                      </motion.div>
                      
                      <div className="mt-4 flex justify-end">
                        <div 
                          className="p-2 bg-white/20 rounded-full backdrop-blur-md border border-white/30"
                          style={{ transform: 'translateZ(40px)' }}
                        >
                          <Maximize2 className="text-white" size={20} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ParallaxCard>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[3.5rem] overflow-hidden glass border shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 ${theme === 'dark' ? 'bg-[#0a1628]/90 border-white/20' : 'bg-white/30 border-white/50'}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <AnimatePresence initial={false} custom={carouselIndex}>
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setSelectedImage(IMAGES[carouselIndex])}
                >
                  <LazyImage
                    src={IMAGES[carouselIndex].url}
                    thumbnail={IMAGES[carouselIndex].thumbnail}
                    alt={IMAGES[carouselIndex].title}
                    theme={theme}
                    className="w-full h-full"
                    onLoad={() => console.log(`Carousel loaded: ${IMAGES[carouselIndex].title}`)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#010409]/90 to-transparent">
                    <h3 className="text-white text-4xl font-bold mb-2">{IMAGES[carouselIndex].title}</h3>
                    <p className="text-white/70 text-lg max-w-2xl">{IMAGES[carouselIndex].description}</p>
                    {IMAGES[carouselIndex].category && (
                      <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-lg text-white/90 text-sm font-medium">
                        {IMAGES[carouselIndex].category}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 flex justify-between pointer-events-none no-print">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className={`p-4 glass rounded-full pointer-events-auto hover:bg-white hover:text-[#020617] transition-all border shadow-lg ${theme === 'dark' ? 'border-white/30 text-white' : 'border-black/10 text-black'}`}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className={`p-4 glass rounded-full pointer-events-auto hover:bg-white hover:text-[#020617] transition-all border shadow-lg ${theme === 'dark' ? 'border-white/30 text-white' : 'border-black/10 text-black'}`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute top-8 right-12 flex gap-2 no-print">
                {IMAGES.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === carouselIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 增强的图片模态框 */}
      <ImageModal
        image={selectedImage}
        images={IMAGES}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
        theme={theme}
      />
    </section>
  );
};
