import axios from 'axios';

// 创建 axios 实例，配置基础 URL
// 在 Next.js 中，优先使用 API 代理避免 CORS 问题
const getBaseURL = () => {
  // 在浏览器环境中，使用 Next.js API 代理
  if (typeof window !== 'undefined') {
    // 优先使用代理，避免 CORS 问题
    const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false';
    if (useProxy) {
      return ''; // 使用相对路径，通过 Next.js API 代理
    }
    // 直接调用后端 API
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';
    return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  }
  // 在服务端渲染时，直接使用后端 API
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';
  return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 确保路径以 / 开头
    if (config.url && !config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
    // 调试日志（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        params: config.params,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    // 调试日志（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // 调试日志（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
        } : null,
        request: error.request ? {
          url: error.config?.url,
        } : null,
      });
    }
    
    // 统一处理错误
    if (error.response) {
      // 服务器返回了错误响应
      const status = error.response.status;
      const data = error.response.data;
      let message = `服务器错误 (${status})`;
      
      if (data?.message) {
        message += `: ${data.message}`;
      } else if (data?.error) {
        message += `: ${data.error}`;
      } else if (error.response.statusText) {
        message += `: ${error.response.statusText}`;
      }
      
      error.message = message;
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      if (error.code === 'ECONNREFUSED') {
        error.message = '无法连接到服务器，请确保后端服务运行在 http://localhost:9002';
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        error.message = '网络错误: 请检查网络连接和后端服务状态';
      } else {
        error.message = '请求超时或网络错误，请检查后端服务状态';
      }
    } else {
      // 其他错误
      error.message = error.message || '请求配置错误';
    }
    
    return Promise.reject(error);
  }
);

export default api;

