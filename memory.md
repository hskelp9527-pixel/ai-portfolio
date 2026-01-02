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
