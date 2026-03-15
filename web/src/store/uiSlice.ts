import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, MixingMode } from '../types';

const initialState: UIState = {
  mode: 'manual',
  activeDeck: 'A',
  showTrackSearch: false,
  searchTarget: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<MixingMode>) => {
      state.mode = action.payload;
    },
    setActiveDeck: (state, action: PayloadAction<'A' | 'B'>) => {
      state.activeDeck = action.payload;
    },
    toggleTrackSearch: (state, action: PayloadAction<'A' | 'B' | null>) => {
      state.showTrackSearch = !state.showTrackSearch;
      state.searchTarget = action.payload;
    },
    closeTrackSearch: (state) => {
      state.showTrackSearch = false;
      state.searchTarget = null;
    },
  },
});

export const { setMode, setActiveDeck, toggleTrackSearch, closeTrackSearch } = uiSlice.actions;

export default uiSlice.reducer;
