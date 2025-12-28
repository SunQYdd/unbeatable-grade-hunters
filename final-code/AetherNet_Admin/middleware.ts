import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义受保护的路由
const protectedRoutes = ['/', '/ai-prediction', '/user-management', '/history', '/report']
// 定义公开路由（无需认证即可访问）
const publicRoutes = ['/login']

// 检查请求中是否包含认证cookie的函数
function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return false
  
  // 解析cookie字符串，检查是否存在Authorization
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
  return cookies.some(cookie => cookie.startsWith('Authorization='))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 检查当前路径是否为受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // 检查当前路径是否为公开路由
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // 检查用户是否已认证
  const authenticated = isAuthenticated(request)
  
  // 如果访问的是公开路由，直接放行
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // 如果访问受保护路由但没有认证信息，重定向到登录页
  if (isProtectedRoute && !authenticated) {
    const loginUrl = new URL('/login', request.url)
    // 保存用户原本想要访问的路径，登录成功后可以重定向回去
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // 其他情况正常放行
  return NextResponse.next()
}

// 配置中间件匹配器
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下特殊情况：
     * 1. 以/_next/开头的路径（Next.js内部文件）
     * 2. 以/static/开头的路径（静态资源）
     * 3. 以/favicon.ico结尾的路径（网站图标）
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}