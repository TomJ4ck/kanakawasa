import api from './api';
import { SocialInsuranceDTO } from '../types';

/**
 * API 客户端类
 * 用于处理与后端 API 的通信
 */
export class ApiClient {
  /**
   * 获取社会保险数据
   * @param monthlySalary 月薪
   * @param age 年龄
   * @returns 返回社会保险 DTO
   */
  async getSocialInsurance(
    monthlySalary: number,
    age: number
  ): Promise<SocialInsuranceDTO> {
    // 如果使用代理，路径需要包含 /api/proxy/
    const useProxy = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false';
    const endpoint = useProxy 
      ? '/api/proxy/socialInsuranceQuery'
      : '/socialInsuranceQuery';
    
    const response = await api.get<SocialInsuranceDTO>(endpoint, {
      params: {
        monthlySalary,
        age,
      },
    });
    return response.data;
  }
}

// 导出单例实例
export default new ApiClient();

