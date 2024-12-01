import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SupportingAsset } from '@/types/ebios';

interface SupportingAssetsState {
  assets: SupportingAsset[];
  loading: boolean;
  error: string | null;
}

const initialState: SupportingAssetsState = {
  assets: [],
  loading: false,
  error: null,
};

const supportingAssetsSlice = createSlice({
  name: 'supportingAssets',
  initialState,
  reducers: {
    setSupportingAssets: (state, action: PayloadAction<SupportingAsset[]>) => {
      state.assets = action.payload;
    },
    addSupportingAsset: (state, action: PayloadAction<SupportingAsset>) => {
      state.assets.push(action.payload);
    },
    updateSupportingAsset: (state, action: PayloadAction<SupportingAsset>) => {
      const index = state.assets.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.assets[index] = action.payload;
      }
    },
    deleteSupportingAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(a => a.id !== action.payload);
    },
  },
});

export const {
  setSupportingAssets,
  addSupportingAsset,
  updateSupportingAsset,
  deleteSupportingAsset,
} = supportingAssetsSlice.actions;

export default supportingAssetsSlice.reducer;