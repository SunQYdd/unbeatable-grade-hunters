"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Edit, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageLayout } from "@/components/page-layout"
import { 
  fetchCategories,
  type Category 
} from "@/lib/api"

export default function CategoryManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(true) // 控制筛选区域显示/隐藏
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // 获取分类数据
  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await fetchCategories()
      if (response.code === 200) {
        setCategories(response.data)
        setFilteredCategories(response.data)
        setDisplayedCategories(response.data)
      }
    } catch (error) {
      console.error("获取分类数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    loadCategories()
  }, [])

  // 搜索和分类筛选功能
  useEffect(() => {
    let result = categories;
    
    // 应用搜索筛选
    if (searchQuery) {
      result = result.filter(
        category => 
          category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.categoryCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // 应用分类筛选
    if (selectedCategory !== "all") {
      result = result.filter(category => category.categoryCode === selectedCategory)
    }
    
    setFilteredCategories(result)
    setDisplayedCategories(result)
  }, [searchQuery, selectedCategory, categories])

  // 处理分类筛选变更
  const handleCategoryFilterChange = (categoryCode: string) => {
    setSelectedCategory(categoryCode)
  }

  // 重置筛选
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
  }

  return (
    <PageLayout title="分类管理">
      {/* Search and Filter */}
      <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索分类名称或编码..."
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
        
        {/* Category Filter Buttons */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs ${selectedCategory === "all" ? "bg-primary-blue" : ""}`}
              onClick={() => handleCategoryFilterChange("all")}
            >
              全部
            </Button>
            {categories.map((category) => (
              <Button
                key={category.categoryId}
                variant={selectedCategory === category.categoryCode ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-xs ${selectedCategory === category.categoryCode ? "bg-primary-blue" : ""}`}
                onClick={() => handleCategoryFilterChange(category.categoryCode)}
              >
                {category.categoryName}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>加载中...</p>
            </div>
          ) : displayedCategories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>没有找到匹配的分类</p>
            </div>
          ) : (
            <>
              {displayedCategories.map((category, index) => (
                <div
                  key={category.categoryId}
                  className={`flex items-center gap-4 p-4 ${
                    index !== displayedCategories.length - 1 ? "border-b border-gray-100" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{category.categoryName}</h3>
                      <Badge variant="outline" className="text-xs text-gray-500 rounded-full">
                        {category.categoryCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-gray-500 border-gray-500 hover:bg-gray-100 rounded-full">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-gray-500 border-gray-500 hover:bg-gray-100 rounded-full">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  共 {displayedCategories.length} 个分类
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="rounded-full">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">1 / 1</span>
                  <Button variant="outline" size="sm" disabled className="rounded-full">
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