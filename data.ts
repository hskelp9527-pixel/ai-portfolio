import { Experience, ProjectImage, ProjectVideo, Skill, MediaManagerConfig, GraphNode, GraphEdge } from './types';

// 媒体管理配置
export const MEDIA_CONFIG: MediaManagerConfig = {
  imagePath: '/images/gallery',
  videoPath: '/videos/gallery',
  thumbnailPath: '/images/gallery/thumbnails',
  supportedImageFormats: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
  supportedVideoFormats: ['.mp4', '.webm', '.mov'],
  lazyLoadThreshold: 200,
  maxImageSize: 5 * 1024 * 1024,
  maxVideoSize: 50 * 1024 * 1024,
};

export const PERSONAL_INFO = {
  name: '任泓雨',
  avatar: '/images/avatar/admin.jpg',
  phone: '19068046220',
  email: 'rhydewy@163.com',
  summary: '具备 3–4 年信息化项目交付与协同经验，曾在 10 亿级信息化平台项目中承担关键子项目的执行与协调工作，负责数千万级模块的进度控制、文档规范与缺陷闭环管理，保障项目在合规约束下稳定推进，并按既定里程碑完成交付。使用 Claude Code、Codex 深度参与企业级项目开发，将项目完成效率提升了 50%，积极探索前沿 AI 技术落地生产力。',
  aiDescription: '为提升效率，我在工作中广泛使用 AI 工具：ChatGPT/Gemini/豆包/千问/Grok等AI应用软件生成会议纪要与文档内容提升工作效率；业余时间使用Midjourney 、Nano Bnana、即梦、豆包、千问等AI应用图像创作、hailuo、Runway、Pika 、Veo3.1、Vidu、千问等工具的视频制作，以及搭建AI资讯日报跟踪收集 Bot、个人知识库（AI类）。熟练掌握 Claude Code、Codex 等使用方式，有熟练搭建 OpenClaw 经历，能够完成智能体和 Skill 的设计与落地使用，并通过 AI 编程方式快速验证想法，形成可实际使用的应用原型。积极关注AI前沿发展，热情探索AI相关应用，对AI行业发展具有热情。',
  education: [
    { school: '深圳大学', major: '计算机科学与技术 | 本科 (在读)', period: '2024.01 – 2027.07 (预计)' },
    { school: '湖南交通职业技术学院', major: '物联网应用技术 | 大专', period: '2018.09 – 2021.07' }
  ]
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'w0',
    company: '深圳市知行求索科技有限公司',
    role: 'AI产品经理',
    period: '2026.01 – 至今',
    description: '1．负责项目原型的快速落地；\n2．开发前端页面，并独立完成前后端联调，效率提升 50%；\n3．参与产品设计、UI 设计、测试工作。',
    tags: ['AI产品', '前端开发', '原型落地', '效率提升']
  },
  {
    id: 'w1',
    company: '深圳市艾泰克工程咨询有限公司',
    role: '信息化项目交付专员',
    period: '2023.09 – 2025.09',
    description: '1．协助协同同事与多方干系人完成交付，规避系统性风险；\n2．参与项目技术性方案编制，明确用户需求，提供解决思路；\n3．协助参与项目质量交付验收会议，提供项目答疑解惑；',
    tags: ['G端交付', '风险规避', '技术方案', '验收答疑']
  },
  {
    id: 'w2',
    company: '湖南大福信息技术有限公司',
    role: '项目交付助理',
    period: '2021.09 – 2023.08',
    description: '1．需求分析与沟通： 负责用户需求调研，协助编写技术方案PPT。\n2．现场交付保障： 参与项目质量验收会议，协助解决现场技术突发问题。\n3．参与跨组织协同交付，明确多方职责边界与对接流程。\n4．构建文档全周期管控流程，实现交付材料完整归档与标准化修正。',
    tags: ['需求调研', '跨组织协同', '文档管控', '交付保障']
  }
];

export const MAIN_PROJECTS = [
  {
    id: 'mp1',
    title: '深圳市交通某信息化集成项目',
    role: '信息化项目交付专员',
    period: '2024.06 – 2025.09',
    scale: '参与管理数千万级子项目（总项目规模约 10 亿元）。全项目规模约 30 个子项目，我负责其中约 7–8 个核心子项，涉及多家施工队及服务商，累计管控规模约 800–1200 人天。',
    description: '核心交付职责：\n• 跨组织协调：直接对接 10 人以上核心干系人，涉及甲方多部门与第三方监管单位，建立稳定对接机制。\n• 会议管控：每周组织 3–4 场对接会，产出会议纪要并重点跟踪，累计参与 50+ 场会议。\n• 文档审计：年度审核 200–300+ 份文件材料，指导乙方完成多轮文档标准化输出。\n• 交付保障：保障关键里程碑按计划完成交付，实现子项目高质量验收。',
    tags: ['千万级子项', '30个子项', '干系人管理', '文档审计']
  }
];

export const PERSONAL_PROJECTS = [
  {
    id: 'pp8',
    title: 'Query Auto - 智能情报简报 Agent',
    description: '是什么：基于 Vercel 部署的多智能体情报收集与分析系统，自动生成结构化情报简报并通过邮件投递。\n\n核心功能：\n• 多智能体协作：基于 LangGraph 构建规划器、研究员、编辑、评论家等多智能体系统\n• 实时信息聚合：从 Google News RSS 抓取国内外最新资讯，支持中外源混合检索\n• AI 报告生成：集成 OpenRouter 和智谱 AI，生成结构化情报简报\n• 定时任务调度：支持每日定时发送和即时执行两种模式\n• 邮件投递：通过 Resend webhook 自动投递生成的简报\n\n技术亮点：\n• LangGraph 多智能体编排，实现情报收集-分析-审核-生成全流程自动化\n• Vercel KV 持久化存储，支持任务状态跟踪与历史记录查询\n• 响应式设计，Web 界面实时监控任务执行状态',
    tags: ['LangGraph', '多智能体', 'Vercel', '智谱AI', 'OpenRouter'],
    importance: 10,
    links: [
      { name: '访问应用', url: 'https://query.airainyu.xyz/', icon: 'ExternalLink' }
    ]
  },
  {
    id: 'pp7',
    title: '宠物健康AI服务平台',
    description: '是什么：为宠物健康AI服务平台开发的多页面SPA应用，包含智能问诊、四大AI识别（品种/情绪/排泄物/呕吐物）、用户权益管理等完整功能模块。\n\n核心亮点：\n• 全程AI辅助开发：零手写代码，100%使用Claude Code完成全部前端开发\n• 大规模交付：14个页面，核心JavaScript代码超过10,000行\n• 完整功能模块：AI智能问诊（3164行）、四大AI识别功能、用户权益系统\n• 独立联调：独立完成20+ API接口联调，具备上线条件\n\n技术栈：Claude Code、原生HTML/JavaScript、Tailwind CSS',
    tags: ['Claude Code', 'AI辅助开发', '前端交付', 'API联调'],
    importance: 9,
    links: [
      { name: '宠物专区', url: 'http://pet.anykcloud.net:8088/ai_pet_sign.html?info=%2BEwLURWIPnSXJlbsX%2B9J6RsrNl0PP2QtRMtduiHxBbfAl7BwtykWGIdezQpiexE4hE76qOwTPoSmCtGiN%2FG7MJ7cxXGD3syKtleHenjOaiMA%2Fpia%2BeYlduimQyA%3D&id=41', icon: 'Heart' },
      { name: 'AI智能问诊', url: 'http://pet.anykcloud.net:8088/AIconsultation/AIconsultation.html?info=%2BEwLURWIPnSXJlbsX%2B9J6RsrNl0PP2QtRMtduiHxBbfAl7BwtykWGIdezQpiexE4hE76qOwTPoSmCtGiN%2FG7MJ7cxXGD3syKtleHenjOaiMA%2Fpia%2BeYlduimQyA%3D&id=41', icon: 'Stethoscope' },
      { name: '情绪识别', url: 'http://pet.anykcloud.net:8088/ai/pet-emotion.html?info=%2BEwLURWIPnSXJlbsX%2B9J6RsrNl0PP2QtRMtduiHxBbfAl7BwtykWGIdezQpiexE4hE76qOwTPoSmCtGiN%2FG7MJ7cxXGD3syKtleHenjOaiMA%2Fpia%2BeYlduimQyA%3D&id=41', icon: 'Smile' },
      { name: '品种识别', url: 'http://pet.anykcloud.net:8088/ai/pet-breed.html?info=%2BEwLURWIPnSXJlbsX%2B9J6RsrNl0PP2QtRMtduiHxBbfAl7BwtykWGIdezQpiexE4hE76qOwTPoSmCtGiN%2FG7MJ7cxXGD3syKtleHenjOaiMA%2Fpia%2BeYlduimQyA%3D&id=41', icon: 'Scan' }
    ]
  },
  {
    id: 'pp3',
    title: '基于 Dify 的个人知识库问答系统（RAG）',
    description: '是什么：为解决个人项目资料分散、难以快速检索与复述的问题，基于 Dify 平台构建了一套个人知识库问答系统。系统通过知识检索增强生成（RAG）机制，将个人项目文档、产品总结等资料转化为可对话的智能知识库，实现对个人经历与项目的自然语言问答。\n核心实现：\n            1、构建混合检索知识库（向量检索 + 关键词检索），提升召回准确率\n            2、基于 Chatflow 设计「用户输入 → 知识检索 → LLM → 回复」的问答流程\n            3、通过 Prompt 约束，强制模型仅基于知识库内容回答，避免幻觉\n            4、对项目类问题采用结构化输出（背景 → 方案 → 价值）',
    tags: ['RAG', 'Dify', '知识库', 'LLM', '向量检索'],
    importance: 8
  },
  {
    id: 'pp1',
    title: '基于 Coze 的智能客服 Agent',
    description: '项目描述：针对传统客服依赖人工检索资料、回复效率低的问题，设计并实现了一套基于 Coze 的智能客服 Agent，用于自动识别用户问题并从知识库中返回结构化答案。\n核心动作：收集整理行业文档，清洗数据后导入飞书知识库；配置工作流（Workflow），让Bot能自动识别用户意图并调用知识库准确回答。',
    tags: ['Coze', '知识库', 'Workflow', '智能客服'],
    importance: 7
  },
  {
    id: 'pp6',
    title: 'AI Skill 自动化书评创作工具',
    description: '是什么：深度整合大语言模型与 Seedream 4.5 MCP 图像生成能力的全流程自动化书评创作工具。\n核心功能：\n            1、书籍背景自动检索与信息提取\n            2、精华观点智能提炼与结构化输出\n            3、AI 自动配图，视觉化呈现书评内容\n            4、多格式一键导出（Markdown、PDF、图片等）\n技术特点：集成 LLM 与 MCP 协议，实现"秒级生成"高质量书评。\n适用场景：内容创作者快速产出专业书评，将创作周期从"数小时"缩短至"秒级"。',
    tags: ['LLM', 'MCP', '内容创作', '自动化', '效率工具'],
    importance: 6
  },
  {
    id: 'pp2',
    title: 'TimeReminder',
    description: '是什么：针对传统待办工具需要用户频繁查看、容易错过执行时机的问题，设计并实现了一款 Windows 桌面任务提醒工具 TimeReminder。产品以"设好就不管"为核心理念，用户只需输入截止时间与预计耗时，系统即可自动推导"应开始时间"，并在关键节点通过系统级通知进行强提醒，减少用户的认知负担。\n核心设计与实现：\n            1、基于「截止时间 − 预计耗时」的时间推导逻辑，自动计算提醒时机\n            2、采用 Windows Toast 通知，实现必须确认的强提醒机制\n            3、托盘常驻与开机自启设计，保证提醒不被遗漏\n            4、本地 SQLite 存储，免配置、免服务端，支持数据导入导出\n            5、打包为单文件 exe，双击即用，降低使用与分发成本',
    tags: ['Python', 'PyQt5', '任务管理', 'Windows桌面应用'],
    importance: 5
  },
  {
    id: 'pp5',
    title: '桌面清理工具',
    description: '是什么：Vibe Coding 开发 Windows 桌面文件管理应用，使用 Python + tkinter 开发，打包成单个 exe 文件。\n核心功能：\n            1、扫描桌面所有文件，按类型自动分组（图片、文档、视频、音频等）\n            2、文件夹可递归展开（最多3层），快捷方式(.lnk)可展开目标内容\n            3、右侧复选框多选，支持批量转移/删除/重命名\n            4、双击文件在资源管理器中打开，右键重命名\n界面特点：深色标题栏，扁平设计，左侧三角形展开，显示文件名、时间、大小三列。\n适用场景：桌面太乱时快速查看并批量清理文件。',
    tags: ['Python', 'tkinter', '桌面应用', '文件管理'],
    importance: 4
  }
];

export const SKILLS: Skill[] = [
  {
    category: '⚡ AI 工具能力 · 内容生成与原型实现',
    items: ['多模型对比与结果校验（ChatGPT / Claude / Gemini / 千问）', 'Prompt 设计与输出约束', '文档生成与结构化重写', '会议纪要与信息提炼自动化', 'AI 资讯跟踪与日报 Bot 构建', '基于 Coze 的轻量 Agent 实践', 'AI 编程辅助（Claude Code / Codex）', 'LangGraph 多智能体编排', 'OpenClaw 框架应用', '使用 Obsidian 进行持续复盘'],
    summary: '我擅长将 AI 工具组合成可复用的工作流，用于信息处理、内容生成和产品原型验证。'
  },
  {
    category: '⚡ 产品与交付能力（AI 项目背景）',
    items: ['信息化项目协同与交付推进', '使用 Claude Code / Codex 深度参与企业级项目开发', '多角色沟通与需求拆解', '技术方案梳理与表达（PPT / 文档）', '复杂项目的流程与风险管理', '跨团队协作与资源协调', 'AI 辅助开发效率提升 50%'],
    summary: '我具备在多方干系人与复杂流程中推进项目落地的能力，能平衡需求与技术实现。积极探索前沿 AI 技术落地生产力，将 AI 工具深度融入项目开发流程。'
  },
  {
    category: '⚡ 常用 AI 模型与创作工具',
    items: ['大语言模型（ChatGPT / Claude / Gemini / 千问 / 豆包）', '图像生成（Nano Banana / 即梦 / Midjourney）', '视频生成（Runway / Vidu / Veo3.1 / hailuo / Sora2）', 'AI 编程工具（Claude Code / Codex / OpenClaw）', '多智能体框架（LangGraph / Coze / Dify）'],
    summary: '熟悉多类 AI 工具的特性与适用场景，能根据任务需求选择合适的模型与工具组合。持续关注 AI 前沿技术，积极探索新的生产力工具在实际工作流中的应用。'
  }
];

export const IMAGES: ProjectImage[] = [
  // AIGC 风景与人文系列
  { id: 'i1', filename: '乡村牧歌.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B9%A1%E6%9D%91%E7%89%A7%E6%AD%8C.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B9%A1%E6%9D%91%E7%89%A7%E6%AD%8C.png', title: '乡村牧歌', description: 'AI 生成的田园风光作品，展现宁静的乡村生活。', category: 'AIGC风景', tags: ['乡村', '田园', '风景'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i2', filename: '乡间故事.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B9%A1%E9%97%B4%E6%95%85%E4%BA%8B.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B9%A1%E9%97%B4%E6%95%85%E4%BA%8B.png', title: '乡间故事', description: 'AI 生成的乡间生活场景，充满温馨与回忆。', category: 'AIGC风景', tags: ['乡间', '故事', '生活'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i3', filename: '井底光明.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%BA%95%E5%BA%95%E5%85%89%E6%98%8E.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%BA%95%E5%BA%95%E5%85%89%E6%98%8E.png', title: '井底光明', description: 'AI 生成的创意视觉作品，光影交织的艺术表达。', category: 'AIGC创意', tags: ['光影', '创意', '艺术'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i4', filename: '老人与孩子.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E8%80%81%E4%BA%BA%E4%B8%8E%E5%AD%A9%E5%AD%90.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E8%80%81%E4%BA%BA%E4%B8%8E%E5%AD%A9%E5%AD%90.png', title: '老人与孩子', description: 'AI 生成的温馨人文作品，展现代际之间的温情。', category: 'AIGC人文', tags: ['人文', '温情', '家庭'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i5', filename: '知更鸟.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%9F%A5%E6%9B%B4%E9%B8%9F.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%9F%A5%E6%9B%B4%E9%B8%9F.png', title: '知更鸟', description: 'AI 生成的自然生态作品，捕捉鸟类的灵动之美。', category: 'AIGC自然', tags: ['鸟类', '自然', '生态'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  // 历史重现系列
  { id: 'i6', filename: '明朝北京俯瞰图.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%98%8E%E6%9C%9D%E5%8C%97%E4%BA%AC%E4%BF%AF%E7%9E%B0%E5%9B%BE.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%98%8E%E6%9C%9D%E5%8C%97%E4%BA%AC%E4%BF%AF%E7%9E%B0%E5%9B%BE.png', title: '明朝北京俯瞰图', description: 'AI 重现的明朝时期北京城市风貌。', category: '历史重现', tags: ['明朝', '北京', '历史'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i7', filename: '清明上河图风格明朝北京俯瞰图.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%B8%85%E6%98%8E%E4%B8%8A%E6%B2%B3%E5%9B%BE%E9%A3%8E%E6%A0%BC%E6%98%8E%E6%9C%9D%E5%8C%97%E4%BA%AC%E4%BF%AF%E7%9E%B0%E5%9B%BE.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%B8%85%E6%98%8E%E4%B8%8A%E6%B2%B3%E5%9B%BE%E9%A3%8E%E6%A0%BC%E6%98%8E%E6%9C%9D%E5%8C%97%E4%BA%AC%E4%BF%AF%E7%9E%B0%E5%9B%BE.png', title: '清明上河图风格明朝北京俯瞰图', description: '融合清明上河图经典画风的明朝北京城市景观。', category: '传统艺术', tags: ['清明上河图', '明朝'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i8', filename: '岳阳楼黄鹤楼结构解说图.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E5%B2%B3%E9%98%B3%E6%A5%BC%E9%BB%84%E9%B9%A4%E6%A5%BC%E7%BB%93%E6%9E%84%E8%A7%A3%E8%AF%B4%E5%9B%BE.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E5%B2%B3%E9%98%B3%E6%A5%BC%E9%BB%84%E9%B9%A4%E6%A5%BC%E7%BB%93%E6%9E%84%E8%A7%A3%E8%AF%B4%E5%9B%BE.png', title: '岳阳楼黄鹤楼结构解说图', description: '详细展示中国古典建筑结构的技术解说图。', category: '建筑设计', tags: ['古典建筑', '岳阳楼', '黄鹤楼'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  // 美食摄影系列
  { id: 'i9', filename: '东坡肉1.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B8%9C%E5%9D%A1%E8%82%891.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B8%9C%E5%9D%A1%E8%82%891.png', title: '东坡肉美食摄影', description: 'AI 生成的精美东坡肉美食摄影作品。', category: '美食摄影', tags: ['东坡肉', '美食'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i10', filename: '红烧鱼.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%BA%A2%E7%83%A7%E9%B1%BC.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%BA%A2%E7%83%A7%E9%B1%BC.png', title: '红烧鱼美食摄影', description: '精美的红烧鱼美食摄影。', category: '美食摄影', tags: ['红烧鱼', '中式烹饪'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i11', filename: '鲜蒸鱼.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E9%B2%9C%E8%92%B8%E9%B1%BC.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E9%B2%9C%E8%92%B8%E9%B1%BC.png', title: '鲜蒸鱼美食摄影', description: '清淡鲜美的蒸鱼料理。', category: '美食摄影', tags: ['蒸鱼', '健康饮食'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  // 其他创意作品
  { id: 'i12', filename: '拼豆成图.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%8B%BC%E8%B1%86%E6%88%90%E5%9B%BE.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%8B%BC%E8%B1%86%E6%88%90%E5%9B%BE.png', title: '拼豆艺术创作', description: '独特的拼豆艺术作品。', category: '创意艺术', tags: ['拼豆', '像素艺术'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i13', filename: '商品图.jpeg', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E5%95%86%E5%93%81%E5%9B%BE.jpeg', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E5%95%86%E5%93%81%E5%9B%BE.jpeg', title: '商品展示图', description: '精美的商品展示摄影。', category: '商业摄影', tags: ['商品', '产品摄影'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  // 可乐品牌设计系列 (按顺序 0-8)
  { id: 'i14', filename: '生活场景0.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%94%9F%E6%B4%BB%E5%9C%BA%E6%99%AF0.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%94%9F%E6%B4%BB%E5%9C%BA%E6%99%AF0.png', title: '可乐生活场景', description: '可乐品牌生活场景摄影，展现产品融入日常的美好瞬间。', category: '可乐品牌', tags: ['可乐', '生活场景', '品牌'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i15', filename: '特写1.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%89%B9%E5%86%991.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%89%B9%E5%86%991.png', title: '可乐特写 I', description: '可乐产品特写摄影，展现产品细节之美。', category: '可乐品牌', tags: ['可乐', '特写', '产品'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i16', filename: '特写2.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%89%B9%E5%86%992.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%89%B9%E5%86%992.png', title: '可乐特写 II', description: '可乐产品特写摄影，捕捉产品精彩瞬间。', category: '可乐品牌', tags: ['可乐', '特写', '产品'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i17', filename: '细节特写3.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%BB%86%E8%8A%82%E7%89%B9%E5%86%993.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E7%BB%86%E8%8A%82%E7%89%B9%E5%86%993.png', title: '可乐细节特写', description: '可乐产品细节特写，展现精致工艺与质感。', category: '可乐品牌', tags: ['可乐', '细节', '特写'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i18', filename: '银色标志4.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E9%93%B6%E8%89%B2%E6%A0%87%E5%BF%974.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E9%93%B6%E8%89%B2%E6%A0%87%E5%BF%974.png', title: '可乐银色标志', description: '可乐品牌银色标志设计，体现专业与品质。', category: '可乐品牌', tags: ['可乐', '标志', 'Logo'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i19', filename: '营养成分表5.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E8%90%A5%E5%85%BB%E6%88%90%E5%88%86%E8%A1%A85.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E8%90%A5%E5%85%BB%E6%88%90%E5%88%86%E8%A1%A85.png', title: '可乐营养成分表', description: '可乐产品营养成分表设计，信息可视化。', category: '可乐品牌', tags: ['可乐', '营养', '信息设计'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i20', filename: '主KV视觉6.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B8%BBKV%E8%A7%86%E8%A7%896.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E4%B8%BBKV%E8%A7%86%E8%A7%896.png', title: '可乐主KV视觉', description: '可乐品牌主视觉KV设计，强烈的视觉冲击力。', category: '可乐品牌', tags: ['可乐', 'KV设计', '主视觉'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i21', filename: '气泡动力7.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%B0%94%E6%B3%A1%E5%8A%A8%E5%8A%9B7.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%B0%94%E6%B3%A1%E5%8A%A8%E5%8A%9B7.png', title: '可乐气泡动力', description: '可乐气泡动力视觉设计，动感与美感的完美结合。', category: '可乐品牌', tags: ['可乐', '气泡', '动力'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
  { id: 'i22', filename: '最后插画8.png', url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%9C%80%E5%90%8E%E6%8F%92%E7%94%BB8.png', thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/%E6%9C%80%E5%90%8E%E6%8F%92%E7%94%BB8.png', title: '可乐创意插画', description: '可乐品牌创意插画设计，展现独特的艺术风格。', category: '可乐品牌', tags: ['可乐', '插画', '创意'], dimensions: { width: 1920, height: 1080 }, createdAt: '2024-12-31' },
];

export const VIDEOS: ProjectVideo[] = [
  {
    id: 'v1',
    filename: '片场合影.mp4',
    url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E7%89%87%E5%9C%BA%E5%90%88%E5%BD%B1.mp4',
    thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E7%89%87%E5%9C%BA%E5%90%88%E5%BD%B1-%E5%B0%81%E9%9D%A2.png',
    title: '片场合影',
    description: 'AI 生成的影视风格影像作品。',
    duration: 120,
    aspectRatio: '16:9',
    category: 'AI影视',
    tags: ['AI视频', '影视', '创意'],
    createdAt: '2024-12-31'
  },
  {
    id: 'v2',
    filename: 'AI搞笑漫_1_.webm',
    url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/AI%E6%90%9E%E7%AC%91%E6%BC%AB_1_.webm',
    thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%90%9E%E7%AC%91%E6%BC%AB-%E5%B0%81%E9%9D%A2.jpg',
    title: 'AI 搞笑漫剧场',
    description: '使用 AI 工具生成的创意搞笑动画短片。',
    duration: 60,
    aspectRatio: '16:9',
    category: 'AI动画',
    tags: ['AI动画', '搞笑', '创意'],
    createdAt: '2024-12-02'
  },
  {
    id: 'v3',
    filename: '教父.webm',
    url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%95%99%E7%88%B6.webm',
    thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%95%99%E7%88%B6%E6%97%A0%E6%B0%B4%E5%8D%B0%E7%89%88-%E5%B0%81%E9%9D%A2.jpg',
    title: '教父风格影像',
    description: 'AI 生成的经典电影风格影像作品。',
    duration: 90,
    aspectRatio: '16:9',
    category: 'AI影视',
    tags: ['AI视频', '经典风格', '影视'],
    createdAt: '2024-12-02'
  },
  {
    id: 'v4',
    filename: '星际救援.mp4',
    url: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%98%9F%E9%99%85%E6%95%91%E6%8F%B4.mp4',
    thumbnail: 'https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%98%9F%E9%99%85%E6%95%91%E6%8F%B4.png',
    title: '星际救援',
    description: 'AI 生成的科幻风格太空救援影像作品。',
    duration: 120,
    aspectRatio: '16:9',
    category: 'AI影视',
    tags: ['AI视频', '科幻', '太空'],
    createdAt: '2025-01-03'
  }
];

// ===== Neural Canvas 节点数据 =====

export const GRAPH_NODES: GraphNode[] = [
  {
    id: 'center',
    type: 'center',
    cluster: 'center',
    label: '任泓雨',
    summary: 'AI 应用工程师 · 用 AI 重塑生产力',
    detail: '不是程序员，是用 AI 做产品的人。把任何重复 3 遍的事 AI 化或自动化。3-4 年信息化项目交付经验，深度使用 Claude Code / Codex 做企业级项目开发，效率提升 50%。',
    importance: 10,
    accent: 'teal',
  },

  // Projects cluster
  {
    id: 'pp8',
    type: 'project',
    cluster: 'projects',
    label: 'Query Auto',
    summary: '多智能体情报简报 Agent · LangGraph 编排',
    detail: '基于 Vercel 部署的多智能体情报收集与分析系统。LangGraph 编排规划器 / 研究员 / 编辑 / 评论家，从 Google News RSS 抓取，集成 OpenRouter + 智谱 AI 生成结构化简报，通过 Resend 邮件投递。',
    tags: ['LangGraph', '多智能体', 'Vercel', '智谱AI'],
    importance: 10,
    url: 'https://query.airainyu.xyz/',
    accent: 'amber',
  },
  {
    id: 'pp7',
    type: 'project',
    cluster: 'projects',
    label: '宠物健康 AI',
    summary: '14 页面 SPA · 100% Claude Code 开发',
    detail: '宠物健康 AI 服务平台：智能问诊 + 四大 AI 识别（品种/情绪/排泄物/呕吐物）+ 用户权益。零手写代码，100% Claude Code 完成，核心 JS 10,000+ 行，独立联调 20+ API。',
    tags: ['Claude Code', 'AI 辅助开发', 'API 联调'],
    importance: 9,
    accent: 'amber',
  },
  {
    id: 'pp3',
    type: 'project',
    cluster: 'projects',
    label: 'Dify RAG 知识库',
    summary: '混合检索 + Prompt 约束防幻觉',
    detail: '基于 Dify 的个人知识库问答系统。向量检索 + 关键词检索混合，Chatflow 设计「用户输入 → 知识检索 → LLM → 回复」，Prompt 强制模型仅基于知识库回答。',
    tags: ['RAG', 'Dify', '向量检索'],
    importance: 8,
    accent: 'teal',
  },
  {
    id: 'pp1',
    type: 'project',
    cluster: 'projects',
    label: 'Coze 智能客服',
    summary: 'Workflow + 知识库 · 自动识别意图',
    detail: '基于 Coze 的智能客服 Agent。整理行业文档清洗后导入飞书知识库，配置 Workflow 让 Bot 识别用户意图并调用知识库回答。',
    tags: ['Coze', 'Workflow', '智能客服'],
    importance: 7,
    accent: 'teal',
  },
  {
    id: 'pp6',
    type: 'project',
    cluster: 'projects',
    label: 'AI 书评工具',
    summary: 'LLM + Seedream MCP · 秒级生成',
    detail: '深度整合 LLM 与 Seedream 4.5 MCP 图像生成的全流程自动化书评工具。书籍背景检索 → 观点提炼 → AI 配图 → 多格式导出，将创作周期从数小时缩短至秒级。',
    tags: ['LLM', 'MCP', '内容创作'],
    importance: 6,
    accent: 'teal',
  },
  {
    id: 'pp2',
    type: 'project',
    cluster: 'projects',
    label: 'TimeReminder',
    summary: 'Windows 桌面 · 设好就不管',
    detail: 'Windows 桌面任务提醒工具。"设好就不管"理念：用户输入截止时间 + 预计耗时，系统推导应开始时间，Toast 强提醒 + 托盘常驻 + SQLite 本地存储 + 单文件 exe。',
    tags: ['Python', 'PyQt5', '桌面应用'],
    importance: 5,
    accent: 'default',
  },
  {
    id: 'pp5',
    type: 'project',
    cluster: 'projects',
    label: '桌面清理工具',
    summary: 'Vibe Coding · Python + tkinter',
    detail: 'Windows 桌面文件管理应用。扫描桌面按类型分组，文件夹递归展开 3 层，快捷方式展开，多选批量操作，双击打开，右键重命名。',
    tags: ['Python', 'tkinter', '文件管理'],
    importance: 4,
    accent: 'default',
  },

  // Skills cluster
  {
    id: 'skill-ai',
    type: 'skill',
    cluster: 'skills',
    label: 'AI 工具能力',
    summary: '多模型对比 + Prompt 设计 + Agent 编排',
    detail: '多模型对比校验（ChatGPT / Claude / Gemini / 千问）、Prompt 设计与输出约束、LangGraph 多智能体编排、OpenClaw 框架、AI 编程辅助（Claude Code / Codex）。',
    tags: ['Prompt', 'LangGraph', 'Claude Code'],
    importance: 9,
    accent: 'teal',
  },
  {
    id: 'skill-product',
    type: 'skill',
    cluster: 'skills',
    label: '产品交付',
    summary: 'AI 项目背景下的多方协调',
    detail: '信息化项目协同 + Claude Code / Codex 深度参与企业级开发，多角色沟通与需求拆解，技术方案梳理（PPT / 文档），流程与风险管理，效率提升 50%。',
    tags: ['需求拆解', '风险管控', '技术方案'],
    importance: 8,
    accent: 'teal',
  },
  {
    id: 'skill-models',
    type: 'skill',
    cluster: 'skills',
    label: 'AI 模型工具',
    summary: 'LLM + 图像 + 视频 + 编程',
    detail: 'LLM：ChatGPT / Claude / Gemini / 千问 / 豆包。图像：Nano Banana / 即梦 / Midjourney。视频：Runway / Vidu / Veo3.1 / hailuo / Sora2。编程：Claude Code / Codex / OpenClaw。框架：LangGraph / Coze / Dify。',
    tags: ['LLM', '图像生成', '视频生成'],
    importance: 7,
    accent: 'teal',
  },

  // Philosophy cluster
  {
    id: 'philo-ai',
    type: 'philosophy',
    cluster: 'philosophy',
    label: 'AI 应用工程师',
    summary: '不是程序员 · 用 AI 做产品',
    detail: '定位：AI 应用工程师。技术决策讲"为什么"和"对用户的影响"，不只讲实现。',
    importance: 9,
    accent: 'amber',
  },
  {
    id: 'philo-3x',
    type: 'philosophy',
    cluster: 'philosophy',
    label: '重复 3 遍即自动化',
    summary: '工作哲学 · 把流程交给机器',
    detail: '工作哲学：把任何重复 3 遍的事 AI 化或自动化。这是效率第一性原理。',
    importance: 8,
    accent: 'amber',
  },
  {
    id: 'philo-user',
    type: 'philosophy',
    cluster: 'philosophy',
    label: '用户体验最高',
    summary: '优先级 > 技术偏好 + 代码整洁度',
    detail: '用户体验是所有产品的最高准则。优先级高于技术偏好、代码整洁度、架构优雅度。后端可以复杂，用户触碰到的每一层必须丝滑。',
    importance: 8,
    accent: 'amber',
  },

  // Timeline cluster
  {
    id: 'w0',
    type: 'timeline',
    cluster: 'timeline',
    label: '知行求索科技',
    summary: 'AI 产品经理 · 2026.01 至今',
    detail: 'AI 产品经理。负责项目原型快速落地、前端开发与前后端联调，效率提升 50%。参与产品设计、UI 设计、测试工作。',
    tags: ['AI 产品', '前端开发', '原型落地'],
    importance: 9,
    accent: 'amber',
  },
  {
    id: 'w1',
    type: 'timeline',
    cluster: 'timeline',
    label: '艾泰克工程咨询',
    summary: '信息化项目交付专员 · 2023.09-2025.09',
    detail: '协助协同同事与多方干系人完成交付，规避系统性风险。参与项目技术性方案编制，明确用户需求。协助参与项目质量交付验收会议。',
    tags: ['G端交付', '风险规避', '验收答疑'],
    importance: 7,
    accent: 'default',
  },
  {
    id: 'w2',
    type: 'timeline',
    cluster: 'timeline',
    label: '湖南大福信息',
    summary: '项目交付助理 · 2021.09-2023.08',
    detail: '需求分析与沟通，协助编写技术方案 PPT。现场交付保障，参与项目质量验收会议。跨组织协同交付，构建文档全周期管控流程。',
    tags: ['需求调研', '跨组织协同', '文档管控'],
    importance: 6,
    accent: 'default',
  },
];

export const GRAPH_EDGES: GraphEdge[] = [
  // Center hub
  { source: 'center', target: 'pp8', strength: 1 },
  { source: 'center', target: 'skill-ai', strength: 1 },
  { source: 'center', target: 'philo-ai', strength: 1 },
  { source: 'center', target: 'w0', strength: 1 },

  // Project to skill cross-links
  { source: 'pp8', target: 'skill-ai', strength: 0.6 },
  { source: 'pp7', target: 'skill-ai', strength: 0.5 },
  { source: 'pp3', target: 'skill-ai', strength: 0.5 },
  { source: 'pp1', target: 'skill-ai', strength: 0.4 },
  { source: 'pp6', target: 'skill-models', strength: 0.4 },

  // Skill cross-links
  { source: 'skill-ai', target: 'skill-product', strength: 0.5 },
  { source: 'skill-ai', target: 'skill-models', strength: 0.5 },

  // Philosophy cross-links
  { source: 'philo-ai', target: 'philo-3x', strength: 0.6 },
  { source: 'philo-ai', target: 'philo-user', strength: 0.6 },

  // Work → philosophy
  { source: 'w0', target: 'philo-ai', strength: 0.5 },
  { source: 'w0', target: 'skill-product', strength: 0.4 },
  { source: 'w1', target: 'skill-product', strength: 0.4 },

  // Timeline chain
  { source: 'w0', target: 'w1', strength: 0.3 },
  { source: 'w1', target: 'w2', strength: 0.3 },
];
