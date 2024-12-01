import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SecurityBaseline } from '@/types/ebios';

interface SecurityControlsState {
  controls: SecurityBaseline[];
  loading: boolean;
  error: string | null;
}

const initialState: SecurityControlsState = {
  controls: [],
  loading: false,
  error: null,
};

const securityControlsSlice = createSlice({
  name: 'securityControls',
  initialState,
  reducers: {
    setSecurityControls: (state, action: PayloadAction<SecurityBaseline[]>) => {
      state.controls = action.payload;
    },
    addSecurityControl: (state, action: PayloadAction<SecurityBaseline>) => {
      state.controls.push(action.payload);
    },
    updateSecurityControl: (state, action: PayloadAction<SecurityBaseline>) => {
      const index = state.controls.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.controls[index] = action.payload;
      }
    },
    deleteSecurityControl: (state, action: PayloadAction<string>) => {
      state.controls = state.controls.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setSecurityControls,
  addSecurityControl,
  updateSecurityControl,
  deleteSecurityControl,
} = securityControlsSlice.actions;

export default securityControlsSlice.reducer;