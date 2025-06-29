import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Mission } from '@/types/ebios';

interface MissionsState {
  missions: Mission[];
  selectedMission: Mission | null;
  loading: boolean;
  error: string | null;
}

const initialState: MissionsState = {
  missions: [],
  selectedMission: null,
  loading: false,
  error: null,
};

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setMissions: (state, action: PayloadAction<Mission[]>) => {
      state.missions = action.payload;
    },
    setSelectedMission: (state, action: PayloadAction<Mission | null>) => {
      state.selectedMission = action.payload;
    },
    addMission: (state, action: PayloadAction<Mission>) => {
      state.missions.push(action.payload);
    },
    updateMission: (state, action: PayloadAction<Mission>) => {
      const index = state.missions.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.missions[index] = action.payload;
      }
    },
    deleteMission: (state, action: PayloadAction<string>) => {
      state.missions = state.missions.filter((m) => m.id !== action.payload);
    },
  },
});

export const { setMissions, setSelectedMission, addMission, updateMission, deleteMission } =
  missionsSlice.actions;
export default missionsSlice.reducer;