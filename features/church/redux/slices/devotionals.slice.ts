import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as devotionalsRepo from '../../services/devotionals.repository';
import type { DevotionalsState, DevotionalItem } from '../../types/devotionals.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: DevotionalsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchDevotionals = createAsyncThunk(
  'devotionals/fetchAll',
  async () => devotionalsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { devotionals: DevotionalsState }).devotionals;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const devotionalsSlice = createSlice({
  name: 'devotionals',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<DevotionalItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevotionals.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDevotionals.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchDevotionals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load devotionals.';
      });
  },
});

export const { setSelected } = devotionalsSlice.actions;
export default devotionalsSlice.reducer;
