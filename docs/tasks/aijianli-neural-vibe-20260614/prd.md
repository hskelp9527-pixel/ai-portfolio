# AIJianLi Neural Vibe · L1 节点神经质感

## 1. 用户原始请求

> 在我看来就是加了 21 个节点这些内容，好像没有其他特别的部分。
> 我后面可能会加一些 gif 图，点击可以扩大的那种，更具备可视感的去展示，我的具体项目。
> 颜色最好可以做主题切换深色和浅色的都需要。
> 先做 L1，L2 是扩展。都是扩展，今天不全部做。先出确定方案，开发包，再开发。

**理解（修正版）**：开发包要规划全（L1-L4 + 方向 A），今天开发只做 L1。后续 phase 等用户启动。

L1 = 节点要有"神经网络"质感（4 个子项）：
1. 边线光点流动（脉冲数据流）
2. 节点轻微呼吸（错峰）
3. Center 节点独特（外环旋转 + 内核脉动 + 光晕）
4. 悬停时从节点向外扩散涟漪

L2 = 粒子氛围升级（constellation + 三层视差 + 鼠标响应）
L3 = 信息密度（center 3 行 + 角标 + 键盘提示）
L4 = 主题切换深色/浅色打磨（用户明确要）—— 日间矿物主题
方向 A = 多模态项目剧场（GIF 缩略 + 全屏剧场 + 滚动叙事，用户明确要）

方向 B/C/D（AI 数字分身 / 简历体检 Agent / 实时数据 + 学习日志）暂列后续扩展备忘，不在本开发包范围。

## 2. Agent 理解

用户的真实判断：「21 个节点」版本本质是「传统简历 + 节点图层」，AI 感和未来感没拉开。问题不在节点数，在节点的**生命质感**——当前节点是装饰，看完一次就不想再碰。

L1 的目标：**让节点和边线"活"起来**，访客首屏 5 秒内感到"这是神经活动，不是静态信息图"。这是方向的最低门槛，没这个底子，后续 L2/方向 A/B/C/D 都白搭。

L1 不改动：
- 节点数据结构（GraphNode 不变）
- 节点位置算法（useNodeGraph 不变）
- 节点交互逻辑（hover/active/dim 不变）
- 粒子背景（L2 范围）
- AI 导览系统（Phase 3 已完成）

## 3. Agent 反馈与风险

### 风险 1：性能炸机
4 类动画同时跑（边线脉冲 + 节点呼吸 + Center 多层环 + 涟漪），21 节点 + N 边的 SVG 重绘成本可能让低端机掉到 30fps 以下。

**对策**：
- 所有动画用 `transform` / `opacity`（GPU 加速，不触发 layout）
- 每条边的光点数量上限 2 个
- 涟漪只在 hover 时触发（非常驻）
- 加 `prefers-reduced-motion` 检测，开启时关闭装饰动画
- center 多层环用 will-change 提示

### 风险 2：动画噪音
4 类动画一起跑可能"太满"，反而失去高级感。

**对策**：
- 节点呼吸幅度小（scale 1.0↔1.04，不是 1.1）
- 边线脉冲不显眼（opacity 0.3→0.8，不是 0→1）
- Center 卫星轨道是慢动作（duration 8-15s）
- 颜色统一在 signature-teal / signature-amber 范围

### 风险 3：和现有 hover/dim 状态打架
当前 NodeCluster 已有 hover dim（非 hover 节点 opacity 0.25）+ active scale 1.25。新加的呼吸/涟漪不能干扰这些状态。

**对策**：
- hover/active 时呼吸暂停
- 涟漪只在 hover 触发，hover 结束后涟漪完成本轮就消失
- dim 状态（opacity 0.25）的节点继续呼吸（不暂停），但呼吸幅度更小

### 风险 4：移动端不渲染 canvas（不影响）
MobileTimeline 路径不渲染 NeuralCanvas，L1 改动只影响 desktop。无需额外兼容。

## 4. 替代方案

### 4.1 边线脉冲的三种实现

**A. SVG `<animateMotion>` + path**（标准但繁琐）
- 每条边定义 `<path>`，光点用 `<circle><animateMotion><mpath/></animateMotion></circle>`
- 优点：浏览器原生
- 缺点：21 节点的边可能 30+，每个 path 都要算贝塞尔，复杂

**B. motion.circle + 线性插值**（推荐 ✅）
- 已知 s.x/s.y/t.x/t.y，每帧插值 `cx = s.x + (t.x-s.x) * progress`
- framer-motion 的 `animate` 配 `repeat: Infinity` + `ease: linear`
- 优点：代码简单，性能可控
- 缺点：光点路径只能直线（节点图边本来就是直线，OK）

**C. CSS keyframes + transform**
- 每条边一个 `<div>` + `animation` 关键帧
- 缺点：CSS 不知道 s/t 坐标，要 inline style 注入，复杂

**选 B**。

### 4.2 Center 节点的"独特"程度

**A. 加 1 个旋转外环**（轻量）
- 当前已有 scale 脉冲环，加一个反方向旋转的外环
- 工作量小，视觉提升有限

**B. 多层环 + 卫星**（推荐 ✅）
- 外环（旋转，duration 20s）+ 中环（脉动，3s）+ 内核（box-shadow 光晕）
- 3 个卫星点沿圆形轨道运动（duration 8/10/12s 错峰）
- 工作量中等，视觉提升明显

**C. three.js 3D 球体**（重）
- 用 three.js 做真实 3D 球
- 缺点：和现有 DOM 节点体系混搭，复杂度高

**选 B**。

### 4.3 涟漪触发位置

**A. 节点中心 SVG circle**
- 在 SVG 层（z-index 5）画涟漪
- 缺点：SVG 层是 pointer-events: none，没问题但要管理状态

**B. motion.div 在节点 div 内**（推荐 ✅）
- NodeCluster 的 motion.div 内加一个 motion.div，scale 0→2 opacity 1→0
- 优点：状态管理简单（hover 时触发）
- 缺点：涟漪受节点 div 圆角限制（设为圆形无问题）

**选 B**。

## 5. 验收场景（BDD）

```gherkin
Scenario: 首屏加载完成
When 用户首次访问 desktop 1920x1080
Then 节点图谱渲染完成
  And 边线上有光点沿直线流动（每条边 1-2 个）
  And 所有非 center 节点在轻微呼吸（错峰周期 2-4s）
  And Center 节点"任泓雨"显示外环旋转 + 中环脉动 + 卫星轨道
  And 整体 FPS ≥ 30

Scenario: 悬停某节点
When 用户 hover pp8（Query Auto）节点
Then pp8 节点放大到 scale 1.15
  And 从 pp8 中心向外扩散 1-2 圈涟漪（scale 0→2，opacity 1→0）
  And 其他节点 dim 到 opacity 0.25（呼吸不停）
  And HoverCard 显示

When 用户移开鼠标
Then 涟漪完成本轮后消失
  And pp8 节点恢复呼吸

Scenario: prefers-reduced-motion 开启
When 用户系统开启 reduce motion
Then 边线光点停止流动（静态显示或不显示）
  And 节点呼吸暂停
  And Center 卫星停止
  And 涟漪不触发
  And 节点位置 / hover / click 等基础功能正常

Scenario: 性能不显著退化
When Lighthouse 跑 desktop 性能分
Then Performance ≥ 70（当前未测，目标不下降）
  And 21 节点 + 边的初始渲染 < 500ms
```

## 6. 禁止动作

- ❌ 不改 GraphNode / GraphEdge 数据结构
- ❌ 不改 useNodeGraph 位置算法
- ❌ 不改 useAIGuide / useVisitorType 逻辑
- ❌ 不动 MobileTimeline（mobile 路径不渲染 canvas，无关）
- ❌ 不动粒子背景 ParticleField（L2 范围）
- ❌ 不引入新依赖（framer-motion 已足够）
- ❌ 不为了"加动画"而加动画（每类动画都要解释为什么）
- ❌ 不删 _trash 备份
- ❌ 不改 theme 切换逻辑（L4 范围）
- ❌ 不 push remote

## 7. 实现要点

### L001 边线脉冲数据流
- `NeuralCanvas.tsx` SVG 层：保留 `motion.line`，新增 `motion.circle` 沿线运动
- 每条边根据 strength 决定光点数量：strength ≥ 0.7 → 2 个，否则 1 个
- 光点速度：duration 3-5s（strength 高 → 快）
- 光点颜色：signature-teal（dark） / 矿物青深色（light）
- 光点大小：r=2（默认）/ r=3（strength ≥ 0.9）

### L002 节点错峰呼吸
- `NodeCluster.tsx` motion.div 的 `animate` 加 `scale` 多关键帧
- 每个节点的 delay 基于其 id 哈希（保证刷新后稳定，不是随机）
- 呼吸幅度：scale 1.0 ↔ 1.04（不是 1.1，避免太满）
- 周期：2-4s 错峰
- hover/active 时呼吸暂停（用 `useMotionValue` 或条件 animate）

### L003 Center 节点升级
- `NodeCluster.tsx` center 分支重构：3 层环 + 3 卫星
- 外环：absolute inset-0 rounded-full border，CSS animation rotate 20s linear infinite
- 中环：当前已有 scale 1↔1.15，保留
- 内核：box-shadow 光晕加强（已有 shadow-glow-teal-strong，加 pulse 动画）
- 卫星：3 个 motion.div 沿圆形轨道（用 `transform: rotate()` + `translateX(radius)`）
- 整体尺寸：center 节点保持 120px，但视觉延伸到 ~180px（卫星轨道）

### L004 悬停涟漪
- `NodeCluster.tsx` 每个 motion.div 内加 `<motion.div className="ripple" />`
- 初始 `scale: 0, opacity: 0`
- hover 时 animate `scale: [0, 2], opacity: [0.6, 0]`，duration 0.8s
- 涟漪是 absolute，定位 center，pointer-events: none
- 用 `AnimatePresence` 控制挂载/卸载

### 性能保护
- 顶部 `const prefersReducedMotion = useReducedMotion()`（framer-motion 内置）
- 所有装饰动画（光点/呼吸/卫星/涟漪）在 `prefersReducedMotion = true` 时关闭

## 8. 设计 token（不新增，复用）

- 边线脉冲色：`signature-teal`（dark） / `signature-teal-dim`（light）
- 涟漪色：`signature-teal`（teal accent 节点）/ `signature-amber`（amber accent 节点）/ `fg-tertiary`（default）
- Center 卫星色：`signature-teal`
- 缓动：`cubic-bezier(0.4, 0, 0.2, 1)`（neural-out）

## 9. 测试策略

- smoke：`npm run build` 通过
- 浏览器实测：粒子 + 节点 + 边线脉冲 + 涟漪同时跑 FPS ≥ 30
- 主题切换实测：light 模式下脉冲色不刺眼
- `prefers-reduced-motion` 实测：开启后动画停掉，基础功能正常
- 不写自动化测试（4 个 feature 都是视觉，自动化 ROI 低）

## 10. Phase 划分

开发包规划 5 个 phase，**今天只开发 Phase 1**，其他 phase 等用户启动。

| Phase | 主题 | Features | 何时做 |
|---|---|---|---|
| Phase 1 | L1 节点神经质感 | L001-L004 | ✅ 今天开发 |
| Phase 2 | L2 粒子氛围 | L005-L007 | 待用户启动 |
| Phase 3 | L3 信息密度 | L008-L010 | 待用户启动 |
| Phase 4 | L4 主题切换打磨 | L011-L013 | 待用户启动（用户明确要） |
| Phase 5 | 方向 A 项目剧场 | L014-L016 | 待用户启动 + 用户提供 GIF 素材 |

**Phase 1 commit（今天）**：
- 单 commit：`polish L1: neural vibe (edge pulses + node breathing + center upgrade + hover ripples)`
- L001-L004 全部 passes:true 后提交

**Phase 2-5 commit（后续）**：
- 每个 phase 单独 commit，独立可回退
- Phase 5 阻塞依赖：用户先提供 GIF 素材

## 11. 开发包信息

- 路径：`docs/tasks/aijianli-neural-vibe-20260614/`
- 备份：不需要（改动局限于现有 2-3 个文件，且 `_trash/pre-neural-canvas-backup-20260614/` 已含原版）
- commit：每 phase 一个 commit，本地，不 push
- Phase 1 工作量：4-5 小时
- Phase 2 工作量：3-4 小时（three.js 改动，性能调优）
- Phase 3 工作量：2-3 小时
- Phase 4 工作量：3-4 小时（视觉实测 + 修 bug 是大头）
- Phase 5 工作量：6-8 小时（GIF 集成 + 剧场模式 + 滚动叙事）+ 用户准备 GIF 素材

## 12. 后续扩展备忘（不在本开发包）

- **方向 B · AI 数字分身**：center 节点是 AI 角色，语音自我介绍（GLM voice）+ 角色扮演问答
- **方向 C · 简历体检 Agent**：HR 上传 JD → GLM 分析 → 匹配度报告 + 推荐突出项目
- **方向 D · 实时数据 + 公开学习日志**：GitHub API + 外脑（human_rhy_soul）公开部分

这三个方向用户未明确要，暂不进 feature_list。等用户决定后再开新开发包。
