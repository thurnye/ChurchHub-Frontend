import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as communityRepo from '../../services/community.repository';
import type { CommunityState, CommunityProgram, ProgramType } from '../../types/community.types';

const CACHE_TTL = 5 * 60 * 1000;
const PAGE_SIZE = 20;

const initialState: CommunityState = {
  items: [],
  selected: null,
  selectedStatus: 'idle',
  categories: [],
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
  page: 1,
  hasMore: true,
  loadingMore: false,
};

interface FetchParams {
  type?: ProgramType;
  category?: string;
  refresh?: boolean;
}

export const fetchCommunityItems = createAsyncThunk(
  'community/fetchAll',
  async (params: FetchParams | undefined, { getState }) => {
    const result = await communityRepo.getAll({ ...params, page: 1, limit: PAGE_SIZE });
    return { ...result, refresh: params?.refresh ?? true };
  },
  {
    condition: (params, { getState }) => {
      if (params?.refresh) return true;
      const state = (getState() as { community: CommunityState }).community;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

export const fetchMoreCommunityItems = createAsyncThunk(
  'community/fetchMore',
  async (params: FetchParams | undefined, { getState }) => {
    const state = (getState() as { community: CommunityState }).community;
    const nextPage = state.page + 1;
    const result = await communityRepo.getAll({ ...params, page: nextPage, limit: PAGE_SIZE });
    return result;
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { community: CommunityState }).community;
      return state.hasMore && !state.loadingMore && state.status !== 'loading';
    },
  },
);

export const fetchProgramById = createAsyncThunk(
  'community/fetchById',
  async (id: string) => communityRepo.getById(id),
);

export const fetchCategories = createAsyncThunk(
  'community/fetchCategories',
  async () => communityRepo.getCategories(),
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<CommunityProgram | null>) {
      state.selected = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
      state.selectedStatus = 'idle';
    },
    resetPagination(state) {
      state.page = 1;
      state.hasMore = true;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch initial items
      .addCase(fetchCommunityItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommunityItems.fulfilled, (state, action) => {
        const { items, meta, refresh } = action.payload;
        state.items = Array.isArray(items) ? items : [];
        state.page = meta.page;
        state.hasMore = meta.page < meta.totalPages;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
        state.error = null;
      })
      .addCase(fetchCommunityItems.rejected, (state, action) => {
        state.status = 'failed';
        state.items = [];
        state.error = action.error.message ?? 'Failed to load community programs.';
      })
      // Fetch more items (pagination)
      .addCase(fetchMoreCommunityItems.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(fetchMoreCommunityItems.fulfilled, (state, action) => {
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
      .addCase(fetchMoreCommunityItems.rejected, (state) => {
        state.loadingMore = false;
      })
      // Fetch single program by ID
      .addCase(fetchProgramById.pending, (state) => {
        state.selectedStatus = 'loading';
      })
      .addCase(fetchProgramById.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.selectedStatus = 'succeeded';
      })
      .addCase(fetchProgramById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.error = action.error.message ?? 'Failed to load program details.';
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export const { setSelected, clearSelected, resetPagination } = communitySlice.actions;
export default communitySlice.reducer;
