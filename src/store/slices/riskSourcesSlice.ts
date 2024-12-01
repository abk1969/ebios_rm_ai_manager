import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RiskSource } from '@/types/ebios';

interface RiskSourcesState {
  riskSources: RiskSource[];
  loading: boolean;
  error: string | null;
}

const initialState: RiskSourcesState = {
  riskSources: [],
  loading: false,
  error: null,
};

const riskSourcesSlice = createSlice({
  name: 'riskSources',
  initialState,
  reducers: {
    setRiskSources: (state, action: PayloadAction<RiskSource[]>) => {
      state.riskSources = action.payload;
    },
    addRiskSource: (state, action: PayloadAction<RiskSource>) => {
      state.riskSources.push(action.payload);
    },
    updateRiskSource: (state, action: PayloadAction<RiskSource>) => {
      const index = state.riskSources.findIndex(
        (rs) => rs.id === action.payload.id
      );
      if (index !== -1) {
        state.riskSources[index] = action.payload;
      }
    },
    deleteRiskSource: (state, action: PayloadAction<string>) => {
      state.riskSources = state.riskSources.filter(
        (rs) => rs.id !== action.payload
      );
    },
  },
});

export const {
  setRiskSources,
  addRiskSource,
  updateRiskSource,
  deleteRiskSource,
} = riskSourcesSlice.actions;
export default riskSourcesSlice.reducer;