# AIJianLi Neural Vibe · L1 Progress

用途：让下一轮 agent 不问人也能继续。

## Current State

- Status: phase 1 done（L001-L004 全部 passes:true，等待用户浏览器实测后启动 Phase 2-5）
- Active branch: `main`（本地，不上传仓库）
- Latest commit: `polish L1: neural vibe (edge pulses + node breathing + center upgrade + hover ripples)`（即将提交）
- Feature list: `feature_list.json`（L001-L004 全部 passes:true）
- PRD: `prd.md`

## 任务概览

| Phase | 主题 | Features | 何时做 |
| --- | --- | --- | --- |
| Phase 1 神经质感 | L1 节点视觉生命感 | L001-L004 | ✅ 今天开发 |
| Phase 2 粒子氛围 | L2 背景氛围升级 | L005-L007 | 待用户启动 |
| Phase 3 信息密度 | L3 节点信息层次 | L008-L010 | 待用户启动 |
| Phase 4 主题切换 | L4 深色/浅色打磨（用户明确要） | L011-L013 | 待用户启动 |
| Phase 5 项目剧场 | 方向 A GIF 多模态（用户明确要） | L014-L016 | 待用户启动 + GIF 素材 |

总计：5 phase，16 个 feature。今天开发 Phase 1（4 个 feature，1 commit）。

## Round 1 - 2026-06-14 Phase 1 (L1) 实施

### 本轮完成了什么

用户说"开干" → 开发 Phase 1 全部 4 个 feature。

- L001 边线脉冲数据流（NeuralCanvas.tsx）
- L002 节点错峰呼吸（NodeCluster.tsx）
- L003 Center 节点升级（NodeCluster.tsx）
- L004 悬停涟漪扩散（NodeCluster.tsx）

4 个 feature 全部 `passes:true`，evidence: `evidence/phase-1-build.md`。

### 修改了哪些文件

修改：
- `components/NeuralCanvas.tsx`：SVG 边线脉冲（包 g + motion.circle，光点单方向 s→t + drop-shadow 4px 发光）
- `components/NodeCluster.tsx`：完全重写 motion.div 渲染逻辑（hashSeed + 错峰呼吸 + Center 4 部分升级 + AnimatePresence 涟漪）

新建：
- `docs/tasks/aijianli-neural-vibe-20260614/evidence/phase-1-build.md`

### 测试了什么

- `npm run build`：通过（2169 modules, 3.59s, 无 TS 报错）
- Dev server (http://localhost:4001)：响应 200
- 代码静态 review：4 个 feature 实施全部对齐 PRD §7 spec

待用户浏览器实测（不能由 agent 自动验证视觉）：
- L001 光点流动 + strength ≥ 0.7 双光点
- L002 节点呼吸 + 错峰 + hover 暂停
- L003 Center 外环/中环/卫星
- L004 非 center 节点涟漪
- FPS ≥ 30
- prefers-reduced-motion 关闭装饰动画

### 证据在哪里

- `evidence/phase-1-build.md`：4 个 feature 实施细节 + 关键代码片段 + 静态验证 + 待用户实测项

### 还剩什么

- 等用户浏览器实测 Phase 1（视觉验证）
- 用户实测通过 → 可启动 Phase 2（L005-L007 粒子氛围）
- 等用户决定是否启动 Phase 3-5

### 未说明 / 未解决的失败项

无。所有 4 个 feature build 通过，但视觉实测待用户。

### 下轮建议从哪里继续

1. 用户浏览器实测 Phase 1，反馈视觉效果
2. 如果效果好 → 启动 Phase 2（L005 粒子连线 / L006 三层视差 / L007 鼠标响应）
3. 如果有问题 → 针对性调整（动画幅度/速度/颜色）

### Git 状态

- 即将提交：`polish L1: neural vibe (edge pulses + node breathing + center upgrade + hover ripples)`
- 改动文件：`components/NeuralCanvas.tsx` + `components/NodeCluster.tsx` + `docs/tasks/aijianli-neural-vibe-20260614/*`
- 不 push（PRD §6 spec）

---

## Round 0 - 2026-06-14 开发包创建

### 本轮完成了什么

- 用户反馈：当前 Neural Canvas "就是加了 21 个节点，没有其他特别的部分"
- /design + /think 综合分析：诊断 3 个核心问题（节点是装饰 / AI 是旁观者 / 粒子是背景）
- 列出 L1-L4 立即优化 + 方向 A/B/C/D 发散建议
- 用户决定：先做 L1（节点神经质感），L2 和方向 A/B/C/D 都是扩展
- 创建开发包目录 `docs/tasks/aijianli-neural-vibe-20260614/`
- 写 PRD（11 章节：需求重述 / Agent 理解 / 风险 / 替代方案 / BDD / 禁止 / 实现要点 / token / 测试 / phase 划分）
- 写 feature_list.json（4 个 feature，全部 passes:false）

### 修改了哪些文件

新建：
- `docs/tasks/aijianli-neural-vibe-20260614/prd.md`
- `docs/tasks/aijianli-neural-vibe-20260614/feature_list.json`
- `docs/tasks/aijianli-neural-vibe-20260614/progress.md`（本文件）
- `docs/tasks/aijianli-neural-vibe-20260614/evidence/.gitkeep`

### 不属于本开发包但已落地的修改

- `data.ts`：深圳市知行求索科技日期 `2026.01 – 至今` → `2026.01 – 2026.03`（用户上一轮明确要求，已直接做掉，不在 L1 范围）

### 测试了什么

无（准备阶段不涉及代码改动）。

### 证据在哪里

无。

### 还剩什么

- 等用户确认 PRD
- 确认后开发 L001-L004

### 未说明 / 未解决的失败项

无。

### 下轮建议从哪里继续

**等用户确认 PRD 后开始 Phase 1**：

1. L001 边线脉冲数据流（NeuralCanvas.tsx）
2. L002 节点错峰呼吸（NodeCluster.tsx）
3. L003 Center 节点升级（NodeCluster.tsx）
4. L004 悬停涟漪（NodeCluster.tsx）

每个 feature 完成后：
- 跑 `feature_list.json` 里写的 `user_steps` 做 smoke 验证
- 验证通过 → 把 `passes` 改为 `true`，填 `evidence` 路径
- 在本文件追加 Round N 节
- 4 个 feature 全部完成后 git commit（不 push）

### Git 状态

- Commit: 无新增
- git status: docs/tasks/aijianli-neural-vibe-20260614/ 下有新增未跟踪文件

## 后续扩展（不在本开发包，仅记录）

- **L2 粒子氛围**：粒子连线 / 视差 / 鼠标聚集 / bloom
- **L3 信息密度**：center 节点 3 行 + 节点角标 + 键盘提示
- **L4 主题切换打磨**：light 模式从"日间矿物"主题重新调
- **方向 A 多模态项目剧场**：GIF 缩略 + 全屏剧场（用户提到的扩展方向）
- **方向 B AI 数字分身**：center 节点是 AI 角色，语音自我介绍 + 角色扮演
- **方向 C 简历体检 Agent**：HR 上传 JD → AI 匹配报告
- **方向 D 实时数据 + 学习日志**：GitHub API + 外脑公开部分
