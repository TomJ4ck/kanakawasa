import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CalculationResult, IndustryType } from '../types';
import apiClient from '../utils/ApiClient';

interface CalculatorState {
  salary: number | '';
  age: number | '';
  dependents: number;
  industry: IndustryType;
  result: CalculationResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: CalculatorState = {
  salary: '',
  age: '',
  dependents: 0,
  industry: 'general',
  result: null,
  loading: false,
  error: null,
};

// 异步 thunk 用于从 API 获取社会保险数据
export const calculateResult = createAsyncThunk(
  'calculator/calculateResult',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { calculator: CalculatorState };
    const { salary, age, dependents, industry } = state.calculator;

    if (typeof salary !== 'number' || typeof age !== 'number') {
      return rejectWithValue('月薪和年龄必须为数字');
    }

    try {
      const apiResult = await apiClient.getSocialInsurance(salary, age);
      
      // 将 API 返回的数据转换为 CalculationResult 格式
      const employeeCost = apiResult.employeeCost;
      
      // 计算健康保险总额（基础保险 + 介护保险）
      const healthInsurance = employeeCost.healthCostWithNoCare + employeeCost.careCost;
      
      // 计算社会保险总额
      const socialInsuranceTotal = 
        healthInsurance + 
        employeeCost.pension + 
        employeeCost.employmentInsurance;

      // 使用后端返回的 ageCategory，如果没有则根据年龄计算（临时方案，建议后端返回）
      const ageCategory = apiResult.ageCategory || (
        age < 40 ? 'under40' : (age >= 40 && age < 65 ? '40to64' : 'over64')
      );

      // 构建 CalculationResult
      const result: CalculationResult = {
        grossSalary: salary,
        standardRemuneration: apiResult.standardRemuneration || salary, // 使用后端返回的值，如果没有则使用月薪
        healthInsurance: Math.round(healthInsurance),
        welfarePension: Math.round(employeeCost.pension),
        employmentInsurance: Math.round(employeeCost.employmentInsurance),
        socialInsuranceTotal: Math.round(socialInsuranceTotal),
        incomeTaxEstimate: Math.round(employeeCost.withholdingTax),
        takeHomePay: Math.round(salary - socialInsuranceTotal - employeeCost.withholdingTax),
        ageCategory,
        grade: apiResult.grade || 0, // 使用后端返回的等级，如果没有则设为 0
        dependents,
        industry,
      };

      return result;
    } catch (error: any) {
      // 处理不同类型的错误
      if (error.response) {
        // 服务器返回了错误状态码
        return rejectWithValue(`服务器错误: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        return rejectWithValue('网络错误: 无法连接到服务器，请检查后端服务是否运行在 http://localhost:9002');
      } else {
        // 其他错误
        return rejectWithValue(error.message || '获取社会保险数据失败');
      }
    }
  }
);

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setSalary(state, action: PayloadAction<number | ''>) {
      state.salary = action.payload;
    },
    setAge(state, action: PayloadAction<number | ''>) {
      state.age = action.payload;
    },
    setDependents(state, action: PayloadAction<number>) {
      state.dependents = action.payload;
    },
    setIndustry(state, action: PayloadAction<IndustryType>) {
      state.industry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateResult.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.error = null;
      })
      .addCase(calculateResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSalary, setAge, setDependents, setIndustry } = calculatorSlice.actions;
export default calculatorSlice.reducer;
