import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as settingsRepo from '../../services/settings.repository';
import type { SettingsState, SettingsItem } from '../../types/settings.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: SettingsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchSettingsItems = createAsyncThunk(
  'settings/fetchAll',
  async () => settingsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { settings: SettingsState }).settings;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<SettingsItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettingsItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchSettingsItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchSettingsItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load settings items.';
      });
  },
});

export const { setSelected } = settingsSlice.actions;
export default settingsSlice.reducer;
