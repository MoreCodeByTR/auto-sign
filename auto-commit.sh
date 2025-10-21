#!/bin/bash

# ===================================
# GitHub 自动提交脚本
# ===================================

# 配置项
REPO_PATH="/Users/tianrui/github/auto-sign"  # Git 仓库路径
COMMIT_FILE="auto-sign.txt"   # 要修改的文件名
BRANCH="master"                       # 分支名

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 检查仓库路径
if [ ! -d "$REPO_PATH/.git" ]; then
    log_error "仓库路径不存在或不是 Git 仓库: $REPO_PATH"
    exit 1
fi

# 进入仓库目录
cd "$REPO_PATH" || exit 1
log_info "进入仓库目录: $REPO_PATH"

# 拉取最新代码
log_info "拉取最新代码..."
git pull origin "$BRANCH"

# 创建或更新文件
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "Auto commit at: $TIMESTAMP" >> "$COMMIT_FILE"
log_info "更新文件: $COMMIT_FILE"

# 添加到暂存区
git add "$COMMIT_FILE"

# 检查是否有变更
if git diff --staged --quiet; then
    log_warning "没有变更需要提交"
    exit 0
fi

# 提交
COMMIT_MSG="Auto commit: $TIMESTAMP"
git commit -m "$COMMIT_MSG"
log_info "创建提交: $COMMIT_MSG"

# 推送到远程
log_info "推送到远程仓库..."
if git push origin "$BRANCH"; then
    log_info "✅ 成功推送到 GitHub"
else
    log_error "❌ 推送失败"
    exit 1
fi

log_info "🎉 自动提交完成！"

