import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as prayerRepo from '../../services/prayer.repository';
import type { PrayerState, PrayerItem } from '../../types/prayer.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: PrayerState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchPrayerItems = createAsyncThunk(
  'prayer/fetchAll',
  async () => prayerRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { prayer: PrayerState }).prayer;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<PrayerItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrayerItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPrayerItems.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchPrayerItems.rejected, (state, action) => {
        state.status = 'failed';
        state.items = [];
        state.error = action.error.message ?? 'Failed to load prayer items.';
      });
  },
});

export const { setSelected } = prayerSlice.actions;
export default prayerSlice.reducer;
