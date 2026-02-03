import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as groupsRepo from '../../services/groups.repository';
import type { GroupsState, GroupItem } from '../../types/groups.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: GroupsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async () => groupsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { groups: GroupsState }).groups;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<GroupItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load groups.';
      });
  },
});

export const { setSelected } = groupsSlice.actions;
export default groupsSlice.reducer;
