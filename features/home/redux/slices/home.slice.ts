import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as homeRepo from '../../services/home.repository';
import type { HomeState, HomeItem } from '../../types/home.types';

const CACHE_TTL = 5 * 60 * 1000;
const PAGE_SIZE = 10;

const initialState: HomeState = {
  items: [],
  selected: null,
  status: 'idle',
  loadingMore: false,
  error: null,
  lastFetchedAt: 0,
  page: 1,
  hasNext: true,
  total: 0,
};

// Fetch initial items (page 1)
export const fetchHomeItems = createAsyncThunk(
  'home/fetchAll',
  async () => homeRepo.getAll(1, PAGE_SIZE),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { home: HomeState }).home;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

// Force refresh - bypasses cache, resets to page 1
export const refreshHomeItems = createAsyncThunk(
  'home/refresh',
  async () => homeRepo.getAll(1, PAGE_SIZE),
);

// Load more items (next page)
export const loadMoreHomeItems = createAsyncThunk(
  'home/loadMore',
  async (_, { getState }) => {
    const state = (getState() as { home: HomeState }).home;
    const nextPage = state.page + 1;
    return homeRepo.getAll(nextPage, PAGE_SIZE);
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { home: HomeState }).home;
      // Don't load more if already loading or no more items
      return !state.loadingMore && state.hasNext;
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
    clearCache(state) {
      state.lastFetchedAt = 0;
      state.page = 1;
      state.hasNext = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch initial items
      .addCase(fetchHomeItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHomeItems.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
        state.page = action.payload.page;
        state.hasNext = action.payload.hasNext;
        state.total = action.payload.total;
      })
      .addCase(fetchHomeItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load home items.';
      })
      // Refresh actions
      .addCase(refreshHomeItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshHomeItems.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
        state.page = action.payload.page;
        state.hasNext = action.payload.hasNext;
        state.total = action.payload.total;
      })
      .addCase(refreshHomeItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to refresh home items.';
      })
      // Load more actions
      .addCase(loadMoreHomeItems.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(loadMoreHomeItems.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.data];
        state.loadingMore = false;
        state.page = action.payload.page;
        state.hasNext = action.payload.hasNext;
        state.total = action.payload.total;
      })
      .addCase(loadMoreHomeItems.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message ?? 'Failed to load more items.';
      });
  },
});

export const { setSelected, clearCache } = homeSlice.actions;
export default homeSlice.reducer;
