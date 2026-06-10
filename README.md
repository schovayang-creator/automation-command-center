# Yang 自动化总控台站点

这是一个上层聚合站点，用来统一展示每天所有自动化工作报告。

## 核心结构

```text
index.html                      总首页：游戏化仪表盘 + 今日报告源
calendar.html                   日历页：按日期查看每日自动化内容
days/YYYY-MM-DD/index.html      当天主页：当天所有自动化报告聚合
reports/YYYY-MM-DD/             当天具体报告文件
data/hub.json                   当前原型数据源
assets/styles.css               共享样式
assets/app.js                   共享渲染逻辑
```

## 现有自动化源

- 总经理每日自动日报：已有 GitHub Pages 仓库 `gm-daily-brief`
- AI 趋势雷达日报：已有内容母稿，待建立每日发布 cron
- Linux 工作日报链路：已有测试 HTML
- 双创比赛检索：已有日报输出目录
- 健身运动追踪：已有 CSV 和训练计划

## 未来发布协议

每个 cron 每天完成后应做三件事：

1. 生成自己的报告 HTML。
2. 拷贝到 `days/YYYY-MM-DD/reports/<automation-id>.html` 或 `reports/YYYY-MM-DD/<automation-id>.html`。
3. 更新 `data/hub.json` 或未来的 `data/days/YYYY-MM-DD.json`。

总控台统一负责：

- 生成总首页索引
- 生成日历
- 生成当天主页
- 提交并推送 GitHub Pages
- 发送 OpenClaw 微信短报

## 推荐 GitHub 仓库

建议新建独立仓库：

```text
automation-command-center
```

不要混入现有 `gm-daily-brief` 仓库。现有 GM 仓库继续只做总经理日报，新的总控台作为上层入口链接它。
