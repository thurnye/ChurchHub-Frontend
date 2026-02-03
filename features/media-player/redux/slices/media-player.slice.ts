import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as mediaPlayerRepo from '../../services/media-player.repository';
import type { MediaState, MediaItem } from '../../types/media-player.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: MediaState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchMediaItems = createAsyncThunk(
  'mediaPlayer/fetchAll',
  async () => mediaPlayerRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { mediaPlayer: MediaState }).mediaPlayer;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const mediaPlayerSlice = createSlice({
  name: 'mediaPlayer',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<MediaItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMediaItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchMediaItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load media items.';
      });
  },
});

export const { setSelected } = mediaPlayerSlice.actions;
export default mediaPlayerSlice.reducer;
