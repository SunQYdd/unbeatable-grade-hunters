"use client"

import { FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reportData, dailyStats } from "@/lib/mock-data"
import { PageLayout } from "@/components/page-layout"

export default function ReportPage() {
  return (
    <PageLayout title="审核报告">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-primary-blue" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalReviewed}</p>
              <p className="text-sm text-gray-500">总审核量</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalViolations}</p>
              <p className="text-sm text-gray-500">违规内容</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.aiAccuracy}%</p>
              <p className="text-sm text-gray-500">AI准确率</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.avgResponseTime}s</p>
              <p className="text-sm text-gray-500">平均响应</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-blue" />
              本周审核趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.weeklyTrend.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-12">{day.day}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-primary-blue rounded-full"
                        style={{ width: `${(day.count / 120) * 100}%` }}
                      />
                      <div
                        className="absolute top-0 left-0 h-full bg-red-400 rounded-full"
                        style={{ width: `${(day.violations / 120) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-24">
                    <span className="text-sm font-medium text-gray-900">{day.count}</span>
                    <span className="text-xs text-gray-400"> / </span>
                    <span className="text-sm text-red-500">{day.violations}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-blue rounded-full" />
                <span className="text-xs text-gray-500">总审核量</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-xs text-gray-500">违规数量</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Violation Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              违规类型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.violationTypes.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{type.type}</span>
                    <span className="text-sm text-gray-500">
                      {type.count} 件 ({type.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        index === 0 ? "bg-red-400" : index === 1 ? "bg-amber-400" : "bg-orange-400"
                      }`}
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Stats Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-blue" />
              每日审核明细
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">日期</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">审核量</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">违规</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">AI判断</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">违规率</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((stat, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-900">{stat.date}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{stat.totalReviewed}</td>
                      <td className="py-3 px-2 text-right text-red-500">{stat.violations}</td>
                      <td className="py-3 px-2 text-right text-primary-blue">{stat.aiJudged}</td>
                      <td className="py-3 px-2 text-right text-gray-500">
                        {((stat.violations / stat.totalReviewed) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
