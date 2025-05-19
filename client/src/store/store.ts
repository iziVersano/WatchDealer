import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import watchReducer from './watchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watches: watchReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
