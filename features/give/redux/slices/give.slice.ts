import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as giveRepo from '../../services/give.repository';
import type { GiveState, GiveItem } from '../../types/give.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: GiveState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchGiveItems = createAsyncThunk(
  'give/fetchAll',
  async () => giveRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { give: GiveState }).give;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const giveSlice = createSlice({
  name: 'give',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<GiveItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGiveItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchGiveItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchGiveItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load give items.';
      });
  },
});

export const { setSelected } = giveSlice.actions;
export default giveSlice.reducer;
