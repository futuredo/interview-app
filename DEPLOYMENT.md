# 部署指南（GitHub Pages）

以下以 **Vite + GitHub Pages** 方式部署为例。

## 1. 创建仓库并推送代码
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
git push -u origin main
```

## 2. 配置 Vite 的 base 路径
打开 `vite.config.ts`，设置 `base` 为你的仓库名：

```ts
export default defineConfig({
  base: '/<你的仓库名>/',
  // ...其他配置
})
```

## 3. 添加部署脚本（可选）
使用 `gh-pages` 自动部署：

```bash
npm install -D gh-pages
```

在 `package.json` 中增加：

```json
"scripts": {
  "build": "tsc -b && vite build",
  "deploy": "gh-pages -d dist"
}
```

部署：

```bash
npm run build
npm run deploy
```

## 4. GitHub Pages 设置
- 打开仓库 Settings → Pages
- Source 选择 `gh-pages` 分支，根目录 `/`
- 保存后稍等几分钟访问：
`https://<你的用户名>.github.io/<你的仓库名>/`

## 常见问题
1. **页面空白**：检查 `base` 是否设置正确。
2. **路由刷新 404**：建议在 GitHub Pages 开启 SPA 回退（可使用 `404.html` 方案）或改用 HashRouter。
