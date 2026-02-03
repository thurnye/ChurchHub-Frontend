import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as worshipRepo from '../../services/worship.repository';
import type { WorshipState, WorshipItem } from '../../types/worship.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: WorshipState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchWorshipItems = createAsyncThunk(
  'worship/fetchAll',
  async () => worshipRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { worship: WorshipState }).worship;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const worshipSlice = createSlice({
  name: 'worship',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<WorshipItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorshipItems.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchWorshipItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchWorshipItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load worship items.';
      });
  },
});

export const { setSelected } = worshipSlice.actions;
export default worshipSlice.reducer;
