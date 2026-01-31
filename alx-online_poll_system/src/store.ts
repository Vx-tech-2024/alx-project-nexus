// src/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Example: create an empty reducer for now
const store = configureStore({
  reducer: {
    // you will add slices here later
  },
});

// Optional: Infer types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
