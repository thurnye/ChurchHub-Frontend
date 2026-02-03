export interface GiveItem {
  id: string;
  amount: number;
  churchId: string;
  date: string;
}

export interface GiveState {
  items: GiveItem[];
  selected: GiveItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
