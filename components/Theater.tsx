import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIDEOS } from '../data';
import { Play, Pause, X, Grid, Columns2, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize, SkipBack, SkipForward, AlertCircle } from 'lucide-react';
import { ProjectVideo, Theme } from '../types';
import { ParallaxCard } from './ParallaxCard';
import { LazyImage } from './LazyImage';

interface TheaterProps {
  theme: Theme;
  onModalStateChange?: (isOpen: boolean) => void;
}

export const Theater: React.FC<TheaterProps> = ({ theme, onModalStateChange }) => {
  const [selectedVideo, setSelectedVideo] = useState<ProjectVideo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 自动轮播控制
  useEffect(() => {
    if (viewMode === 'carousel' && !isPaused && VIDEOS.length > 1) {
      timerRef.current = window.setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % VIDEOS.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewMode, isPaused]);

  // 通知父组件模态框状态变化
  useEffect(() => {
    onModalStateChange?.(!!selectedVideo);
  }, [selectedVideo, onModalStateChange]);

  // 视频切换时重置状态
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      // 重置视频状态
      setProgress(0);
      setIsPlaying(false);
      setDuration(0);
      setVideoError(false);
    }
  }, [selectedVideo?.url]);

  // 模态框关闭时停止视频
  useEffect(() => {
    if (!selectedVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [selectedVideo]);

  // 键盘控制
  useEffect(() => {
    if (!selectedVideo) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setSelectedVideo(null);
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          handlePrevVideo();
          break;
        case 'ArrowRight':
          handleNextVideo();
          break;
        case 'm':
          setIsMuted(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  // 视频播放控制
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // 处理视频单击
  const handleVideoClick = () => {
    togglePlay();
    showControlsTemporarily();
  };

  // 临时显示控制栏
  const showControlsTemporarily = () => {
    setIsControlsVisible(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoError(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevVideo = () => {
    if (!selectedVideo) return;

    // 先停止当前视频
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const currentIndex = VIDEOS.findIndex(v => v.id === selectedVideo.id);
    const prevIndex = (currentIndex - 1 + VIDEOS.length) % VIDEOS.length;

    // 重置所有状态
    setVideoError(false);
    setProgress(0);
    setIsPlaying(false);
    setDuration(0);

    // 延迟切换，确保清理完成
    setTimeout(() => {
      setSelectedVideo(VIDEOS[prevIndex]);
    }, 50);
  };

  const handleNextVideo = () => {
    if (!selectedVideo) return;

    // 先停止当前视频
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const currentIndex = VIDEOS.findIndex(v => v.id === selectedVideo.id);
    const nextIndex = (currentIndex + 1) % VIDEOS.length;

    // 重置所有状态
    setVideoError(false);
    setProgress(0);
    setIsPlaying(false);
    setDuration(0);

    // 延迟切换，确保清理完成
    setTimeout(() => {
      setSelectedVideo(VIDEOS[nextIndex]);
    }, 50);
  };

  // 音量控制
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % VIDEOS.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);

  const switchBg = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/75 border-white/40';
  const sectionBg = 'bg-transparent';

  // 如果没有视频，显示占位提示
  if (VIDEOS.length === 0) {
    return (
      <section id="theater" className={`py-8 sm:py-24 px-6 transition-colors duration-300 mt-6 sm:mt-20 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>视频影院</h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>暂无视频内容</p>
        </div>
      </section>
    );
  }

  return (
    <section id="theater" className={`py-8 sm:py-24 px-6 transition-colors duration-300 mt-6 sm:mt-20 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto mb-10 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-2 sm:mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>视频影院</h2>
          <p className={`text-base sm:text-lg md:text-xl max-w-xl font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-[#1D1D1F]/80'}`}>
            AI 视频生成作品展示，探索 Sora、Runway、Veo 等前沿技术。
          </p>
        </div>
        
        {/* 视图切换按钮 - 响应式优化 */}
        <div className={`flex glass rounded-2xl p-1 items-center no-print shadow-2xl border transition-all duration-700 ${switchBg}`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold hover:bg-blue-500 hover:text-white ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-white text-[#010409] shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'opacity-60 text-white' : 'opacity-60 text-black')}`}
          >
            <Grid size={18} /> 平铺
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold hover:bg-blue-500 hover:text-white ${viewMode === 'carousel' ? (theme === 'dark' ? 'bg-white text-[#010409] shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'opacity-60 text-white' : 'opacity-60 text-black')}`}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {VIDEOS.map((video) => (
                <ParallaxCard key={video.id}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer relative"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => { setSelectedVideo(video); setVideoError(false); }}
                  >
                    <div className={`relative aspect-video rounded-xl sm:rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-xl sm:shadow-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#0a1628]/60 border-white/20' : 'bg-white border-white/60'}`}>
                      {video.thumbnail.includes('.mp4') ? (
                        <video
                          src={video.thumbnail}
                          muted
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          preload="none"
                        />
                      ) : (
                        <LazyImage
                          src={video.thumbnail}
                          alt={video.title}
                          theme={theme}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          threshold={300}
                        />
                      )}
                      
                      {/* 播放按钮遮罩 */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center">
                        <div className="p-3 sm:p-4 lg:p-5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 mb-3 sm:mb-4">
                          <Play fill="white" className="text-white w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                        </div>
                        <h3 className="text-white font-bold text-sm sm:text-base lg:text-xl mb-1 px-4 text-center">{video.title}</h3>
                        <p className="text-white/70 text-xs sm:text-sm px-4 text-center line-clamp-2">{video.description}</p>
                        {video.duration && (
                          <span className="mt-2 px-2 py-0.5 bg-black/50 rounded text-white/80 text-xs">{formatTime(video.duration)}</span>
                        )}
                      </div>
                      
                      {/* 时长标签 */}
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/70 rounded text-white text-[10px] sm:text-xs font-medium">
                          {formatTime(video.duration)}
                        </div>
                      )}
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
              className={`relative w-full aspect-video rounded-xl sm:rounded-2xl lg:rounded-[3rem] overflow-hidden glass border shadow-2xl transition-all duration-700 ${theme === 'dark' ? 'bg-[#0a1628]/40 border-white/20' : 'bg-white/75 border-white/50'}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 cursor-pointer group bg-black"
                  onClick={() => { setSelectedVideo(VIDEOS[carouselIndex]); setVideoError(false); }}
                >
                  {VIDEOS[carouselIndex].thumbnail.includes('.mp4') ? (
                    <video
                      src={VIDEOS[carouselIndex].thumbnail}
                      muted
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      preload="none"
                    />
                  ) : (
                    <LazyImage
                      src={VIDEOS[carouselIndex].thumbnail}
                      alt={VIDEOS[carouselIndex].title}
                      theme={theme}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      threshold={300}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 sm:p-6 lg:p-10 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                      <Play fill="white" className="text-white w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-12 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                    <div className="max-w-3xl">
                      <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-blue-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 sm:mb-4 shadow-lg">Featured</span>
                      <h3 className="text-white text-lg sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 lg:mb-4 tracking-tight">{VIDEOS[carouselIndex].title}</h3>
                      <p className="text-white/80 text-xs sm:text-sm lg:text-lg font-medium line-clamp-2">{VIDEOS[carouselIndex].description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {VIDEOS.length > 1 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 sm:left-4 sm:right-4 lg:left-8 lg:right-8 flex justify-between pointer-events-none no-print">
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                      className={`p-2 sm:p-3 lg:p-5 glass rounded-full pointer-events-auto hover:bg-white hover:text-[#010409] transition-all border shadow-2xl ${theme === 'dark' ? 'border-white/30 text-white bg-black/20' : 'border-black/10 text-black bg-white/20'}`}
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                      className={`p-2 sm:p-3 lg:p-5 glass rounded-full pointer-events-auto hover:bg-white hover:text-[#010409] transition-all border shadow-2xl ${theme === 'dark' ? 'border-white/30 text-white bg-black/20' : 'border-black/10 text-black bg-white/20'}`}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-10 lg:right-12 flex gap-1.5 sm:gap-2 lg:gap-3 no-print z-10">
                    {VIDEOS.map((_, i) => (
                      <div 
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                        className={`h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-500 cursor-pointer ${i === carouselIndex ? 'w-6 sm:w-8 lg:w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'w-1 sm:w-1.5 lg:w-2 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 沉浸式全屏播放器 - 增强版 */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] backdrop-blur-[50px] flex items-center justify-center p-2 sm:p-4 lg:p-12 no-print transition-colors duration-500 ${theme === 'dark' ? 'bg-[#010409]/95' : 'bg-white/95'}`}
            onClick={() => setSelectedVideo(null)}
          >
            {/* 顶部信息栏 */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-12 flex items-center gap-2 sm:gap-3 lg:gap-4 no-print z-20" onClick={(e) => e.stopPropagation()}>
              <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`}>
                <Play className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                <h4 className={`text-xs sm:text-sm lg:text-xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{selectedVideo.title}</h4>
                <p className={`text-[10px] sm:text-xs lg:text-xs font-black uppercase tracking-widest opacity-40 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>视频影院</p>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={() => setSelectedVideo(null)}
              className={`absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 p-2 sm:p-3 lg:p-5 glass rounded-full hover:scale-110 transition-all z-50 shadow-2xl border ${theme === 'dark' ? 'text-white border-white/20 bg-white/10' : 'text-black border-black/10 bg-black/5'}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
            </button>

            {/* 视频播放器容器 */}
            <div className="w-full max-w-6xl aspect-video relative group" onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className={`w-full h-full rounded-xl sm:rounded-2xl lg:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.6)] border sm:border-2 lg:border-4 ${theme === 'dark' ? 'border-white/10' : 'border-white'}`}
                onClick={handleVideoClick}
                onMouseEnter={() => setIsControlsVisible(true)}
                onMouseLeave={() => { if (isPlaying) setIsControlsVisible(false); }}
              >
                {videoError ? (
                  <div className={`w-full h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <AlertCircle className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                    <p className={`text-sm sm:text-base lg:text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>视频加载失败</p>
                    <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>请检查视频文件是否存在</p>
                  </div>
                ) : (
                  <video
                    key={selectedVideo.url}
                    ref={videoRef}
                    src={selectedVideo.url}
                    preload="none"
                    poster={selectedVideo.thumbnail}
                    className="w-full h-full object-contain bg-black cursor-pointer"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={handleVideoError}
                    onPlay={() => { setIsPlaying(true); showControlsTemporarily(); }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onVolumeChange={() => {
                      if (videoRef.current) {
                        setVolume(videoRef.current.volume);
                        setIsMuted(videoRef.current.muted);
                      }
                    }}
                    playsInline
                  />
                )}
              </motion.div>

              {/* 自定义控制栏 */}
              {!videoError && (
                <div
                  className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 rounded-b-xl sm:rounded-b-2xl lg:rounded-b-[3rem] ${isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 进度条 - 移动端更高更易点击 */}
                  <div
                    className="w-full h-2 sm:h-1.5 lg:h-2 bg-white/20 rounded-full cursor-pointer mb-3 sm:mb-3 lg:mb-4 group/progress"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-blue-500 rounded-full relative transition-all"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* 控制按钮 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-2 lg:gap-4">
                      {/* 上一个 - 移动端触摸目标更大 */}
                      <button onClick={handlePrevVideo} className="p-3 sm:p-2 lg:p-3 hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center">
                        <SkipBack className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </button>

                      {/* 播放/暂停 - 移动端触摸目标更大 */}
                      <button onClick={togglePlay} className="p-3 sm:p-3 lg:p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors min-w-[52px] min-h-[52px] sm:min-w-0 sm:min-h-0 flex items-center justify-center">
                        {isPlaying ? (
                          <Pause className="w-6 h-6 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="white" />
                        ) : (
                          <Play className="w-6 h-6 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="white" />
                        )}
                      </button>

                      {/* 下一个 - 移动端触摸目标更大 */}
                      <button onClick={handleNextVideo} className="p-3 sm:p-2 lg:p-3 hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center">
                        <SkipForward className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </button>

                      {/* 时间显示 - 移动端字体更大 */}
                      <span className="text-white text-xs sm:text-xs lg:text-sm font-medium ml-2 sm:ml-2">
                        {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-2 lg:gap-3">
                      {/* 音量控制 - 移动端触摸目标更大 */}
                      <button
                        onClick={toggleMute}
                        className="p-3 sm:p-2 lg:p-3 hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        )}
                      </button>
                      {/* 音量滑块 - 移动端更宽 */}
                      <div className="flex items-center w-28 sm:w-24 lg:w-32">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-full h-1.5 sm:h-1 lg:h-1 bg-white/20 rounded-full appearance-none cursor-pointer hover:bg-white/30 transition-colors [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:sm:w-3 [&::-webkit-slider-thumb]:sm:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                        />
                      </div>
                      
                      {/* 全屏 - 移动端触摸目标更大 */}
                      <button onClick={toggleFullscreen} className="p-3 sm:p-2 lg:p-3 hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center">
                        <Maximize className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 视频描述 */}
              <div className="mt-4 sm:mt-6 lg:mt-8 text-center max-w-3xl mx-auto px-4">
                <p className={`text-xs sm:text-sm lg:text-lg font-medium leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedVideo.description}
                </p>
                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    {selectedVideo.tags.map((tag, i) => (
                      <span key={i} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${theme === 'dark' ? 'bg-white/10 text-white/70' : 'bg-black/5 text-black/60'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
