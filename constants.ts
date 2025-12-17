import { IndustryType } from './types';

// Employment Insurance Rates for Reiwa 7 (2025) - Worker Burden
// 用于显示保险料率信息
export const EMPLOYMENT_RATES: Record<IndustryType, number> = {
  general: 5.5 / 1000,       // 0.0055
  agriculture: 6.5 / 1000,    // 0.0065 (農林水産・清酒製造)
  construction: 6.5 / 1000,   // 0.0065 (建設)
};
