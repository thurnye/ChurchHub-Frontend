import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as eventsRepo from '../../services/events.repository';
import type { EventsState, EventItem } from '../../types/events.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: EventsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async () => eventsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { events: EventsState }).events;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<EventItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load events.';
      });
  },
});

export const { setSelected } = eventsSlice.actions;
export default eventsSlice.reducer;
