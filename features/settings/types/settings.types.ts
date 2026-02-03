export interface SettingsItem {
  key: string;
  value: string;
}

export interface SettingsState {
  items: SettingsItem[];
  selected: SettingsItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
