import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Stakeholder } from '@/types/ebios';

interface StakeholdersState {
  stakeholders: Stakeholder[];
  loading: boolean;
  error: string | null;
}

const initialState: StakeholdersState = {
  stakeholders: [],
  loading: false,
  error: null,
};

const stakeholdersSlice = createSlice({
  name: 'stakeholders',
  initialState,
  reducers: {
    setStakeholders: (state, action: PayloadAction<Stakeholder[]>) => {
      state.stakeholders = action.payload;
    },
    addStakeholder: (state, action: PayloadAction<Stakeholder>) => {
      state.stakeholders.push(action.payload);
    },
    updateStakeholder: (state, action: PayloadAction<Stakeholder>) => {
      const index = state.stakeholders.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.stakeholders[index] = action.payload;
      }
    },
    deleteStakeholder: (state, action: PayloadAction<string>) => {
      state.stakeholders = state.stakeholders.filter(s => s.id !== action.payload);
    },
  },
});

export const {
  setStakeholders,
  addStakeholder,
  updateStakeholder,
  deleteStakeholder,
} = stakeholdersSlice.actions;

export default stakeholdersSlice.reducer;