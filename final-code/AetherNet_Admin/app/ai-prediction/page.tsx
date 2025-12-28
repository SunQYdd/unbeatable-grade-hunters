"use client"

import { useState } from "react"
import { Brain, TrendingUp, Shield, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AICapabilityModal } from "@/components/ai-capability-modal"
import { PredictionDetailModal } from "@/components/prediction-detail-modal"
import { PageLayout } from "@/components/page-layout"

export default function AIPredictionPage() {
  const [selectedCapability, setSelectedCapability] = useState<
    "violation" | "trend" | "classification" | "semantic" | null
  >(null)
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null)

  const predictionItems = [
    { id: "1", title: "求电子书", result: "通过", confidence: 98.5, bgColor: "bg-gray-50" },
    { id: "8", title: "水贴", result: "违规", confidence: 95.2, bgColor: "bg-red-50" },
    { id: "7", title: "能不能打广告", result: "待定", confidence: 67.8, bgColor: "bg-amber-50" },
  ]

  return (
    <PageLayout title="AI决策预测">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* AI Overview Card */}
        <Card className="bg-gradient-to-br from-primary-blue to-cyan-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">智能审核助手</h2>
                <p className="text-white/80 text-sm">AI驱动的内容审核决策</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">93.27%</p>
                <p className="text-white/70 text-xs">准确率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">70</p>
                <p className="text-white/70 text-xs">今日AI判断</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">0.3s</p>
                <p className="text-white/70 text-xs">平均响应</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI能力</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCapability("violation")}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">违规检测</h3>
                  <p className="text-xs text-gray-500 mt-1">自动识别违规内容</p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCapability("trend")}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">趋势分析</h3>
                  <p className="text-xs text-gray-500 mt-1">预测风险趋势</p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCapability("classification")}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">智能分类</h3>
                  <p className="text-xs text-gray-500 mt-1">自动内容分类</p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCapability("semantic")}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">语义理解</h3>
                  <p className="text-xs text-gray-500 mt-1">深度语义分析</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Predictions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近预测</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              {predictionItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 ${item.bgColor} rounded-xl cursor-pointer hover:shadow-md transition-all`}
                  onClick={() => setSelectedPredictionId(item.id)}
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">预测结果：{item.result}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        item.result === "通过"
                          ? "text-primary-blue"
                          : item.result === "违规"
                            ? "text-red-500"
                            : "text-amber-500"
                      }`}
                    >
                      {item.confidence}%
                    </p>
                    <p className="text-xs text-gray-400">置信度</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Model Performance */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">模型性能</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">准确率</span>
                  <span className="text-sm font-medium text-gray-900">93.27%</span>
                </div>
                <Progress value={93.27} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">召回率</span>
                  <span className="text-sm font-medium text-gray-900">89.5%</span>
                </div>
                <Progress value={89.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">F1分数</span>
                  <span className="text-sm font-medium text-gray-900">91.3%</span>
                </div>
                <Progress value={91.3} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Modals */}
      <AICapabilityModal
        isOpen={selectedCapability !== null}
        onClose={() => setSelectedCapability(null)}
        capability={selectedCapability}
      />

      <PredictionDetailModal
        isOpen={selectedPredictionId !== null}
        onClose={() => setSelectedPredictionId(null)}
        itemId={selectedPredictionId}
      />
    </PageLayout>
  )
}
