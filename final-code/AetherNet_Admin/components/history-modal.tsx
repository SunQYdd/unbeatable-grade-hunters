"use client"

import { X, Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { reviewRecords } from "@/lib/mock-data"

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "rejected">("all")

  if (!isOpen) return null

  const filteredRecords = reviewRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || record.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">历史审核记录</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-4 border-b border-gray-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索审核记录..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-100 border-0 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${filterStatus === "all" ? "bg-primary-blue" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              全部
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${filterStatus === "approved" ? "bg-green-500" : ""}`}
              onClick={() => setFilterStatus("approved")}
            >
              已通过
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${filterStatus === "rejected" ? "bg-red-500" : ""}`}
              onClick={() => setFilterStatus("rejected")}
            >
              已拒绝
            </Button>
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-xl border ${
                  record.status === "approved" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{record.title}</h4>
                      {record.aiAssisted && (
                        <Badge className="bg-primary-blue/10 text-primary-blue text-xs rounded-full">AI辅助</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                    {record.reason && <p className="text-sm text-red-600 mt-2">拒绝原因: {record.reason}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>审核员: {record.reviewer}</span>
                      <span>{record.reviewedAt}</span>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.status === "approved" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {record.status === "approved" ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">共 {filteredRecords.length} 条记录</p>
        </div>
      </div>
    </div>
  )
}
