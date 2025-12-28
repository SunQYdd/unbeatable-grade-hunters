// Mock data for the content moderation system

export interface ContentItem {
  id: string
  title: string
  description: string
  status: "pending" | "approved" | "rejected" | "warning"
  tag?: string
  createdAt: string
  author: string
  category: string
  aiConfidence?: number
  aiPrediction?: "pass" | "reject" | "pending"
}

export interface ReviewRecord {
  id: string
  contentId: string
  title: string
  description: string
  status: "approved" | "rejected"
  reviewedAt: string
  reviewer: string
  reason?: string
  aiAssisted: boolean
}

export interface DailyStats {
  date: string
  totalReviewed: number
  violations: number
  aiJudged: number
  categories: {
    ad: number
    spam: number
    violation: number
    normal: number
  }
}

// Content items for review
export const contentItems: ContentItem[] = [
  {
    id: "1",
    title: "求电子书",
    description: "需要线性代数电子书",
    status: "approved",
    createdAt: "2025-11-25 10:30",
    author: "张三",
    category: "学习资料",
    aiConfidence: 98.5,
    aiPrediction: "pass",
  },
  {
    id: "2",
    title: "二手电脑",
    description: "用了一年的二手电脑出二手，详说齐全，无暗病",
    status: "pending",
    tag: "微",
    createdAt: "2025-11-25 11:15",
    author: "李四",
    category: "二手交易",
    aiConfidence: 85.2,
    aiPrediction: "pass",
  },
  {
    id: "3",
    title: "大学城拼车到福州南站",
    description: "明天放学18点在三区门口拼车",
    status: "approved",
    createdAt: "2025-11-25 09:45",
    author: "王五",
    category: "拼车出行",
    aiConfidence: 92.1,
    aiPrediction: "pass",
  },
  {
    id: "4",
    title: "健身卡转售",
    description: "还有8个月",
    status: "pending",
    createdAt: "2025-11-25 12:00",
    author: "赵六",
    category: "二手交易",
    aiConfidence: 88.7,
    aiPrediction: "pass",
  },
  {
    id: "5",
    title: "出高等数学历年卷",
    description: "好价",
    status: "pending",
    createdAt: "2025-11-25 13:20",
    author: "钱七",
    category: "学习资料",
    aiConfidence: 94.3,
    aiPrediction: "pass",
  },
  {
    id: "6",
    title: "有没有打明日方舟的",
    description: "想认识朋友，一起去吃海底捞！",
    status: "pending",
    createdAt: "2025-11-25 14:10",
    author: "孙八",
    category: "交友娱乐",
    aiConfidence: 91.5,
    aiPrediction: "pass",
  },
  {
    id: "7",
    title: "能不能打广告",
    description: "我想问个平台能不能打广告，我想打广告",
    status: "pending",
    createdAt: "2025-11-25 15:30",
    author: "周九",
    category: "咨询",
    aiConfidence: 67.8,
    aiPrediction: "pending",
  },
  {
    id: "8",
    title: "水贴",
    description: "十五字十五字十五字十五字十五字",
    status: "warning",
    createdAt: "2025-11-25 16:00",
    author: "吴十",
    category: "其他",
    aiConfidence: 95.2,
    aiPrediction: "reject",
  },
  {
    id: "9",
    title: "代写作业",
    description: "专业代写各类作业，价格优惠",
    status: "pending",
    createdAt: "2025-11-25 16:30",
    author: "郑某",
    category: "其他",
    aiConfidence: 12.3,
    aiPrediction: "reject",
  },
  {
    id: "10",
    title: "校园跑腿",
    description: "提供校园内跑腿服务，取快递、送餐等",
    status: "pending",
    createdAt: "2025-11-25 17:00",
    author: "冯某",
    category: "服务",
    aiConfidence: 89.1,
    aiPrediction: "pass",
  },
  {
    id: "11",
    title: "求租电动车",
    description: "想租一辆电动车，一个月左右",
    status: "pending",
    createdAt: "2025-11-25 17:30",
    author: "陈某",
    category: "租赁",
    aiConfidence: 93.8,
    aiPrediction: "pass",
  },
  {
    id: "12",
    title: "兼职招聘",
    description: "招聘校园兼职，日结200起",
    status: "pending",
    createdAt: "2025-11-25 18:00",
    author: "某公司",
    category: "招聘",
    aiConfidence: 45.6,
    aiPrediction: "pending",
  },
]

// Historical review records
export const reviewRecords: ReviewRecord[] = [
  {
    id: "r1",
    contentId: "1",
    title: "求电子书",
    description: "需要线性代数电子书",
    status: "approved",
    reviewedAt: "2025-11-25 10:35",
    reviewer: "审核员A",
    aiAssisted: true,
  },
  {
    id: "r2",
    contentId: "8",
    title: "水贴",
    description: "十五字十五字十五字十五字十五字",
    status: "rejected",
    reviewedAt: "2025-11-25 16:05",
    reviewer: "审核员A",
    reason: "内容无意义",
    aiAssisted: true,
  },
  {
    id: "r3",
    contentId: "3",
    title: "大学城拼车到福州南站",
    description: "明天放学18点在三区门口拼车",
    status: "approved",
    reviewedAt: "2025-11-25 09:50",
    reviewer: "审核员B",
    aiAssisted: false,
  },
  {
    id: "r4",
    contentId: "101",
    title: "出售iPhone 15",
    description: "国行256G，9成新",
    status: "approved",
    reviewedAt: "2025-11-24 14:20",
    reviewer: "审核员A",
    aiAssisted: true,
  },
  {
    id: "r5",
    contentId: "102",
    title: "广告推广",
    description: "加微信领红包...",
    status: "rejected",
    reviewedAt: "2025-11-24 15:30",
    reviewer: "审核员C",
    reason: "疑似诈骗广告",
    aiAssisted: true,
  },
  {
    id: "r6",
    contentId: "103",
    title: "考研资料分享",
    description: "2026考研数学资料",
    status: "approved",
    reviewedAt: "2025-11-24 16:00",
    reviewer: "审核员B",
    aiAssisted: true,
  },
  {
    id: "r7",
    contentId: "104",
    title: "出租单车",
    description: "闲置自行车出租",
    status: "approved",
    reviewedAt: "2025-11-24 17:00",
    reviewer: "审核员A",
    aiAssisted: false,
  },
  {
    id: "r8",
    contentId: "105",
    title: "违规内容",
    description: "不当言论...",
    status: "rejected",
    reviewedAt: "2025-11-23 10:00",
    reviewer: "审核员C",
    reason: "违反社区规定",
    aiAssisted: true,
  },
  {
    id: "r9",
    contentId: "106",
    title: "二手教材",
    description: "大一教材低价转",
    status: "approved",
    reviewedAt: "2025-11-23 11:30",
    reviewer: "审核员B",
    aiAssisted: true,
  },
  {
    id: "r10",
    contentId: "107",
    title: "求购笔记本",
    description: "求一台游戏本",
    status: "approved",
    reviewedAt: "2025-11-23 14:00",
    reviewer: "审核员A",
    aiAssisted: true,
  },
]

// Daily statistics
export const dailyStats: DailyStats[] = [
  {
    date: "2025-11-25",
    totalReviewed: 100,
    violations: 12,
    aiJudged: 70,
    categories: { ad: 5, spam: 4, violation: 3, normal: 88 },
  },
  {
    date: "2025-11-24",
    totalReviewed: 95,
    violations: 8,
    aiJudged: 65,
    categories: { ad: 3, spam: 3, violation: 2, normal: 87 },
  },
  {
    date: "2025-11-23",
    totalReviewed: 110,
    violations: 15,
    aiJudged: 78,
    categories: { ad: 7, spam: 5, violation: 3, normal: 95 },
  },
  {
    date: "2025-11-22",
    totalReviewed: 88,
    violations: 6,
    aiJudged: 60,
    categories: { ad: 2, spam: 2, violation: 2, normal: 82 },
  },
  {
    date: "2025-11-21",
    totalReviewed: 102,
    violations: 10,
    aiJudged: 72,
    categories: { ad: 4, spam: 4, violation: 2, normal: 92 },
  },
]

// Report data
export const reportData = {
  summary: {
    totalReviewed: 495,
    totalViolations: 51,
    aiAccuracy: 93.27,
    avgResponseTime: 0.3,
    humanReviewRate: 30,
  },
  weeklyTrend: [
    { day: "周一", count: 102, violations: 10 },
    { day: "周二", count: 88, violations: 6 },
    { day: "周三", count: 110, violations: 15 },
    { day: "周四", count: 95, violations: 8 },
    { day: "周五", count: 100, violations: 12 },
  ],
  violationTypes: [
    { type: "广告推广", count: 21, percentage: 41 },
    { type: "水贴灌水", count: 18, percentage: 35 },
    { type: "违规内容", count: 12, percentage: 24 },
  ],
}


// 新增：敏感词管理模块数据
// ==========================================

export interface SensitiveWord {
  id: string;
  word: string;
  category: 'event' | 'person' | 'abuse' | 'ad' | 'porn' | 'other';
  createdAt: string;
}

// 初始的敏感词假数据
export const initialSensitiveWords: SensitiveWord[] = [
  {
    id: "1",
    word: "代开假条",
    category: "other",
    createdAt: "2025-11-20 10:00",
  },
  {
    id: "2",
    word: "加威信看片",
    category: "porn",
    createdAt: "2025-11-21 15:30",
  },
  {
    id: "3",
    word: "刷单兼职",
    category: "ad",
    createdAt: "2025-11-22 09:20",
  },
  {
    id: "4",
    word: "傻X",
    category: "abuse",
    createdAt: "2025-11-23 11:45",
  },
  {
    id: "5",
    word: "国家领导人",
    category: "person",
    createdAt: "2025-11-24 14:10",
  },
  {
    id: "6",
    word: "游行示威",
    category: "event",
    createdAt: "2025-11-25 08:00",
  },
];