import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, Play, Sun, Moon, Menu, X, MessageSquare } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { NavigationItem as NavigationItemType, Theme } from '../types';

// FloatingNavigation组件属性接口
interface FloatingNavigationProps {
  theme: Theme;
  onToggleTheme: () => void;
  visible?: boolean;
  onAIChatToggle?: () => void;
  isAIChatOpen?: boolean;
}

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  theme,
  onToggleTheme,
  visible = true,
  onAIChatToggle,
  isAIChatOpen = false
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 导航项配置
  const navigationItems: NavigationItemType[] = [
    {
      id: 'resume',
      icon: FileText,
      label: '简历',
      href: '#resume'
    },
    {
      id: 'gallery',
      icon: Image,
      label: '作品集',
      href: '#gallery'
    },
    {
      id: 'theater',
      icon: Play,
      label: '视频影院',
      href: '#theater'
    },
    {
      id: 'ai-chat',
      icon: MessageSquare,
      label: 'AI 问答',
      onClick: onAIChatToggle
    },
    {
      id: 'theme',
      icon: theme === 'light' ? Moon : Sun,
      label: '主题切换',
      onClick: onToggleTheme
    }
  ];

  // 处理导航项点击
  const handleItemClick = (item: NavigationItemType) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      // 平滑滚动到目标元素
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // 移动端点击后关闭菜单
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // 处理悬停状态
  const handleItemHover = (itemId: string, expanded: boolean) => {
    setHoveredItem(expanded ? itemId : null);
  };

  // 主题相关样式
  const containerBg = theme === 'dark' 
    ? 'bg-[#0d1117]/95 border-white/10' 
    : 'bg-white/30 border-black/5';

  const mobileButtonBg = theme === 'dark'
    ? 'bg-[#0d1117]/95 border-white/10 text-white'
    : 'bg-white/80 border-black/5 text-black';

  // 如果模态框打开，隐藏导航栏
  if (!visible) return null;

  // 移动端渲染
  if (isMobile) {
    return (
      <>
        {/* 移动端悬浮按钮 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`fixed right-4 bottom-4 z-50 p-4 glass rounded-full border shadow-2xl transition-all duration-300 no-print ${mobileButtonBg}`}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* 移动端展开菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed right-4 bottom-20 z-50 glass rounded-2xl p-3 border shadow-2xl transition-all duration-300 no-print ${containerBg}`}
            >
              <div className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    theme={theme}
                    isExpanded={true} // 移动端始终展开显示文字
                    onHover={() => {}} // 移动端不需要悬停效果
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* 点击遮罩关闭菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 no-print"
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // 桌面端渲染 - 圆形导航
  return (
    <motion.nav
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 no-print`}
    >
      {navigationItems.map((item) => {
        const isAIChatActive = item.id === 'ai-chat' && isAIChatOpen;
        return (
          <motion.div
            key={item.id}
            onHoverStart={() => handleItemHover(item.id, true)}
            onHoverEnd={() => handleItemHover(item.id, false)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => handleItemClick(item)}
              className={`w-14 h-14 rounded-full glass flex items-center justify-center border shadow-2xl transition-all duration-300 relative ${
                isAIChatActive
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'hover:bg-blue-500 hover:text-white'
              } ${containerBg}`}
              title={item.label}
            >
              <item.icon size={20} />
              {hoveredItem === item.id && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`absolute right-full mr-3 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${theme === 'dark' ? 'bg-white text-[#010409]' : 'bg-black text-white'}`}
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          </motion.div>
        );
      })}
    </motion.nav>
  );
};