export type IndustryType = 'general' | 'agriculture' | 'construction';

export interface GradeRow {
  grade: number;
  standard: number;
  min: number;
  max: number;
}

export interface CalculationResult {
  grossSalary: number;
  standardRemuneration: number; // The standardized amount used for lookups
  healthInsurance: number;
  welfarePension: number;
  employmentInsurance: number;
  socialInsuranceTotal: number;
  incomeTaxEstimate: number;
  takeHomePay: number;
  ageCategory: 'under40' | '40to64' | 'over64';
  grade: number;
  dependents: number;
  industry: IndustryType;
}

// 社会保险费用明细
export interface SocialInsuranceCost {
  careCost: number; // 介护保险金额
  employmentInsurance: number; // 雇佣保险费
  healthCostWithNoCare: number; // 保险金额（不含介护）
  pension: number; // 厚生年金金额
  withholdingTax: number; // 源泉征收税
}

// 社会保险 DTO
export interface SocialInsuranceDTO {
  employeeCost: SocialInsuranceCost; // 员工需要支付的金额
  employerCost: SocialInsuranceCost; // 公司需要支付的金额
}