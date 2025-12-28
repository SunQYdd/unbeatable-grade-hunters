"use client"

import { X, Check, AlertTriangle, Clock, User, Tag, Calendar, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import type { ContentItem } from "@/lib/mock-data"

interface ContentDetailModalProps {
  item: ContentItem | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string, riskLevel: "low" | "medium" | "high") => void
  onReject: (id: string, reason: string, riskLevel: "low" | "medium" | "high") => void
}

export function ContentDetailModal({ item, isOpen, onClose, onApprove, onReject }: ContentDetailModalProps) {
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low")
  const [moderationRemark, setModerationRemark] = useState("")

  // 当模态框关闭时，重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setRejectReason("")
      setShowRejectInput(false)
      setRiskLevel("low")
      setModerationRemark("")
    }
  }, [isOpen])

  if (!isOpen || !item) return null

  const handleApprove = () => {
    // 在实际应用中，这里应该调用API进行审核操作
    onApprove(item.id, riskLevel)
  }

  const handleReject = () => {
    // 直接调用onReject回调，传递默认拒绝原因和风险等级
    const reason = `审核拒绝${moderationRemark ? ' | 备注: ' + moderationRemark : ''}`;
    onReject(item.id, reason, riskLevel);
  }

  const getAiPredictionColor = (prediction?: string) => {
    switch (prediction) {
      case "pass":
        return "bg-green-100 text-green-600"
      case "reject":
        return "bg-red-100 text-red-600"
      default:
        return "bg-amber-100 text-amber-600"
    }
  }

  const getAiPredictionText = (prediction?: string) => {
    switch (prediction) {
      case "pass":
        return "通过"
      case "reject":
        return "拒绝"
      default:
        return "待定"
    }
  }

  // 重写onClose函数以确保状态被重置
  const handleClose = () => {
    // 调用原始的onClose函数
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">内容详情</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              {item.tag && (
                <Badge variant="outline" className="text-xs border-green-500 text-green-500 rounded-full">
                  {item.tag}
                </Badge>
              )}
              {item.status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
            </div>
            <p className="text-gray-600">{item.description}</p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>发布者: {item.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{item.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>分类: {item.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                状态:{" "}
                {item.status === "pending"
                  ? "待审核"
                  : item.status === "approved"
                    ? "已通过"
                    : item.status === "rejected"
                      ? "已拒绝"
                      : "需关注"}
              </span>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary-blue" />
              <span className="font-medium text-gray-900">AI 分析结果</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI预测结果</span>
              <Badge className={`${getAiPredictionColor(item.aiPrediction)} rounded-full`}>
                {getAiPredictionText(item.aiPrediction)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">置信度</span>
              <span className="font-medium text-primary-blue">{item.aiConfidence}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-blue rounded-full transition-all"
                style={{ width: `${item.aiConfidence}%` }}
              />
            </div>
          </div>

          {/* Risk Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">风险等级</label>
            <div className="flex gap-2">
              <Button
                variant={riskLevel === "low" ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-xs ${riskLevel === "low" ? "bg-primary-blue" : ""}`}
                onClick={() => setRiskLevel("low")}
              >
                低风险
              </Button>
              <Button
                variant={riskLevel === "medium" ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-xs ${riskLevel === "medium" ? "bg-primary-blue" : ""}`}
                onClick={() => setRiskLevel("medium")}
              >
                中风险
              </Button>
              <Button
                variant={riskLevel === "high" ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-xs ${riskLevel === "high" ? "bg-primary-blue" : ""}`}
                onClick={() => setRiskLevel("high")}
              >
                高风险
              </Button>
            </div>
          </div>

          {/* Moderation Remark */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">审核备注</label>
            <Textarea
              placeholder="请输入审核备注..."
              value={moderationRemark}
              onChange={(e) => setModerationRemark(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleReject}>
              <X className="h-4 w-4 mr-2" />
              拒绝
            </Button>
            <Button className="flex-1 bg-primary-blue hover:bg-blue-600 text-white" onClick={handleApprove}>
              <Check className="h-4 w-4 mr-2" />
              通过
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}