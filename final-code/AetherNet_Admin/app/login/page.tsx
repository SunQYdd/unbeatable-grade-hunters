"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock, User } from "lucide-react"
import { login, type LoginRequest } from "@/lib/api"

// 设置cookie的工具函数
function setCookie(name: string, value: string, days?: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // 确保cookie可以在所有路径下访问，并设置适当的SameSite和Secure属性
  let cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax;";
  // 如果是HTTPS环境，添加Secure属性
  if (window.location.protocol === "https:") {
    cookieString += " Secure;";
  }
  document.cookie = cookieString;
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // 获取登录成功后要跳转的路径，默认跳转到帖子管理页面
  const redirectPath = searchParams.get('redirect') || '/post-management'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 防止多次提交
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");

    try {
      // 准备登录数据
      const loginData: LoginRequest = {
        studentId,
        password,
        role: 'admin'  // 根据要求，登录时role必须为admin
      };

      // 调用登录接口
      const response = await login(loginData);
      
      console.log('登录响应:', response);

      if (response.code === 200) {
        // 检查响应中的Authorization字段是否存在
        if (response.data.accessToken) {
          // 登录成功，将accessToken保存到名为Authorization的cookie中
          setCookie("Authorization", response.data.accessToken, 7); // 7天有效期
          
          // 将用户信息保存到localStorage中
          if (typeof window !== 'undefined') {
            const userInfo = {
              userId: response.data.user.userId,
              studentId: response.data.user.studentId,
              role: response.data.user.role,
              status: response.data.user.status
            };
            window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
          
          // 添加一个小延迟确保cookie被设置
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // 登录成功，跳转到目标页面
          console.log('登录成功，即将跳转到:', redirectPath);
          router.push(redirectPath);
        } else {
          console.error('登录响应中缺少Authorization字段:', response);
          setError("登录响应异常，请稍后再试");
        }
      } else {
        setError(response.message || "登录失败");
      }
    } catch (err) {
      setError("登录失败，请稍后再试");
      console.error("登录错误:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary-blue flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">AetherNet 管理系统</h2>
          <p className="mt-2 text-sm text-gray-600">
            请输入您的账号信息登录
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
            <CardDescription className="text-center">
              请输入您的学号和密码
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">学号</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="请输入学号"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    登录中...
                  </div>
                ) : "登录"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <div className="text-sm text-gray-500 text-center">
              <p>默认账号: admin</p>
              <p>默认密码: password</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}