import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 根据 NEXT_PUBLIC_ENV 获取 API 基地址
const getApiBaseURL = (): string => {
  const env = process.env.NEXT_PUBLIC_ENV || 'dev';
  
  switch (env) {
    case 'prod':
      return 'https://social-insurance-backend-service-884028304162.asia-northeast1.run.app';
    case 'test':
      return 'http://localhost';
    case 'dev':
    default:
      return 'http://localhost:9002';
  }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || getApiBaseURL();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path || '';
    const apiUrl = `${API_BASE_URL}/${apiPath}`;

    // 转发请求到后端 API
    const response = await axios.get(apiUrl, {
      params: req.query,
      timeout: 10000,
    });

    // 返回后端响应
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      res.status(500).json({ 
        message: '无法连接到后端服务器',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: '代理请求失败',
        error: error.message 
      });
    }
  }
}

