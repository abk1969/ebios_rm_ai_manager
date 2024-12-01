import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SecurityMeasure } from '@/types/ebios';

interface SecurityMeasuresState {
  measures: SecurityMeasure[];
  loading: boolean;
  error: string | null;
}

const initialState: SecurityMeasuresState = {
  measures: [],
  loading: false,
  error: null,
};

const securityMeasuresSlice = createSlice({
  name: 'securityMeasures',
  initialState,
  reducers: {
    setSecurityMeasures: (state, action: PayloadAction<SecurityMeasure[]>) => {
      state.measures = action.payload;
    },
    addSecurityMeasure: (state, action: PayloadAction<SecurityMeasure>) => {
      state.measures.push(action.payload);
    },
    updateSecurityMeasure: (state, action: PayloadAction<SecurityMeasure>) => {
      const index = state.measures.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.measures[index] = action.payload;
      }
    },
    deleteSecurityMeasure: (state, action: PayloadAction<string>) => {
      state.measures = state.measures.filter(m => m.id !== action.payload);
    },
  },
});

export const {
  setSecurityMeasures,
  addSecurityMeasure,
  updateSecurityMeasure,
  deleteSecurityMeasure,
} = securityMeasuresSlice.actions;

export default securityMeasuresSlice.reducer;