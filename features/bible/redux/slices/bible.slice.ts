import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  fetchEnglishBibles,
  fetchBooksForBible,
  type ApiBible,
  type ApiBibleBook,
} from '../../services/bibleService';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── State ──────────────────────────────────────────────────────────────────

interface BibleState {
  bibles: ApiBible[];
  biblesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  biblesError: string | null;
  selectedBibleId: string;
  books: ApiBibleBook[];
  booksStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  booksFilter: string; // 'ALL' or a bookId
  lastFetchedAt: {
    bibles: number;
    books: number;
  };
}

const initialState: BibleState = {
  bibles: [],
  biblesStatus: 'idle',
  biblesError: null,
  selectedBibleId: '',
  books: [],
  booksStatus: 'idle',
  booksFilter: 'ALL',
  lastFetchedAt: {
    bibles: 0,
    books: 0,
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function pickKjv(bibles: ApiBible[]): string {
  const kjv = bibles.find(
    (b) => (b.abbreviationLocal ?? b.abbreviation).toLowerCase() === 'kjv',
  );
  if (kjv) return kjv.id;
  const fallback = bibles.find((b) => b.name.toLowerCase().includes('king james'));
  return fallback?.id ?? bibles[0]?.id ?? '';
}

// ─── Thunks ─────────────────────────────────────────────────────────────────

export const loadBibles = createAsyncThunk(
  'bible/loadBibles',
  async () => {
    return await fetchEnglishBibles();
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { bible: BibleState }).bible;
      return !(
        state.biblesStatus === 'succeeded' &&
        Date.now() - state.lastFetchedAt.bibles < CACHE_TTL
      );
    },
  },
);

export const loadBooks = createAsyncThunk(
  'bible/loadBooks',
  async () => {
    return await fetchBooksForBible();
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { bible: BibleState }).bible;
      return !(
        state.booksStatus === 'succeeded' &&
        Date.now() - state.lastFetchedAt.books < CACHE_TTL
      );
    },
  },
);

// ─── Slice ──────────────────────────────────────────────────────────────────

const bibleSlice = createSlice({
  name: 'bible',
  initialState,
  reducers: {
    setSelectedBibleId(state, action: PayloadAction<string>) {
      state.selectedBibleId = action.payload;
    },
    setBooksFilter(state, action: PayloadAction<string>) {
      state.booksFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBibles.pending, (state) => {
        state.biblesStatus = 'loading';
      })
      .addCase(loadBibles.fulfilled, (state, action) => {
        state.bibles = action.payload;
        state.biblesStatus = 'succeeded';
        state.lastFetchedAt.bibles = Date.now();
        if (!state.selectedBibleId) {
          state.selectedBibleId = pickKjv(action.payload);
        }
      })
      .addCase(loadBibles.rejected, (state, action) => {
        state.biblesStatus = 'failed';
        state.biblesError = action.error.message ?? 'Failed to load translations.';
      })
      .addCase(loadBooks.pending, (state) => {
        state.booksStatus = 'loading';
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.booksStatus = 'succeeded';
        state.lastFetchedAt.books = Date.now();
      })
      .addCase(loadBooks.rejected, (state) => {
        state.booksStatus = 'failed';
      });
  },
});

export const { setSelectedBibleId, setBooksFilter } = bibleSlice.actions;
export default bibleSlice.reducer;
