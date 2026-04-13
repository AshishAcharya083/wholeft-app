import { configureStore } from '@reduxjs/toolkit';

import homepageReducer from '@/src/features/homepage/homepageSlice';

export const store = configureStore({
  reducer: {
    homepage: homepageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

