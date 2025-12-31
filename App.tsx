import React, { useState, useEffect } from 'react';
import { FloatingNavigation } from './components/FloatingNavigation';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Hero } from './components/Hero';
import { IdentitySection } from './components/IdentitySection';
import { Resume } from './components/Resume';
import { Gallery } from './components/Gallery';
import { Theater } from './components/Theater';
import { Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from './data';
import { Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [emailCopied, setEmailCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const email = 'rhydewy@163.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      alert('已复制邮箱');
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <div className={`relative min-h-screen transition-all duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-[#1D1D1F]'}`}>
      <FloatingNavigation
        theme={theme}
        onToggleTheme={toggleTheme}
        visible={!isModalOpen}
        onAIChatToggle={toggleAIChat}
        isAIChatOpen={isAIChatOpen}
      />

      <main className="relative z-10">
        <Hero theme={theme} />
        <div className="-mt-8 md:-mt-12 lg:-mt-16">
          <IdentitySection theme={theme} />
        </div>
        <Resume theme={theme} />
        <Gallery theme={theme} onModalStateChange={setIsModalOpen} />
        <Theater theme={theme} onModalStateChange={setIsModalOpen} />
      </main>

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        theme={theme}
      />

      <footer className={`py-16 px-6 relative overflow-hidden glass border-t transition-colors duration-300 no-print mt-20 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-black/5'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">共建 AI 未来</h2>
            <p className={`text-lg font-medium leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-[#1D1D1F]/50'}`}>
              致力于探索前沿AI技术转化为实际商业价值<br />持续学习，保持热爱。
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-10">
            <div className="flex gap-6">
              <button
                onClick={handleCopyEmail}
                className={`p-5 glass rounded-[2rem] transition-all hover:-translate-y-2 hover:bg-blue-600 hover:text-white shadow-sm border flex items-center justify-center ${theme === 'dark' ? 'bg-white/5 border-white/20' : 'bg-black/5 border-black/5'}`}
                title="复制邮箱"
              >
                <Mail size={24} />
              </button>
            </div>

            <div className="text-right">
               <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 flex items-center justify-end gap-2 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400/60' : 'text-[#1D1D1F]/30'}`}>
                 CRAFTED WITH AI & PASSION <ExternalLink size={10} />
               </p>
               <p className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${theme === 'dark' ? 'text-gray-500' : 'text-[#1D1D1F]/20'}`}>
                  2026 Ren Hong Yu
               </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
