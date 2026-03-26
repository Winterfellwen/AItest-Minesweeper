# 扫雷小游戏（Django 后端 + 微信小程序前端）

## 项目结构
```
minesweeper_django/
├─ manage.py
├─ minesweeper/          # Django 项目配置
│   ├─ __init__.py
│   ├─ settings.py
│   ├─ urls.py
│   └─ wsgi.py
├─ game/                 # 小游戏应用
│   ├─ __init__.py
│   ├─ admin.py
│   ├─ apps.py
│   ├─ models.py
│   ├─ views.py
│   ├─ urls.py
│   └─ migrations/
├─ static/
│   └─ game/
│       ├─ css/
│       │   └─ style.css
│       ├─ js/
│       │   ├─ minesweeper.js
│       │   └─ util.js
│       └─ images/
└─ templates/
    └─ game/
        └─ index.html
```

## 功能说明
- **Django 后端**：提供静态文件服务（HTML、CSS、JS、图片），并可选提供 API（如生成棋盘、记录得分）。
- **微信小程序前端**：使用普通 HTML/CSS/JS 编写的扫雷游戏，可直接在微信开发者工具中导入运行（将 `static/game` 目录下的文件复制到小程序项目中，或通过网络下载后使用）。
- **GitHub 集成**：将本项目推送到 GitHub 仓库，可通过 GitHub Actions 自动部署到服务器（如 Vercel、Heroku、阿里云等），或直接克隆仓库进行本地调试。

## 快速开始（本地开发）
1. 克隆仓库（或复制本目录）：
   ```bash
   git clone <your-github-repo-url>
   cd minesweeper_django
   ```
2. 创建虚拟环境并安装依赖：
   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. 应用数据库迁移（虽然本示例未使用数据库，但保持完整）：
   ```bash
   python manage.py migrate
   ```
4. 启动开发服务器：
   ```bash
   python manage.py runserver
   ```
5. 在浏览器访问 http://127.0.0.1:8000/game/ 查看游戏页面（纯 web 版）。
6. 将 `static/game` 目录下的文件复制到微信小程序项目中，或在微信开发者工具里新建项目并选择该目录作为本地调试目录，即可在微信小程序中玩耍。

## 部署到生产环境（示例）
- 推送代码到 GitHub：`git push origin main`
- 在服务器上拉取代码，配置 WSGI（如 Gunicorn + Nginx）或使用平台（Heroku、Vercel、阿里云容器服务等）自动构建。
- 确保 `STATIC_URL` 和 `STATIC_ROOT` 已正确配置，收集静态文件：
  ```bash
  python manage.py collectstatic
  ```

## 注意事项
- 微信小程序不能直接运行普通 HTML/JS，需将代码改写为 WXML/WXSS/JS 格式。本示例提供的前端代码为通用网页版，您可以参考其逻辑自行转换为小程序文件。
- 若需要后端保存游戏记录（如最高分），可在 `game/views.py` 中添加对应的 API 视图，并在前端通过 `wx.request` 调用。

祝游戏愉快！