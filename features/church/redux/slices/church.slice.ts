import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as churchRepo from '../../services/church.repository';
import type { ChurchState, ChurchItem } from '../../types/church.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: ChurchState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchChurches = createAsyncThunk(
  'church/fetchAll',
  async () => churchRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { church: ChurchState }).church;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const churchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<ChurchItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChurches.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchChurches.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchChurches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load churches.';
      });
  },
});

export const { setSelected } = churchSlice.actions;
export default churchSlice.reducer;
