# 快速上手指南

## 🎯 5 分钟快速开始

### Shell 脚本方案（适合 Mac/Linux）

#### 步骤 1：修改配置

打开 `auto-commit.sh`，找到配置区域并修改：

```bash
REPO_PATH="/Users/tianrui/github/your-repo"  # 改成你的仓库路径
COMMIT_FILE="auto-sign.txt"                   # 要修改的文件（会自动创建）
BRANCH="main"                                  # 分支名（main 或 master）
```

#### 步骤 2：测试运行

```bash
./auto-commit.sh
```

如果成功，你会看到：
```
[INFO] 2025-10-21 10:30:00 - 进入仓库目录: /path/to/repo
[INFO] 2025-10-21 10:30:01 - 拉取最新代码...
[INFO] 2025-10-21 10:30:02 - 更新文件: auto-sign.txt
[INFO] 2025-10-21 10:30:03 - 创建提交: Auto commit: 2025-10-21 10:30:03
[INFO] 2025-10-21 10:30:05 - 推送到远程仓库...
[INFO] 2025-10-21 10:30:07 - ✅ 成功推送到 GitHub
[INFO] 2025-10-21 10:30:07 - 🎉 自动提交完成！
```

#### 步骤 3：设置定时任务

```bash
# 编辑定时任务
crontab -e

# 添加以下内容（每天上午 9:00 执行）
0 9 * * * cd /Users/tianrui/github/auto-sign && ./auto-commit.sh >> /tmp/auto-sign.log 2>&1

# 保存并退出（vi 编辑器按 ESC，输入 :wq 回车）
```

验证定时任务：
```bash
crontab -l
```

---

### Node.js 方案（跨平台，推荐）

#### 步骤 1：安装依赖

```bash
npm install
```

#### 步骤 2：创建配置文件

```bash
cp config.example.json config.json
```

编辑 `config.json`：
```json
{
  "repoPath": "/Users/tianrui/github/your-repo",
  "commitFile": "auto-sign.txt",
  "branch": "main"
}
```

#### 步骤 3：测试运行

```bash
npm start
```

成功输出：
```
[INFO] 2025-10-21 10:30:00 - 🚀 开始执行自动提交任务...
[INFO] 2025-10-21 10:30:00 - 进入仓库目录: /path/to/repo
[INFO] 2025-10-21 10:30:01 - 拉取最新代码...
[INFO] 2025-10-21 10:30:02 - 更新文件: auto-sign.txt
[INFO] 2025-10-21 10:30:03 - 创建提交: Auto commit: 2025-10-21 10:30:03
[INFO] 2025-10-21 10:30:05 - 推送到远程仓库...
[INFO] 2025-10-21 10:30:07 - ✅ 成功推送到 GitHub
[INFO] 2025-10-21 10:30:07 - 🎉 自动提交完成！
```

#### 步骤 4：启动定时任务

**方法 A：直接运行（测试用）**
```bash
npm run schedule
```

**方法 B：使用 PM2（生产环境推荐）**
```bash
# 安装 PM2
npm install -g pm2

# 启动
pm2 start schedule.js --name "auto-sign"

# 开机自启
pm2 startup
pm2 save
```

## 🔧 常见问题

### Q1: 如何修改执行时间？

**Shell (crontab)**：
```bash
# 每天上午 9:00
0 9 * * * /path/to/auto-commit.sh

# 每天晚上 23:00
0 23 * * * /path/to/auto-commit.sh

# 每 6 小时
0 */6 * * * /path/to/auto-commit.sh

# 周一到周五上午 9:00
0 9 * * 1-5 /path/to/auto-commit.sh
```

**Node.js**：
```bash
# 修改执行时间
CRON_SCHEDULE="0 23 * * *" node schedule.js

# 或使用 PM2
pm2 delete auto-sign
CRON_SCHEDULE="0 23 * * *" pm2 start schedule.js --name "auto-sign"
```

### Q2: 推送失败怎么办？

1. **检查 SSH 密钥**：
```bash
ssh -T git@github.com
```

应该看到：`Hi username! You've successfully authenticated...`

2. **如果没有配置 SSH，配置一下**：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```
然后将公钥添加到 GitHub：https://github.com/settings/keys

3. **或者使用 HTTPS + Token**：
```bash
# 在仓库中设置远程地址
git remote set-url origin https://TOKEN@github.com/username/repo.git
```

### Q3: 如何查看运行日志？

**Shell + crontab**：
```bash
tail -f /tmp/auto-sign.log
```

**Node.js + PM2**：
```bash
pm2 logs auto-sign
```

### Q4: 如何停止定时任务？

**Shell**：
```bash
crontab -e
# 删除或注释掉对应行（在行首加 #）
```

**Node.js**：
```bash
# 如果是直接运行
按 Ctrl+C

# 如果是 PM2
pm2 stop auto-sign
pm2 delete auto-sign
```

## 📊 推荐配置

### 日常使用（每天一次）
```bash
# 每天上午 9:00
0 9 * * *
```

### 工作日使用
```bash
# 周一到周五上午 9:00
0 9 * * 1-5
```

### 频繁使用（保持活跃）
```bash
# 每 6 小时
0 */6 * * *
```

### 低调使用（避免被发现）
```bash
# 每天随机时间（可以每天手动修改）
# 上午 8-10 点之间
0 8-10 * * *
```

## 🎓 进阶技巧

### 技巧 1：随机时间提交

创建 `random-commit.sh`：
```bash
#!/bin/bash
# 随机延迟 0-3600 秒（1小时内）
sleep $((RANDOM % 3600))
./auto-commit.sh
```

然后在 crontab 中使用：
```bash
0 9 * * * /path/to/random-commit.sh
```

### 技巧 2：只在工作日提交

Node.js 版本已内置支持：
```bash
# 周一到周五
CRON_SCHEDULE="0 9 * * 1-5" node schedule.js
```

### 技巧 3：多个仓库

复制配置文件：
```bash
cp config.json config-repo1.json
cp config.json config-repo2.json
```

启动多个实例：
```bash
pm2 start schedule.js --name "repo1" -- config-repo1.json
pm2 start schedule.js --name "repo2" -- config-repo2.json
```

## ✅ 检查清单

- [ ] Git 已安装：`git --version`
- [ ] Node.js 已安装（Node.js 方案）：`node --version`
- [ ] Git 用户信息已配置：`git config user.name` 和 `git config user.email`
- [ ] Git 认证已配置（SSH 或 Token）：`ssh -T git@github.com`
- [ ] 仓库路径正确且有 .git 目录
- [ ] 有仓库的写入权限
- [ ] 配置文件已正确填写
- [ ] 手动测试成功
- [ ] 定时任务已设置

## 🆘 需要帮助？

如果遇到问题：
1. 查看详细文档：`README.md`
2. 检查日志文件
3. 手动运行测试
4. 检查 Git 配置和权限

祝使用愉快！🎉

