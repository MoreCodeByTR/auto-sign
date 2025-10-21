# GitHub 自动提交工具

这是一个自动定时向 GitHub 指定仓库提交 commit 的工具，提供了 Shell 脚本和 Node.js 两种实现方案。

## 📋 功能特点

- ✅ 自动定时提交到 GitHub
- ✅ 支持 Shell 脚本和 Node.js 两种方案
- ✅ 灵活的定时配置
- ✅ 完整的日志输出
- ✅ 错误处理

## 🚀 快速开始

### 方案一：Shell 脚本（推荐用于 Linux/Mac）

#### 1. 配置脚本

```bash
# 给脚本添加执行权限
chmod +x auto-commit.sh

# 编辑脚本，修改配置项
nano auto-commit.sh
```

修改以下配置：
```bash
REPO_PATH="/path/to/your/repo"  # 你的 Git 仓库路径
COMMIT_FILE="auto-sign.txt"     # 要修改的文件名
BRANCH="main"                    # 分支名
```

或者通过环境变量设置：
```bash
export REPO_PATH="/path/to/your/repo"
export COMMIT_FILE="auto-sign.txt"
export BRANCH="main"
```

#### 2. 手动测试

```bash
./auto-commit.sh
```

#### 3. 设置定时任务（使用 crontab）

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天上午 9:00 执行）
0 9 * * * /path/to/auto-sign/auto-commit.sh >> /path/to/logs/auto-commit.log 2>&1

# 其他时间示例：
# 每天中午 12:00
# 0 12 * * * /path/to/auto-sign/auto-commit.sh

# 每 6 小时执行一次
# 0 */6 * * * /path/to/auto-sign/auto-commit.sh

# 周一到周五上午 9:00
# 0 9 * * 1-5 /path/to/auto-sign/auto-commit.sh
```

查看定时任务：
```bash
crontab -l
```

删除定时任务：
```bash
crontab -r
```

### 方案二：Node.js 脚本（跨平台）

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置

复制配置文件模板：
```bash
cp config.example.json config.json
```

编辑 `config.json`：
```json
{
  "repoPath": "/path/to/your/github/repo",
  "commitFile": "auto-sign.txt",
  "branch": "main"
}
```

#### 3. 手动测试

```bash
npm start
# 或
node auto-commit.js
```

#### 4. 启动定时任务

使用内置的定时调度器：
```bash
npm run schedule
# 或
node schedule.js
```

默认每天上午 9:00 执行，可以通过环境变量修改：
```bash
# 每天下午 3:00
CRON_SCHEDULE="0 15 * * *" node schedule.js

# 每 2 小时
CRON_SCHEDULE="0 */2 * * *" node schedule.js

# 每 30 分钟
CRON_SCHEDULE="*/30 * * * *" node schedule.js
```

#### 5. 使用 PM2 保持运行（生产环境推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start schedule.js --name "auto-sign"

# 查看状态
pm2 status

# 查看日志
pm2 logs auto-sign

# 停止
pm2 stop auto-sign

# 重启
pm2 restart auto-sign

# 设置开机自启
pm2 startup
pm2 save
```

## ⏰ Cron 表达式说明

Cron 表达式格式：
```
┌───────────── 分钟 (0 - 59)
│ ┌───────────── 小时 (0 - 23)
│ │ ┌───────────── 日期 (1 - 31)
│ │ │ ┌───────────── 月份 (1 - 12)
│ │ │ │ ┌───────────── 星期几 (0 - 7) (0 或 7 是星期日)
│ │ │ │ │
* * * * *
```

常用示例：
- `0 9 * * *` - 每天上午 9:00
- `0 */6 * * *` - 每 6 小时
- `0 0 * * 1-5` - 周一到周五的午夜
- `*/30 * * * *` - 每 30 分钟
- `0 9,17 * * *` - 每天 9:00 和 17:00

## 🔧 环境要求

### Shell 脚本
- Bash Shell
- Git
- 已配置 Git 认证（SSH 密钥或 Personal Access Token）

### Node.js 脚本
- Node.js 12.0 或更高版本
- npm 或 yarn
- Git
- 已配置 Git 认证

## 🔐 Git 认证配置

### 方式一：SSH 密钥（推荐）

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
```

然后在 GitHub 设置中添加 SSH 密钥：
1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容

### 方式二：Personal Access Token

```bash
# 配置 Git 凭证
git config --global credential.helper store

# 第一次推送时输入用户名和 Token
# 用户名: 你的 GitHub 用户名
# 密码: Personal Access Token（不是账户密码）
```

创建 Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并保存 Token

## 📝 注意事项

1. **首次使用前**，请确保：
   - Git 仓库已初始化
   - 已配置 Git 用户信息：
     ```bash
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     ```
   - 已配置 Git 认证（SSH 或 Token）

2. **权限问题**：
   - Shell 脚本需要执行权限：`chmod +x auto-commit.sh`
   - 确保有仓库的写入权限

3. **定时任务**：
   - Shell 方案使用 crontab，适合 Linux/Mac
   - Node.js 方案跨平台，支持 Windows
   - 生产环境建议使用 PM2 管理 Node.js 进程

4. **日志管理**：
   - Shell 脚本建议重定向输出到日志文件
   - Node.js 使用 PM2 可以自动管理日志

## 🛠️ 故障排查

### 问题：推送失败

**解决方法**：
1. 检查网络连接
2. 验证 Git 认证配置
3. 检查仓库权限
4. 查看错误日志

### 问题：定时任务未执行

**Shell 脚本**：
```bash
# 检查 crontab 服务状态
sudo service cron status  # Ubuntu/Debian
sudo service crond status # CentOS/RHEL

# 查看 cron 日志
tail -f /var/log/syslog | grep CRON  # Ubuntu/Debian
tail -f /var/log/cron                # CentOS/RHEL
```

**Node.js**：
```bash
# 如果使用 PM2
pm2 logs auto-sign
pm2 status
```

### 问题：权限不足

```bash
# 检查文件权限
ls -la auto-commit.sh

# 添加执行权限
chmod +x auto-commit.sh

# 检查仓库权限
cd /path/to/repo
git status
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

