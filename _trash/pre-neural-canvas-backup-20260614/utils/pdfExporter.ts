import html2canvas from 'html2canvas';
import { Theme } from '../types';

export interface PDFExportOptions {
  filename?: string;
  theme: Theme;
  excludeSelectors?: string[];
}

/**
 * 生成PDF文件名
 * 格式: 任泓雨_个人简历_YYYY-MM-DD.pdf
 */
export const generateFilename = (userName: string = '任泓雨'): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${userName}_个人简历_${year}-${month}-${day}.png`;
};

/**
 * 隐藏不需要导出的元素
 */
const hideElements = (selectors: string[]): HTMLElement[] => {
  const hiddenElements: HTMLElement[] = [];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach(el => {
      if (el.style.display !== 'none') {
        hiddenElements.push(el);
        el.style.display = 'none';
      }
    });
  });

  return hiddenElements;
};

/**
 * 恢复隐藏的元素
 */
const showElements = (elements: HTMLElement[]): void => {
  elements.forEach(el => {
    el.style.display = '';
  });
};

/**
 * 导出当前页面为高清图片
 */
export const exportToPDF = async (options: PDFExportOptions): Promise<void> => {
  const {
    filename,
    theme,
    excludeSelectors = ['.no-print', 'nav', '.floating-nav']
  } = options;

  const finalFilename = filename || generateFilename();

  try {
    // 获取要导出的内容区域
    const element = document.getElementById('root');
    if (!element) {
      throw new Error('无法找到要导出的内容');
    }

    // 隐藏不需要导出的元素
    const hiddenElements = hideElements(excludeSelectors);

    // 显示加载提示
    const loadingTip = document.createElement('div');
    loadingTip.id = 'export-loading-tip';
    loadingTip.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px 40px;border-radius:10px;z-index:99999;font-size:16px;';
    loadingTip.textContent = '正在生成图片，请稍候...';
    document.body.appendChild(loadingTip);

    // 临时切换到浅色主题
    const body = document.body;
    const hadDarkTheme = body.classList.contains('dark-theme');
    if (hadDarkTheme) {
      body.classList.remove('dark-theme');
    }
    const originalBackground = body.style.background;
    body.style.background = '#ffffff';

    // 等待样式更新
    await new Promise(resolve => setTimeout(resolve, 500));

    // 使用html2canvas捕获页面为高清图片
    const canvas = await html2canvas(element, {
      scale: 4, // 超高清
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // 在克隆的文档中强制设置浅色主题
        const root = clonedDoc.getElementById('root');
        if (root) {
          root.style.background = '#ffffff';
          root.style.color = '#1D1D1F';
        }

        // 隐藏不需要的元素
        excludeSelectors.forEach(selector => {
          const elements = clonedDoc.querySelectorAll<HTMLElement>(selector);
          elements.forEach(el => {
            el.style.display = 'none';
          });
        });
      }
    });

    // 恢复隐藏的元素
    showElements(hiddenElements);

    // 恢复原始状态
    if (hadDarkTheme) {
      body.classList.add('dark-theme');
    }
    body.style.background = originalBackground;

    // 移除加载提示
    document.getElementById('export-loading-tip')?.remove();

    // 将canvas转换为图片并下载
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('图片导出失败:', error);
    document.getElementById('export-loading-tip')?.remove();
    throw error;
  }
};

/**
 * 创建PDF导出处理函数（实际导出为高清图片）
 */
export const createPDFExportHandler = (theme: Theme, userName?: string) => {
  return async () => {
    try {
      await exportToPDF({
        theme,
        filename: generateFilename(userName)
      });
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    }
  };
};
