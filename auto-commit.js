#!/usr/bin/env node

/**
 * GitHub 自动提交脚本 (Node.js 版本)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置文件路径
const CONFIG_PATH = process.env.CONFIG_PATH || path.join(__dirname, 'config.json');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// 日志函数
function log(level, message) {
  const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });
  const levelColors = {
    INFO: colors.green,
    ERROR: colors.red,
    WARNING: colors.yellow,
  };
  console.log(`${levelColors[level]}[${level}]${colors.reset} ${timestamp} - ${message}`);
}

// 执行命令
function runCommand(command, cwd) {
  try {
    return execSync(command, { cwd, encoding: 'utf-8' });
  } catch (error) {
    throw new Error(`命令执行失败: ${command}\n${error.message}`);
  }
}

// 读取配置
function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      log('ERROR', `配置文件不存在: ${CONFIG_PATH}`);
      log('INFO', '请复制 config.example.json 为 config.json 并填写配置');
      process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return config;
  } catch (error) {
    log('ERROR', `读取配置文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 主函数
async function autoCommit() {
  log('INFO', '🚀 开始执行自动提交任务...');

  const config = loadConfig();
  const { repoPath, commitFile = 'auto-sign.txt', branch = 'main' } = config;

  // 检查仓库路径
  if (!fs.existsSync(path.join(repoPath, '.git'))) {
    log('ERROR', `仓库路径不存在或不是 Git 仓库: ${repoPath}`);
    process.exit(1);
  }

  log('INFO', `进入仓库目录: ${repoPath}`);

  try {
    // 拉取最新代码
    log('INFO', '拉取最新代码...');
    runCommand(`git pull origin ${branch}`, repoPath);

    // 创建或更新文件
    const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });
    const filePath = path.join(repoPath, commitFile);
    const content = `Auto commit at: ${timestamp}\n`;
    
    fs.appendFileSync(filePath, content);
    log('INFO', `更新文件: ${commitFile}`);

    // 添加到暂存区
    runCommand(`git add ${commitFile}`, repoPath);

    // 检查是否有变更
    try {
      runCommand('git diff --staged --quiet', repoPath);
      log('WARNING', '没有变更需要提交');
      return;
    } catch (error) {
      // 有变更，继续提交
    }

    // 提交
    const commitMsg = `Auto commit: ${timestamp}`;
    runCommand(`git commit -m "${commitMsg}"`, repoPath);
    log('INFO', `创建提交: ${commitMsg}`);

    // 推送到远程
    log('INFO', '推送到远程仓库...');
    runCommand(`git push origin ${branch}`, repoPath);
    log('INFO', '✅ 成功推送到 GitHub');

    log('INFO', '🎉 自动提交完成！');
  } catch (error) {
    log('ERROR', `❌ 执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  autoCommit();
}

module.exports = { autoCommit };

