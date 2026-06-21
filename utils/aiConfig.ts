export const PRIMARY_CHAT_MODEL = 'glm-5.2' as const;
export const FALLBACK_CHAT_MODEL = 'glm-5.1' as const;
export const CHAT_MODEL = PRIMARY_CHAT_MODEL;
export const EMBEDDING_MODEL = 'embedding-3' as const;

export const RAG_TOP_K = 3;
export const RAG_MIN_SCORE = 0.18;
export const RAG_CONTEXT_MAX_CHARS = 2200;

export const RAG_SOURCE_PRIORITY = [
  '我是谁.md',
  '简历经历.md',
  '项目作品.md',
  '常见问答口径.md',
  '别名与关键字.md',
] as const;

export const RAG_ROUTE_RULES = [
  {
    name: 'profile',
    keywords: ['我是谁', '自我介绍', '个人介绍', '介绍', '求职方向', '定位', '背景', '优势', '擅长', '能力', '会什么'],
    sources: ['我是谁.md', '简历经历.md'],
  },
  {
    name: 'experience',
    keywords: ['经历', '经验', '工作', '简历', '职业', '项目经历', '交付', '职责', '岗位', '年限', '做什么', '新公司', '艾谷瑞', 'ChinaB2C', '跨境电商'],
    sources: ['简历经历.md', '我是谁.md'],
  },
  {
    name: 'projects',
    keywords: ['项目', '作品', '做过', '案例', '成果', '上线', '功能', 'RAG', '桌面清理', '门户网站', '作品集', 'ChinaB2C', 'Listing', 'A+', 'ASIN', 'eBay', '竞品', '卖点图'],
    sources: ['项目作品.md', '别名与关键字.md'],
  },
  {
    name: 'interview',
    keywords: ['面试', '为什么', '匹配', '怎么', '弥补', '企业级', '回答', '自我介绍', '经验'],
    sources: ['常见问答口径.md', '我是谁.md', '简历经历.md'],
  },
  {
    name: 'alias',
    keywords: ['别名', '关键词', '同义词', '别称'],
    sources: ['别名与关键字.md'],
  },
] as const;
