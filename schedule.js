#!/usr/bin/env node

/**
 * 定时任务调度器
 * 使用 node-cron 实现定时自动提交
 */

const cron = require('node-cron');
const { autoCommit } = require('./auto-commit');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message) {
  const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });
  console.log(`${colors.cyan}[SCHEDULER]${colors.reset} ${timestamp} - ${message}`);
}

// 默认配置：每天上午 9:00 执行
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 9 * * *';

log(`📅 定时任务已启动`);
log(`⏰ 执行时间: ${CRON_SCHEDULE} (Cron 表达式)`);
log(`💡 提示: 可以通过环境变量 CRON_SCHEDULE 修改执行时间`);
log('');
log('Cron 表达式说明:');
log('  * * * * * *');
log('  | | | | | |');
log('  | | | | | +-- 星期几 (0 - 7) (0 或 7 是星期日)');
log('  | | | | +---- 月份 (1 - 12)');
log('  | | | +------ 日期 (1 - 31)');
log('  | | +-------- 小时 (0 - 23)');
log('  | +---------- 分钟 (0 - 59)');
log('  +------------ 秒 (0 - 59, 可选)');
log('');
log('常用示例:');
log('  0 9 * * *    - 每天上午 9:00');
log('  0 */6 * * *  - 每 6 小时');
log('  0 0 * * 1-5  - 周一到周五的午夜');
log('  */30 * * * * - 每 30 分钟');
log('');

// 验证 cron 表达式
if (!cron.validate(CRON_SCHEDULE)) {
  console.error(`${colors.red}[ERROR]${colors.reset} 无效的 Cron 表达式: ${CRON_SCHEDULE}`);
  process.exit(1);
}

// 创建定时任务
const task = cron.schedule(CRON_SCHEDULE, async () => {
  log('⏰ 触发定时任务');
  try {
    await autoCommit();
  } catch (error) {
    console.error(`${colors.red}[ERROR]${colors.reset} 任务执行失败:`, error);
  }
}, {
  scheduled: true,
  timezone: process.env.TZ || 'Asia/Shanghai'
});

log(`✅ 定时任务运行中... (按 Ctrl+C 停止)`);

// 优雅退出
process.on('SIGINT', () => {
  log('');
  log('⏹️  收到退出信号，停止定时任务...');
  task.stop();
  log('👋 定时任务已停止');
  process.exit(0);
});

// 保持进程运行
process.stdin.resume();

