import fs from 'fs';
import path from 'path';
import axios from 'axios';
import type { KnowledgeChunk, RAGSearchResult, VectorIndex } from '../types';
import {
  EMBEDDING_MODEL,
  RAG_CONTEXT_MAX_CHARS,
  RAG_MIN_SCORE,
  RAG_ROUTE_RULES,
  RAG_SOURCE_PRIORITY,
  RAG_TOP_K,
} from './aiConfig';

const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';
const ENABLE_RUNTIME_EMBEDDING = process.env.RAG_RUNTIME_EMBEDDING === 'true';
const EMBEDDING_TIMEOUT_MS = 10000;

export class RAGService {
  private static instance: RAGService;
  private vectorIndex: VectorIndex | null = null;
  private knowledgeBasePath: string;
  private indexPath: string;

  private constructor() {
    this.knowledgeBasePath = path.join(process.cwd(), 'Rag');
    this.indexPath = path.join(process.cwd(), 'public', 'vector-index.json');
  }

  public static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  private getApiKey(): string {
    return process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY || '';
  }

  private normalizeText(value: string): string {
    return value.toLowerCase().replace(/[\s\u3000]/g, '');
  }

  private sortFilesByPriority(files: string[]): string[] {
    return [...files].sort((a, b) => {
      const aIndex = RAG_SOURCE_PRIORITY.indexOf(a as (typeof RAG_SOURCE_PRIORITY)[number]);
      const bIndex = RAG_SOURCE_PRIORITY.indexOf(b as (typeof RAG_SOURCE_PRIORITY)[number]);
      if (aIndex === bIndex) {
        return a.localeCompare(b, 'zh-Hans-CN');
      }
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  private cleanHeading(line: string): string {
    return line.replace(/^#+\s*/, '').trim();
  }

  private shouldKeepSection(title: string, bodyLines: string[]): boolean {
    const bodyText = bodyLines.join('\n').trim();
    if (!bodyText) {
      return false;
    }

    const meaningfulText = bodyText.replace(/[\s\u3000]/g, '');
    if (meaningfulText.length < 18) {
      return false;
    }

    return title.length > 0 || meaningfulText.length > 0;
  }

  private extractKeywords(text: string): string[] {
    const normalizedText = this.normalizeText(text);
    const keywords = new Set<string>();

    for (const rule of RAG_ROUTE_RULES) {
      for (const keyword of rule.keywords) {
        const normalizedKeyword = this.normalizeText(keyword);
        if (normalizedKeyword && normalizedText.includes(normalizedKeyword)) {
          keywords.add(keyword);
        }
      }
    }

    return [...keywords];
  }

  private loadKnowledgeBase(): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];

    if (!fs.existsSync(this.knowledgeBasePath)) {
      console.warn(`Knowledge base directory not found: ${this.knowledgeBasePath}`);
      return chunks;
    }

    const files = this.sortFilesByPriority(
      fs.readdirSync(this.knowledgeBasePath).filter(file => file.endsWith('.md'))
    );

    for (const file of files) {
      const filePath = path.join(this.knowledgeBasePath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      chunks.push(...this.splitIntoSections(content, file));
    }

    console.log(`Loaded ${chunks.length} knowledge chunks from ${files.length} markdown files.`);
    return chunks;
  }

  private splitIntoSections(content: string, sourceFile: string): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    const lines = content.split(/\r?\n/);

    let currentTitle = '';
    let currentBody: string[] = [];

    const flush = () => {
      if (!this.shouldKeepSection(currentTitle, currentBody)) {
        currentTitle = '';
        currentBody = [];
        return;
      }

      const bodyText = currentBody.join('\n').trim();
      const fullText = [currentTitle, bodyText].filter(Boolean).join('\n').trim();

      chunks.push({
        id: `${sourceFile}-${chunks.length}`,
        content: fullText,
        source: sourceFile,
        metadata: {
          category: currentTitle || sourceFile,
          keywords: this.extractKeywords(fullText),
        },
      });

      currentTitle = '';
      currentBody = [];
    };

    for (const line of lines) {
      if (/^#{1,6}\s+/.test(line)) {
        flush();
        currentTitle = this.cleanHeading(line);
        continue;
      }

      currentBody.push(line);
    }

    flush();
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 8): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error: any) {
        const status = error?.response?.status;

        if (status !== 429 || attempt >= maxRetries) {
          throw error;
        }

        const retryAfter = Number(error?.response?.headers?.['retry-after'] ?? 0);
        const backoff = Math.min(60000, (2 ** attempt) * 1000);
        const jitter = Math.floor(Math.random() * 300);
        const waitMs = retryAfter > 0 ? retryAfter * 1000 : backoff + jitter;

        console.log(`429 throttled, retrying in ${waitMs}ms (${attempt + 1}/${maxRetries})...`);
        await this.sleep(waitMs);
        attempt++;
      }
    }
  }

  private async getBatchEmbeddingsFromAPI(texts: string[]): Promise<number[][]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    return this.withRetry(async () => {
      const response = await axios.post(
        `${GLM_API_BASE}/embeddings`,
        {
          model: EMBEDDING_MODEL,
          input: texts,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: EMBEDDING_TIMEOUT_MS,
        }
      );

      if (response.data?.data) {
        return response.data.data.map((item: any) => item.embedding);
      }

      throw new Error('Embedding API returned an invalid payload');
    });
  }

  private async getBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    const batchSize = 32;

    console.log(`Generating embeddings for ${texts.length} chunks in batches of ${batchSize}.`);

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchEmbeddings = await this.getBatchEmbeddingsFromAPI(batch);
      embeddings.push(...batchEmbeddings);

      if (i + batchSize < texts.length) {
        await this.sleep(1000);
      }
    }

    console.log(`Generated ${embeddings.length} embeddings.`);
    return embeddings;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vector dimensions do not match');
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

  private getPreferredSources(query: string): string[] {
    const normalizedQuery = this.normalizeText(query);
    const sources = new Set<string>();

    for (const rule of RAG_ROUTE_RULES) {
      const hit = rule.keywords.some(keyword => normalizedQuery.includes(this.normalizeText(keyword)));
      if (!hit) {
        continue;
      }

      for (const source of rule.sources) {
        sources.add(source);
      }
    }

    return this.sortFilesByPriority([...sources]);
  }

  private getKeywordScore(query: string, chunk: KnowledgeChunk): number {
    const normalizedQuery = this.normalizeText(query);
    const normalizedChunk = this.normalizeText(
      `${chunk.source} ${chunk.metadata?.category ?? ''} ${chunk.content}`
    );

    const matchedKeywords = new Set<string>();
    for (const rule of RAG_ROUTE_RULES) {
      for (const keyword of rule.keywords) {
        const normalizedKeyword = this.normalizeText(keyword);
        if (normalizedKeyword && normalizedQuery.includes(normalizedKeyword)) {
          matchedKeywords.add(normalizedKeyword);
        }
      }
    }

    if (matchedKeywords.size === 0) {
      return 0;
    }

    let hitCount = 0;
    for (const keyword of matchedKeywords) {
      if (normalizedChunk.includes(keyword)) {
        hitCount++;
      }
    }

    return hitCount / matchedKeywords.size;
  }

  private getSourceBoost(chunk: KnowledgeChunk, preferredSources: string[]): number {
    const preferredIndex = preferredSources.indexOf(chunk.source);
    if (preferredIndex >= 0) {
      return Math.max(0.12 - preferredIndex * 0.03, 0.03);
    }

    return 0;
  }

  private getRouteBoost(query: string, chunk: KnowledgeChunk, preferredSources: string[]): number {
    const normalizedQuery = this.normalizeText(query);
    const normalizedChunk = this.normalizeText(
      `${chunk.source} ${chunk.metadata?.category ?? ''} ${chunk.content}`
    );

    for (const rule of RAG_ROUTE_RULES) {
      const hit = rule.keywords.some(keyword => normalizedQuery.includes(this.normalizeText(keyword)));
      if (!hit) {
        continue;
      }

      if ((rule.sources as readonly string[]).includes(chunk.source)) {
        return Math.max(0.1, this.getSourceBoost(chunk, preferredSources));
      }

      if (rule.keywords.some(keyword => normalizedChunk.includes(this.normalizeText(keyword)))) {
        return 0.05;
      }
    }

    return 0;
  }

  public shouldUseKnowledgeBase(query: string): boolean {
    return this.getPreferredSources(query).length > 0;
  }

  public async buildIndex(): Promise<void> {
    console.log('Building vector index...');

    const chunks = this.loadKnowledgeBase();
    if (chunks.length === 0) {
      throw new Error('Knowledge base is empty');
    }

    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    const texts = chunks.map(chunk => chunk.content);
    const embeddings = await this.getBatchEmbeddings(texts);

    this.vectorIndex = {
      chunks,
      embeddings,
      updatedAt: new Date().toISOString(),
    };

    const indexDir = path.dirname(this.indexPath);
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true });
    }

    fs.writeFileSync(this.indexPath, JSON.stringify(this.vectorIndex, null, 2));
    console.log(`Vector index saved to ${this.indexPath}`);
  }

  private loadIndex(): void {
    try {
      if (!fs.existsSync(this.indexPath)) {
        this.vectorIndex = null;
        return;
      }

      const indexData = JSON.parse(fs.readFileSync(this.indexPath, 'utf-8')) as VectorIndex;
      if (
        !indexData?.chunks ||
        !indexData?.embeddings ||
        indexData.chunks.length === 0 ||
        indexData.chunks.length !== indexData.embeddings.length
      ) {
        console.warn('Vector index is invalid or out of sync.');
        this.vectorIndex = null;
        return;
      }

      this.vectorIndex = indexData;
      console.log(`Loaded vector index with ${this.vectorIndex.chunks.length} chunks.`);
    } catch (error) {
      console.error('Failed to load vector index:', error);
      this.vectorIndex = null;
    }
  }

  public async search(query: string, topK: number = RAG_TOP_K): Promise<RAGSearchResult[]> {
    const liveChunks = this.loadKnowledgeBase();
    if (liveChunks.length === 0) {
      return [];
    }

    try {
      let queryEmbedding: number[] | null = null;
      let indexedEmbeddings: Map<string, number[]> | null = null;

      if (ENABLE_RUNTIME_EMBEDDING) {
        if (!this.vectorIndex) {
          this.loadIndex();
        }
        if (this.vectorIndex) {
          indexedEmbeddings = new Map(
            this.vectorIndex.chunks.map((chunk, index) => [chunk.id, this.vectorIndex!.embeddings[index]])
          );
        }

        try {
          [queryEmbedding] = await this.getBatchEmbeddingsFromAPI([query]);
        } catch (embeddingError) {
          console.warn('Embedding lookup failed, falling back to lexical ranking only.');
        }
      } else {
        console.log('Runtime embedding disabled; using lexical ranking only.');
      }

      const preferredSources = this.getPreferredSources(query);

      const ranked = liveChunks.map((chunk) => {
        const embedding = indexedEmbeddings?.get(chunk.id);
        const vectorScore = queryEmbedding && embedding ? this.cosineSimilarity(queryEmbedding, embedding) : 0;
        const keywordScore = this.getKeywordScore(query, chunk);
        const routeBoost = this.getRouteBoost(query, chunk, preferredSources);
        const sourceBoost = this.getSourceBoost(chunk, preferredSources);
        const lengthBoost = chunk.content.length >= 120 ? 0.03 : 0;

        const score = queryEmbedding
          ? vectorScore * 0.8 + keywordScore * 0.12 + routeBoost + sourceBoost + lengthBoost
          : keywordScore * 0.45 + routeBoost + sourceBoost + lengthBoost;

        return { chunk, score };
      });

      ranked.sort((a, b) => b.score - a.score);

      let results = ranked.slice(0, topK).filter(result => result.score >= RAG_MIN_SCORE);

      if (results.length === 0 && preferredSources.length > 0) {
        results = ranked
          .filter(result => preferredSources.includes(result.chunk.source))
          .slice(0, topK)
          .filter(result => result.score >= 0.12);
      }

      console.log(
        `RAG search returned ${results.length} chunks. Scores: ${results
          .map(result => result.score.toFixed(3))
          .join(', ')}`
      );

      return results;
    } catch (error) {
      console.error('RAG search failed:', error);
      return [];
    }
  }

  public formatContext(results: RAGSearchResult[]): string {
    if (results.length === 0) {
      return '';
    }

    let context = '【参考资料】\n';

    for (const [index, result] of results.entries()) {
      const title = result.chunk.metadata?.category || result.chunk.source;
      const block = [
        `--- 资料 ${index + 1} ---`,
        `来源: ${result.chunk.source}`,
        `章节: ${title}`,
        `评分: ${result.score.toFixed(3)}`,
        result.chunk.content.trim(),
        '',
      ].join('\n');

      if (context.length + block.length > RAG_CONTEXT_MAX_CHARS) {
        break;
      }

      context += `${block}\n`;
    }

    context += '请只基于以上资料回答；资料未包含的内容，请明确说明未知，不要编造。\n';
    return context;
  }
}

export const ragService = RAGService.getInstance();
