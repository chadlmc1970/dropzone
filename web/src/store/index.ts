import { configureStore } from '@reduxjs/toolkit';
import decksReducer from './decksSlice';
import mixerReducer from './mixerSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    decks: decksReducer,
    mixer: mixerReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
