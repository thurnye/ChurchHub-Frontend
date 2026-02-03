import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { careers } from '@/data/mockData';
import type { CareerItem } from '../types/careers.types';
import * as careersApi from './careers.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<CareerItem[]> {
  if (DATA_SOURCE === 'api') return careersApi.fetchCareers();
  return delay(careers);
}

export async function getById(id: string): Promise<CareerItem | null> {
  if (DATA_SOURCE === 'api') return careersApi.fetchCareerById(id);
  return delay(careers.find((item) => item.id === id) ?? null);
}
