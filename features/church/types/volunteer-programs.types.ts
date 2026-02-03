import type { VolunteerProgram } from '@/data/mockData';

export type VolunteerProgramItem = VolunteerProgram;

export interface VolunteerProgramsState {
  items: VolunteerProgramItem[];
  selected: VolunteerProgramItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
