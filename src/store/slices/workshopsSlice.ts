import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Workshop } from '@/types/ebios';

interface WorkshopsState {
  workshops: Workshop[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkshopsState = {
  workshops: [],
  loading: false,
  error: null,
};

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {
    setWorkshops: (state, action: PayloadAction<Workshop[]>) => {
      state.workshops = action.payload;
    },
    addWorkshop: (state, action: PayloadAction<Workshop>) => {
      state.workshops.push(action.payload);
    },
    updateWorkshop: (state, action: PayloadAction<Workshop>) => {
      const index = state.workshops.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workshops[index] = action.payload;
      }
    },
    deleteWorkshop: (state, action: PayloadAction<string>) => {
      state.workshops = state.workshops.filter(w => w.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWorkshops,
  addWorkshop,
  updateWorkshop,
  deleteWorkshop,
  setLoading,
  setError,
} = workshopsSlice.actions;

export default workshopsSlice.reducer;