"use client"

import { useState } from "react"
import { ChevronRight, Check, X, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { reviewRecords } from "@/lib/mock-data"
import { HistoryModal } from "@/components/history-modal"
import { AIHelpModal } from "@/components/ai-help-modal"
import { StatsDetailModal } from "@/components/stats-detail-modal"
import { PredictionDetailModal } from "@/components/prediction-detail-modal"
import { PageLayout } from "@/components/page-layout"

export default function HistoryPage() {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isAIHelpModalOpen, setIsAIHelpModalOpen] = useState(false)
  const [statsModalType, setStatsModalType] = useState<"review" | "violation" | "ai" | null>(null)
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null)

  const todayRecords = reviewRecords.slice(0, 2)

  const handleStatsClick = (type: "review" | "violation" | "ai") => {
    setStatsModalType(type)
  }

  const handleRecordClick = (contentId: string) => {
    setSelectedPredictionId(contentId)
  }

  return (
    <PageLayout title="历史审核记录">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* History Report Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">历史审核报告</h2>
          <p className="text-sm text-gray-500 mb-4">这里可以查看您历史审核与审核报告</p>

          <Link href="/report">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">查看审核报告</h3>
                    <p className="text-sm text-gray-500">了解更多信息</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Today's Review Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">今日审核情况</h2>
          <p className="text-sm text-gray-500 mb-4">这里可以查看您今日审核</p>

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Today Status Header */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-blue rounded-full" />
                <span className="font-medium text-gray-900">今日情况</span>
              </div>

              {/* Stats */}
              <div className="flex gap-2">
                <Badge
                  className="bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 rounded-full px-4 py-1 cursor-pointer transition-colors"
                  onClick={() => handleStatsClick("review")}
                >
                  审核量 100
                </Badge>
                <Badge
                  className="bg-cyan-100 text-cyan-600 hover:bg-cyan-200 rounded-full px-4 py-1 cursor-pointer transition-colors"
                  onClick={() => handleStatsClick("violation")}
                >
                  违规量 12
                </Badge>
                <Badge
                  className="bg-cyan-50 text-cyan-500 hover:bg-cyan-100 rounded-full px-4 py-1 cursor-pointer transition-colors"
                  onClick={() => handleStatsClick("ai")}
                >
                  AI判断量 70
                </Badge>
              </div>

              {/* Reviewed Items */}
              <div className="space-y-2">
                {todayRecords.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl flex items-center justify-between cursor-pointer hover:shadow-md transition-all ${
                      item.status === "approved" ? "bg-blue-50 hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => handleRecordClick(item.id)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    {item.status === "approved" ? (
                      <Check className="h-5 w-5 text-primary-blue" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* View More Link */}
              <button
                className="flex items-center gap-1 text-primary-blue text-sm font-medium hover:underline"
                onClick={() => setIsHistoryModalOpen(true)}
              >
                <span className="text-lg">+</span>
                <span>查看更多历史审核</span>
              </button>

              {/* AI Accuracy Info */}
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-primary-blue" />
                <span className="text-gray-600">
                  当前AI决策准确率为
                  <span className="text-primary-blue font-medium">93.27%</span>
                  ，如有疑问
                  <button
                    className="text-primary-blue font-medium hover:underline"
                    onClick={() => setIsAIHelpModalOpen(true)}
                  >
                    点击这里
                  </button>
                </span>
              </div>

              {/* Analysis Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${showAnalysis ? "border-primary-blue bg-primary-blue" : "border-gray-300"} flex items-center justify-center cursor-pointer`}
                    onClick={() => setShowAnalysis(!showAnalysis)}
                  >
                    {showAnalysis && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700">当日审核违规类型分布与风险趋势分析</span>
                </div>
                <Switch checked={showAnalysis} onCheckedChange={setShowAnalysis} />
              </div>

              {/* Analysis Chart (shown when toggle is on) */}
              {showAnalysis && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-4">违规类型分布</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16">广告</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-blue rounded-full" style={{ width: "45%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10">45%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16">水贴</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: "30%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10">30%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16">违规</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: "25%" }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10">25%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* History Modal */}
      <HistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />

      {/* AI Help Modal */}
      <AIHelpModal isOpen={isAIHelpModalOpen} onClose={() => setIsAIHelpModalOpen(false)} />

      {/* Stats Detail Modal */}
      <StatsDetailModal
        isOpen={statsModalType !== null}
        onClose={() => setStatsModalType(null)}
        type={statsModalType}
      />

      {/* Prediction Detail Modal */}
      <PredictionDetailModal
        isOpen={selectedPredictionId !== null}
        onClose={() => setSelectedPredictionId(null)}
        itemId={selectedPredictionId}
      />
    </PageLayout>
  )
}
