# 头像图片文件夹

## 使用说明

将你的头像图片放在这个文件夹中，然后在 `data.ts` 文件中修改头像路径。

## 建议规格

- **格式**: JPG, PNG, WebP
- **尺寸**: 400x400 或更高（正方形）
- **文件大小**: 建议不超过 500KB

## 修改方法

在 `data.ts` 文件中找到 `PERSONAL_INFO` 对象中的这一行：
```typescript
avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=2000&auto=format&fit=crop',
```

替换为：
```typescript
avatar: '/images/avatar/your-avatar.jpg',
```