
import { motion } from 'framer-motion';
import { PERSONAL_INFO, SKILLS } from '../data';
import { Mail, Phone, Cpu, Zap, Activity } from 'lucide-react';
import { Theme } from '../types';

interface IdentitySectionProps {
  theme: Theme;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({ theme }) => {
  const p1 = "为提升效率，我在工作中广泛使用 AI 工具：ChatGPT/Gemini/豆包/千问/Grok等AI应用软件生成会议纪要与文档内容提升工作效率。";
  const p2 = "业余时间使用 Nano Banana、即梦、豆包、千问等 AI 应用进行图像创作，利用Sora2、hailuo、Runway、Veo3.1、Vidu 等工具制作视频，并搭建了 AI 资讯日报跟踪收集 Bot 与个人 AI 知识库。";
  const p3 = "熟练掌握 Coze 和 Claude Code 使用，产出智能体应用、Skill，并积极探索 Spec Coding AI 编程，致力于产出更高质有效的应用。我对 AI 前沿发展及行业应用充满热情。";

  const cardBg = theme === 'dark' ? 'bg-[#0d1117]/50 border-white/10' : 'bg-white/30 border-white/40';

  return (
    <section className="py-4 px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch transition-colors duration-300">
      {/* 左侧卡片：个人信息 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        viewport={{ once: true }}
        className={`lg:col-span-5 glass rounded-[3rem] p-6 sm:p-10 flex flex-col justify-between transition-all duration-700 border shadow-sm ${cardBg}`}
      >
        <div className="space-y-6 sm:space-y-8">
          {/* 头像 + 信息容器：强制不换行，确保信息在右侧 */}
          <div className="flex flex-row flex-nowrap items-center sm:items-start gap-4 sm:gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-20 h-20 sm:w-40 sm:h-40 shrink-0 overflow-hidden rounded-[1.2rem] sm:rounded-[2.5rem] shadow-xl"
            >
              <div className={`absolute inset-0 rounded-[2.5rem] blur-2xl opacity-30 ${theme === 'dark' ? 'bg-blue-400/40' : 'bg-blue-500/10'}`} />
              <img 
                src={PERSONAL_INFO.avatar} 
                alt={PERSONAL_INFO.name}
                className={`w-full h-full object-cover relative z-10 border-2 shadow-lg ${theme === 'dark' ? 'border-white/20' : 'border-white'}`}
              />
            </motion.div>
            
            <div className="flex-1 text-left min-w-0 space-y-1.5 sm:space-y-4">
              <h2 className={`text-2xl sm:text-5xl font-bold tracking-tighter truncate transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>
                {PERSONAL_INFO.name}
              </h2>
              <div className={`h-1 w-10 sm:h-1.5 sm:w-16 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`} />
              
              {/* 联系方式：精准对齐 */}
              <div className="space-y-1.5 sm:space-y-3 pt-0.5">
                <div className="flex items-center justify-start gap-2 sm:gap-3 group">
                  <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${theme === 'dark' ? 'bg-blue-400/20 text-blue-200' : 'bg-blue-500/5 text-blue-600'}`}>
                    <Phone size={10} className="sm:size-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]'}`}>{PERSONAL_INFO.phone}</span>
                </div>
                <div className="flex items-center justify-start gap-2 sm:gap-3 group">
                  <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${theme === 'dark' ? 'bg-purple-400/20 text-purple-200' : 'bg-purple-500/5 text-purple-600'}`}>
                    <Mail size={10} className="sm:size-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold truncate transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]'}`}>{PERSONAL_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-left space-y-6">
            <div>
              <span className={`text-xs font-black uppercase tracking-[0.4em] block mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300/70' : 'text-[#1D1D1F]/40'}`}>Career Summary</span>
              <p className={`text-sm sm:text-lg font-bold leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-[#1D1D1F]/80'}`}>
                {PERSONAL_INFO.summary}
              </p>
            </div>

            {/* Web 端专有内容：填补空白区域 */}
            <div className={`hidden lg:block pt-8 border-t mt-8 transition-colors duration-300 ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
              <span className={`text-xs font-black uppercase tracking-[0.4em] block mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-purple-300/70' : 'text-[#1D1D1F]/40'}`}>Intelligence Stack</span>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-[1.5rem] border transition-all duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
                  <Cpu size={16} className={`mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                  <p className={`text-xs font-bold mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>AIGC 集成</p>
                  <p className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1D1D1F]/60'}`}>提示词工程与模型微调应用</p>
                </div>
                <div className={`p-4 rounded-[1.5rem] border transition-all duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
                  <Zap size={16} className={`mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                  <p className={`text-xs font-bold mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>自动化工作流</p>
                  <p className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1D1D1F]/60'}`}>基于 Coze 的智能 Agent 开发</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 右侧卡片：AI 描述 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-7"
      >
        <div className={`glass rounded-[3rem] p-8 sm:p-14 h-full flex flex-col justify-between border shadow-sm transition-all duration-700 hover:shadow-xl ${cardBg}`}>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-600'}`} />
              <span className={`text-xs sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] transition-colors duration-300 ${theme === 'dark' ? 'text-purple-300' : 'text-[#1D1D1F]/40'}`}>AI Workflow & Passion</span>
            </div>
            <div className={`space-y-4 sm:space-y-6 text-base sm:text-xl lg:text-[1.35rem] leading-[1.6] sm:leading-[1.7] font-medium tracking-normal transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-[#1D1D1F]/90'}`}>
              <p>{p1}</p>
              <p>{p2}</p>
              <p>{p3}</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
            {['10亿级平台经验', 'AIGC 深度集成', 'Spec Coding 探索者'].map(tag => (
              <span key={tag} className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900/40 text-blue-100 border border-blue-400/30 hover:bg-blue-800/60' : 'bg-black/5 text-[#1D1D1F] hover:bg-black/10'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
