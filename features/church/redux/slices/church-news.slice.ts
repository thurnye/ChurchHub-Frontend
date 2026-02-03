import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as churchNewsRepo from '../../services/church-news.repository';
import type { ChurchNewsState, ChurchNewsItem } from '../../types/church-news.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: ChurchNewsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchChurchNews = createAsyncThunk(
  'churchNews/fetchAll',
  async () => churchNewsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { churchNews: ChurchNewsState }).churchNews;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const churchNewsSlice = createSlice({
  name: 'churchNews',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<ChurchNewsItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChurchNews.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchChurchNews.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchChurchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load church news.';
      });
  },
});

export const { setSelected } = churchNewsSlice.actions;
export default churchNewsSlice.reducer;
