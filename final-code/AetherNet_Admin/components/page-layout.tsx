"use client"

import { SidebarNav } from "./sidebar-nav"
import type { ReactNode } from "react"
import { Button } from "./ui/button"
import { LogOut, User, Shield, Settings, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PageLayoutProps {
  children: ReactNode
  title: string
  showBackButton?: boolean
  backHref?: string
  headerActions?: ReactNode
}

export function PageLayout({ children, title, headerActions }: PageLayoutProps) {
  // 获取用户学号的函数
  function getUserStudentId(): string | null {
    if (typeof window === 'undefined') return null;
    
    // 从localStorage中获取用户信息
    const userInfo = window.localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        // 如果有studentId则返回学号，否则返回用户名或默认"管理员"
        return parsed.studentId || parsed.username || '管理员';
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
    
    return '管理员';
  }

  const router = useRouter()
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState("")
  const [userDisplayText, setUserDisplayText] = useState("管理员")

  // 组件挂载时获取用户信息
  useEffect(() => {
    const studentId = getUserStudentId();
    setUserDisplayText(studentId || "管理员");
  }, []);
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [newAdminPhone, setNewAdminPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [adminError, setAdminError] = useState("")
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false)
  const [isAdminSuccess, setIsAdminSuccess] = useState(false)

  const handleLogout = () => {
    // 清除认证信息
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // 清除用户信息
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userInfo');
    }
    // 跳转到登录页面
    router.push("/login")
  }

  const handleChangePassword = () => {
    // 模拟修改密码的逻辑
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("请填写所有字段")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("新密码与确认密码不一致")
      return
    }
    
    // 在实际应用中，这里应该调用后端API来修改密码
    // 模拟API调用
    setTimeout(() => {
      setIsPasswordSuccess(true)
      setPasswordError("")
      
      // 清空表单
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      // 2秒后关闭对话框
      setTimeout(() => {
        setIsPasswordDialogOpen(false)
        setIsPasswordSuccess(false)
      }, 2000)
    }, 500)
  }

  const handleAddAdmin = () => {
    // 模拟添加管理员的逻辑
    if (!newAdminUsername.trim() || !newAdminPassword.trim() || !newAdminPhone.trim()) {
      setAdminError("请填写所有字段")
      return
    }
    
    // 简单的手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(newAdminPhone)) {
      setAdminError("请输入有效的手机号")
      return
    }
    
    // 在实际应用中，这里应该调用后端API来添加管理员
    // 模拟API调用
    setTimeout(() => {
      setIsAdminSuccess(true)
      setAdminError("")
      
      // 3秒后关闭对话框
      setTimeout(() => {
        setIsAdminDialogOpen(false)
        setIsAdminSuccess(false)
        // 重置表单
        setNewAdminUsername("")
        setNewAdminPassword("")
        setNewAdminPhone("")
      }, 3000)
    }, 500)
  }

  const handleAdminInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      // 当用户开始输入时，清除错误信息
      if (adminError) {
        setAdminError("")
      }
    }
  }

  // 处理点击对话框内容区域的事件
  const handleAdminDialogContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // 如果点击的不是输入框，清除错误信息
    if (target.tagName !== 'INPUT' && adminError) {
      setAdminError("");
    }
  };

  // 处理点击密码对话框内容区域的事件
  const handlePasswordDialogContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // 如果点击的不是输入框，清除错误信息
    if (target.tagName !== 'INPUT' && passwordError) {
      setPasswordError("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content - with left margin for sidebar */}
      <div className="ml-56 transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <div className="flex items-center gap-4">
              {headerActions}
              {/* User Info and Settings */}
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setIsAdminDialogOpen(true)}
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{userDisplayText}</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      修改密码
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Add Admin Dialog */}
        <Dialog open={isAdminDialogOpen} onOpenChange={(open) => {
          setIsAdminDialogOpen(open)
          // 关闭对话框时重置状态
          if (!open) {
            setAdminError("")
            setNewAdminUsername("")
            setNewAdminPassword("")
            setNewAdminPhone("")
            setIsAdminSuccess(false)
          }
        }}>
          <DialogContent className="sm:max-w-[425px]" onClick={handleAdminDialogContentClick}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary-blue" />
                新增管理员
              </DialogTitle>
              <DialogDescription>
                请输入新管理员的用户名、密码和手机号
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {isAdminSuccess ? (
                <Alert className="border-green-500 bg-green-50">
                  <AlertDescription className="text-green-700">
                    管理员添加成功！
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="admin-username" className="text-right">
                      学号
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="admin-username"
                        value={newAdminUsername}
                        onChange={handleAdminInputChange(setNewAdminUsername)}
                        placeholder="请输入学号"
                        className="col-span-3"
                        // 阻止在输入框内点击时冒泡到父级div
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="admin-password" className="text-right">
                      密码
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="admin-password"
                        type="password"
                        value={newAdminPassword}
                        onChange={handleAdminInputChange(setNewAdminPassword)}
                        placeholder="请输入密码"
                        className="col-span-3"
                        // 阻止在输入框内点击时冒泡到父级div
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="admin-phone" className="text-right">
                      手机号
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="admin-phone"
                        value={newAdminPhone}
                        onChange={handleAdminInputChange(setNewAdminPhone)}
                        placeholder="请输入手机号"
                        className="col-span-3"
                        // 阻止在输入框内点击时冒泡到父级div
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {adminError && (
                    <Alert variant="destructive">
                      <AlertDescription>{adminError}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
            {!isAdminSuccess && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAdminDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={handleAddAdmin}>添加</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={(open) => {
          setIsPasswordDialogOpen(open)
          // 关闭对话框时重置状态
          if (!open) {
            setPasswordError("")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setIsPasswordSuccess(false)
          }
        }}>
          <DialogContent className="sm:max-w-[425px]" onClick={handlePasswordDialogContentClick}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-blue" />
                修改密码
              </DialogTitle>
              <DialogDescription>
                请输入当前密码和新密码
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {isPasswordSuccess ? (
                <Alert className="border-green-500 bg-green-50">
                  <AlertDescription className="text-green-700">
                    密码修改成功！
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="current-password" className="text-right">
                      当前密码
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value)
                          if (passwordError) setPasswordError("")
                        }}
                        className="col-span-3"
                        // 阻止在输入框内点击时冒泡到父级div
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-password" className="text-right">
                      新密码
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          if (passwordError) setPasswordError("")
                        }}
                        className="col-span-3"
                        // 阻止在输入框内点击时冒泡到父级div
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirm-password" className="text-right">
                      确认密码
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (passwordError) setPasswordError("")
                        }}
                        className="col-span-3"
                        // 阻止在输入框内点击时冒泡到父级div
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
            {!isPasswordSuccess && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={handleChangePassword}>修改密码</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}