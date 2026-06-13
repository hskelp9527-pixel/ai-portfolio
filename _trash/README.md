# _trash/

被认定为无用或与本项目无关的文件。谨慎起见没有直接删除，确认无用后可手动清空整个目录。

## 一次性脚本（用过即丢）

| 文件 | 废弃原因 |
|---|---|
| `nul` | Windows 误产物（bash 不识别 `del` 命令产生的占位文件，内容是 "del: command not found"） |
| `debug.log` | 6.8KB 早期 API 调试日志，已被 `.gitignore` 忽略 |
| `test-api.js` | 早期 API 测试脚本，已被 `vitest` 体系取代 |
| `test-rag.js` | 早期 RAG 测试脚本，已被 `vitest` 体系取代 |
| `remove-signatures.js` | 移除腾讯云 COS URL 签名参数的一次性脚本。与项目历史中"添加认证令牌"的操作矛盾，说明项目方向已变，该脚本不再需要 |

## backup/ — 旧版本组件备份

| 文件 | 废弃原因 |
|---|---|
| `backup/IdentitySection.tsx` | 旧版本，已被根目录 `components/IdentitySection.tsx` 取代 |
| `backup/Resume.tsx` | 旧版本，已被根目录 `components/Resume.tsx` 取代 |
| `backup/data.ts` | 旧版本，已被根目录 `data.ts` 取代 |

## personal-notes/ — 不属于本项目的个人笔记

这些文件是其他项目（宠物健康 AI 服务平台）的产物或个人草稿，不应放在 AIJianLi 项目目录里。

| 文件 | 实际归属 |
|---|---|
| `personal-notes/NewJianli.md` | 简历文案修改草稿（原文 vs 修改后版本对照） |
| `personal-notes/宠物服务链接.md` | 宠物健康 AI 服务平台的页面链接清单 |
| `personal-notes/宠物健康AI服务平台-项目经验.md` | 宠物健康 AI 服务平台的项目经验总结 |

建议：移到外挂大脑或对应项目目录，不要放回 AIJianLi。
