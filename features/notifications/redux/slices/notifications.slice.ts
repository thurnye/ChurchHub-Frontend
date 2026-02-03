import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as notificationsRepo from '../../services/notifications.repository';
import type { NotificationsState, NotificationItem } from '../../types/notifications.types';

const CACHE_TTL = 5 * 60 * 1000;

const initialState: NotificationsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => notificationsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { notifications: NotificationsState }).notifications;
      return !(state.status === 'succeeded' && Date.now() - state.lastFetchedAt < CACHE_TTL);
    },
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<NotificationItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load notifications.';
      });
  },
});

export const { setSelected } = notificationsSlice.actions;
export default notificationsSlice.reducer;
