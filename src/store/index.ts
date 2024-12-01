import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import missionsReducer from './slices/missionsSlice';
import businessValuesReducer from './slices/businessValuesSlice';
import supportingAssetsReducer from './slices/supportingAssetsSlice';
import securityControlsReducer from './slices/securityControlsSlice';
import riskSourcesReducer from './slices/riskSourcesSlice';
import workshopsReducer from './slices/workshopsSlice';
import stakeholdersReducer from './slices/stakeholdersSlice';
import attackPathsReducer from './slices/attackPathsSlice';
import securityMeasuresReducer from './slices/securityMeasuresSlice';

export const store = configureStore({
  reducer: {
    missions: missionsReducer,
    businessValues: businessValuesReducer,
    supportingAssets: supportingAssetsReducer,
    securityControls: securityControlsReducer,
    riskSources: riskSourcesReducer,
    workshops: workshopsReducer,
    stakeholders: stakeholdersReducer,
    attackPaths: attackPathsReducer,
    securityMeasures: securityMeasuresReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;