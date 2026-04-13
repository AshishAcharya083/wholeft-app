import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/src/store/store';

type HomepageState = {
  hasUploadedZip: boolean;
  lastUploadedAt: number | null;
};

const initialState: HomepageState = {
  hasUploadedZip: false,
  lastUploadedAt: null,
};

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    setHasUploadedZip(state, action: PayloadAction<boolean>) {
      state.hasUploadedZip = action.payload;
      state.lastUploadedAt = action.payload ? Date.now() : null;
    },
  },
});

export const { setHasUploadedZip } = homepageSlice.actions;

export const selectHasUploadedZip = (state: RootState) => state.homepage.hasUploadedZip;

export default homepageSlice.reducer;

