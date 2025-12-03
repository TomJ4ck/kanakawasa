import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculationResult, IndustryType } from '../types';
import { calculatePay } from '../utils/calculator';

interface CalculatorState {
  salary: number | '';
  age: number | '';
  dependents: number;
  industry: IndustryType;
  result: CalculationResult | null;
}

const initialState: CalculatorState = {
  salary: '',
  age: '',
  dependents: 0,
  industry: 'general',
  result: null,
};

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
    calculateResult(state) {
      if (typeof state.salary === 'number' && typeof state.age === 'number') {
        let ageCategory: 'under40' | '40to64' | 'over64';
        if (state.age < 40) {
          ageCategory = 'under40';
        } else if (state.age >= 40 && state.age < 65) {
          ageCategory = '40to64';
        } else {
          ageCategory = 'over64';
        }
        state.result = calculatePay(state.salary, ageCategory, state.dependents, state.industry);
      }
    },
  },
});

export const { setSalary, setAge, setDependents, setIndustry, calculateResult } = calculatorSlice.actions;
export default calculatorSlice.reducer;
