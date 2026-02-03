import { DATA_SOURCE } from '@/shared/utils/dataSource';
import type { SettingsItem } from '../types/settings.types';
import * as settingsApi from './settings.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<SettingsItem[]> {
  if (DATA_SOURCE === 'api') return settingsApi.fetchSettingsItems();
  return delay([]);
}

export async function getById(key: string): Promise<SettingsItem | null> {
  if (DATA_SOURCE === 'api') return settingsApi.fetchSettingsItemById(key);
  return delay(null);
}
