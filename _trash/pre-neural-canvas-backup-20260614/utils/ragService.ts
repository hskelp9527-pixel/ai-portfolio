import fs from 'fs';
import path from 'path';
import axios from 'axios';
import type { KnowledgeChunk, VectorIndex, RAGSearchResult } from '../types';

// 智谱 API 配置
const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';
const EMBEDDING_MODEL = 'embedding-3';

/**
 * RAG 服务类：处理知识库检索
 */
export class RAGService {
  private static instance: RAGService;
  private vectorIndex: VectorIndex | null = null;
  private knowledgeBasePath: string;
  private indexPath: string;
  private apiKey: string;

  private constructor() {
    // 知识库路径（项目根目录下的 Rag 文件夹）
    this.knowledgeBasePath = path.join(process.cwd(), 'Rag');
    // 向量索引存储路径
    this.indexPath = path.join(process.cwd(), 'public', 'vector-index.json');
    // API key 在运行时动态获取（每次调用时重新读取）
    this.apiKey = '';
  }

  /**
   * 获取 API Key（运行时动态读取，不缓存）
   */
  private getApiKey(): string {
    // 每次都从环境变量中读取最新的值
    const key = process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY || '';
    return key;
  }

  public static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  /**
   * 读取知识库文件
   */
  private async loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
    const chunks: KnowledgeChunk[] = [];

    try {
      // 检查知识库目录是否存在
      if (!fs.existsSync(this.knowledgeBasePath)) {
        console.warn(`知识库目录不存在: ${this.knowledgeBasePath}`);
        return chunks;
      }

      // 读取所有 markdown 文件
      const files = fs.readdirSync(this.knowledgeBasePath)
        .filter(file => file.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(this.knowledgeBasePath, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 按段落分割内容（以 ## 开头的是段落标题）
        const sections = this.splitIntoSections(content, file);

        chunks.push(...sections);
      }

      console.log(`已加载 ${chunks.length} 个知识片段，来自 ${files.length} 个文件`);
    } catch (error) {
      console.error('加载知识库失败:', error);
    }

    return chunks;
  }

  /**
   * 将文档内容按段落分割
   */
  private splitIntoSections(content: string, sourceFile: string): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    const lines = content.split('\n');
    let currentSection = '';
    let currentTitle = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 检测是否是标题（以 # 开头）
      if (line.trim().startsWith('#')) {
        // 保存上一个段落
        if (currentSection.trim()) {
          chunks.push({
            id: `${sourceFile}-${chunks.length}`,
            content: currentSection.trim(),
            source: sourceFile,
            metadata: {
              category: currentTitle || '未分类'
            }
          });
        }

        // 开始新段落
        currentTitle = line.replace(/^#+\s*/, '').trim();
        currentSection = line + '\n';
      } else {
        currentSection += line + '\n';
      }
    }

    // 保存最后一个段落
    if (currentSection.trim()) {
      chunks.push({
        id: `${sourceFile}-${chunks.length}`,
        content: currentSection.trim(),
        source: sourceFile,
        metadata: {
          category: currentTitle || '未分类'
        }
      });
    }

    return chunks;
  }

  /**
   * 辅助函数：延迟执行
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 智能重试包装器（指数退避 + Retry-After）
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 8
  ): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error: any) {
        const status = error?.response?.status;

        // 非 429 错误或超过最大重试次数，直接抛出
        if (status !== 429 || attempt >= maxRetries) {
          throw error;
        }

        // 读取 Retry-After 头（优先级最高）
        const retryAfter = Number(error?.response?.headers?.['retry-after'] ?? 0);

        // 指数退避计算（1s, 2s, 4s, 8s, 16s, 32s, 60s, 60s）
        const backoff = Math.min(60000, (2 ** attempt) * 1000);

        // 添加随机抖动（±300ms）避免多个客户端同步重试
        const jitter = Math.floor(Math.random() * 300);

        // 计算最终等待时间
        const waitMs = retryAfter > 0
          ? retryAfter * 1000
          : backoff + jitter;

        console.log(`⚠️  429 限流，等待 ${waitMs}ms 后重试 (${attempt + 1}/${maxRetries})...`);
        await this.sleep(waitMs);
        attempt++;
      }
    }
  }

  /**
   * 批量调用智谱 Embedding API（方案1：批量处理）
   * 智谱支持最多 64 个文本同时请求
   */
  private async getBatchEmbeddingsFromAPI(texts: string[]): Promise<number[][]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API Key 未设置');
    }

    // 使用智能重试
    return this.withRetry(async () => {
      const response = await axios.post(
        `${GLM_API_BASE}/embeddings`,
        {
          model: EMBEDDING_MODEL,
          input: texts  // ← 直接传入数组，智谱 API 支持批量
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        // 智谱返回的是数组，按原顺序排序
        return response.data.data.map((item: any) => item.embedding);
      }

      throw new Error('Embedding API 返回数据格式错误');
    });
  }

  /**
   * 批量获取 embeddings（企业级方案）
   * - 使用批量 API（最多 64 条/请求）
   * - 智能重试（指数退避 + Retry-After）
   * - 串行处理（避免并发）
   */
  private async getBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    const BATCH_SIZE = 32; // 每批 32 个（智谱上限 64，保守一点）

    console.log(`📦 批量处理模式：${texts.length} 个文本 → ${Math.ceil(texts.length / BATCH_SIZE)} 个请求`);

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(texts.length / BATCH_SIZE);

      console.log(`  [${batchNum}/${totalBatches}] 处理 ${batch.length} 个文本...`);

      // 批量调用 API（单次请求处理多个文本）
      const batchEmbeddings = await this.getBatchEmbeddingsFromAPI(batch);
      embeddings.push(...batchEmbeddings);

      // 批次之间短暂等待（避免连续请求）
      if (i + BATCH_SIZE < texts.length) {
        await this.sleep(1000); // 仅等待 1 秒
      }
    }

    console.log(`✅ 批量处理完成，共生成 ${embeddings.length} 个向量`);
    return embeddings;
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('向量维度不匹配');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * 构建向量索引
   */
  async buildIndex(): Promise<void> {
    console.log('开始构建向量索引...');

    // 1. 加载知识库
    const chunks = await this.loadKnowledgeBase();
    if (chunks.length === 0) {
      throw new Error('知识库为空，无法构建索引');
    }

    // 2. 获取所有文本的 embeddings
    console.log(`正在为 ${chunks.length} 个片段生成 embeddings...`);
    const texts = chunks.map(chunk => chunk.content);
    const embeddings = await this.getBatchEmbeddings(texts);

    // 3. 保存索引
    this.vectorIndex = {
      chunks,
      embeddings,
      updatedAt: new Date().toISOString()
    };

    // 4. 将索引保存到文件
    const indexDir = path.dirname(this.indexPath);
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true });
    }

    fs.writeFileSync(this.indexPath, JSON.stringify(this.vectorIndex, null, 2));
    console.log(`向量索引已保存到: ${this.indexPath}`);
  }

  /**
   * 加载已保存的向量索引
   */
  private loadIndex(): void {
    try {
      if (fs.existsSync(this.indexPath)) {
        const indexData = fs.readFileSync(this.indexPath, 'utf-8');
        this.vectorIndex = JSON.parse(indexData);
        console.log(`已加载向量索引，包含 ${this.vectorIndex.chunks.length} 个片段`);
        return;
      }
    } catch (error) {
      console.error('加载向量索引失败:', error);
    }

    console.warn('向量索引不存在，请先运行 buildIndex()');
    this.vectorIndex = null;
  }

  /**
   * 检索最相关的知识片段
   */
  async search(query: string, topK: number = 5): Promise<RAGSearchResult[]> {
    // 如果没有加载索引，尝试加载
    if (!this.vectorIndex) {
      this.loadIndex();
    }

    // 如果还是没有索引，返回空结果
    if (!this.vectorIndex || this.vectorIndex.chunks.length === 0) {
      console.warn('向量索引为空，无法进行检索');
      return [];
    }

    try {
      // 1. 获取查询的 embedding（使用批量 API 的单元素版本）
      const [queryEmbedding] = await this.getBatchEmbeddingsFromAPI([query]);

      // 2. 计算与所有片段的相似度
      const scores = this.vectorIndex.embeddings.map((embedding, index) => ({
        chunk: this.vectorIndex!.chunks[index],
        score: this.cosineSimilarity(queryEmbedding, embedding)
      }));

      // 3. 按相似度排序，取 top-k
      const results = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .filter(result => result.score > 0.15); // 降低阈值以获取更多相关结果

      console.log(`检索到 ${results.length} 个相关片段（阈值: 0.15）`);
      console.log(`相似度分数: ${results.map(r => r.score.toFixed(3)).join(', ')}`);
      return results;
    } catch (error) {
      console.error('检索失败:', error);
      return [];
    }
  }

  /**
   * 将检索结果格式化为上下文
   */
  formatContext(results: RAGSearchResult[]): string {
    if (results.length === 0) {
      return '';
    }

    let context = '\n【参考资料】\n\n';

    results.forEach((result, index) => {
      context += `--- 资料 ${index + 1} ---\n`;
      context += `${result.chunk.content}\n\n`;
    });

    context += '--- 参考资料结束 ---\n\n';

    console.log(`RAG 上下文已格式化，包含 ${results.length} 个片段`);

    return context;
  }
}

// 导出单例
export const ragService = RAGService.getInstance();
