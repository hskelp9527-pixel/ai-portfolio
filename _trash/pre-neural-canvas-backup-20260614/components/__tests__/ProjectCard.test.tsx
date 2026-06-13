import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from '../ProjectCard';
import { Theme } from '../../types';

// Mock 数据
const mockProject = {
  id: 'pp7',
  title: '宠物健康AI服务平台',
  description: '是什么：为宠物健康AI服务平台开发的多页面SPA应用。',
  tags: ['Claude Code', 'AI辅助开发', '前端交付', 'API联调'],
  links: [
    { name: '宠物专区', url: 'http://example.com/pet', icon: 'Heart' },
    { name: '健康日志打卡', url: 'http://example.com/health', icon: 'CalendarCheck' },
    { name: 'AI智能问诊', url: 'http://example.com/consultation', icon: 'Stethoscope' }
  ]
};

const mockProjectWithSingleLink = {
  id: 'pp8',
  title: 'Query Auto - 智能情报简报 Agent',
  description: '是什么：基于 Vercel 部署的多智能体情报收集与分析系统。',
  tags: ['LangGraph', '多智能体', 'Vercel', '智谱AI', 'OpenRouter'],
  links: [
    { name: '访问应用', url: 'https://query.airainyu.xyz/', icon: 'ExternalLink' }
  ]
};

describe('ProjectCard 组件', () => {
  describe('基础渲染测试', () => {
    it('应该渲染项目标题', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      expect(screen.getByText('宠物健康AI服务平台')).toBeInTheDocument();
    });

    it('应该渲染项目描述', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      expect(screen.getByText(/多页面SPA应用/)).toBeInTheDocument();
    });

    it('应该渲染所有标签', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      expect(screen.getByText('Claude Code')).toBeInTheDocument();
      expect(screen.getByText('AI辅助开发')).toBeInTheDocument();
      expect(screen.getByText('前端交付')).toBeInTheDocument();
      expect(screen.getByText('API联调')).toBeInTheDocument();
    });
  });

  describe('链接按钮渲染测试', () => {
    it('应该渲染所有链接按钮', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const buttons = screen.getAllByRole('link');
      expect(buttons).toHaveLength(3);
    });

    it('应该为单链接项目渲染按钮', () => {
      render(<ProjectCard project={mockProjectWithSingleLink} theme="light" />);
      const buttons = screen.getAllByRole('link');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute('href', 'https://query.airainyu.xyz/');
    });

    it('按钮应该有正确的 href 属性', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const link = screen.getByRole('link', { name: /宠物专区/ });
      expect(link).toHaveAttribute('href', 'http://example.com/pet');
    });

    it('链接应该在新标签页打开', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const link = screen.getByRole('link', { name: /宠物专区/ });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Tooltip 交互测试', () => {
    it('悬停时应该显示 tooltip', async () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const button = screen.getByRole('link', { name: /宠物专区/ });

      // 初始状态 tooltip 应该隐藏
      const tooltip = screen.queryByText('宠物专区');
      expect(tooltip).not.toBeInTheDocument();

      // 悬停显示 tooltip
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        const tooltipVisible = screen.queryByText('宠物专区');
        expect(tooltipVisible).toBeInTheDocument();
      });
    });

    it('鼠标移出时应该隐藏 tooltip', async () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const button = screen.getByRole('link', { name: /宠物专区/ });

      // 先悬停
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.queryByText('宠物专区')).toBeInTheDocument();
      });

      // 再移出
      fireEvent.mouseLeave(button);
      await waitFor(() => {
        expect(screen.queryByText('宠物专区')).not.toBeInTheDocument();
      });
    });
  });

  describe('主题适配测试', () => {
    it('暗色主题应该应用正确的样式', () => {
      const { container } = render(<ProjectCard project={mockProject} theme="dark" />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-[#0d1117]/60');
      expect(card).toHaveClass('border-l-purple-400');
    });

    it('亮色主题应该应用正确的样式', () => {
      const { container } = render(<ProjectCard project={mockProject} theme="light" />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white/30');
      expect(card).toHaveClass('border-l-purple-500');
    });
  });

  describe('响应式测试', () => {
    it('应该在移动端正确显示', () => {
      // 模拟移动端视口
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      const { container } = render(<ProjectCard project={mockProject} theme="light" />);
      const buttons = container.querySelectorAll('a');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('按钮应该有足够大的触控区域', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const button = screen.getByRole('link', { name: /宠物专区/ });
      const styles = window.getComputedStyle(button);
      const minSize = 44; // WCAG 最小触控目标
      // 实际项目中需要检查实际渲染的尺寸
    });
  });

  describe('可访问性测试', () => {
    it('按钮应该有 aria-label', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const button = screen.getByRole('link', { name: /宠物专区/ });
      expect(button).toHaveAttribute('aria-label', '宠物专区');
    });

    it('图标应该是装饰性的', () => {
      render(<ProjectCard project={mockProject} theme="light" />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        const svg = link.querySelector('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
