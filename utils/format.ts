/**
 * 格式化日元金额
 */
export const formatYen = (num: number): string => {
  return new Intl.NumberFormat('ja-JP', { 
    style: 'currency', 
    currency: 'JPY', 
    maximumFractionDigits: 0 
  }).format(num);
};

