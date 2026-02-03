import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as sermonsRepo from '../../services/sermons.repository';
import type { SermonsState, SermonItem } from '../../types/sermon.types';

// ─── State ──────────────────────────────────────────────────────────────────

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const initialState: SermonsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

// ─── Thunks ─────────────────────────────────────────────────────────────────

export const fetchSermons = createAsyncThunk(
  'sermons/fetchAll',
  async () => sermonsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { sermons: SermonsState }).sermons;
      return !(
        state.status === 'succeeded' &&
        Date.now() - state.lastFetchedAt < CACHE_TTL
      );
    },
  },
);

export const fetchSermonById = createAsyncThunk(
  'sermons/fetchById',
  async (id: string) => sermonsRepo.getById(id),
);

// ─── Slice ──────────────────────────────────────────────────────────────────

const sermonsSlice = createSlice({
  name: 'sermons',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<SermonItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSermons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSermons.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchSermons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load sermons.';
      })
      .addCase(fetchSermonById.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const { setSelected } = sermonsSlice.actions;
export default sermonsSlice.reducer;
