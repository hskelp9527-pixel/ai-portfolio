# Phase 1 (L1 Neural Vibe) · Build Evidence

## 实施概览

4 个 feature 全部完成，单 commit：

| ID | Feature | 文件 | 状态 |
|---|---|---|---|
| L001 | 边线脉冲数据流 | `components/NeuralCanvas.tsx` | ✅ build 通过 |
| L002 | 节点错峰呼吸 | `components/NodeCluster.tsx` | ✅ build 通过 |
| L003 | Center 节点升级 | `components/NodeCluster.tsx` | ✅ build 通过 |
| L004 | 悬停涟漪扩散 | `components/NodeCluster.tsx` | ✅ build 通过 |

## L001 边线脉冲数据流（NeuralCanvas.tsx）

**改动**：保留 `motion.line`，把每条边包进 `<g>`，加 `motion.circle` 光点。

```tsx
const dots = strength >= 0.7 ? 2 : 1;
const dotDuration = 5 - strength * 2; // 3-5s
const dotRadius = strength >= 0.9 ? 3 : 2;

<g key={`edge-${i}`}>
  <motion.line ... />
  {!reducedMotion && Array.from({ length: dots }).map((_, di) => (
    <motion.circle
      key={`dot-${i}-${di}`}
      r={dotRadius}
      fill={lineColor}
      initial={{ cx: s.x, cy: s.y, opacity: 0 }}
      animate={{
        cx: [s.x, t.x],
        cy: [s.y, t.y],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: dotDuration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay: (di / dots) * dotDuration + (i % 7) * 0.3,
      }}
      style={{ filter: `drop-shadow(0 0 4px ${lineColor})` }}
    />
  ))}
</g>
```

**关键设计**：
- 光点单方向从 s 到 t（repeatType: 'loop' 自动跳回 s.x）
- delay 错峰：`(di / dots) * dotDuration` 让 strength ≥ 0.7 的 2 光点不同步，`(i % 7) * 0.3` 让边之间不同步
- drop-shadow 4px 让光点发光感

## L002 节点错峰呼吸（NodeCluster.tsx）

**改动**：motion.div 的 animate scale 改为条件数组。

```tsx
function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const seed = hashSeed(node.id);
const breathDuration = 2 + (seed % 3); // 2-4s
const breathDelay = (seed % 2000) / 1000; // 0-2s 错峰

const breathActive = !prefersReducedMotion && !isHovered && !isActive;

const scaleValue = isHovered ? 1.15 : isActive ? 1.25 : breathActive ? [1, 1.04, 1] : 1;

const scaleTransition = breathActive
  ? { duration: breathDuration, repeat: Infinity, ease: 'easeInOut', delay: breathDelay }
  : { duration: 0.3, ease: [0.16, 1, 0.3, 1] };
```

**关键设计**：
- hashSeed 用 charCodeAt 累乘（刷新后稳定，不是 random）
- breathDuration 2-4s（PRD §7.2 spec）
- breathDelay 0-2s（错峰）
- hover/active 时 scaleValue 变单值（1.15/1.25），transition 切换为短促 0.3s，呼吸自然停止
- dim 节点（opacity 0.25）继续呼吸（breathActive 不依赖 isDimmed）

## L003 Center 节点升级（NodeCluster.tsx）

**改动**：center 分支重构为 4 部分。

```tsx
{isCenter && (
  <>
    {/* 外环：dashed border + 慢速旋转 20s */}
    {!prefersReducedMotion && (
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ inset: -30, border: '1px dashed oklch(0.78 0.18 165 / 0.25)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    )}

    {/* 中环：原有 scale 1↔1.15 脉冲保留 */}
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none"
      animate={prefersReducedMotion ? { opacity: 0.4 } : { scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ boxShadow: '0 0 0 2px oklch(0.78 0.18 165 / 0.4)' }}
    />

    {/* 3 卫星：起始角度 0/120/240，duration 8/10/12s */}
    {!prefersReducedMotion && SATELLITE_ANGLES.map((startAngle, i) => (
      <motion.div
        key={`satellite-${i}`}
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{ width: 0, height: 0, willChange: 'transform' }}
        animate={{ rotate: [startAngle, startAngle + 360] }}
        transition={{ duration: SATELLITE_DURATIONS[i], repeat: Infinity, ease: 'linear' }}
      >
        <div style={{
          position: 'absolute',
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'oklch(0.78 0.18 165)',
          boxShadow: '0 0 8px oklch(0.78 0.18 165 / 0.8)',
          transform: `translateX(${SATELLITE_RADIUS}px) translateY(-3px)`,
        }} />
      </motion.div>
    ))}
  </>
)}
```

**关键设计**：
- 外环 inset: -30px 让它视觉半径 ~90px（center 节点 120px 的话，整体延伸到 ~180px，符合 PRD §7.3 spec）
- 卫星用 transform: rotate + translateX 沿圆形轨道（width/height 0 + 子元素 absolute 居中），轨道半径 80px
- 每颗卫星起始角度错 120 度，duration 错 2 秒（8/10/12s）
- prefersReducedMotion 时只保留静态中环 opacity 0.4，外环和卫星停
- 父容器加 overflow-visible（line 123）防卫星被裁剪

## L004 悬停涟漪（NodeCluster.tsx）

**改动**：非 center 节点内嵌 AnimatePresence + ripple motion.div。

```tsx
{!isCenter && (
  <AnimatePresence>
    {isHovered && !prefersReducedMotion && (
      <motion.div
        key={`ripple-${node.id}`}
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 2, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ border: `2px solid ${accent.ring}` }}
      />
    )}
  </AnimatePresence>
)}
```

**关键设计**：
- key=`ripple-${node.id}` 稳定（不随时间变化），AnimatePresence 在 isHovered true→false 时 exit，false→true 时挂载
- 涟漪 border 用 accent.ring（teal/amber/default 三种 accent 各有色）
- pointer-events: none 不阻挡 click
- center 节点不触发涟漪（PRD §5 BDD scenario 2 + feature acceptance "Center 节点 hover 不触发涟漪"）

## 性能保护

- 所有动画用 transform/opacity（GPU 加速）
- 卫星轨道用 will-change: transform
- 光点 drop-shadow filter 单独应用，不影响其他元素
- prefersReducedMotion 在 NodeCluster 用 useReducedMotion()，NeuralCanvas 沿用 props.reducedMotion
- 每条边光点上限 2 个（strength ≥ 0.7）
- 涟漪只在 hover 时挂载，非常驻

## 静态验证

- ✅ `npm run build` 通过（2169 modules transformed in 3.59s）
- ✅ bundle 体积：index.js 470.68 kB（gzip 145.33 kB），ParticleField chunk 891.16 kB 单独分包
- ✅ TypeScript 编译无报错（vite build 跑了 tsc 检查）
- ✅ Dev server (http://localhost:4001) 响应 200
- ✅ 代码 review：4 个 feature 实施符合 PRD §7 各项 spec

## 待用户浏览器实测

静态验证不能替代视觉验证。请用户在浏览器（http://localhost:4001）查看：

1. **L001**：节点之间边线上是否有光点沿直线流动；高 strength 边（如 center → pp8）是否 2 个光点；刷新后光点是否流畅不卡
2. **L002**：节点是否在轻微呼吸（scale 1.0↔1.04）；hover 时呼吸是否停止；不同节点呼吸错峰
3. **L003**：center 节点 "任泓雨" 是否有外环旋转 + 中环脉冲 + 3 卫星沿轨道
4. **L004**：hover 非 center 节点是否触发涟漪；涟漪颜色按 accent
5. **整体**：FPS 是否 ≥ 30（DevTools Performance tab）
6. **prefers-reduced-motion**：系统设置开启 reduce motion 后，所有装饰动画是否停止，基础交互（hover/click/ESC）是否正常

## 文件改动清单

- `components/NodeCluster.tsx`：L002 + L003 + L004（重写整个 motion.div 渲染逻辑）
- `components/NeuralCanvas.tsx`：L001（SVG 边线脉冲，包 g 加 motion.circle）

未改动：
- `data.ts` / `hooks/*` / `types.ts` / 粒子背景 / HoverCard / DetailPanel / AIConversationPanel / MobileTimeline
