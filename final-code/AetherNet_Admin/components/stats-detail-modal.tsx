"use client"

import { X, FileText, AlertTriangle, Bot, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dailyStats, reviewRecords } from "@/lib/mock-data"

interface StatsDetailModalProps {
  isOpen: boolean
  onClose: () => void
  type: "review" | "violation" | "ai" | null
}

export function StatsDetailModal({ isOpen, onClose, type }: StatsDetailModalProps) {
  if (!isOpen || !type) return null

  const todayStats = dailyStats[0]
  const yesterdayStats = dailyStats[1]

  const config = {
    review: {
      title: "审核量详情",
      icon: FileText,
      color: "text-primary-blue",
      bgColor: "bg-blue-100",
      value: todayStats.totalReviewed,
      yesterdayValue: yesterdayStats.totalReviewed,
    },
    violation: {
      title: "违规量详情",
      icon: AlertTriangle,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      value: todayStats.violations,
      yesterdayValue: yesterdayStats.violations,
    },
    ai: {
      title: "AI判断量详情",
      icon: Bot,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      value: todayStats.aiJudged,
      yesterdayValue: yesterdayStats.aiJudged,
    },
  }

  const data = config[type]
  const Icon = data.icon
  const change = (((data.value - data.yesterdayValue) / data.yesterdayValue) * 100).toFixed(1)
  const isIncrease = data.value >= data.yesterdayValue

  // Get relevant records based on type
  const getRelevantRecords = () => {
    if (type === "review") {
      return reviewRecords.slice(0, 6)
    } else if (type === "violation") {
      return reviewRecords.filter((r) => r.status === "rejected").slice(0, 6)
    } else {
      return reviewRecords.filter((r) => r.aiAssisted).slice(0, 6)
    }
  }

  const records = getRelevantRecords()

  // Get hourly distribution data
  const hourlyData = [
    { hour: "08:00", count: type === "review" ? 8 : type === "violation" ? 1 : 6 },
    { hour: "09:00", count: type === "review" ? 12 : type === "violation" ? 2 : 9 },
    { hour: "10:00", count: type === "review" ? 15 : type === "violation" ? 1 : 11 },
    { hour: "11:00", count: type === "review" ? 10 : type === "violation" ? 2 : 7 },
    { hour: "12:00", count: type === "review" ? 6 : type === "violation" ? 0 : 4 },
    { hour: "13:00", count: type === "review" ? 8 : type === "violation" ? 1 : 6 },
    { hour: "14:00", count: type === "review" ? 14 : type === "violation" ? 2 : 10 },
    { hour: "15:00", count: type === "review" ? 11 : type === "violation" ? 1 : 8 },
    { hour: "16:00", count: type === "review" ? 9 : type === "violation" ? 2 : 6 },
    { hour: "17:00", count: type === "review" ? 7 : type === "violation" ? 0 : 3 },
  ]
  const maxCount = Math.max(...hourlyData.map((d) => d.count))

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
            <h2 className="text-lg font-semibold text-gray-900">{data.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className={data.bgColor}>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${data.color}`}>{data.value}</p>
                <p className="text-sm text-gray-600">今日</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-gray-700">{data.yesterdayValue}</p>
                <p className="text-sm text-gray-600">昨日</p>
              </CardContent>
            </Card>
            <Card className={isIncrease ? "bg-green-50" : "bg-red-50"}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  {isIncrease ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <p className={`text-2xl font-bold ${isIncrease ? "text-green-600" : "text-red-600"}`}>
                    {isIncrease ? "+" : ""}
                    {change}%
                  </p>
                </div>
                <p className="text-sm text-gray-600">环比</p>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Distribution Chart */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">今日时段分布</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-end justify-between h-32 gap-1">
                  {hourlyData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t ${data.bgColor}`}
                        style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: item.count > 0 ? "8px" : "0" }}
                      />
                      <span className="text-xs text-gray-500 transform -rotate-45 origin-center">{item.hour}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Category Breakdown (for violations) */}
          {type === "violation" && (
            <section>
              <h3 className="font-medium text-gray-900 mb-3">违规类型分布</h3>
              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold text-primary-blue">{todayStats.categories.ad}</p>
                    <p className="text-sm text-gray-600">广告推广</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold text-cyan-600">{todayStats.categories.spam}</p>
                    <p className="text-sm text-gray-600">水贴灌水</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">{todayStats.categories.violation}</p>
                    <p className="text-sm text-gray-600">违规内容</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* AI Stats (for AI type) */}
          {type === "ai" && (
            <section>
              <h3 className="font-medium text-gray-900 mb-3">AI审核效率</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-2xl font-bold text-primary-blue">93.27%</p>
                    <p className="text-sm text-gray-600">决策准确率</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-2xl font-bold text-green-600">0.3s</p>
                    <p className="text-sm text-gray-600">平均响应时间</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-2xl font-bold text-cyan-600">70%</p>
                    <p className="text-sm text-gray-600">自动处理率</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-2xl font-bold text-amber-600">30%</p>
                    <p className="text-sm text-gray-600">人工复核率</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Recent Records */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">
              {type === "review" ? "最近审核" : type === "violation" ? "最近违规" : "AI处理记录"}
            </h3>
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className={`p-3 rounded-xl flex items-center justify-between ${
                    record.status === "approved" ? "bg-blue-50" : "bg-red-50"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{record.title}</p>
                    <p className="text-sm text-gray-500">{record.reviewedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.aiAssisted && (
                      <span className="text-xs px-2 py-0.5 bg-cyan-100 text-cyan-600 rounded-full">AI</span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        record.status === "approved" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {record.status === "approved" ? "通过" : "拒绝"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
