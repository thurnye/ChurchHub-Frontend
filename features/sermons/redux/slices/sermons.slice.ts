import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as sermonsRepo from '../../services/sermons.repository';
import type { SermonsState, SermonItem } from '../../types/sermon.types';

// ─── Constants ───────────────────────────────────────────────────────────────

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 20;

// ─── State ──────────────────────────────────────────────────────────────────

const initialState: SermonsState = {
  items: [],
  selected: null,
  selectedStatus: 'idle',
  speakers: [],
  tags: [],
  selectedTag: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
  page: 1,
  hasMore: true,
  loadingMore: false,
};

// ─── Fetch Params ────────────────────────────────────────────────────────────

interface FetchParams {
  tag?: string;
  refresh?: boolean;
}

// ─── Thunks ─────────────────────────────────────────────────────────────────

export const fetchSermons = createAsyncThunk(
  'sermons/fetchAll',
  async (params: FetchParams | undefined, { getState }) => {
    const tag = params?.tag || undefined;
    const result = await sermonsRepo.getAll({ tag, page: 1, limit: PAGE_SIZE });
    return { ...result, refresh: params?.refresh ?? true, tag };
  },
  {
    condition: (params, { getState }) => {
      if (params?.refresh) return true;
      if (params?.tag) return true; // Always refetch when tag changes
      const state = (getState() as { sermons: SermonsState }).sermons;
      return !(
        state.status === 'succeeded' &&
        Date.now() - state.lastFetchedAt < CACHE_TTL
      );
    },
  },
);

export const fetchMoreSermons = createAsyncThunk(
  'sermons/fetchMore',
  async (params: FetchParams | undefined, { getState }) => {
    const state = (getState() as { sermons: SermonsState }).sermons;
    const nextPage = state.page + 1;
    const tag = params?.tag || state.selectedTag || undefined;
    const result = await sermonsRepo.getAll({ tag, page: nextPage, limit: PAGE_SIZE });
    return result;
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { sermons: SermonsState }).sermons;
      return state.hasMore && !state.loadingMore && state.status !== 'loading';
    },
  },
);

export const fetchSermonById = createAsyncThunk(
  'sermons/fetchById',
  async (id: string) => sermonsRepo.getById(id),
);

export const fetchTags = createAsyncThunk(
  'sermons/fetchTags',
  async () => sermonsRepo.getTags(),
);

export const fetchSpeakers = createAsyncThunk(
  'sermons/fetchSpeakers',
  async () => sermonsRepo.getSpeakers(),
);

// ─── Slice ──────────────────────────────────────────────────────────────────

const sermonsSlice = createSlice({
  name: 'sermons',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<SermonItem | null>) {
      state.selected = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
      state.selectedStatus = 'idle';
    },
    setSelectedTag(state, action: PayloadAction<string | null>) {
      state.selectedTag = action.payload;
    },
    resetPagination(state) {
      state.page = 1;
      state.hasMore = true;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sermons
      .addCase(fetchSermons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSermons.fulfilled, (state, action) => {
        const { items, meta, tag } = action.payload;
        state.items = Array.isArray(items) ? items : [];
        state.page = meta.page;
        state.hasMore = meta.page < meta.totalPages;
        state.selectedTag = tag ?? null;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
        state.error = null;
      })
      .addCase(fetchSermons.rejected, (state, action) => {
        state.status = 'failed';
        state.items = [];
        state.error = action.error.message ?? 'Failed to load sermons.';
      })
      // Fetch more sermons (pagination)
      .addCase(fetchMoreSermons.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(fetchMoreSermons.fulfilled, (state, action) => {
        const { items, meta } = action.payload;
        const newItems = Array.isArray(items) ? items : [];
        // Deduplicate by _id
        const existingIds = new Set(state.items.map((item) => item._id));
        const uniqueNewItems = newItems.filter((item) => !existingIds.has(item._id));
        state.items = [...state.items, ...uniqueNewItems];
        state.page = meta.page;
        state.hasMore = meta.page < meta.totalPages;
        state.loadingMore = false;
      })
      .addCase(fetchMoreSermons.rejected, (state) => {
        state.loadingMore = false;
      })
      // Fetch single sermon by ID
      .addCase(fetchSermonById.pending, (state) => {
        state.selectedStatus = 'loading';
      })
      .addCase(fetchSermonById.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.selectedStatus = 'succeeded';
      })
      .addCase(fetchSermonById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.error = action.error.message ?? 'Failed to load sermon.';
      })
      // Fetch tags
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = Array.isArray(action.payload) ? action.payload : [];
      })
      // Fetch speakers
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.speakers = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export const { setSelected, clearSelected, setSelectedTag, resetPagination } = sermonsSlice.actions;
export default sermonsSlice.reducer;
