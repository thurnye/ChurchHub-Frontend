import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as careersRepo from '../../services/careers.repository';
import type { CareersState, CareerItem } from '../../types/careers.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: CareersState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchCareers = createAsyncThunk(
  'careers/fetchAll',
  async () => careersRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { careers: CareersState }).careers;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const careersSlice = createSlice({
  name: 'careers',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<CareerItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCareers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchCareers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load careers.';
      });
  },
});

export const { setSelected } = careersSlice.actions;
export default careersSlice.reducer;
