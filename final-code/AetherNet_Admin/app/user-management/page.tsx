"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, X, Check, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageLayout } from "@/components/page-layout"
import { fetchUsers, updateUserStatus, type User } from "@/lib/api"

interface PaginationInfo {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status.toString() === filterStatus;
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // 获取用户数据
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchUsers(currentPage, pageSize, filterStatus, searchQuery, filterRole);
      if (response.code === 200) {
        setUsers(response.data.records);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("获取用户数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载和依赖变化时获取数据
  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, filterStatus, searchQuery, filterRole]); // 添加filterRole到依赖数组

  const paginationInfo: PaginationInfo = {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages
  }

  const handleToggleUserStatus = async (userId: number) => {
    const user = users.find(u => u.userId === userId)
    if (user) {
      try {
        const newStatus = user.status === 1 ? 0 : 1
        const response = await updateUserStatus(userId, newStatus)
        if (response.code === 200) {
          // 更新成功后重新加载数据
          loadUsers()
        } else {
          console.error("更新用户状态失败:", response.message)
        }
      } catch (error) {
        console.error("更新用户状态失败:", error)
      }
    }
  }

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

  const handleFilterRoleChange = (role: string) => {
    setFilterRole(role)
    handleFilterChange()
  }

  return (
    <PageLayout title="用户管理">
      {/* Search and Filter */}
      <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索学号或邮箱..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleFilterChange()
              }}
              className="pl-10 bg-gray-100 border-0 rounded-xl"
            />
            {searchQuery && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => {
                setSearchQuery("")
                handleFilterChange()
              }}>
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
                  variant={filterStatus === "1" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "1" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterStatusChange("1")}
                >
                  启用
                </Button>
                <Button
                  variant={filterStatus === "0" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterStatus === "0" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterStatusChange("0")}
                >
                  禁用
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">角色筛选</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterRole === "all" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterRole === "all" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterRoleChange("all")}
                >
                  全部
                </Button>
                <Button
                  variant={filterRole === "student" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterRole === "student" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterRoleChange("student")}
                >
                  student
                </Button>
                <Button
                  variant={filterRole === "admin" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${filterRole === "admin" ? "bg-primary-blue" : ""}`}
                  onClick={() => handleFilterRoleChange("admin")}
                >
                  admin
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User List */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>加载中...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>没有找到匹配的用户</p>
            </div>
          ) : (
            <>
              {users.map((user, index) => (
                <div
                  key={user.userId}
                  className={`flex items-center gap-4 p-4 ${
                    index !== users.length - 1 ? "border-b border-gray-100" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{user.username}</h3>
                      {user.status === 1 ? (
                        <Badge className="text-xs bg-green-100 text-green-600 rounded-full">启用</Badge>
                      ) : (
                        <Badge className="text-xs bg-red-100 text-red-600 rounded-full">禁用</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{user.studentId}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>角色: {user.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.status === 1 ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 border-red-500 hover:bg-red-50 rounded-full"
                        onClick={() => handleToggleUserStatus(user.userId)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        禁用
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-500 border-green-500 hover:bg-green-50 rounded-full"
                        onClick={() => handleToggleUserStatus(user.userId)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        启用
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    显示第 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, total)} 条，共 {total} 条记录
                  </span>
                  <div className="flex items-center gap-1 ml-4">
                    <span className="text-sm text-gray-600">每页:</span>
                    <select 
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
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
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mx-2">
                      第 {currentPage} 页，共 {totalPages} 页
                    </span>
                  </div>
                  
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