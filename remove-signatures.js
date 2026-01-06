import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Pattern to match URLs with query parameters and remove them
const pattern = /(https:\/\/aicunchu-1394039784\.cos\.ap-guangzhou\.myqcloud\.com\/(?:video|image)\/[^?"'\s]+)\?[^"'\s]*/g;

let count = 0;
const newContent = content.replace(pattern, (match, url) => {
  count++;
  return url;
});

fs.writeFileSync(dataPath, newContent, 'utf8');
console.log(`成功替换了 ${count} 个URL，移除了签名参数`);
