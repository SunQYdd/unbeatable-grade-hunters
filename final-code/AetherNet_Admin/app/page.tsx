"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ExternalLink, AlertTriangle, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContentDetailModal } from "@/components/content-detail-modal"
import { PageLayout } from "@/components/page-layout"
import { fetchPosts, moderatePost, type Post } from "@/lib/api"
import { toast } from "sonner"

// 定义内容项接口，与API返回的数据结构匹配
interface ContentItem {
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
  viewCount?: number
  likeCount?: number
  commentCount?: number
}

export default function ContentReviewPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 获取待审核内容数据
  const loadContentItems = async () => {
    setLoading(true)
    try {
      // 使用帖子管理API获取待审核帖子
      const response = await fetchPosts(currentPage, pageSize, searchQuery)
      if (response.code === 200) {
        // 将API返回的数据转换为ContentItem格式
        // 确保只显示待审核(pending)状态的帖子
        const items: ContentItem[] = response.data.records
          .filter((post: Post) => post.status === "pending")
          .map((post: Post) => ({
            id: post.postId.toString(),
            title: post.title,
            description: `作者: ${post.author}`,
            status: post.status as "pending" | "approved" | "rejected" | "warning",
            createdAt: new Date(post.createdAt).toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            author: post.author,
            category: "帖子", // 根据实际情况设置分类
            viewCount: post.viewCount,
            likeCount: post.likeCount,
            commentCount: post.commentCount
          }))
        setContentItems(items)
      }
    } catch (error) {
      console.error("获取内容数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 页面加载和依赖变化时获取数据
  useEffect(() => {
    loadContentItems()
  }, [currentPage, pageSize, searchQuery])

  // Get unique categories
  const categories = Array.from(new Set(contentItems.map((item) => item.category)))

  const filteredItems = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const openItemDetail = (item: ContentItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleApprove = async (id: string, riskLevel: "low" | "medium" | "high" = "low") => {
    try {
      const postId = parseInt(id);
      const response = await moderatePost(postId, "approved", riskLevel, "审核通过");
      
      if (response.code === 200) {
        toast.success("审核通过成功");
        // 审核成功后更新本地状态
        setContentItems((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, status: "approved" } : item
          )
        )
        setIsModalOpen(false)
        // 从选中项中移除
        setSelectedItems(selectedItems.filter(itemId => itemId !== id))
      } else {
        toast.error("审核失败: " + response.message);
        console.error("审核失败:", response.message)
      }
    } catch (error) {
      toast.error("审核过程中发生错误");
      console.error("审核过程中发生错误:", error)
    }
  }

  const handleReject = async (id: string, reason: string, riskLevel: "low" | "medium" | "high" = "low") => {
    try {
      const postId = parseInt(id);
      // 使用用户选择的风险等级
      const response = await moderatePost(postId, "rejected", riskLevel, reason);
      
      if (response.code === 200) {
        toast.success("审核拒绝成功");
        // 审核成功后更新本地状态
        setContentItems((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, status: "rejected" } : item
          )
        )
        setIsModalOpen(false)
        // 从选中项中移除
        setSelectedItems(selectedItems.filter(itemId => itemId !== id))
      } else {
        toast.error("审核失败: " + response.message);
        console.error("审核失败:", response.message)
      }
    } catch (error) {
      toast.error("审核过程中发生错误");
      console.error("审核过程中发生错误:", error)
    }
  }

  const handleBatchApprove = () => {
    // 在实际应用中，这里应该调用API批量批准内容
    setContentItems((prev) =>
      prev.map((item) => 
        selectedItems.includes(item.id) ? { ...item, status: "approved" } : item
      ),
    )
    setSelectedItems([])
  }

  const getStatusIcon = (item: ContentItem) => {
    if (item.status === "warning") {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
    return null
  }

  return (
    <PageLayout title="开始审核">
      {/* Search and Filter */}
      <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索标题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-100 border-0 rounded-xl"
            />
            {searchQuery && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-xl ${showFilters ? "bg-primary-blue text-white" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">状态筛选</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "all" ? "bg-primary-blue" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  全部
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "pending" ? "bg-primary-blue" : ""}`}
                  onClick={() => setFilterStatus("pending")}
                >
                  待审核
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "approved" ? "bg-primary-blue" : ""}`}
                  onClick={() => setFilterStatus("approved")}
                >
                  已通过
                </Button>
                <Button
                  variant={filterStatus === "rejected" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "rejected" ? "bg-primary-blue" : ""}`}
                  onClick={() => setFilterStatus("rejected")}
                >
                  已拒绝
                </Button>
                <Button
                  variant={filterStatus === "warning" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "warning" ? "bg-primary-blue" : ""}`}
                  onClick={() => setFilterStatus("warning")}
                >
                  需关注
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">分类筛选</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterCategory === "all" ? "bg-primary-blue" : ""}`}
                  onClick={() => setFilterCategory("all")}
                >
                  全部
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full text-xs ${filterCategory === cat ? "bg-primary-blue" : ""}`}
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content List */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>加载中...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>没有找到匹配的内容</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 ${
                  index !== filteredItems.length - 1 ? "border-b border-gray-100" : ""
                } hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => openItemDetail(item)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                      selectedItems.includes(item.id)
                        ? "bg-primary-blue border-primary-blue"
                        : "border-gray-300 hover:border-primary-blue"
                    }`}
                    onClick={(e) => toggleItem(item.id, e)}
                  >
                    {selectedItems.includes(item.id) && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    {item.tag && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-500 rounded-full">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{item.createdAt}</span>
                    {item.aiConfidence !== undefined && (
                      <>
                        <span>•</span>
                        <span>AI置信度: {item.aiConfidence}%</span>
                      </>
                    )}
                    {item.aiPrediction && (
                      <>
                        <span>•</span>
                        <span>
                          AI预测:{" "}
                          {item.aiPrediction === "pass"
                            ? "通过"
                            : item.aiPrediction === "reject"
                              ? "拒绝"
                              : "待定"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Content Detail Modal */}
      <ContentDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </PageLayout>
  )
}