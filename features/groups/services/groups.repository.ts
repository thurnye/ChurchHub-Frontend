import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { churchGroups } from '@/data/mockData';
import type { GroupItem, CreateGroupDto } from '../types/groups.types';
import * as groupsApi from './groups.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Map mock data to match the GroupItem type
function mapMockToGroupItem(mock: typeof churchGroups[0]): GroupItem {
  return {
    _id: mock.id,
    id: mock.id,
    tenantId: '1',
    name: mock.name,
    description: mock.description,
    type: mock.category as any,
    image: mock.image,
    leaderId: mock.leaderId || '',
    members: [],
    meetingSchedule: mock.meetingDay ? `${mock.meetingDay} at ${mock.meetingTime}` : undefined,
    meetingLocation: mock.location,
    maxMembers: mock.memberCount || 20,
    isOpen: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: mock.memberCount,
  };
}

export async function getAll(): Promise<GroupItem[]> {
  if (DATA_SOURCE === 'api') return groupsApi.fetchGroups();
  return delay(churchGroups.map(mapMockToGroupItem));
}

export async function getById(id: string): Promise<GroupItem | null> {
  if (DATA_SOURCE === 'api') return groupsApi.fetchGroupById(id);
  const mock = churchGroups.find((item) => item.id === id);
  return delay(mock ? mapMockToGroupItem(mock) : null);
}

export async function getMyGroups(): Promise<GroupItem[]> {
  if (DATA_SOURCE === 'api') return groupsApi.fetchMyGroups();
  // Mock: return first 2 groups as "my groups"
  return delay(churchGroups.slice(0, 2).map(mapMockToGroupItem));
}

export async function create(dto: CreateGroupDto): Promise<GroupItem> {
  if (DATA_SOURCE === 'api') return groupsApi.createGroup(dto);
  // Mock: return a fake created group
  const mockGroup: GroupItem = {
    _id: `mock-${Date.now()}`,
    id: `mock-${Date.now()}`,
    tenantId: '1',
    ...dto,
    members: [],
    maxMembers: dto.maxMembers || 20,
    isOpen: dto.isOpen ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return delay(mockGroup);
}

export async function join(id: string): Promise<GroupItem> {
  if (DATA_SOURCE === 'api') return groupsApi.joinGroup(id);
  const mock = churchGroups.find((item) => item.id === id);
  if (!mock) throw new Error('Group not found');
  return delay(mapMockToGroupItem(mock));
}

export async function leave(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return groupsApi.leaveGroup(id);
  return delay(undefined);
}
