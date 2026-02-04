// src/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Example: creating an empty reducer for now
const store = configureStore({
  reducer: {
    //for more updates slices will be added here
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
