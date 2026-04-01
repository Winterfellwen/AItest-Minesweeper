# 扫雷 - 微信小程序

微信小程序扫雷游戏，扁平化UI，Canvas粒子烟花胜利特效，在线排行榜。

## 项目结构

```
miniprogram/  - 微信小程序前端
backend/      - Django REST API后端
```

## 游戏特性

- 三种难度：初级 9×9/10雷、中级 16×16/40雷、高级 16×30/99雷
- 首次点击安全保护（不会踩雷 + 周围区域展开）
- 短按翻开，长按插旗
- 胜利时Canvas粒子烟花特效
- 在线排行榜（Django + MySQL）

## 后端部署

```bash
cd backend
pip install -r requirements.txt
# 配置 .env 或环境变量:
#   DJANGO_SECRET_KEY, WECHAT_APPID, WECHAT_SECRET
#   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## 前端开发

1. 用微信开发者工具打开 `miniprogram/` 目录
2. 修改 `utils/constants.js` 中的 `API_BASE` 为后端地址
3. 编译预览

## 后端API

- `POST /api/auth/login/` — 微信登录 (body: `{code}`)
- `POST /api/scores/submit/` — 提交成绩 (需 Bearer token)
- `GET /api/scores/leaderboard/?difficulty=easy&limit=50` — 排行榜
