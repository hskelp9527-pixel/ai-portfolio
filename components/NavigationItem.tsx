import { motion } from 'framer-motion';
import { NavigationItem as NavigationItemType, Theme } from '../types';

interface NavigationItemProps {
  item: NavigationItemType;
  theme: Theme;
  isExpanded: boolean;
  onHover: (expanded: boolean) => void;
  onClick: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  theme,
  isExpanded,
  onHover,
  onClick
}) => {
  const IconComponent = item.icon;

  // 主题相关样式
  const itemBg = theme === 'dark'
    ? 'hover:bg-white/10'
    : 'hover:bg-black/5';

  const iconColor = theme === 'dark'
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-600 hover:text-black';

  const labelColor = theme === 'dark'
    ? 'text-white'
    : 'text-black';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onTouchStart={() => onHover(true)}
      onTouchEnd={() => onHover(false)}
      className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 min-w-[48px] min-h-[48px] ${itemBg} ${iconColor}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={item.label}
    >
      {/* 图标 */}
      <IconComponent 
        size={20} 
        className="shrink-0 transition-colors duration-300" 
      />
      
      {/* 展开的文字标签 */}
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ 
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? 'auto' : 0
        }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeInOut',
          opacity: { duration: 0.2 },
          width: { duration: 0.3 }
        }}
        className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-colors duration-300 ${labelColor}`}
        style={{
          // 确保文字从右到左滑入的效果
          transformOrigin: 'left center'
        }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
};