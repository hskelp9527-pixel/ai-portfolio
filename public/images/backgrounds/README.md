# 背景图片文件夹

## 使用说明

将你的背景图片放在这个文件夹中，然后在 `App.tsx` 文件中修改图片路径。

## 建议规格

- **格式**: JPG, PNG, WebP
- **尺寸**: 1920x1080 或更高
- **文件大小**: 建议不超过 2MB

## 当前背景图片

- **深色主题背景**: 目前使用外部链接，你可以替换为本地文件
- **浅色主题背景**: 目前使用CSS渐变，你可以添加图片背景

## 修改方法

在 `App.tsx` 文件中找到这一行：
```jsx
src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=3546&auto=format&fit=crop"
```

替换为：
```jsx
src="/images/backgrounds/your-background.jpg"
```