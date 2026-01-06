#!/usr/bin/env node
/**
 * 知识库向量索引构建脚本
 *
 * 用途：
 * 1. 读取 Rag 文件夹中的所有 markdown 文件
 * 2. 调用智谱 Embedding API 生成向量
 * 3. 将向量索引保存到 public/vector-index.json
 *
 * 使用方法：
 * - 开发环境：npm run build:kb
 * - Vercel 部署时自动执行
 */

import dotenv from 'dotenv';

// ⚠️ 第一步：加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log('========================================');
console.log('  知识库向量索引构建工具');
console.log('========================================\n');
console.log('环境变量检查：');
console.log('  GLM_API_KEY:', process.env.GLM_API_KEY ? '✓ 已设置' : '✗ 未设置');
console.log('  ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? '✓ 已设置' : '✗ 未设置');
console.log('');

// 检查 API Key
if (!process.env.GLM_API_KEY && !process.env.ZHIPU_API_KEY) {
  console.error('错误: 未设置 API Key 环境变量');
  console.error('请在 .env.local 文件中设置: GLM_API_KEY=your_api_key');
  process.exit(1);
}

// ⚠️ 第二步：动态导入 ragService（在环境变量加载后）
const { ragService } = await import('../utils/ragService.js');

// ⚠️ 第三步：执行构建
try {
  await ragService.buildIndex();

  console.log('\n========================================');
  console.log('  向量索引构建完成！');
  console.log('========================================');
  console.log('\n提示: 向量索引已保存到 public/vector-index.json');
} catch (error) {
  console.error('\n构建失败:', error.message);
  process.exit(1);
}
