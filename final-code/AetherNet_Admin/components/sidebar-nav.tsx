"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Brain, Play, History, FileText, ChevronLeft, ChevronRight, Users, MessageSquare, Tag, ShieldAlert } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/ai-prediction",
    label: "AI决策预测",
    icon: Brain,
  },
  {
    href: "/",
    label: "开始审核",
    icon: Play,
  },
  {
    href: "/user-management",
    label: "用户管理",
    icon: Users,
  },
  {
    href: "/post-management",
    label: "帖子管理",
    icon: MessageSquare,
  },
  {
    href: "/sensitive-words",
    label: "敏感词管理",
    icon: ShieldAlert,
  },
  {
    href: "/category-management",
    label: "分类列表",
    icon: Tag,
  },
  {
    href: "/history",
    label: "历史审核记录",
    icon: History,
  },
  {
    href: "/report",
    label: "审核报告",
    icon: FileText,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-20 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">审</span>
            </div>
            <span className="font-semibold text-gray-900">内容审核</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">审</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                isActive ? "bg-primary-blue text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200",
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500")} />
              </div>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">收起侧栏</span>
            </>
          )}
        </button>
      </div>

      {/* AI Status Indicator */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary-blue/10 to-cyan-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-700">AI 在线</span>
            </div>
            <p className="text-xs text-gray-500">准确率 93.27%</p>
          </div>
        </div>
      )}
    </aside>
  )
}