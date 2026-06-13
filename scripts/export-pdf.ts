/**
 * 智能导出 PDF 脚本
 * 使用 Playwright 将前端页面导出为 PDF，智能避免文字截断
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function exportToPDF() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 设置视口大小
  await page.setViewportSize({ width: 1400, height: 1080 });

  console.log('正在加载页面...');

  // 访问本地页面
  await page.goto('http://localhost:3001', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  console.log('等待内容加载...');

  // 等待网络空闲
  await page.waitForLoadState('networkidle');

  // 等待所有图片加载完成
  await page.waitForFunction(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).every(img => img.complete && (img as HTMLImageElement).naturalHeight !== 0);
  }, { timeout: 30000 });

  // 等待所有视频元素至少有缩略图
  await page.waitForFunction(() => {
    const videos = document.querySelectorAll('video');
    return Array.from(videos).every(video => (video as HTMLVideoElement).readyState >= 1);
  }, { timeout: 10000 }).catch(() => {
    console.log('部分视频未加载，继续...');
  });

  // 额外等待动态内容和动画
  await page.waitForTimeout(3000);

  // 再次确认网络空闲
  await page.waitForLoadState('networkidle');

  console.log('内容加载完成，开始生成 PDF...');

  // 隐藏导航栏（添加 no-print 类的元素）
  await page.addStyleTag({
    content: `
      .no-print {
        display: none !important;
      }
    `
  });

  console.log('正在生成 PDF...');

  // 使用 PDF 生成功能，自动处理分页
  const pdfBuffer = await page.pdf({
    path: join(__dirname, '..', '任泓雨_个人简历.pdf'),
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    },
    displayHeaderFooter: false,
    preferCSSPageSize: true
  });

  await browser.close();

  console.log('✅ PDF 导出成功！');
  console.log('文件路径:', join(__dirname, '..', '任泓雨_个人简历.pdf'));
}

exportToPDF().catch(console.error);
