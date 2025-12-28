"use client"

import { X, CheckCircle, XCircle, AlertTriangle, Bot, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { contentItems } from "@/lib/mock-data"

interface PredictionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  itemId: string | null
}

export function PredictionDetailModal({ isOpen, onClose, itemId }: PredictionDetailModalProps) {
  if (!isOpen || !itemId) return null

  const item = contentItems.find((c) => c.id === itemId)
  if (!item) return null

  // Mock AI analysis data
  const analysisData = {
    overallScore: item.aiConfidence || 85,
    prediction: item.aiPrediction || "pass",
    analysisTime: "0.28s",
    modelVersion: "v2.3.1",
    factors: [
      { name: "文本安全性", score: item.aiPrediction === "reject" ? 25 : 95, weight: 30 },
      { name: "内容质量", score: item.aiPrediction === "reject" ? 35 : 88, weight: 25 },
      { name: "用户信誉", score: 92, weight: 20 },
      { name: "语义合规性", score: item.aiPrediction === "reject" ? 40 : 90, weight: 25 },
    ],
    keywords:
      item.aiPrediction === "reject" ? ["重复内容", "无意义", "灌水嫌疑"] : ["正常请求", "学习相关", "符合规范"],
    suggestions:
      item.aiPrediction === "reject"
        ? ["内容缺乏实质信息", "建议用户补充详细描述", "可能为水贴"]
        : ["内容符合社区规范", "可以直接通过", "无需人工复核"],
    similarCases: [
      { title: "类似帖子A", result: item.aiPrediction === "reject" ? "rejected" : "approved", confidence: 94 },
      { title: "类似帖子B", result: item.aiPrediction === "reject" ? "rejected" : "approved", confidence: 91 },
      { title: "类似帖子C", result: "approved", confidence: 88 },
    ],
  }

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case "pass":
        return "text-green-600"
      case "reject":
        return "text-red-600"
      default:
        return "text-amber-600"
    }
  }

  const getPredictionBg = (prediction: string) => {
    switch (prediction) {
      case "pass":
        return "bg-green-100"
      case "reject":
        return "bg-red-100"
      default:
        return "bg-amber-100"
    }
  }

  const getPredictionText = (prediction: string) => {
    switch (prediction) {
      case "pass":
        return "建议通过"
      case "reject":
        return "建议拒绝"
      default:
        return "需人工审核"
    }
  }

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case "pass":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "reject":
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <AlertTriangle className="h-6 w-6 text-amber-600" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI预测详情</h2>
              <p className="text-sm text-gray-500">{item.title}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
          {/* Prediction Result */}
          <Card className={getPredictionBg(analysisData.prediction)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getPredictionIcon(analysisData.prediction)}
                  <div>
                    <p className={`text-xl font-bold ${getPredictionColor(analysisData.prediction)}`}>
                      {getPredictionText(analysisData.prediction)}
                    </p>
                    <p className="text-sm text-gray-600">置信度: {analysisData.overallScore}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{analysisData.analysisTime}</span>
                  </div>
                  <p className="text-xs text-gray-400">模型 {analysisData.modelVersion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Preview */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">内容信息</h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">发布者: {item.author}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{item.category}</span>
                  <span className="text-xs text-gray-400">{item.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Analysis Factors */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">分析因素</h3>
            <div className="space-y-3">
              {analysisData.factors.map((factor, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{factor.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">权重 {factor.weight}%</span>
                      <span
                        className={`text-sm font-medium ${
                          factor.score >= 80 ? "text-green-600" : factor.score >= 60 ? "text-amber-600" : "text-red-600"
                        }`}
                      >
                        {factor.score}分
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={factor.score}
                    className={`h-2 ${
                      factor.score >= 80
                        ? "[&>div]:bg-green-500"
                        : factor.score >= 60
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-red-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Keywords */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">关键词标签</h3>
            <div className="flex flex-wrap gap-2">
              {analysisData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    analysisData.prediction === "reject" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          {/* AI Suggestions */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">AI建议</h3>
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {analysisData.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-2 ${
                          analysisData.prediction === "reject" ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Similar Cases */}
          <section>
            <h3 className="font-medium text-gray-900 mb-3">相似案例参考</h3>
            <div className="space-y-2">
              {analysisData.similarCases.map((caseItem, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <span className="text-sm text-gray-700">{caseItem.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{caseItem.confidence}%</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        caseItem.result === "approved" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {caseItem.result === "approved" ? "通过" : "拒绝"}
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
