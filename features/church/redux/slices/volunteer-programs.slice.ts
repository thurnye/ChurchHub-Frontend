import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as volunteerProgramsRepo from '../../services/volunteer-programs.repository';
import type { VolunteerProgramsState, VolunteerProgramItem } from '../../types/volunteer-programs.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: VolunteerProgramsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchVolunteerPrograms = createAsyncThunk(
  'volunteerPrograms/fetchAll',
  async () => volunteerProgramsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { volunteerPrograms: VolunteerProgramsState }).volunteerPrograms;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const volunteerProgramsSlice = createSlice({
  name: 'volunteerPrograms',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<VolunteerProgramItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolunteerPrograms.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchVolunteerPrograms.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchVolunteerPrograms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load volunteer programs.';
      });
  },
});

export const { setSelected } = volunteerProgramsSlice.actions;
export default volunteerProgramsSlice.reducer;
