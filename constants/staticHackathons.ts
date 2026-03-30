export interface StaticHackathonLink {
  href: string;
  label: string;
  note: string;
}

export interface StaticHackathonAgendaItem {
  endedAt: string;
  name: string;
  startedAt: string;
  summary: string;
  type: 'break' | 'competition' | 'enrollment' | 'evaluation' | 'formation';
}

export interface StaticHackathonPrize {
  name: string;
  quota: string;
  summary: string;
}

export interface StaticHackathonFAQ {
  answer: string;
  question: string;
}

export interface StaticHackathonProfile {
  agenda: StaticHackathonAgendaItem[];
  awards: StaticHackathonPrize[];
  entryLinks: StaticHackathonLink[];
  faq: StaticHackathonFAQ[];
  id: string;
  location: string;
  name: string;
  notes: string[];
  summary: string;
  theme: string;
  timeline: string;
}

export const staticHackathons: Record<string, StaticHackathonProfile> = {
  'niuma-hackathon-2026': {
    id: 'niuma-hackathon-2026',
    name: '2026 五一牛马 AI 黑客松',
    summary:
      '劳动节，用 AI 把自己从重复劳动中解放出来。报名一个月拉满人，组队只给 7 天做决策，比赛压缩为 3 天核心冲刺，再用 Demo Day 做集中展示。',
    theme: 'AI 解放牛马',
    location: '线上 + 线下同步',
    timeline: '2026-03-25 00:00 - 2026-05-06 晚上（UTC+8）',
    entryLinks: [
      {
        label: '队员注册',
        href: 'https://open-source-bazaar.feishu.cn/share/base/shrcnZAJd1yhqHYRmQXmAwlXjkc',
        note: '所有参赛者先完成报名，进入组队池与官方群。',
      },
      {
        label: '项目注册',
        href: 'https://open-source-bazaar.feishu.cn/share/base/shrcnKsgpHpBXcwh4W6GDg2G7Nc',
        note: '组队阶段由队长登记项目、成员、赛道和一句话介绍。',
      },
      {
        label: '代码库创建',
        href: 'https://open-source-bazaar.feishu.cn/share/base/shrcnc1mbGsxMm8mS69au3B7uzf',
        note: '需要官方统一协助建库时使用，不是所有队伍都必须填写。',
      },
      {
        label: '产品提交',
        href: 'https://open-source-bazaar.feishu.cn/share/base/shrcnkrO7EMQlXYR1I41w26Ioyf',
        note: '比赛截止前由队长或指定提交人统一提交最终作品。',
      },
      {
        label: '活动官网',
        href: 'https://hack.digitalvio.shop/',
        note: '查看当前活动主页、时间线和最新说明。',
      },
    ],
    agenda: [
      {
        name: '报名阶段',
        summary: '所有队员完成注册，开始找人、找方向、进入官方群。',
        startedAt: '2026-03-25 00:00',
        endedAt: '2026-04-20 23:59',
        type: 'enrollment',
      },
      {
        name: '组队 / 项目注册',
        summary: '队长完成项目注册，锁定队伍、赛道和项目介绍。',
        startedAt: '2026-04-21 00:00',
        endedAt: '2026-04-28 23:59',
        type: 'formation',
      },
      {
        name: '比赛冲刺',
        summary: '3 天核心开发冲刺，围绕 AI Agents、开发者工具、创意娱乐与社会影响展开。',
        startedAt: '2026-05-01 10:00',
        endedAt: '2026-05-03 20:00',
        type: 'competition',
      },
      {
        name: '评审阶段',
        summary: '评委完成打分与复核，筛出进入 Demo Day 的队伍。',
        startedAt: '2026-05-03 20:00',
        endedAt: '2026-05-05 18:00',
        type: 'evaluation',
      },
      {
        name: 'Demo Day',
        summary: '集中展示项目成果，并公布最终结果。',
        startedAt: '2026-05-06 晚上',
        endedAt: '2026-05-06 晚上',
        type: 'break',
      },
    ],
    awards: [
      {
        name: '一等奖',
        quota: '1 队',
        summary: '首页展示 + 资源连接 + 一等奖数字徽章',
      },
      {
        name: '二等奖',
        quota: '2 队',
        summary: '社区展示 + 官方收录 + 二等奖数字徽章',
      },
      {
        name: '三等奖',
        quota: '3 队',
        summary: '荣誉名单 + 项目合集收录 + 三等奖数字徽章',
      },
      {
        name: '最佳创意奖',
        quota: '1 队',
        summary: '专题推荐 + 最佳创意数字徽章',
      },
      {
        name: '最佳牛马精神奖',
        quota: '1 队',
        summary: '社区荣誉 + 最佳牛马精神数字徽章',
      },
      {
        name: 'Demo Day 入选',
        quota: '若干',
        summary: 'Demo Day 展示资格 + 入选数字徽章',
      },
    ],
    notes: [
      '每队 1-4 人，支持跨城市、跨公司组队。',
      '作品需在本次黑客松期间完成核心创作，并包含 AI 核心能力或 AI 驱动体验。',
      '最终提交建议包含 GitHub 仓库链接、Demo 视频、产品说明和 AI 技术栈说明。',
      '奖项以数字徽章 + 展示 / 资源连接为主，不承诺实体奖章或现金奖励。',
    ],
    faq: [
      {
        question: '可以一个人参赛吗？',
        answer: '可以，单人队伍有效参赛，也可以在官方群里继续找队友。',
      },
      {
        question: '活动鼓励哪些方向？',
        answer: '鼓励 AI Agents、开发者工具、创意娱乐、社会影响等方向，也支持自由赛道。',
      },
      {
        question: '什么时候截止报名？',
        answer: '报名截止时间是 2026-04-20 23:59（UTC+8）。',
      },
      {
        question: '什么时候开始比赛？',
        answer: '比赛将在 2026-05-01 10:00（UTC+8）正式开始。',
      },
    ],
  },
};

export const getStaticHackathonProfile = (id: string) => staticHackathons[id];
