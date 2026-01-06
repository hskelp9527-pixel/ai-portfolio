import 'dotenv/config';
import dotenv from 'dotenv';
import { ragService } from './utils/ragService.js';

// 加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config();

async function testRAG() {
  console.log('开始测试 RAG 检索...\n');

  console.log(`GLM_API_KEY: ${process.env.GLM_API_KEY ? '已设置' : '未设置'}`);
  console.log(`ZHIPU_API_KEY: ${process.env.ZHIPU_API_KEY ? '已设置' : '未设置'}\n`);

  const query = '任泓雨的自我介绍';
  console.log(`查询: ${query}\n`);

  try {
    const results = await ragService.search(query, 5);

    console.log(`\n检索到 ${results.length} 个结果:\n`);

    results.forEach((result, index) => {
      console.log(`--- 结果 ${index + 1} ---`);
      console.log(`相似度: ${result.score.toFixed(3)}`);
      console.log(`来源: ${result.chunk.source}`);
      console.log(`内容: ${result.chunk.content.substring(0, 100)}...`);
      console.log('');
    });

    if (results.length === 0) {
      console.log('❌ 未检索到任何结果！');
    } else {
      console.log('\n格式化后的上下文:');
      console.log(ragService.formatContext(results));
    }
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testRAG();
