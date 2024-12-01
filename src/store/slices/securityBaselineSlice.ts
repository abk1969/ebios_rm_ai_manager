import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SecurityBaseline } from '@/types/ebios';

interface SecurityBaselineState {
  baselines: SecurityBaseline[];
  loading: boolean;
  error: string | null;
}

const initialState: SecurityBaselineState = {
  baselines: [],
  loading: false,
  error: null,
};

const securityBaselineSlice = createSlice({
  name: 'securityBaseline',
  initialState,
  reducers: {
    setBaselines: (state, action: PayloadAction<SecurityBaseline[]>) => {
      state.baselines = action.payload;
    },
    addBaseline: (state, action: PayloadAction<SecurityBaseline>) => {
      state.baselines.push(action.payload);
    },
    updateBaseline: (state, action: PayloadAction<SecurityBaseline>) => {
      const index = state.baselines.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.baselines[index] = action.payload;
      }
    },
    deleteBaseline: (state, action: PayloadAction<string>) => {
      state.baselines = state.baselines.filter(b => b.id !== action.payload);
    },
  },
});

export const {
  setBaselines,
  addBaseline,
  updateBaseline,
  deleteBaseline,
} = securityBaselineSlice.actions;
export default securityBaselineSlice.reducer;