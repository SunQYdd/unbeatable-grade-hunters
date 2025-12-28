"use client"

import { X, Shield, TrendingUp, Zap, Brain, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AICapabilityModalProps {
  isOpen: boolean
  onClose: () => void
  capability: "violation" | "trend" | "classification" | "semantic" | null
}

const capabilityData = {
  violation: {
    title: "违规检测",
    icon: Shield,
    color: "text-primary-blue",
    bgColor: "bg-blue-100",
    description: "基于深度学习的违规内容自动识别系统",
    features: [
      { name: "敏感词检测", accuracy: 98.5, status: "active" },
      { name: "图片违规识别", accuracy: 95.2, status: "active" },
      { name: "链接安全检测", accuracy: 97.8, status: "active" },
      { name: "用户行为分析", accuracy: 89.3, status: "active" },
    ],
    recentDetections: [
      { content: "加微信领红包...", type: "诈骗广告", confidence: 98.2, result: "rejected" },
      { content: "代写作业联系...", type: "违规服务", confidence: 94.5, result: "rejected" },
      { content: "出售游戏账号...", type: "潜在风险", confidence: 72.3, result: "pending" },
    ],
    stats: {
      todayDetected: 12,
      totalBlocked: 1523,
      falsePositiveRate: 2.1,
    },
  },
  trend: {
    title: "趋势分析",
    icon: TrendingUp,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    description: "实时监控内容趋势，预测潜在风险",
    features: [
      { name: "热点话题追踪", accuracy: 92.1, status: "active" },
      { name: "异常流量检测", accuracy: 88.7, status: "active" },
      { name: "风险预警系统", accuracy: 91.5, status: "active" },
      { name: "季节性分析", accuracy: 85.2, status: "active" },
    ],
    trendData: [
      { period: "本周", change: "+15%", trend: "up", category: "二手交易" },
      { period: "本周", change: "-8%", trend: "down", category: "广告违规" },
      { period: "本周", change: "+23%", trend: "up", category: "学习资料" },
      { period: "本周", change: "+5%", trend: "up", category: "拼车出行" },
    ],
    predictions: [
      { event: "期末考试周", prediction: "学习资料需求将上升50%", probability: 89 },
      { event: "双十一后", prediction: "二手交易帖子增加30%", probability: 78 },
      { event: "节假日", prediction: "娱乐交友帖子增加25%", probability: 82 },
    ],
  },
  classification: {
    title: "智能分类",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "自动识别内容类型并进行精准分类",
    features: [
      { name: "文本分类", accuracy: 96.3, status: "active" },
      { name: "意图识别", accuracy: 93.8, status: "active" },
      { name: "多标签分类", accuracy: 91.2, status: "active" },
      { name: "情感分析", accuracy: 88.9, status: "active" },
    ],
    categories: [
      { name: "学习资料", count: 156, percentage: 25 },
      { name: "二手交易", count: 187, percentage: 30 },
      { name: "拼车出行", count: 93, percentage: 15 },
      { name: "交友娱乐", count: 62, percentage: 10 },
      { name: "招聘兼职", count: 75, percentage: 12 },
      { name: "其他", count: 50, percentage: 8 },
    ],
    recentClassifications: [
      { content: "求购二手笔记本", category: "二手交易", confidence: 97.2 },
      { content: "明天拼车去机场", category: "拼车出行", confidence: 95.8 },
      { content: "线性代数笔记分享", category: "学习资料", confidence: 98.1 },
    ],
  },
  semantic: {
    title: "语义理解",
    icon: Brain,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "深度语义分析，理解内容真实含义",
    features: [
      { name: "上下文理解", accuracy: 91.5, status: "active" },
      { name: "隐晦表达识别", accuracy: 87.3, status: "active" },
      { name: "谐音变体检测", accuracy: 89.8, status: "active" },
      { name: "多语言支持", accuracy: 85.6, status: "active" },
    ],
    examples: [
      {
        original: "加v领取福利",
        interpretation: "引导添加微信，可能为广告或诈骗",
        risk: "high",
      },
      {
        original: "dd我私发",
        interpretation: "私下交流，可能规避平台规则",
        risk: "medium",
      },
      {
        original: "有没有老哥带带",
        interpretation: "寻求帮助或组队，正常交流",
        risk: "low",
      },
    ],
    capabilities: ["识别网络用语和缩写", "理解表情符号含义", "检测变体和谐音词", "分析上下文语境", "多轮对话理解"],
  },
}

export function AICapabilityModal({ isOpen, onClose, capability }: AICapabilityModalProps) {
  if (!isOpen || !capability) return null

  const data = capabilityData[capability]
  const Icon = data.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${data.bgColor} rounded-xl flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${data.color}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{data.title}</h2>
              <p className="text-sm text-gray-500">{data.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
          {/* Feature Accuracy */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">功能准确率</h3>
            <div className="grid grid-cols-2 gap-3">
              {data.features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{feature.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          feature.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {feature.status === "active" ? "运行中" : "维护中"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={feature.accuracy} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-gray-900">{feature.accuracy}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Capability-specific content */}
          {capability === "violation" && (
            <>
              <section>
                <h3 className="font-medium text-gray-900 mb-3">今日检测统计</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-red-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">{data.stats.todayDetected}</p>
                      <p className="text-sm text-gray-600">今日检测</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary-blue">{data.stats.totalBlocked}</p>
                      <p className="text-sm text-gray-600">累计拦截</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{data.stats.falsePositiveRate}%</p>
                      <p className="text-sm text-gray-600">误报率</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-3">最近检测记录</h3>
                <div className="space-y-2">
                  {data.recentDetections.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        item.result === "rejected" ? "bg-red-50" : "bg-amber-50"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.content}</p>
                        <p className="text-sm text-gray-500">类型: {item.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.confidence}%</span>
                        {item.result === "rejected" ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {capability === "trend" && (
            <>
              <section>
                <h3 className="font-medium text-gray-900 mb-3">本周趋势变化</h3>
                <div className="grid grid-cols-2 gap-3">
                  {data.trendData.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.category}</span>
                        <span
                          className={`text-sm font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.change}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-3">趋势预测</h3>
                <div className="space-y-2">
                  {data.predictions.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{item.event}</span>
                          <span className="text-sm text-primary-blue">{item.probability}% 概率</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.prediction}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          )}

          {capability === "classification" && (
            <>
              <section>
                <h3 className="font-medium text-gray-900 mb-3">分类分布</h3>
                <div className="space-y-3">
                  {data.categories.map((cat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20">{cat.name}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-blue rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${cat.percentage}%` }}
                        >
                          <span className="text-xs text-white font-medium">{cat.count}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-3">最近分类</h3>
                <div className="space-y-2">
                  {data.recentClassifications.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.content}</p>
                        <p className="text-sm text-gray-500">分类: {item.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {capability === "semantic" && (
            <>
              <section>
                <h3 className="font-medium text-gray-900 mb-3">语义解析示例</h3>
                <div className="space-y-3">
                  {data.examples.map((item, index) => (
                    <Card
                      key={index}
                      className={
                        item.risk === "high"
                          ? "border-red-200 bg-red-50"
                          : item.risk === "medium"
                            ? "border-amber-200 bg-amber-50"
                            : "border-green-200 bg-green-50"
                      }
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">"{item.original}"</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              item.risk === "high"
                                ? "bg-red-200 text-red-700"
                                : item.risk === "medium"
                                  ? "bg-amber-200 text-amber-700"
                                  : "bg-green-200 text-green-700"
                            }`}
                          >
                            {item.risk === "high" ? "高风险" : item.risk === "medium" ? "中风险" : "低风险"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{item.interpretation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-3">核心能力</h3>
                <div className="flex flex-wrap gap-2">
                  {data.capabilities.map((cap, index) => (
                    <span key={index} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {cap}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
