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
  booksByBibleId: Record<string, ApiBibleBook[]>;
  booksStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>;
  booksFilter: string; // 'ALL' or a bookId
  lastFetchedAt: {
    bibles: number;
    books: Record<string, number>;
  };
}

const initialState: BibleState = {
  bibles: [],
  biblesStatus: 'idle',
  biblesError: null,
  selectedBibleId: '',
  booksByBibleId: {},
  booksStatus: {},
  booksFilter: 'ALL',
  lastFetchedAt: {
    bibles: 0,
    books: {},
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
  async (bibleId: string) => {
    const books = await fetchBooksForBible(bibleId);
    return { bibleId, books };
  },
  {
    condition: (bibleId, { getState }) => {
      const state = (getState() as { bible: BibleState }).bible;
      const lastFetched = state.lastFetchedAt.books[bibleId] ?? 0;
      return !(
        state.booksStatus[bibleId] === 'succeeded' &&
        Date.now() - lastFetched < CACHE_TTL
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
      .addCase(loadBooks.pending, (state, action) => {
        state.booksStatus[action.meta.arg] = 'loading';
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        const { bibleId, books } = action.payload;
        state.booksByBibleId[bibleId] = books;
        state.booksStatus[bibleId] = 'succeeded';
        state.lastFetchedAt.books[bibleId] = Date.now();
      })
      .addCase(loadBooks.rejected, (state, action) => {
        state.booksStatus[action.meta.arg] = 'failed';
      });
  },
});

export const { setSelectedBibleId, setBooksFilter } = bibleSlice.actions;
export default bibleSlice.reducer;
