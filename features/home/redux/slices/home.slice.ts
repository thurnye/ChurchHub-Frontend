import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as homeRepo from '../../services/home.repository';
import type { HomeState, HomeItem } from '../../types/home.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: HomeState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchHomeItems = createAsyncThunk(
  'home/fetchAll',
  async () => homeRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { home: HomeState }).home;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<HomeItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchHomeItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchHomeItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load home items.';
      });
  },
});

export const { setSelected } = homeSlice.actions;
export default homeSlice.reducer;
