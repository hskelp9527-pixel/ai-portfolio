
import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCES, SKILLS, PERSONAL_INFO, MAIN_PROJECTS, PERSONAL_PROJECTS } from '../data';
import { Briefcase, Zap, GraduationCap, CheckCircle2, ChevronRight, Globe, Cpu, Terminal } from 'lucide-react';
import { Theme } from '../types';

interface ResumeProps {
  theme: Theme;
}

export const Resume: React.FC<ResumeProps> = ({ theme }) => {
  const cardBg = theme === 'dark' ? 'bg-[#0d1117]/50 border-white/10 hover:bg-[#0d1117]/70 hover:border-white/30' : 'bg-white/30 border-white/40 hover:bg-white/50 hover:border-white/60';

  return (
    <section id="resume" className="py-12 px-6 max-w-7xl mx-auto space-y-16 sm:space-y-20 transition-colors duration-300">
      {/* 工作经历 */}
      <div>
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-700 ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/10'}`}>
            <Briefcase size={24} className="sm:size-[28px]" />
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>工作经历</h2>
        </div>

        <div className="space-y-6">
          {EXPERIENCES.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`glass p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border shadow-xl hover:shadow-2xl transition-all duration-500 cursor-default ${cardBg}`}
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4 sm:mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-[10px] font-black uppercase tracking-widest mb-2 sm:mb-3 transition-all duration-700 ${theme === 'dark' ? 'bg-blue-400/30 text-blue-100' : 'bg-indigo-500/10 text-indigo-600'}`}>
                    {exp.period}
                  </span>
                  <h3 className={`text-2xl sm:text-3xl font-bold mb-1 leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>{exp.company}</h3>
                  <p className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1D1D1F]/40'}`}>{exp.role}</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {exp.description.split('\n').map((line, i) => (
                  <div key={i} className="flex gap-3 sm:gap-4 items-start">
                    <CheckCircle2 size={16} className={`shrink-0 mt-1 transition-all ${theme === 'dark' ? 'text-blue-300' : 'text-indigo-500'}`} />
                    <p className={`text-sm sm:text-base leading-relaxed font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]/70'}`}>{line}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-[9px] font-bold uppercase tracking-wider transition-all duration-700 ${theme === 'dark' ? 'bg-white/10 text-gray-300 border border-white/10' : 'bg-black/5 text-black/60'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 主要项目经历 */}
      <div>
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-700 ${theme === 'dark' ? 'bg-blue-900/30 text-blue-200 border-blue-400/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/10'}`}>
            <Globe size={24} className="sm:size-[28px]" />
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>主要项目经历</h2>
        </div>

        {MAIN_PROJECTS.map((proj) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01, y: -4 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`glass p-6 sm:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] border-l-[6px] sm:border-l-[10px] shadow-2xl hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 cursor-default ${theme === 'dark' ? 'bg-[#0d1117]/60 border-white/20 border-l-blue-400 hover:bg-[#0d1117]/80 hover:border-white/40' : 'bg-white/30 border-white/40 border-l-blue-500 hover:bg-white/50 hover:border-white/70'}`}
          >
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
              <h3 className={`text-xl sm:text-3xl font-bold leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>{proj.title}</h3>
              <span className={`text-sm sm:text-base font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-gray-500' : 'text-[#1D1D1F]/30'}`}>{proj.period}</span>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">
              <div className="lg:col-span-1 space-y-3 sm:space-y-4">
                 <p className={`text-xs sm:text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300/70' : 'text-[#1D1D1F]/40'}`}>项目规模与职责</p>
                 <p className={`text-base sm:text-lg font-bold leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]'}`}>{proj.scale}</p>
                 <div className="flex flex-wrap gap-2">
                   {proj.tags.map(t => <span key={t} className={`px-2.5 py-1 rounded-md text-xs sm:text-[9px] font-black uppercase tracking-tight bg-blue-600 text-white`}>{t}</span>)}
                 </div>
              </div>
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                 <p className={`text-xs sm:text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300/70' : 'text-[#1D1D1F]/40'}`}>核心交付详情</p>
                 <div className="space-y-3 sm:space-y-4">
                    {proj.description.split('\n').map((line, idx) => (
                      <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                        <ChevronRight className={`shrink-0 mt-1 transition-all ${theme === 'dark' ? 'text-blue-300' : 'text-blue-500'}`} size={18} />
                        <p className={`text-sm sm:text-base leading-relaxed font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]/70'}`}>{line}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 个人项目经历 */}
      <div>
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-700 ${theme === 'dark' ? 'bg-purple-900/30 text-purple-200 border-purple-400/30' : 'bg-purple-500/10 text-purple-500 border-purple-500/10'}`}>
            <Cpu size={24} className="sm:size-[28px]" />
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>个人项目经历</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {PERSONAL_PROJECTS.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`glass p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-l-[6px] sm:border-l-[8px] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col ${theme === 'dark' ? 'bg-[#0d1117]/60 border-white/20 border-l-purple-400 hover:bg-[#0d1117]/80' : 'bg-white/30 border-white/40 border-l-purple-500 hover:bg-white/50'}`}
            >
              <h3 className={`text-xl sm:text-2xl font-bold mb-4 leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>{proj.title}</h3>

              <div className="space-y-3 sm:space-y-4 flex-grow">
                {proj.description.split('\n').map((line, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    {line.includes('：') && <Terminal className={`shrink-0 mt-1 transition-all ${theme === 'dark' ? 'text-purple-300' : 'text-purple-500'}`} size={16} />}
                    <p className={`text-sm sm:text-base leading-relaxed font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-[#1D1D1F]/70'}`}>{line}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {proj.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-[9px] font-bold uppercase tracking-wider transition-all duration-700 ${theme === 'dark' ? 'bg-purple-900/40 text-purple-100 border border-purple-500/30' : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 教育背景 */}
      <div>
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
           <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-700 ${theme === 'dark' ? 'bg-blue-900/30 text-blue-200 border-blue-400/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/10'}`}>
             <GraduationCap size={24} className="sm:size-[28px]" />
           </div>
           <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>教育背景</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {PERSONAL_INFO.education.map((edu, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ x: 10 }}
              viewport={{ once: true }}
              className={`glass p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-l-4 shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#0d1117]/50 border-white/10 border-l-blue-400' : 'bg-white/30 border-white/40 border-l-blue-500/50'}`}
            >
              <div className={`text-xs sm:text-[10px] font-black mb-1 sm:mb-2 uppercase tracking-[0.2em] transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>{edu.period}</div>
              <div className={`text-lg sm:text-xl font-bold mb-0.5 sm:mb-1 leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1D1D1F]'}`}>{edu.school}</div>
              <div className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1D1D1F]/50'}`}>{edu.major}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 技能 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {SKILLS.map((skillGroup) => (
          <motion.div
            key={skillGroup.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            viewport={{ once: true }}
            className={`glass p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-b-[6px] sm:border-b-[8px] shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#0d1117]/70 border-white/10 border-b-blue-400/40' : 'bg-white/30 border-white/40 border-b-purple-500/10'}`}
          >
            <h3 className={`text-xs sm:text-[10px] font-black mb-4 sm:mb-6 flex items-center gap-3 uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300' : 'text-[#1D1D1F]/40'}`}>
              <Zap size={14} className={theme === 'dark' ? 'text-blue-400' : 'text-purple-500'} />
              {skillGroup.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map(skill => (
                <span
                  key={skill}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-default ${theme === 'dark' ? 'bg-blue-900/40 text-blue-100 border border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'bg-black/5 text-[#1D1D1F] hover:bg-purple-600 hover:text-white'}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
