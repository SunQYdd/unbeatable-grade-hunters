"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, Trash2, X, Pin, Star, Check, X as XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageLayout } from "@/components/page-layout"
import { 
  fetchAllPosts as fetchPosts, 
  togglePostTopStatus, 
  togglePostFeaturedStatus, 
  deletePost,
  moderatePost,
  fetchCategories,
  type Post,
  type Category
} from "@/lib/api"

interface PaginationInfo {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export default function PostManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all") // 默认显示所有帖子
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 获取帖子数据
  const loadPosts = async () => {
    setLoading(true)
    try {
      const response = await fetchPosts(currentPage, pageSize, searchQuery)
      if (response.code === 200) {
        setPosts(response.data.records)
        setTotal(response.data.total)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error("获取帖子数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 页面加载和依赖变化时获取数据
  useEffect(() => {
    loadPosts()
  }, [currentPage, pageSize, searchQuery])

  const paginationInfo: PaginationInfo = {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages
  }

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await deletePost(postId)
      if (response.code === 200) {
        // 删除成功后重新加载数据
        loadPosts()
      } else {
        console.error("删除帖子失败:", response.message)
      }
    } catch (error) {
      console.error("删除帖子失败:", error)
    }
  }

  const handleToggleTopStatus = async (postId: number) => {
    const post = posts.find(p => p.postId === postId)
    if (post) {
      try {
        const newIsTop = post.isTop === 1 ? 0 : 1
        const response = await togglePostTopStatus(postId, newIsTop)
        if (response.code === 200) {
          // 更新成功后重新加载数据
          loadPosts()
        } else {
          console.error("更新帖子置顶状态失败:", response.message)
        }
      } catch (error) {
        console.error("更新帖子置顶状态失败:", error)
      }
    }
  }

  const handleToggleFeaturedStatus = async (postId: number) => {
    const post = posts.find(p => p.postId === postId)
    if (post) {
      try {
        const newIsFeatured = post.isFeatured === 1 ? 0 : 1
        const response = await togglePostFeaturedStatus(postId, newIsFeatured)
        if (response.code === 200) {
          // 更新成功后重新加载数据
          loadPosts()
        } else {
          console.error("更新帖子精华状态失败:", response.message)
        }
      } catch (error) {
        console.error("更新帖子精华状态失败:", error)
      }
    }
  }

  // 添加审核通过功能
  const handleApprovePost = async (postId: number) => {
    try {
      const response = await moderatePost(postId, "approved", "low", "审核通过")
      if (response.code === 200) {
        // 审核成功后重新加载数据
        loadPosts()
      } else {
        console.error("审核帖子失败:", response.message)
      }
    } catch (error) {
      console.error("审核帖子失败:", error)
    }
  }

  // 添加审核拒绝功能
  const handleRejectPost = async (postId: number) => {
    try {
      const response = await moderatePost(postId, "rejected", "low", "审核拒绝")
      if (response.code === 200) {
        // 审核成功后重新加载数据
        loadPosts()
      } else {
        console.error("审核帖子失败:", response.message)
      }
    } catch (error) {
      console.error("审核帖子失败:", error)
    }
  }

  // Calculate pagination info
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = filterStatus === "all" || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleFilterStatusChange = (status: string) => {
    setFilterStatus(status)
    handleFilterChange()
  }


  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "default"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "已通过"
      case "rejected":
        return "已拒绝"
      case "pending":
        return "待审核"
      default:
        return status
    }
  }

  return (
    <PageLayout title="帖子管理">
      {/* Search and Filter */}
      <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索标题或作者..."
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
                  onClick={() => handleFilterStatusChange("all")}
                >
                  全部
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "approved" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterStatusChange("approved")}
                >
                  已通过
                </Button>
                <Button
                  variant={filterStatus === "rejected" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "rejected" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterStatusChange("rejected")}
                >
                  已拒绝
                </Button>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Post List */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>加载中...</p>
            </div>
          ) : paginatedPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>没有找到匹配的帖子</p>
            </div>
          ) : (
            <>
              {paginatedPosts.map((post, index) => (
                <div
                  key={post.postId}
                  className={`flex items-center gap-4 p-4 ${
                    index !== paginatedPosts.length - 1 ? "border-b border-gray-100" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      {post.isTop === 1 && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-500 rounded-full">
                          置顶
                        </Badge>
                      )}
                      {post.isFeatured === 1 && (
                        <Badge variant="outline" className="text-xs border-amber-500 text-amber-500 rounded-full">
                          精华
                        </Badge>
                      )}
                      <Badge variant={getStatusBadgeVariant(post.status)} className="text-xs rounded-full">
                        {getStatusText(post.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">作者: {post.author}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>浏览: {post.viewCount || 0}</span>
                      <span>点赞: {post.likeCount || 0}</span>
                      <span>评论: {post.commentCount || 0}</span>
                      <span>发布时间: {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-gray-500 border-gray-500 hover:bg-gray-100 rounded-full"
                      onClick={() => handleToggleTopStatus(post.postId)}
                      title={post.isTop === 1 ? "取消置顶" : "置顶"}
                    >
                      <Pin className={`h-4 w-4 ${post.isTop === 1 ? "fill-current" : ""}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-gray-500 border-gray-500 hover:bg-gray-100 rounded-full"
                      onClick={() => handleToggleFeaturedStatus(post.postId)}
                      title={post.isFeatured === 1 ? "取消精华" : "设为精华"}
                    >
                      <Star className={`h-4 w-4 ${post.isFeatured === 1 ? "fill-current" : ""}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-gray-500 border-gray-500 hover:bg-gray-100 rounded-full"
                      onClick={() => handleDeletePost(post.postId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    第 {paginationInfo.currentPage} 页，共 {paginationInfo.totalPages} 页
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value="10">每页 10 条</option>
                    <option value="20">每页 20 条</option>
                    <option value="50">每页 50 条</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationInfo.hasPrevious}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {paginationInfo.currentPage} / {paginationInfo.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNext}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}