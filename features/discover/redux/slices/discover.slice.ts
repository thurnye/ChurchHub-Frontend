import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as discoverRepo from '../../services/discover.repository';
import type { DiscoverState, DiscoverItem } from '../../types/discover.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: DiscoverState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchDiscoverItems = createAsyncThunk(
  'discover/fetchAll',
  async () => discoverRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { discover: DiscoverState }).discover;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<DiscoverItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscoverItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDiscoverItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchDiscoverItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load discover items.';
      });
  },
});

export const { setSelected } = discoverSlice.actions;
export default discoverSlice.reducer;
