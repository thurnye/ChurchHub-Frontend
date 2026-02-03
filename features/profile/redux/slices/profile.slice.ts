import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as profileRepo from '../../services/profile.repository';
import type { ProfileState, ProfileItem } from '../../types/profile.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: ProfileState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchProfiles = createAsyncThunk(
  'profile/fetchAll',
  async () => profileRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { profile: ProfileState }).profile;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<ProfileItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load profiles.';
      });
  },
});

export const { setSelected } = profileSlice.actions;
export default profileSlice.reducer;
