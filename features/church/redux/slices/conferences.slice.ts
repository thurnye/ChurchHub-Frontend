import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as conferencesRepo from '../../services/conferences.repository';
import type { ConferencesState, ConferenceItem } from '../../types/conferences.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: ConferencesState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchConferences = createAsyncThunk(
  'conferences/fetchAll',
  async () => conferencesRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { conferences: ConferencesState }).conferences;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const conferencesSlice = createSlice({
  name: 'conferences',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<ConferenceItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConferences.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchConferences.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchConferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load conferences.';
      });
  },
});

export const { setSelected } = conferencesSlice.actions;
export default conferencesSlice.reducer;
