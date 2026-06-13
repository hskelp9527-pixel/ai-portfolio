import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  CalendarCheck,
  Type,
  Smile,
  Shirt,
  Stethoscope,
  Building2,
  Scan,
  ExternalLink,
  Terminal
} from 'lucide-react';
import { Theme } from '../types';

interface ProjectLink {
  name: string;
  url: string;
  icon: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links?: ProjectLink[];
}

interface ProjectCardProps {
  project: Project;
  theme: Theme;
}

// 图标映射
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart,
  CalendarCheck,
  Type,
  Smile,
  Shirt,
  Stethoscope,
  Building2,
  Scan,
  ExternalLink
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, theme }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const cardBg = theme === 'dark'
    ? 'bg-[#0d1117]/60 border-white/20 border-l-purple-400 hover:bg-[#0d1117]/80'
    : 'bg-white/30 border-white/40 border-l-purple-500 hover:bg-white/50';

  const linkBtnClass = theme === 'dark'
    ? 'bg-white/10 hover:bg-white/20 border-white/20'
    : 'bg-white/80 hover:bg-white/90 border-black/5';

  const tooltipClass = theme === 'dark'
    ? 'bg-black/80 text-white border-white/10'
    : 'bg-white/90 text-gray-900 border-black/5';

  const IconComponent = project.links?.[0]?.icon
    ? iconMap[project.links[0].icon]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-l-[6px] sm:border-l-[8px] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col ${cardBg}`}
    >
      <div className="space-y-4 flex-grow">
        {/* 标题 */}
        <h3 className={`text-xl sm:text-2xl font-bold mb-4 leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>
          {project.title}
        </h3>

        {/* 描述 */}
        <div className="space-y-3 sm:space-y-4">
          {project.description.split('\n').map((line, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              {line.includes('：') && <Terminal className={`shrink-0 mt-1 transition-all ${theme === 'dark' ? 'text-purple-300' : 'text-purple-500'}`} size={16} />}
              <p className={`text-sm sm:text-base leading-relaxed font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]/70'}`}>
                {line}
              </p>
            </div>
          ))}
        </div>

        {/* 链接按钮 */}
        {project.links && project.links.length > 0 && (
          <div className={project.links.length > 1 ? 'pt-40' : 'pt-4'}>
            <p className={`text-xs font-semibold mb-3 text-center transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
              欢迎点击跳转体验
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {project.links.map((link) => {
                const IconComponent = iconMap[link.icon];
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className={`
                        w-11 h-11 flex items-center justify-center
                        rounded-xl backdrop-blur-md
                        transition-all duration-200
                        hover:scale-110 hover:shadow-lg
                        border ${linkBtnClass}
                        cursor-pointer
                      `}
                    >
                      {IconComponent && <IconComponent size={20} aria-hidden="true" />}
                    </a>

                    {/* Tooltip */}
                    {hoveredLink === link.name && (
                      <div
                        className={`
                          absolute -top-8 left-1/2 -translate-x-1/2
                          px-3 py-1.5 text-xs font-semibold
                          rounded-lg backdrop-blur-xl
                          whitespace-nowrap
                          border ${tooltipClass}
                          transition-opacity duration-200
                        `}
                      >
                        {link.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mt-5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-[9px] font-bold uppercase tracking-wider transition-all duration-700 ${
                theme === 'dark'
                  ? 'bg-purple-900/40 text-purple-100 border border-purple-500/30'
                  : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
