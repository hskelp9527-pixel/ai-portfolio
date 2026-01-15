
import React from 'react';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

export interface Skill {
  category: string;
  items: string[];
  summary?: string; // 新增：技能总结句
}

export interface ProjectImage {
  id: string;
  filename?: string; // 新增：文件名
  url: string;
  thumbnail?: string; // 新增：缩略图URL
  title: string;
  description: string;
  category?: string; // 新增：分类
  tags?: string[]; // 新增：标签
  dimensions?: { width: number; height: number }; // 新增：尺寸信息
  fileSize?: number; // 新增：文件大小（字节）
  createdAt?: string; // 新增：创建时间
}

export interface ProjectVideo {
  id: string;
  filename?: string; // 新增：文件名
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  duration?: number; // 新增：视频时长（秒）
  aspectRatio?: '16:9' | '9:16' | '4:3' | '1:1'; // 新增：宽高比
  category?: string; // 新增：分类
  tags?: string[]; // 新增：标签
  fileSize?: number; // 新增：文件大小（字节）
  createdAt?: string; // 新增：创建时间
}

export interface MediaManagerConfig {
  imagePath: string;
  videoPath: string;
  thumbnailPath: string;
  supportedImageFormats: string[];
  supportedVideoFormats: string[];
  lazyLoadThreshold: number;
  maxImageSize: number;
  maxVideoSize: number;
}

export interface MediaError {
  type: 'LOAD_ERROR' | 'FORMAT_ERROR' | 'SIZE_ERROR' | 'NETWORK_ERROR';
  message: string;
  filename?: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark';
// 浮动导航相关类型定义
export interface NavigationItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface FloatingNavigationProps {
  theme: Theme;
  onToggleTheme: () => void;
  onExportPDF: () => void;
}

// 聊天相关类型定义
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface GLMChatRequest {
  model: 'glm-4.5' | 'glm-4.5-air';
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  thinking?: {
    type: 'enabled' | 'disabled';
  };
}

export interface GLMChatResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// RAG 相关类型定义
export interface KnowledgeChunk {
  id: string;
  content: string;
  source: string;
  metadata?: {
    category?: string;
    keywords?: string[];
  };
}

export interface VectorIndex {
  chunks: KnowledgeChunk[];
  embeddings: number[][];
  updatedAt: string;
}

export interface RAGSearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

export interface GLMEmbeddingRequest {
  model: string;
  input: string;
}

export interface GLMEmbeddingResponse {
  id: string;
  object: string;
  created: number;
  data: Array<{
    index: number;
    object: string;
    embedding: number[];
  }>;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}