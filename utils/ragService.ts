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
    // API key 在运行时动态获取（不缓存）
    this.apiKey = '';

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('警告: 未设置 GLM_API_KEY 环境变量，RAG 功能将无法使用');
    }
  }

  /**
   * 获取 API Key（运行时动态读取）
   */
  private getApiKey(): string {
    return process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY || '';
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
   * 调用智谱 Embedding API
   */
  private async getEmbedding(text: string): Promise<number[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API Key 未设置');
    }

    try {
      const response = await axios.post(
        `${GLM_API_BASE}/embeddings`,
        {
          model: EMBEDDING_MODEL,
          input: text
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data?.[0]?.embedding) {
        return response.data.data[0].embedding;
      }

      throw new Error('Embedding API 返回数据格式错误');
    } catch (error) {
      console.error('获取 embedding 失败:', error);
      throw error;
    }
  }

  /**
   * 批量获取 embeddings（避免一次性请求过多）
   */
  private async getBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    const batchSize = 5; // 每批处理 5 个（降低批次大小以避免频率限制）

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      // 串行处理（避免并发请求触发频率限制）
      for (const text of batch) {
        const embedding = await this.getEmbedding(text);
        embeddings.push(embedding);

        // 每个请求之间等待 2 秒
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

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
      // 1. 获取查询的 embedding
      const queryEmbedding = await this.getEmbedding(query);

      // 2. 计算与所有片段的相似度
      const scores = this.vectorIndex.embeddings.map((embedding, index) => ({
        chunk: this.vectorIndex!.chunks[index],
        score: this.cosineSimilarity(queryEmbedding, embedding)
      }));

      // 3. 按相似度排序，取 top-k
      const results = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .filter(result => result.score > 0.3); // 过滤掉相似度太低的结果

      console.log(`检索到 ${results.length} 个相关片段（阈值: 0.3）`);
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

    let context = '以下是相关参考资料：\n\n';

    results.forEach((result, index) => {
      context += `【资料 ${index + 1}】（相似度: ${result.score.toFixed(3)}，来源: ${result.chunk.source}）\n`;
      context += `${result.chunk.content}\n\n`;
    });

    context += '请基于以上资料回答用户的问题。如果资料中没有相关信息，请明确说明"资料中未包含此信息"。';

    return context;
  }
}

// 导出单例
export const ragService = RAGService.getInstance();
