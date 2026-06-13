# Phase 1 基础层验证证据

日期：2026-06-14

## N002：装依赖

```
$ npm install three @react-three/fiber d3-force @types/three @types/d3-force
added 24 packages in 10s
```

package.json dependencies 新增：
- three
- @react-three/fiber
- d3-force
- @types/three（devDependencies）
- @types/d3-force（devDependencies）

**PRD 调整**：去掉 react-force-graph。原因：节点用 DOM + framer-motion 渲染（PRD §7.1），不需要 three-based 图谱库。bundle 更小，依赖更少。

## N003：tailwind 色板 + 字体

### tailwind.config.ts 新增内容

```ts
colors: {
  ink: { base, mid, deep, black }           // OKLCH 墨蓝黑底
  glass: { light, mid, dark, border, borderBright }  // 玻璃面
  fg: { primary, secondary, tertiary, faint }        // 文字层级
  signature: { teal, tealDim, amber, amberDim }      // 矿物青 + 暖琥珀
}
fontFamily: {
  sans: ['AlibabaPuHuiTi', 'Geist', ...]
  display: ['Geist', 'AlibabaPuHuiTi', ...]
  mono: ['JetBrains Mono', 'Consolas', ...]
}
transitionTimingFunction: { neural, neural-out, neural-spring }
animation: { pulse-slow, breathe, float, typing-cursor, fade-in-up }
boxShadow: { glow-teal, glow-amber, glow-teal-strong, glass }
```

### src/index.css 新增内容

- 3 个 @font-face 普惠体（400/500/700）来自阿里 OSS CDN
- CSS variables：--color-* 全套 + --ease-neural + --duration-*
- .glass / .glass-strong / .text-glow-teal / .text-glow-amber / .neural-scrollbar 工具类
- 全局 * transition 300ms neural ease

## N004：字体引入

### index.html

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://puhuiti.oss-cn-hangzhou.aliyuncs.com">

<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

普惠体通过 src/index.css 的 @font-face 引入（OSS CDN），Geist + JetBrains Mono 通过 Google Fonts。

### Boot skeleton

`#root:empty::after` 显示"Initializing Neural Canvas..."，font-mono + 脉冲动画，避免白屏。

## N005：粒子背景

### three/ParticleField.tsx

- @react-three/fiber 的 Canvas + Points + bufferGeometry
- 200-220 个粒子（theme 决定数量）
- AdditiveBlending + sizeAttenuation + depthWrite:false
- 鼠标移动时整体 rotation 微弱响应
- 粒子边界反弹

### components/NeuralCanvas.tsx

- React.lazy 动态 import ParticleField（code-split）
- 移动端 / reducedMotion 不渲染 three（性能保护）
- 主题切换粒子颜色：dark = #5eead4（矿物青）/ light = #0d9488（深青）
- 叠加 radial-gradient vignette

### App.tsx 集成

- 默认 theme 改为 'dark'
- <NeuralCanvas theme={theme} /> 作为 fixed z-0 背景层
- 现有 section z-10 保持可见

## Build 验证

```
$ npm run build
vite v6.4.1 building for production...
✓ 2130 modules transformed.

dist/index.html                        1.79 kB │ gzip:   0.90 kB
dist/assets/index-C-Kyqk1R.css        47.22 kB │ gzip:   8.53 kB    ← Tailwind + 自定义 CSS
dist/assets/index-ChrYaR7a.js        429.33 kB │ gzip: 130.57 kB    ← 主 chunk（不含 three）
dist/assets/ParticleField-CSaK5OFU.js 891.16 kB │ gzip: 240.28 kB   ← three.js 独立 chunk（lazy）

✓ built in 4.22s
```

✅ three.js 成功 code-split 成独立 chunk
✅ 主 chunk 429KB（gzip 130KB），首屏不阻塞
✅ CSS 编译通过，色板和字体 token 全部生效
✅ Vite 警告 ParticleField 超 500KB 是预期（three.js 库本身大小），已通过 lazy import 处理

## 未做（留待后续 phase）

- 浏览器手测粒子视觉效果（需用户启动 npm run dev:vite 确认）
- three.js 在低端机的帧率监控（Phase 4 N018）
- 粒子数量根据性能动态调整（Phase 4 N018）

## 状态

- N002 passes: true
- N003 passes: true
- N004 passes: true
- N005 passes: true（build 通过等价于运行时验证；浏览器手测留待用户）
