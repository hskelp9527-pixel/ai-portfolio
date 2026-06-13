# AIJianLi 前端 Neural Canvas 重构 PRD

日期：2026-06-14

状态：需求已确认，待开发

## 1. 需求输入、Agent 反馈与换路思考

### 1.1 用户原始描述

- 把 AIJianLi 前端从静态简历改造成节点图谱 + AI 导览的 Neural Canvas（方向 B）
- 动工前必须备份当前前端 7 个关键文件到 `_trash/pre-neural-canvas-backup-20260614/`
- main 分支本地做，不 push，4 个 phase 各自独立 commit 可回退
- 色板：矿物青 `oklch(0.78 0.18 165)` + 暖琥珀 `oklch(0.75 0.20 50)`
- 字体：阿里巴巴普惠体 + Geist + JetBrains Mono
- 新依赖：three / @react-three/fiber / d3-force / react-force-graph
- Phase B 已修完 F001-F004，Phase C/D/E 的 F005-F011 合并进本开发包末尾一起做完
- 允许大改（包括删 pp4），但备份是硬约束
- 一口气做完 4 个 phase + 附加 F005-F011，只做 smoke 验证

### 1.2 Agent 理解

- 当前形态："传统简历 + 隐藏 AI 抽屉"，Hero 是空话占位，AI 是配角
- 目标形态："AI 即界面"，深空墨黑画布 + 节点图谱 + 玻璃卡 + AI 主动接待
- 4 phase：基础层（依赖 + 字体 + 粒子）→ 节点图谱（含 data.ts 重构）→ AI 导览（drawer → dock + 主动搭话 + 类型自适应）→ 打磨（暗色 + PDF + 移动端 + 性能）
- 数据层必须同步重构（data.ts 当前 PERSONAL_PROJECTS 顺序混乱 + pp4 循环引用简历本身）
- F005-F011 不阻塞前端重构，作为末尾 cleanup 一起做

### 1.3 Agent 反馈

| 类型 | 反馈内容 | 对用户的影响 | 建议采纳状态 |
| --- | --- | --- | --- |
| 风险 | 装新依赖后 bundle 至少 +400kb，首屏 LCP 显著变慢 | 移动端/弱网访客第一眼白屏 | 已采纳（动态 import + 字体 swap + three 懒加载） |
| 风险 | data.ts 里 pp4 描述简历本身（循环引用） | 节点图谱会显示"个人数字化简历网站"节点，点了回到自己 | 已采纳（Phase 2 删 pp4，备份已留） |
| 风险 | data.ts 当前 PERSONAL_PROJECTS 顺序乱（pp7→pp8→pp1→...） | 不加 importance 字段图谱重点会错 | 已采纳（Phase 2 必做） |
| 待确认 | Hero.tsx 删除后 FloatingNavigation 的 `#about` 锚点失效 | 删 Hero 需把 about 锚点改到 NeuralCanvas 中心节点 | 已采纳（Phase 2 同步改） |
| 提醒 | AGENTS.md "已知问题"列表里 Phase B 已修的 1-4 还在 | 不更新会让下一轮 agent 困惑 | 已采纳（Phase 4 顺手更新） |
| 提醒 | 现有 vitest 测试依赖当前组件结构，重构后大概率 fail | npm test 会红 | 已采纳（重构期间 smoke 验证为主，测试在 Phase 4 同步修复） |

### 1.4 换路思考

| 路径 | 核心思路 | 差异 | 取舍 |
| --- | --- | --- | --- |
| 原始路径 | 4 phase 全做，各自独立 commit | 基准 | 工期 4-5 天，bundle 大，复杂度高 |
| 换路 A：先 Phase 1+2 验证视觉，Phase 3+4 看效果再决定 | 切成"骨架可演示"和"AI 主动化"两段 | AI 导览延后 | 省 50% 工期但失去 AI 主动化核心卖点 |
| 换路 B：在现有静态结构上加 AI 主动化（方向 C 变体） | 把"AI 主动接待"作为唯一改造点 | 完全放弃图谱 | 风险最低但"未来感"达不到 |

**仍建议原始路径**：用户已明确选 B + 全力上 three.js + 一口气做完 + 接受 4-5 天工期。换路 A 失去 AI 主动化（用户原话"缺少引导"的根本解法），换路 B 退化为已拒绝的方向 C。

### 1.5 用户决定记录

- 已采纳：
  - 方向 B Neural Canvas
  - 矿物青 + 暖琥珀 + 普惠体 + Geist + JetBrains Mono
  - 全力上 three.js / d3-force / react-force-graph
  - 备份硬约束（_trash/pre-neural-canvas-backup-20260614/）
  - 大改允许（含 pp4 删除）
  - F005-F011 合并进开发包末尾全做完
  - 一口气做完 4 phase + 附加任务
  - 质量模式：smoke 验证
- 暂不采纳：换路 A、换路 B
- 待确认：无

## 2. 背景与目标

### 背景

- AIJianLi 是任泓雨的 AIGC 沉浸式个人简历网站，定位"AI 应用工程师"作品
- 当前 Hero 是空话"拥抱AI / 重塑生产力"，AI 藏在抽屉里默认收起，首条消息是通稿"你好我是 AI 助手"
- 用户反馈："缺少引导"、"不够未来"、"不够 AI 化"
- Phase B（F001-F004）已修复 server.ts 路由、chat.js 引用、Tailwind CDN→PostCSS、删 server/ 子目录

### 目标

把简历从"传统静态作品集 + 隐藏 AI"重构为"AI 即界面"：
- 访客第一眼被 AI 主动接住（不是去看 PDF 化简历）
- 节点图谱可视化展示经历之间的关联（项目/技能/哲学/时间线四簇）
- AI 根据访客行为推断类型并主动推荐路径

## 3. 当前项目事实

接手 agent 必须先自行扫描这些代码文件：

- `App.tsx` —— 入口，5 个 section + AIChatDrawer 抽屉
- `components/Hero.tsx` —— 27 行占位文案，Phase 2 删除
- `components/AIChatDrawer.tsx` —— 293 行抽屉，Phase 3 重写为 AIConversationPanel
- `data.ts` —— 228 行，PERSONAL_PROJECTS 顺序混乱 + pp4 循环引用
- `package.json` —— 当前依赖 framer-motion + lucide-react，未含 three
- `tailwind.config.ts` —— 当前空 theme，Phase 1 加 OKLCH 色板
- `index.html` —— 当前引 Google Fonts，Phase 1 改普惠体 + Geist
- `AGENTS.md` —— 已知问题列表，Phase 4 更新

## 4. 核心判断

| 判断 | 依据 |
| --- | --- |
| 重构比改造更合适 | 当前组件结构与"AI 即界面"形态根本不同，patch 比 rewrite 更慢更乱 |
| 节点图谱是核心，不是装饰 | 用户选 B 的根本原因是图谱对应"AI 检索的可视化"叙事 |
| AI 主动化优先级高于视觉细节 | 用户原话痛点是"缺少引导" |
| F005-F011 合并到末尾 | 这 7 个 bug 简单（统一模型/类型修复/删重复/email 引入），不阻塞前端 |
| smoke 验证够用 | 一口气做完场景下，TDD 会拖慢节奏；视觉/交互问题用 headful 抓 |

## 5. PRD

### 5.1 范围

**包含**：
- Phase 0：备份 7 个前端文件
- Phase 1：依赖安装 + 色板/字体/粒子背景
- Phase 2：节点图谱（含 data.ts 重构、Hero 删除、NeuralCanvas + NodeCluster + GlassCard）
- Phase 3：AI 导览（AIGuideBubble + AIConversationPanel + 访客类型自适应 + 流式输出）
- Phase 4：暗色适配 + PDF 兼容 + 移动端 + 性能 + AGENTS.md 更新
- Phase 5：F005-F011 收尾

**不包含**：
- 后端 API 改造（除 F009 简化错误日志外不动 api/chat.ts 主体）
- RAG 索引重建
- 媒体存储迁移
- 新功能（不做简历内容增删）

### 5.2 用户角色

| 角色 | 占比预期 | 关心什么 | 首屏 AI 应该说什么 |
| --- | --- | --- | --- |
| HR / 业务 leader | 40% | 关键数字、项目成果、联系方式 | "想看精华 30 秒导览吗？" |
| 同行工程师 / AI 圈 | 30% | 技术深度、用的什么模型、怎么解决 RAG | 推荐技术深度路径 |
| 潜在合作者 / 客户 | 20% | 能做什么、案例、合作方式 | 推荐项目实战路径 |
| 朋友 / 好奇访客 | 10% | 看个热闹 | 自由探索 |

### 5.3 功能需求

详见 `feature_list.json`，共 18 个 feature：

- Phase 0：N001（备份）
- Phase 1：N002-N005（依赖 / 色板 / 字体 / 粒子）
- Phase 2：N006-N010（data 重构 / Canvas / Cluster / hover 卡 / zoom-in）
- Phase 3：N011-N014（GuideBubble / ConversationPanel / 类型自适应 / 流式）
- Phase 4：N015-N018（暗色 / PDF / 移动端 / 性能 + AGENTS 更新）
- Phase 5：F005-F011（继承自 bug-fix 开发包）

### 5.4 非目标

- 不做后端架构改造
- 不重构 RAG 系统
- 不引入新的状态管理库（继续用 useState + Context）
- 不做 SEO 优化
- 不做 i18n

## 6. 数据设计

### 6.1 data.ts 重构（Phase 2）

PERSONAL_PROJECTS 重新排序 + 加 `importance` 字段：

```ts
// 新顺序（按重要性）
pp8 Query Auto 多智能体情报 Agent (importance: 10)  // 最强 AI 实力展示
pp7 宠物健康 AI 服务 (importance: 9)
pp3 Dify RAG 知识库 (importance: 8)  // RAG 强相关
pp1 Coze 智能客服 (importance: 7)
pp6 AI Skill 书评 (importance: 6)
pp2 TimeReminder (importance: 5)
pp5 桌面清理工具 (importance: 4)
// pp4 删除（循环引用简历本身）
```

### 6.2 节点数据结构

```ts
interface GraphNode {
  id: string;
  type: 'center' | 'project' | 'skill' | 'philosophy' | 'timeline';
  label: string;
  summary: string;
  detail?: string;        // 详情面板内容
  importance: number;     // 决定节点尺寸
  cluster: 'projects' | 'skills' | 'philosophy' | 'timeline';
  position?: { x: number; y: number };  // d3-force 算出
  color?: string;         // 来自色板
  links?: string[];       // 关联节点 ID
}
```

## 7. 接口与实现方案

### 7.1 组件架构

```
App.tsx
├─ components/
│  ├─ NeuralCanvas.tsx          // three.js 粒子 + 节点层
│  ├─ NodeCluster.tsx           // 4 簇节点组
│  ├─ GlassCard.tsx             // hover/click 玻璃卡
│  ├─ AIGuideBubble.tsx         // 右下角悬浮 AI
│  ├─ AIConversationPanel.tsx   // 重写 AIChatDrawer，dock 形态
│  └─ Hero.tsx                  // 删除
├─ hooks/
│  ├─ useNodeGraph.ts           // d3-force 位置计算
│  ├─ useAIGuide.ts             // 访客轨迹 + 推荐
│  └─ useVisitorType.ts         // 类型推断
└─ three/
   ├─ ParticleField.ts          // 背景粒子
   └─ postprocessing.ts         // bloom 发光
```

### 7.2 关键决策

| 决策点 | 选择 | 理由 |
| --- | --- | --- |
| 节点渲染层 | DOM + framer-motion（不用 three 渲染节点） | 节点要支持 hover 玻璃卡和文本，DOM 更可控；three 只做粒子背景 |
| 力导向算法 | d3-force | 轻量、社区成熟、与 React 兼容好 |
| 字体加载 | `<link rel="preload">` + `font-display: swap` | 避免 FOIT |
| three 引入 | `import('three')` 动态 import | 不阻塞首屏 |
| AI 流式 | chatService 已经支持，UI 层加 token-by-token 渲染 | 复用现有 |

## 8. 页面改造范围

| 文件 | 操作 |
| --- | --- |
| `App.tsx` | 重写：去掉 Hero/Resume/Gallery/Theater 五段式，改为 NeuralCanvas 全屏 + 侧边 AIConversationPanel |
| `components/Hero.tsx` | 删除 |
| `components/AIChatDrawer.tsx` | 重写为 AIConversationPanel.tsx |
| `data.ts` | 重构 PERSONAL_PROJECTS 顺序 + 加 importance + 删 pp4 + 加节点数据结构 |
| `tailwind.config.ts` | 加 OKLCH 色板 token + 字体 stack |
| `index.html` | 改字体引用 |
| `index.tsx` | 改 root 渲染逻辑（如果需要） |
| `components/NeuralCanvas.tsx` | 新建 |
| `components/NodeCluster.tsx` | 新建 |
| `components/GlassCard.tsx` | 新建 |
| `components/AIGuideBubble.tsx` | 新建 |
| `hooks/useNodeGraph.ts` | 新建 |
| `hooks/useAIGuide.ts` | 新建 |
| `hooks/useVisitorType.ts` | 新建 |
| `three/ParticleField.ts` | 新建 |
| `three/postprocessing.ts` | 新建 |

## 9. 开发步骤

### 9.1 接手前确认流程

接手 agent 开始开发前必须先完成：

1. 打开本文档 + feature_list.json + progress.md
2. 自行扫描 §3 列出的代码文件，做深度确认
3. 复述本次任务要做什么、验收条件是什么、禁止执行项是什么
4. 如果用户没有认可复述内容，继续确认，不得开发

用户只需要确认流程、验收条件和禁止执行项。

### 9.2 Phase 顺序

| Phase | 工作内容 | Commit 点 |
| --- | --- | --- |
| Phase 0 | 备份 7 个文件 → `_trash/pre-neural-canvas-backup-20260614/` | 1 个 commit |
| Phase 1 | 装依赖 + 色板 + 字体 + 粒子背景 | 1 个 commit |
| Phase 2 | data.ts 重构 + NeuralCanvas + 节点交互 | 1 个 commit |
| Phase 3 | AI 导览系统 | 1 个 commit |
| Phase 4 | 打磨（暗色/PDF/移动端/性能/AGENTS） | 1 个 commit |
| Phase 5 | F005-F011 收尾 | 1 个 commit |

总计 6 个 commit。每个 phase 完成后跑 smoke 验证 + 更新 progress.md。

## 10. BDD 验收场景

```gherkin
Feature: Neural Canvas 简历

Scenario: 首屏 AI 主动接待
  Given 访客首次打开简历页面
  When 页面加载完成（含字体 + 粒子背景）
  Then 看到"任泓雨"中心节点 + 4 簇（项目/技能/哲学/时间线）+ 右下角 AI 气泡主动浮出

Scenario: hover 节点显示玻璃卡
  Given Neural Canvas 已加载
  When 访客鼠标悬停任意节点
  Then 节点光晕扩大 + 周围节点透明度降到 0.4 + 玻璃卡 backdrop-blur 显示摘要

Scenario: 点击节点 zoom-in
  Given 访客已 hover 节点
  When 访客点击该节点
  Then 相机平滑推近 + 节点放大到屏幕 60% + 玻璃卡从节点位置 grow 出详情

Scenario: AI 主动搭话（3 秒停留触发）
  Given 访客 hover 同一节点超过 3 秒
  When 3 秒计时器触发
  Then AI 气泡浮出推荐问题（如"要不要听听这个项目背后的 AI 协作故事？"）

Scenario: 访客类型自适应
  Given 访客首次访问
  When 在首屏停留 1 秒
  Then AI 根据首个动作（滚动=HR/hover=同行/点对话框=对话型）推断类型并切换推荐

Scenario: 暗色主题切换
  Given 用户在亮色主题下浏览
  When 点击右上角主题切换按钮
  Then 整个画布 + 节点 + 玻璃卡平滑过渡到暗色（300ms cubic-bezier）

Scenario: PDF 导出兼容
  Given 用户在 Neural Canvas 页面点击导出 PDF
  When 触发导出
  Then PDF 内容是节点列表的静态版本（不是图谱截图，因为 three canvas 不参与 html2canvas）

Scenario: 移动端 375px 响应
  Given 访客在 iPhone 12 (375px) 打开
  When 页面加载
  Then 节点图谱降级为纵向时间线（不上 three，性能保护）
```

## 11. 质量模式建议

| 模式 | 推荐 | 原因 | 用户确认状态 |
| --- | --- | --- | --- |
| 轻量验证（smoke） | **是** | 一口气做完场景下，TDD 拖节奏；视觉/交互问题用 headful 抓 | **已确认** |
| 关键路径 TDD | 否 | 用户明确选 smoke | 不采用 |
| 完整 TDD | 否 | 用户明确选 smoke | 不采用 |

smoke 验证清单（每个 phase 完成后跑）：
1. `npm run build` 通过
2. `npm run dev:vite` 启动后浏览器手动验证核心场景
3. 截图证据存到 `evidence/screenshots/`
4. 浏览器 console 无报错

## 12. 验收标准

整个开发包完成的标志：

- [ ] N001-N018 + F005-F011 全部 `passes: true`
- [ ] 每个 feature 有 smoke 验证证据（截图或命令输出）
- [ ] `npm run build` 通过
- [ ] `npm test` 通过（Phase 4 修复后的测试套件）
- [ ] 浏览器手测核心 5 个场景全部通过（§10 BDD）
- [ ] 移动端 375px 浏览不崩
- [ ] 暗色主题切换正常
- [ ] PDF 导出可用（静态列表版本）
- [ ] AGENTS.md 更新（去掉已修问题 + 加新依赖说明）
- [ ] progress.md 记录 6 个 round（每个 phase 一个）
- [ ] git log 有 6 个 commit，每个 phase 一个
- [ ] git status clean

## 13. 禁止执行项

- 不 push 到远程仓库（仅本地 main 分支）
- 不删除 `_trash/pre-neural-canvas-backup-20260614/` 备份
- 不为绕过报错而注释掉 TypeScript 类型检查
- 不在 Phase 0 备份完成前修改任何前端文件
- 不引入未在本 PRD 列出的新依赖（除非用户追加授权）
- 不修改 api/chat.ts 主体逻辑（F009 仅简化 catch 块日志）
- 不修改 RAG 索引或 vector-index.json
- 不删现有 dead code（除非是本次重构产生的）
- 不跳过任何 phase 的 smoke 验证
- 不在一个 commit 里跨 phase（每个 phase 严格独立 commit）

## 14. 任务领取与完成记录

| 任务 | 领取 agent | 分支 | 领取时间 | 完成时间 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| Phase 0 备份 | claude-code | main | 2026-06-14 | 待定 | 待领取 | N001 |
| Phase 1 基础层 | claude-code | main | 待定 | 待定 | 待领取 | N002-N005 |
| Phase 2 节点图谱 | claude-code | main | 待定 | 待定 | 待领取 | N006-N010 |
| Phase 3 AI 导览 | claude-code | main | 待定 | 待定 | 待领取 | N011-N014 |
| Phase 4 打磨 | claude-code | main | 待定 | 待定 | 待领取 | N015-N018 |
| Phase 5 F005-F011 | claude-code | main | 待定 | 待定 | 待领取 | 继承 bug-fix 开发包 |

## 15. 风险与取舍

| 风险 | 概率 | 影响 | 对冲方案 |
| --- | --- | --- | --- |
| bundle 大导致首屏白屏 | 高 | 高 | three 动态 import + 字体 swap + 粒子懒加载 + 骨架屏 |
| 图谱交互不直观，访客不知道能点 | 中 | 高 | 首屏 5 秒虚拟光标引导动画 |
| AI 主动搭话变骚扰 | 中 | 中 | 单次会话最多 2 次，dismiss 后该会话不再触发 |
| three.js 在低端机性能差 | 中 | 中 | 帧率监控，<30fps 自动降级到静态节点 |
| d3-force 与 React 19 兼容问题 | 低 | 中 | 备选：用 react-force-graph 二次封装版 |
| data.ts 重构后 vitest 全红 | 高 | 低 | Phase 4 同步修测试，重构期间允许 test 红 |
| PDF 导出 three canvas 不参与 | 必现 | 中 | 导出时切换为静态列表视图（已是 N016 设计） |

### 最脆弱的假设

**这套设计假设访客愿意停留 10 秒以上探索**。如果主要访客是想 30 秒扫完的 HR，整个图谱就是阻碍。

**对冲**：访客类型自适应（N013）首屏判断如果是 HR 型，AI 主动提议"要不要看 30 秒精华导览"，并提供"跳过图谱看精简版"按钮。

## 16. 结果定义

完成后用户能感受到的变化：

1. **第一眼**：打开简历不再看到两句空话，而是看到会动的节点图谱 + AI 主动浮出气泡迎接
2. **交互**：鼠标 hover 任何节点都有玻璃卡响应，3 秒停留 AI 主动搭话
3. **对话**：AI 不再藏在抽屉，dock 在右侧常驻，首条消息有上下文（不再是"你好我是 AI 助手"通稿）
4. **视觉**：深空墨黑 + 矿物青 + 暖琥珀的色板，普惠体 + Geist + JetBrains Mono 字体组合，明显区别于默认 AI 模板
5. **性能**：首屏 < 3s 完成字体 + 粒子加载（弱网降级骨架屏）
6. **回退**：6 个独立 commit，任何 phase 出问题都能 git revert 回退到上一 phase
