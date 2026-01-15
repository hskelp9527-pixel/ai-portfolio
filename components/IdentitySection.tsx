
import { motion } from 'framer-motion';
import { PERSONAL_INFO, SKILLS } from '../data';
import { Mail, Phone, Cpu, Zap, Activity, Heart } from 'lucide-react';
import { Theme } from '../types';

interface IdentitySectionProps {
  theme: Theme;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({ theme }) => {
  const p1 = "在日常工作中，我将 AI 引入会议记录、文档整理与信息归纳等环节，通过结构化提示与流程化使用，减少人工整理成本，将更多精力集中在问题分析与执行决策上。";
  const p2 = '在个人实践中，我围绕"信息获取与内容生产效率"进行探索，搭建了用于 AI 资讯跟踪的自动化 Bot 以及个人 AI 知识库，用于持续整理行业信息与个人经验沉淀，同时进行图像与视频类 AIGC 创作实践。';
  const p3 = "熟悉 Coze、Dify 与 Claude Code 等平台的使用方式，能够独立完成智能体与 Skill 的设计与落地，并通过 AI 编程方式快速验证想法，形成可实际使用的应用原型。";

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
            {['10 亿级信息化平台项目经验', 'AIGC 在实际工作流中的落地应用', 'AI 编程辅助的快速原型实践'].map(tag => (
              <span key={tag} className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900/40 text-blue-100 border border-blue-400/30 hover:bg-blue-800/60' : 'bg-black/5 text-[#1D1D1F] hover:bg-black/10'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 个人兴趣爱好卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-12"
      >
        <div className={`glass rounded-[3rem] p-8 sm:p-12 border shadow-sm transition-all duration-700 hover:shadow-xl ${cardBg}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-all duration-700 ${theme === 'dark' ? 'bg-pink-900/30 text-pink-300 border-pink-500/30' : 'bg-pink-500/10 text-pink-500 border-pink-500/10'}`}>
                <Heart size={24} />
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>
                个人兴趣爱好
              </h3>
            </div>
            <p className={`text-sm sm:text-base lg:text-lg leading-relaxed font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-[#1D1D1F]/80'}`}>
              在个人成长方面，我更关注信息输入与复盘能力的提升，持续通过阅读、讨论与记录的方式，将零散经验整理为可复用的知识，为后续在 AI 与产品方向上的实践提供支撑。
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
