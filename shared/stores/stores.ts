import { configureStore } from '@reduxjs/toolkit';
import bibleReducer from '@/features/bible/redux/slices/bible.slice';
import sermonsReducer from '@/features/sermons/redux/slices/sermons.slice';
import eventsReducer from '@/features/events/redux/slices/events.slice';
import notificationsReducer from '@/features/notifications/redux/slices/notifications.slice';
import communityReducer from '@/features/community/redux/slices/community.slice';
import groupsReducer from '@/features/groups/redux/slices/groups.slice';
import churchReducer from '@/features/church/redux/slices/church.slice';
import homeReducer from '@/features/home/redux/slices/home.slice';
import prayerReducer from '@/features/prayer/redux/slices/prayer.slice';
import profileReducer from '@/features/profile/redux/slices/profile.slice';
import authReducer from '@/features/auth/redux/slices/auth.slice';
import discoverReducer from '@/features/discover/redux/slices/discover.slice';
import worshipReducer from '@/features/worship/redux/slices/worship.slice';
import giveReducer from '@/features/give/redux/slices/give.slice';
import mediaPlayerReducer from '@/features/media-player/redux/slices/media-player.slice';
import settingsReducer from '@/features/settings/redux/slices/settings.slice';
import conferencesReducer from '@/features/church/redux/slices/conferences.slice';
import careersReducer from '@/features/church/redux/slices/careers.slice';
import volunteerProgramsReducer from '@/features/church/redux/slices/volunteer-programs.slice';
import churchNewsReducer from '@/features/church/redux/slices/church-news.slice';
import devotionalsReducer from '@/features/church/redux/slices/devotionals.slice';

/**
 * Centralized Redux store for the entire ChurchHub application.
 * All feature reducers are registered here.
 */
export const store = configureStore({
  reducer: {
    bible: bibleReducer,
    sermons: sermonsReducer,
    events: eventsReducer,
    notifications: notificationsReducer,
    community: communityReducer,
    groups: groupsReducer,
    church: churchReducer,
    home: homeReducer,
    prayer: prayerReducer,
    profile: profileReducer,
    auth: authReducer,
    discover: discoverReducer,
    worship: worshipReducer,
    give: giveReducer,
    mediaPlayer: mediaPlayerReducer,
    settings: settingsReducer,
    conferences: conferencesReducer,
    careers: careersReducer,
    volunteerPrograms: volunteerProgramsReducer,
    churchNews: churchNewsReducer,
    devotionals: devotionalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
