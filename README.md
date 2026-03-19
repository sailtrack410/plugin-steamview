# Steam View

一个用于 Halo 博客系统的 Steam 游戏库展示插件，可以展示用户的 Steam 游戏数据、游戏时长统计等信息。

![Steam View](./src/main/resources/logo.svg)


## 🌐 演示与交流

- **演示站点**：[https://www.sailtrack.cn/steamview](https://www.sailtrack.cn/steamview)
- **QQ 交流群**：[![QQ群](https://www.xhhao.com/upload/iShot_2025-03-03_16.03.00.png)](https://www.xhhao.com/upload/iShot_2025-03-03_16.03.00.png)

## ✨ 功能特性

- 🎮 **游戏数据展示**
  - 展示 Steam 游戏库中的所有游戏
  - 支持家庭库游戏（Family Sharing）
  - 游戏封面、名称、时长等信息
  - 游戏名称本地化（支持中文）

- 📊 **数据可视化**
  - 玩家资料卡片：头像、等级、徽章、XP
  - 进度条：游戏时长占比可视化
  - 双进度条设计：总时长 + 两周时长

- 🔧 **排序功能**
  - 按两周时长排序（默认）
  - 按总时长排序
  - 按游戏名称排序
  - 按最近游玩时间排序

- 🎨 **用户体验**
  - 响应式 Grid 布局（支持桌面端、平板、移动端）
  - 无限滚动自动加载
  - 主题适配（亮色/暗色）

- ⚙️ **配置管理**
  - Steam API Key 配置
  - Steam ID 配置
  - 数据刷新频率设置
  - 隐藏游戏功能
  - 代理域名支持（含路径级代理）

- 📝 **编辑器嵌入**
  - 支持 TipTap 编辑器扩展
  - 可选择全部游戏或单个游戏渲染

## 🚀 快速开始

### 环境要求

- Halo 2.22.0 或更高版本
- Java 21+

### 安装方法

#### 方法1：通过 Halo 后台安装

1. 登录 Halo 后台
2. 进入"插件" → "安装插件"
3. 上传 `pluginsteamview-1.1.1.jar`
4. 启用插件

#### 方法2：手动安装

1. 下载最新版本的 jar 文件
2. 将 jar 文件复制到 Halo 的插件目录
3. 重启 Halo

### 配置插件

1. 进入 Halo 后台 → 插件 → Steam View → 设置
2. 填写 **Steam API Key**（[申请页面](https://steamcommunity.com/dev/apikey)）
3. 填写 **Steam ID**（17位数字，在 Steam 个人主页 URL 中找到）
4. 点击"测试 Steam 连接"验证配置
5. 保存设置

### 访问插件

```
http://your-halo-domain/steamview
```

## ⚙️ 配置说明

### 基本设置

| 配置项 | 说明 | 必填 |
|--------|------|------|
| Steam API Key | Steam API 密钥 | 是 |
| Steam ID | Steam ID（17位数字） | 是 |
| 数据刷新频率 | 自动刷新频率（1h/6h/24h） | 否 |

### 代理域名设置

支持两种格式：
- **域名格式**: `api.steampowered.com`
- **完整 URL**: `https://proxy.example.com/path/https://api.steampowered.com`

### Steam ID 获取方法

1. 访问 Steam 个人主页，URL 格式：`https://steamcommunity.com/profiles/76561198000000000`，数字部分即 Steam ID
2. 使用自定义 URL 的用户可通过 [Steam ID 查询工具](https://steamid.io/) 查询

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 构建前端（修改 packages/ 后必须执行）
cd packages && pnpm build

# 构建插件
./gradlew build -x test -x pnpmCheck

# 产物位置
build/libs/pluginsteamview-1.1.1.jar
```

## 🛠️ 技术栈

- **后端**: Java 21, Spring Boot WebFlux, Halo Plugin Framework 2.22.0
- **前端**: Vue 3, TypeScript, Lit (Web Components)
- **外部服务**: Steam Web API, Steam Store API, Steam CDN

## 📜 更新日志

### v1.1.1 (2026-03-18)

- ✨ 支持路径级代理域名（完整 URL 格式）
- ✨ 家庭库游戏显示"家庭库"标记
- 🎨 游戏卡片布局改为 CSS Grid，按行排序
- 📝 更新项目文档

### v1.1.0 (2026-03-14)

- ✨ 新增编辑器嵌入功能
- 🎨 前端 UI 改为 Lit 组件形式
- 🔧 重构整体代码架构
- 📝 新增代理域名配置选项
- 🐛 解决已知问题

### v1.0.0 (2026-01-16)

- ✨ 初始版本发布
- 🎮 支持 Steam 游戏库展示
- 📊 支持游戏时长统计和可视化
- 🌍 支持家庭库游戏
- 🇨🇳 支持游戏名称本地化（中文）
- 📱 响应式设计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

本项目采用 [GPL-3.0](./LICENSE) 许可证。

## 👨‍💻 作者

**sailtrack410** - [GitHub](https://github.com/sailtrack410)

**Handsome**

## 📮 反馈与支持

- 提交 [Issue](https://github.com/sailtrack410/plugin-steamview/issues)

---

**Made with ❤️ by sailtrack410 & Handsome**