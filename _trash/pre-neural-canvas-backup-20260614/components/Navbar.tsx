
import { Layout, User, Image as ImageIcon, Video, FileDown, Moon, Sun } from 'lucide-react';
import { Theme } from '../types';

interface NavbarProps {
  onExport: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onExport, theme, onToggleTheme }) => {
  const navItems = [
    { label: '关于', icon: <User size={20} />, href: '#about' },
    { label: '简历', icon: <Layout size={20} />, href: '#resume' },
    { label: '作品', icon: <ImageIcon size={20} />, href: '#gallery' },
    { label: '影院', icon: <Video size={20} />, href: '#theater' },
  ];

  const bgColor = theme === 'dark' ? 'bg-[#0d1117]/95 border-white/10' : 'bg-white/30 border-black/5';

  return (
    <>
      {/* 桌面端导航 */}
      <nav className={`hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-3 items-center gap-8 shadow-2xl transition-all no-print border ${bgColor}`}>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-500 whitespace-nowrap ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black/70 hover:text-black'}`}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-white/20' : 'bg-black/10'}`} />
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-full transition-all hover:scale-110 ${theme === 'dark' ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-black/5 text-indigo-600 hover:bg-black/10'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            onClick={onExport}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform ${theme === 'dark' ? 'bg-white text-[#010409]' : 'bg-slate-900 text-white'}`}
          >
            <FileDown size={16} />
            导出 PDF
          </button>
        </div>
      </nav>

      {/* 移动端导航 */}
      <nav className={`md:hidden fixed bottom-6 left-4 right-4 z-50 glass rounded-2xl p-4 flex justify-around items-center shadow-2xl no-print border ${theme === 'dark' ? 'bg-[#0d1117]/90 border-white/10' : 'bg-white/30 border-black/5'}`}>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-opacity ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black/60 hover:text-black'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </a>
        ))}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'text-yellow-400 bg-white/10' : 'text-indigo-600 bg-black/5'}`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </nav>
    </>
  );
};
