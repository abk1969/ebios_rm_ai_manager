import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BusinessValue } from '@/types/ebios';

interface BusinessValuesState {
  businessValues: BusinessValue[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessValuesState = {
  businessValues: [],
  loading: false,
  error: null,
};

const businessValuesSlice = createSlice({
  name: 'businessValues',
  initialState,
  reducers: {
    setBusinessValues: (state, action: PayloadAction<BusinessValue[]>) => {
      state.businessValues = action.payload;
    },
    addBusinessValue: (state, action: PayloadAction<BusinessValue>) => {
      state.businessValues.push(action.payload);
    },
    updateBusinessValue: (state, action: PayloadAction<BusinessValue>) => {
      const index = state.businessValues.findIndex(
        (bv) => bv.id === action.payload.id
      );
      if (index !== -1) {
        state.businessValues[index] = action.payload;
      }
    },
    deleteBusinessValue: (state, action: PayloadAction<string>) => {
      state.businessValues = state.businessValues.filter(
        (bv) => bv.id !== action.payload
      );
    },
  },
});

export const {
  setBusinessValues,
  addBusinessValue,
  updateBusinessValue,
  deleteBusinessValue,
} = businessValuesSlice.actions;
export default businessValuesSlice.reducer;