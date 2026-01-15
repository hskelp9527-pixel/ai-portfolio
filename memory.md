# 开发记忆记录

## 2025-01-02 - 媒体 URL 迁移

### 任务概述
将项目中的视频和图片 URL 从旧的腾讯云 COS 存储桶迁移到新的存储桶。

### 执行步骤

#### 1. 分析需求
- 用户提供了 `video.csv` 和 `image.csv` 两个文件
- `video.csv` 包含 3 个视频的新 URL（含 2 个 WebM 格式）
- `image.csv` 包含 22 张图片的新 URL
- 需要注意 WebM 格式的兼容性

#### 2. 查找使用位置
- 使用 Grep 搜索媒体文件引用
- 确认主要修改文件：`data.ts`

#### 3. 视频 URL 替换 (3 个)
在 `data.ts` 的 `VIDEOS` 数组中更新：

| 旧文件名 | 新文件名 | 格式 |
|---------|---------|------|
| 片场合影 (2).mp4 | 片场合影.mp4 | MP4 |
| AI搞笑漫(1).mp4 | AI搞笑漫_1_.webm | WebM |
| 教父.mp4 | 教父.webm | WebM |

**URL 变更**:
- 旧域名: `ai-portfolio-videos-1394039784.cos.ap-guangzhou.myqcloud.com`
- 新域名: `aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com`
- 添加了完整的认证令牌查询参数

#### 4. 图片 URL 替换 (22 个)
在 `data.ts` 的 `IMAGES` 数组中更新所有图片：

**更新列表**:
1. 乡村牧歌.png
2. 乡间故事.png
3. 井底光明.png
4. 老人与孩子.png
5. 知更鸟.png
6. 明朝北京俯瞰图.png
7. 清明上河图风格明朝北京俯瞰图.png
8. 岳阳楼黄鹤楼结构解说图.png
9. 商品图.jpeg
10. 生活场景0.png
11. 特写1.png
12. 特写2.png
13. 细节特写3.png
14. 银色标志4.png
15. 营养成分表5.png
16. 主KV视觉6.png
17. 气泡动力7.png
18. 最后插画8.png
... (全部 22 张)

**URL 变更**:
- 旧路径: `/图片/`
- 新路径: `/image/`
- 添加了完整的认证令牌查询参数
- thumbnail 和 url 同步更新

#### 5. WebM 格式处理
- 更新了 `filename` 字段为 `.webm` 扩展名
- 更新了 `url` 字段为 `.webm` 扩展名
- 保持了 thumbnail 引用不变
- Theater 组件已支持 WebM 格式播放

#### 6. Git 提交
```
commit 74c940e
Replace image and video URLs with new COS storage URLs

- Updated 22 image URLs to new aicunchu COS bucket
- Updated 3 video URLs to new aicunchu COS bucket
- Added authentication tokens to all URLs
- Maintained WebM format compatibility for 2 videos
```

#### 7. 推送到 GitHub
```bash
git push origin main
```

### 结果
- 所有 3 个视频 URL 成功替换
- 所有 22 张图片 URL 成功替换
- WebM 格式视频保持兼容
- 代码已推送到 GitHub 主分支

### 技术细节

**旧 URL 格式**:
```
https://ai-portfolio-videos-1394039784.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87/[filename]
```

**新 URL 格式**:
```
https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/[type]/[filename]?q-sign-algorithm=sha1&q-ak=...&x-cos-security-token=...
```

### 文件变更
- **修改**: `data.ts` (28 处变更)
- **新增**: `video.csv`, `image.csv` (未提交)

---

## 2025-01-02 - 移除 URL 签名参数

### 问题发现
部署后图片和视频无法加载，经检查发现腾讯云 COS 的签名 URL 已过期（签名时间为 2025-01-02，已过期 1 年）。

### 解决方案
由于存储桶配置为「公有读私有写」，实际上不需要签名 URL。直接移除所有 URL 的签名参数即可。

### 执行操作
- 使用脚本批量移除 `data.ts` 中所有 URL 的查询参数（`?` 及之后的所有内容）
- 共处理 47 个 URL（22 张图片的 url 和 thumbnail，3 个视频的 url 和 thumbnail）

### URL 变更示例
- **修改前**: `https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/xxx.png?q-sign-algorithm=sha1&...`
- **修改后**: `https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/image/xxx.png`

### 结果
- 所有 URL 已转换为无签名的公开访问 URL
- 图片和视频现在应该可以正常加载

---

## 2025-01-02 - 视频封面更新与懒加载优化

### 需求
1. 更新三个视频的封面图 URL 到新的 aicunchu 存储桶
2. 实现媒体文件的懒加载，避免页面加载时立即从腾讯云下载

### 执行操作

#### 1. 更新视频封面 URL
在 `data.ts` 的 VIDEOS 数组中更新三个视频的 thumbnail：
- **片场合影** (v1): `片场合影-封面.png`
- **AI搞笑漫** (v2): `搞笑漫-封面.jpg`
- **教父** (v3): `教父无水印版-封面.jpg`

#### 2. 懒加载优化
在 `components/Theater.tsx` 中：
- 导入 LazyImage 组件
- Grid 模式：视频封面图使用 LazyImage，滚动到视口才加载
- Carousel 模式：视频封面图使用 LazyImage
- 视频格式封面：设置 `preload="none"` 不预加载

#### 3. 已有的懒加载实现
- **Gallery 组件**：图片使用 LazyImage 组件，支持视口检测懒加载
- **Theater 视频播放器**：使用 `preload="none"`，只有点击播放才开始下载视频流

### 优化效果
- ✅ 图片轮播模式：只加载当前显示的图片
- ✅ 图片平铺模式：滚动到视口才加载
- ✅ 视频封面：滚动到视口才加载（使用 LazyImage）
- ✅ 视频文件：点击播放才加载流（preload="none"）
- ✅ 节省腾讯云 COS 流量费用

### Git 提交
```
commit 121a284
Update video thumbnails and add lazy loading for media optimization
```

---

## 2025-01-03 - 添加新视频：星际救援

### 需求
添加新视频到项目视频库

### 执行操作
在 `data.ts` 的 VIDEOS 数组中添加第四个视频：
- **id**: v4
- **filename**: 星际救援.mp4
- **url**: `https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%98%9F%E9%99%85%E6%95%91%E6%8F%B4.mp4`
- **thumbnail**: `https://aicunchu-1394039784.cos.ap-guangzhou.myqcloud.com/video/%E6%98%9F%E9%99%85%E6%95%91%E6%8F%B4.png`
- **title**: 星际救援
- **category**: AI影视
- **tags**: AI视频, 科幻, 太空
- **duration**: 120 秒

### Git 提交
```
commit 90f505d
Add new video: 星际救援 (Interstellar Rescue)
```

---

## 2026-01-15 - 启动时模块加载错误修复

### 问题描述
启动项目后浏览器显示模块加载错误：
```
css2:1 Failed to load resource: the server responded with a status of 400 ()
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"
```

### 根本原因
1. **双服务器架构**：项目需要同时运行 Vite 前端服务器和 Express API 服务器
2. **启动命令不完整**：`npm run dev` 只启动了 API 服务器
3. **端口冲突**：默认端口 4000 被占用

### 解决方案
1. 修改 `server.ts`：端口改为 `process.env.PORT || 4001`
2. 修改 `vite.config.ts`：代理 target 改为 `http://localhost:4001`
3. 同时启动两个服务器：
   - `npm run dev:api` (API 服务器，端口 4001)
   - `npm run dev:vite` (Vite 前端服务器，端口 3001/3002)

### 技术要点
- **Vite 服务器**：负责 ES 模块转换、热更新、静态资源（必需）
- **Express 服务器**：提供 `/api` 路由（必需）
- **代理配置**：Vite 将 `/api` 请求代理到 Express
- 两者缺一不可

### 快速诊断
```bash
# 检查端口占用
netstat -ano | findstr :4000

# 同时启动两个服务器
npm run dev:api  # 终端1
npm run dev:vite  # 终端2
```

### 文件变更
- **修改**: `server.ts` (端口配置)
- **修改**: `vite.config.ts` (代理配置)

---

## 2025-01-03 - 个人项目内容更新与显示优化

### 需求
1. 更新图1（AI Workflow & Passion）内容
2. 新增两个个人项目：桌面清理工具、AI Skill 自动化书评创作工具
3. 优化项目卡片显示格式

### 执行操作

#### 1. 更新图1内容 (components/IdentitySection.tsx)
**位置**: 右侧卡片 "AI Workflow & Passion" 区域

**修改内容**:
- **p2 (图像创作工具)**: 移除 `Midjourney`，视频工具新增 `Sora2`，移除 `Pika`
- **p3 (技能产出)**: 新增 `Skill` 关键字，移除 `Web 端` 限定词

**变更对比**:
```
旧: Midjourney、Nano Banana、即梦...
新: Nano Banana、即梦... (移除 Midjourney)

旧: hailuo、Runway、Pika、Veo3.1、Vidu
新: Sora2、hailuo、Runway、Veo3.1、Vidu (Pika 换成 Sora2)

旧: 产出智能体应用
新: 产出智能体应用、Skill

旧: 致力于产出更高质有效的 Web 端应用
新: 致力于产出更高质有效的应用 (移除 Web 端限定)
```

#### 2. 新增个人项目 (data.ts)

**pp3 - 桌面清理工具**
```
是什么：Vibe Coding 开发 Windows 桌面文件管理应用，使用 Python + tkinter 开发，打包成单个 exe 文件。
核心功能：
            1、扫描桌面所有文件，按类型自动分组（图片、文档、视频、音频等）
            2、文件夹可递归展开（最多3层），快捷方式(.lnk)可展开目标内容
            3、右侧复选框多选，支持批量转移/删除/重命名
            4、双击文件在资源管理器中打开，右键重命名
界面特点：深色标题栏，扁平设计，左侧三角形展开，显示文件名、时间、大小三列。
适用场景：桌面太乱时快速查看并批量清理文件。
```

**pp4 - AI Skill 自动化书评创作工具**
```
是什么：深度整合大语言模型与 Seedream 4.5 MCP 图像生成能力的全流程自动化书评创作工具。
核心功能：
            1、书籍背景自动检索与信息提取
            2、精华观点智能提炼与结构化输出
            3、AI 自动配图，视觉化呈现书评内容
            4、多格式一键导出（Markdown、PDF、图片等）
技术特点：集成 LLM 与 MCP 协议，实现"秒级生成"高质量书评。
适用场景：内容创作者快速产出专业书评，将创作周期从"数小时"缩短至"秒级"。
```

**格式说明**:
- 使用统一的描述结构：是什么 → 核心功能 → 界面特点/技术特点 → 适用场景
- 核心功能使用 `1、2、3、4` 编号，带12个空格缩进对齐
- 只在带冒号的标题（是什么：、核心功能：、界面特点：、技术特点：、适用场景：）前显示图标

#### 3. 优化项目显示 (components/Resume.tsx)
**位置**: Resume.tsx:136-138

**修改逻辑**:
```tsx
// 修改前：每行都显示图标
{proj.description.split('\n').map((line, idx) => (
  <div key={idx} className="flex gap-3 items-start">
    <Terminal className={...} size={16} />
    <p>{line}</p>
  </div>
))}

// 修改后：只在包含冒号的行显示图标
{proj.description.split('\n').map((line, idx) => (
  <div key={idx} className="flex gap-3 items-start">
    {line.includes('：') && <Terminal className={...} size={16} />}
    <p>{line}</p>
  </div>
))}
```

**优化效果**:
- ✅ 标题行（是什么：、核心功能：等）显示 Terminal 图标
- ✅ 内容行（1、扫描...等）不显示图标
- ✅ 视觉层次更清晰

#### 4. Git 提交与部署

**提交信息**:
```
commit 4abe85d
更新个人项目内容和显示优化

- 新增两个个人项目：桌面清理工具、AI Skill 自动化书评创作工具
- 优化项目描述格式，统一使用"是什么"、"核心功能"等标题
- 只在带冒号的标题前显示图标，其他内容不显示图标
- 调整核心功能列表缩进，使序号对齐
```

**推送记录**:
```bash
git push
To https://github.com/hskelp9527-pixel/ai-portfolio.git
82ba195..4abe85d  main -> main
```

### 结果
- ✅ 图1内容已更新，移除 Midjourney 和 Pika，新增 Sora2 和 Skill
- ✅ 新增 2 个个人项目，共 4 个个人项目
- ✅ 项目显示格式统一，图标只在标题行显示
- ✅ 代码已推送到 GitHub main 分支

### 文件变更
- **修改**: `components/IdentitySection.tsx` (图1内容)
- **修改**: `data.ts` (新增 pp3, pp4 项目)
- **修改**: `components/Resume.tsx` (图标显示逻辑)

---
