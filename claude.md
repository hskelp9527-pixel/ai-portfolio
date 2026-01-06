# AIGC 沉浸式个人履历门户 - 项目文档

## 项目概述

**项目名称**: AIGC 沉浸式个人履历门户
**仓库**: https://github.com/hskelp9527-pixel/ai-portfolio.git
**主分支**: main

## 技术栈

### 前端框架
- **React**: 19.2.3 (最新版本)
- **TypeScript**: ~5.8.2
- **Vite**: 6.2.0 (构建工具)

### 核心依赖
- **framer-motion**: ^12.23.26 - 动画库
- **lucide-react**: ^0.562.0 - 图标库
- **html2canvas**: ^1.4.1 - 截图功能
- **jspdf**: ^3.0.4 - PDF 生成

### 后端/工具
- **express**: ^5.2.1 - 服务器
- **cors**: ^2.8.5 - 跨域
- **dotenv**: ^17.2.3 - 环境变量

### 测试
- **vitest**: ^4.0.16
- **@testing-library/react**: ^16.3.1
- **fast-check**: ^4.5.3 (属性测试)

## 项目结构

```
aijianli/
├── components/           # React 组件目录
│   ├── Hero.tsx         # 首页英雄区域
│   ├── Navbar.tsx       # 导航栏
│   ├── FloatingNavigation.tsx  # 浮动导航
│   ├── Gallery.tsx      # 图片画廊
│   ├── ImageModal.tsx   # 图片模态框
│   ├── Theater.tsx      # 视频播放器
│   ├── Resume.tsx       # 简历展示
│   ├── IdentitySection.tsx  # 身份标识区
│   ├── AIChatDrawer.tsx # AI 聊天抽屉
│   ├── ParallaxCard.tsx # 视差卡片
│   └── LazyImage.tsx    # 懒加载图片
├── data.ts              # 核心数据文件 (视频、图片、技能等)
├── index.tsx            # 应用入口
├── metadata.json        # 元数据配置
├── video.csv            # 视频 URL 映射表
├── image.csv            # 图片 URL 映射表
└── package.json         # 项目配置

```

## 核心数据文件 (data.ts)

### VIDEOS 数组
包含 3 个视频项目：
- 片场合影.mp4
- AI搞笑漫_1_.webm (WebM 格式)
- 教父.webm (WebM 格式)

### IMAGES 数组
包含 22 张图片，分类：
- AIGC 风景 (5张)
- 历史重现 (3张)
- 建筑设计 (1张)
- 产品设计 (10张)
- 品牌视觉 (3张)

### SKILLS 数组
技能分类与展示

## 媒体存储

### 云存储
- **服务商**: 腾讯云 COS (Cloud Object Storage)
- **旧存储桶**: `ai-portfolio-videos-1394039784`
- **新存储桶**: `aicunchu-1394039784`
- **区域**: ap-guangzhou (广州)

### URL 特点
- 使用签名 URL (带认证令牌)
- 支持中文文件名 (URL 编码)
- 视频: `/video/` 路径
- 图片: `/image/` 路径

## 开发命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run preview   # 预览构建结果
npm test          # 运行测试
npm run test:run  # 运行测试并退出
```

## 最近重要更新

### 2025-01-02
- 替换所有媒体 URL 到新的 COS 存储桶
- 添加认证令牌到所有 URL
- WebM 格式视频兼容性处理

### 历史记录
- 优化视频加载 (preload="none")
- 修复视频 URL 编码 (括号处理)
- 添加 Express、CORS、dotenv 依赖

## 注意事项

1. **视频格式**: 项目同时支持 MP4 和 WebM 格式
2. **懒加载**: 图片使用 LazyImage 组件进行懒加载
3. **动画**: 使用 Framer Motion 实现流畅动画效果
4. **响应式**: 组件支持移动端和桌面端
5. **测试**: 使用 Vitest 和 Testing Library

## 用户信息

- **姓名**: Yu
- **职业**: 产品经理
- **技术背景**: 完全不会写代码
- **目标**: 探索各种 Claude Code 的用法
