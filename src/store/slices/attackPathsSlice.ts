import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AttackPath } from '@/types/ebios';

interface AttackPathsState {
  paths: AttackPath[];
  loading: boolean;
  error: string | null;
}

const initialState: AttackPathsState = {
  paths: [],
  loading: false,
  error: null,
};

const attackPathsSlice = createSlice({
  name: 'attackPaths',
  initialState,
  reducers: {
    setAttackPaths: (state, action: PayloadAction<AttackPath[]>) => {
      state.paths = action.payload;
    },
    addAttackPath: (state, action: PayloadAction<AttackPath>) => {
      state.paths.push(action.payload);
    },
    updateAttackPath: (state, action: PayloadAction<AttackPath>) => {
      const index = state.paths.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.paths[index] = action.payload;
      }
    },
    deleteAttackPath: (state, action: PayloadAction<string>) => {
      state.paths = state.paths.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setAttackPaths,
  addAttackPath,
  updateAttackPath,
  deleteAttackPath,
} = attackPathsSlice.actions;

export default attackPathsSlice.reducer;