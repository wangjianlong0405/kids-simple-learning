# 🚀 幼儿英语学习小程序 - 部署指南

## 📦 项目构建

### 1. 生产环境构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 2. 构建输出

构建完成后，会在 `dist` 目录生成以下文件：

```
dist/
├── index.html          # 主页面
├── assets/
│   ├── index-[hash].js # 主JavaScript文件
│   ├── index-[hash].css # 样式文件
│   └── ...            # 其他资源文件
└── vite.svg           # 图标文件
```

## 🌐 部署选项

### 选项 1: Vercel 部署（推荐）

1. **安装 Vercel CLI**

```bash
npm i -g vercel
```

2. **部署到 Vercel**

```bash
# 在项目根目录执行
vercel

# 或者直接部署
vercel --prod
```

3. **配置自动部署**

- 连接 GitHub 仓库
- 设置自动部署分支
- 配置环境变量（如需要）

### 选项 2: Netlify 部署

1. **安装 Netlify CLI**

```bash
npm i -g netlify-cli
```

2. **构建并部署**

```bash
# 构建项目
npm run build

# 部署到Netlify
netlify deploy --prod --dir=dist
```

3. **配置重定向规则**
   在 `public/_redirects` 文件中添加：

```
/*    /index.html   200
```

### 选项 3: GitHub Pages 部署

1. **安装 gh-pages**

```bash
npm install --save-dev gh-pages
```

2. **配置 package.json**

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/kids-english-learning"
}
```

3. **部署**

```bash
npm run build
npm run deploy
```

### 选项 4: 传统服务器部署

1. **构建项目**

```bash
npm run build
```

2. **上传文件**
   将 `dist` 目录中的所有文件上传到 Web 服务器

3. **配置服务器**

- 确保服务器支持 SPA 路由
- 配置 HTTPS（推荐）
- 设置适当的缓存策略

## 🔧 环境配置

### 开发环境

```bash
# 启动开发服务器
npm run dev

# 访问地址
http://localhost:3000
```

### 生产环境

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 访问地址
http://localhost:4173
```

## 📱 PWA 配置

### 1. 安装 PWA 插件

```bash
npm install vite-plugin-pwa -D
```

### 2. 配置 vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "幼儿英语学习乐园",
        short_name: "英语学习",
        description: "专为幼儿设计的英语学习应用",
        theme_color: "#667eea",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

## 🔒 安全配置

### 1. HTTPS 配置

- 使用 Let's Encrypt 免费 SSL 证书
- 配置 HTTP 到 HTTPS 重定向
- 设置安全头信息

### 2. 内容安全策略

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';"
/>
```

### 3. 隐私保护

- 不收集用户个人信息
- 数据仅存储在本地
- 符合儿童隐私保护法规

## 📊 性能优化

### 1. 代码分割

```typescript
// 动态导入组件
const GameInterface = lazy(() => import("./components/GameInterface"));
```

### 2. 图片优化

- 使用 WebP 格式
- 实现懒加载
- 压缩图片大小

### 3. 缓存策略

```typescript
// 设置缓存头
app.use(
  express.static("dist", {
    maxAge: "1y",
    etag: false,
  })
);
```

## 🧪 测试部署

### 1. 本地测试

```bash
# 构建并预览
npm run build
npm run preview

# 测试所有功能
# - 学习模式
# - 游戏模式
# - 进度跟踪
# - 设置功能
```

### 2. 移动端测试

- 使用 Chrome DevTools 模拟移动设备
- 测试触摸操作
- 验证响应式布局

### 3. 性能测试

- 使用 Lighthouse 进行性能审计
- 测试加载速度
- 检查可访问性

## 📈 监控和分析

### 1. 错误监控

```typescript
// 添加错误边界
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("应用错误:", error, errorInfo);
    // 发送错误报告到监控服务
  }
}
```

### 2. 用户分析

- 集成 Google Analytics（可选）
- 跟踪学习进度
- 分析用户行为

### 3. 性能监控

- 监控页面加载时间
- 跟踪用户交互
- 分析错误率

## 🔄 持续集成

### 1. GitHub Actions 配置

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - run: npm run deploy
```

### 2. 自动化测试

```bash
# 添加测试脚本
npm install --save-dev @testing-library/react @testing-library/jest-dom

# 运行测试
npm run test
```

## 📋 部署检查清单

### 部署前检查

- [ ] 代码已提交到版本控制
- [ ] 所有功能测试通过
- [ ] 构建无错误
- [ ] 性能指标达标
- [ ] 移动端适配正常

### 部署后检查

- [ ] 网站可正常访问
- [ ] 所有功能正常工作
- [ ] 移动端体验良好
- [ ] 加载速度正常
- [ ] 无控制台错误

## 🎯 最佳实践

### 1. 版本管理

- 使用语义化版本号
- 记录每次更新的变更
- 保持向后兼容性

### 2. 用户反馈

- 提供反馈渠道
- 及时响应用户问题
- 持续改进用户体验

### 3. 内容更新

- 定期添加新词汇
- 更新游戏内容
- 优化学习路径

## 🆘 故障排除

### 常见问题

1. **构建失败**

   - 检查 Node.js 版本
   - 清除 node_modules 重新安装
   - 检查 TypeScript 错误

2. **部署后白屏**

   - 检查路由配置
   - 验证静态资源路径
   - 查看浏览器控制台错误

3. **移动端显示异常**

   - 检查 viewport 设置
   - 验证 CSS 媒体查询
   - 测试触摸事件

4. **性能问题**
   - 优化图片大小
   - 启用代码分割
   - 检查网络请求

### 联系支持

如遇到问题，请：

1. 查看浏览器控制台错误
2. 检查网络连接
3. 尝试清除浏览器缓存
4. 联系技术支持

---

**部署完成后，您的幼儿英语学习小程序就可以为全世界的孩子们提供学习服务了！** 🌟
