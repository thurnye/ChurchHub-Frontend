import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { volunteerPrograms } from '@/data/mockData';
import type { VolunteerProgramItem } from '../types/volunteer-programs.types';
import * as volunteerProgramsApi from './volunteer-programs.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<VolunteerProgramItem[]> {
  if (DATA_SOURCE === 'api') return volunteerProgramsApi.fetchVolunteerPrograms();
  return delay(volunteerPrograms);
}

export async function getById(id: string): Promise<VolunteerProgramItem | null> {
  if (DATA_SOURCE === 'api') return volunteerProgramsApi.fetchVolunteerProgramById(id);
  return delay(volunteerPrograms.find((item) => item.id === id) ?? null);
}
