import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as communityRepo from '../../services/community.repository';
import type { CommunityState, CommunityItem } from '../../types/community.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: CommunityState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchCommunityItems = createAsyncThunk(
  'community/fetchAll',
  async () => communityRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { community: CommunityState }).community;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<CommunityItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCommunityItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchCommunityItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load community items.';
      });
  },
});

export const { setSelected } = communitySlice.actions;
export default communitySlice.reducer;
