import { SensitiveWord, initialSensitiveWords } from './mock-data';

// API服务封装，用于与后端进行数据交互
const API_BASE_URL = 'http://localhost:8088/api';

// 获取cookie的工具函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return null; // 服务端渲染时返回null
  
  console.log('当前所有cookie:', document.cookie); // 调试用，查看所有cookie
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
      console.log(`找到cookie ${name}:`, value); // 调试用，查看找到的cookie
      return value;
    }
  }
  console.log(`未找到cookie ${name}`); // 调试用，确认未找到cookie
  return null;
}

// 获取认证token的工具函数
function getAuthToken(): string | null {
  return getCookie("Authorization");
}

// 统一响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应格式
interface PaginatedResponse<T> {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  records: T[];
  hasPrevious: boolean;
  hasNext: boolean;
}

// 用户相关接口
export interface User {
  userId: number;
  username: string;
  avatarUrl: string;
  studentId: string;
  email: string;
  role: string;
  status: number;
  createdAt: string;
}

// 帖子相关接口
export interface Post {
  categoryId: any;
  postId: number;
  title: string;
  author: string;
  status: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isTop: number;
  isFeatured: number;
}

// 举报相关接口
export interface Report {
  reportId: number;
  reporter: string;
  targetType: string;
  targetTitle: string;
  reason: string;
  status: string;
  createdAt: string;
}

// 分类相关接口
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryCode: string;
}

// 获取用户列表
export const fetchUsers = async (
  page: number,
  size: number,
  status?: string,
  keyword?: string,
  role?: string
): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const params = new URLSearchParams();
  
  // 添加基础分页参数
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  // 添加可选参数
  if (status && status !== 'all') {
    params.append('status', status);
  }
  
  if (keyword) {
    params.append('keyword', keyword);
  }
  
  if (role && role !== 'all') {
    params.append('role', role);
  }
  
  try {
    // 获取Authorization token
    const authToken = getAuthToken(); // 使用新的函数获取token
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则添加到Authorization头
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      method: 'GET',
      headers,
      // 添加credentials以支持跨域请求时携带cookie等认证信息
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取用户列表失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: {
        currentPage: page,
        pageSize: size,
        total: 0,
        totalPages: 0,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      timestamp: Date.now()
    };
  }
};

// 启用/禁用用户
export const updateUserStatus = async (
  userId: number,
  status: number
): Promise<ApiResponse<null>> => {
  try {
    // 获取Authorization token - 确保与登录页面保存的令牌名称一致
    const authToken = getCookie('Authorization'); // 令牌名称需与登录时设置的cookie名称保持一致
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则添加到Authorization头
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('更新用户状态失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: null,
      timestamp: Date.now()
    };
  }
};

// 获取帖子列表
export const fetchPosts = async (
  page: number,
  size: number,
  keyword?: string
): Promise<ApiResponse<PaginatedResponse<Post>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (keyword) {
    params.append('keyword', keyword);
  }
  
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/posts/pending?${params}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: {
        currentPage: page,
        pageSize: size,
        total: 0,
        totalPages: 0,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      timestamp: Date.now()
    };
  }
};

// 获取所有帖子列表
export const fetchAllPosts = async (
  page: number,
  size: number,
  keyword?: string
): Promise<ApiResponse<PaginatedResponse<Post>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (keyword) {
    params.append('keyword', keyword);
  }
  
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    // 使用学生端获取帖子列表的接口，该接口返回所有已审核通过的帖子
    const response = await fetch(`${API_BASE_URL}/admin/posts/pending?${params}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: {
        currentPage: page,
        pageSize: size,
        total: 0,
        totalPages: 0,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      timestamp: Date.now()
    };
  }
};

// 获取待审核帖子列表
export const fetchPendingPosts = async (
  page: number,
  size: number,
  keyword?: string
): Promise<ApiResponse<PaginatedResponse<Post>>> => {
  const params = new URLSearchParams();
  
  // 添加基础分页参数
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  // 添加可选参数
  if (keyword) {
    params.append('keyword', keyword);
  }
  
  try {
    // 获取Authorization token
    const authToken = getAuthToken(); // 使用新的函数获取token
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则添加到Authorization头
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/posts/pending?${params}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取待审核帖子列表失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: {
        currentPage: page,
        pageSize: size,
        total: 0,
        totalPages: 0,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      timestamp: Date.now()
    };
  }
};

// 置顶/取消置顶帖子
export const togglePostTopStatus = async (
  postId: number,
  isTop: number
): Promise<ApiResponse<null>> => {
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/top`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ isTop }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('更新帖子置顶状态失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: null,
      timestamp: Date.now()
    };
  }
};

// 设置/取消精华帖
export const togglePostFeaturedStatus = async (
  postId: number,
  isFeatured: number
): Promise<ApiResponse<null>> => {
  try {
    // 获取Authorization token - 确保与登录页面保存的令牌名称一致
    const authToken = getCookie('Authorization'); // 令牌名称需与登录时设置的cookie名称保持一致
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则添加到Authorization头
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/featured`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ isFeatured }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('更新帖子精华状态失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: null,
      timestamp: Date.now()
    };
  }
};

// 审核帖子
export const moderatePost = async (
  postId: number,
  decision: 'approved' | 'rejected',
  riskLevel: 'low' | 'medium' | 'high',
  reason: string
): Promise<ApiResponse<null>> => {
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');

    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }

    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/moderate`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ decision, riskLevel, reason }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('审核帖子失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: null,
      timestamp: Date.now()
    };
  }
};

// 获取举报列表
export const fetchReports = async (
  page: number,
  size: number,
  status?: string
): Promise<ApiResponse<PaginatedResponse<Report>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (status && status !== 'all') {
    params.append('status', status);
  }
  
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/reports?${params}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取举报列表失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: {
        currentPage: page,
        pageSize: size,
        total: 0,
        totalPages: 0,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      timestamp: Date.now()
    };
  }
};

// 处理举报
export const handleReport = async (
  reportId: number,
  status: string,
  remark?: string
): Promise<ApiResponse<null>> => {
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/handle`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ status, remark }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('处理举报失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: null,
      timestamp: Date.now()
    };
  }
};

// 删除帖子
export const deletePost = async (postId: number): Promise<ApiResponse<null>> => {
  try {
    // 获取Authorization token - 从名为'Authorization'的cookie中获取
    const authToken = getCookie('Authorization');

    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }

    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
      method: 'DELETE',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('删除帖子失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: null,
      timestamp: Date.now()
    };
  }
};

// 获取分类列表
export const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    // 获取Authorization token
    const authToken = getCookie('Authorization');
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 如果存在authToken，则直接使用其值作为Authorization头的值
    if (authToken) {
      headers['Authorization'] = authToken;
    }
    
    const response = await fetch(`${API_BASE_URL}/public/categories`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取分类列表失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: [],
      timestamp: Date.now()
    };
  }
};

// 用户登录接口
export interface LoginRequest {
  studentId: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    userId: number;
    studentId: string;
    role: string;
    status: number;
  };
}

export const login = async (loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginData),
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('登录接口响应数据:', responseData);
    return responseData;
  } catch (error) {
    console.error('登录失败:', error);
    // 返回一个默认的错误响应格式，与后端保持一致
    return {
      code: 500,
      message: '网络错误或服务器无响应',
      data: {
        accessToken: '',
        user: {
          userId: 0,
          studentId: '',
          role: '',
          status: 0
        }
      },
      timestamp: Date.now()
    };
  }
};

export type {
  ApiResponse,
  PaginatedResponse,
  User,
  Post,
  Report,
  Category
}



// ==========================================
// 新增：敏感词管理接口 (Mock 实现)
// ==========================================

// 本地临时存储 (模拟数据库)
let mockSensitiveWordsDb = [...initialSensitiveWords];

// 1. 获取敏感词列表 (查)
export const fetchSensitiveWords = async (
    page: number,
    size: number,
    keyword?: string,
    category?: string
): Promise<ApiResponse<PaginatedResponse<SensitiveWord>>> => {
  // 模拟网络延迟 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = mockSensitiveWordsDb;

  // 筛选关键词
  if (keyword) {
    filtered = filtered.filter((item) => item.word.includes(keyword));
  }
  // 筛选分类
  if (category && category !== 'all') {
    filtered = filtered.filter((item) => item.category === category);
  }

  // 按时间倒序
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 计算分页
  const total = filtered.length;
  const start = (page - 1) * size;
  const end = start + size;
  const records = filtered.slice(start, end);

  return {
    code: 200,
    message: "success",
    data: {
      currentPage: page,
      pageSize: size,
      total: total,
      totalPages: Math.ceil(total / size),
      records: records,
      hasPrevious: page > 1,
      hasNext: end < total,
    },
    timestamp: Date.now(),
  };
};

// 2. 添加敏感词 (增)
export const addSensitiveWord = async (
    word: string,
    category: string
): Promise<ApiResponse<null>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newWord: SensitiveWord = {
    id: Date.now().toString(), // 随机生成个ID
    word,
    category: category as any,
    createdAt: new Date().toLocaleString().replace(/\//g, "-"), // 生成当前时间
  };

  mockSensitiveWordsDb.unshift(newWord); // 加到最前面

  return {
    code: 200,
    message: "添加成功",
    data: null,
    timestamp: Date.now(),
  };
};

// 3. 删除敏感词 (删)
export const deleteSensitiveWord = async (id: string): Promise<ApiResponse<null>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  mockSensitiveWordsDb = mockSensitiveWordsDb.filter((item) => item.id !== id);

  return {
    code: 200,
    message: "删除成功",
    data: null,
    timestamp: Date.now(),
  };
};