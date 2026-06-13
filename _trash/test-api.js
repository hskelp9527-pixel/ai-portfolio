import 'dotenv/config';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log('环境变量已加载');
console.log('GLM_API_KEY:', process.env.GLM_API_KEY ? '已设置' : '未设置');
console.log('ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? '已设置' : '未设置');

import { ragService } from './utils/ragService.js';

async function testAPI() {
  console.log('\n开始测试 API 流程...\n');

  const query = '任泓雨的自我介绍';
  console.log('查询:', query);
  console.log('');

  try {
    // 1. 测试 RAG 检索
    console.log('步骤 1: 执行 RAG 检索...');
    const searchResults = await ragService.search(query, 5);
    console.log(`检索结果: ${searchResults.length} 个片段\n`);

    if (searchResults.length > 0) {
      const context = ragService.formatContext(searchResults);
      console.log('上下文内容:');
      console.log(context.substring(0, 500));
      console.log('...\n');
    }

    // 2. 导入 API handler
    console.log('步骤 2: 导入 API handler...');
    const apiModule = await import('./api/index.js');
    console.log('API handler 导入成功\n');

    // 3. 模拟 API 调用
    console.log('步骤 3: 调用 API handler...');
    const mockReq = {
      method: 'POST',
      body: {
        messages: [
          { role: 'user', content: query }
        ]
      }
    };

    let responseData = null;
    const mockRes = {
      status: (code) => {
        console.log(`返回状态码: ${code}`);
        return mockRes;
      },
      json: (data) => {
        responseData = data;
        console.log('返回数据:', JSON.stringify(data, null, 2));
      }
    };

    await apiModule.default(mockReq, mockRes);

    console.log('\n测试完成！');
    console.log('AI 回复:', responseData?.content || '无');

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testAPI();
