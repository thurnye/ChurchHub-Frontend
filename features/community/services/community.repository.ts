import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { communityPrograms, volunteerPrograms } from '@/data/mockData';
import type { CommunityProgram, CreateProgramDto, ProgramType } from '../types/community.types';
import * as communityApi from './community.api.service';
import type { FetchProgramsResult } from './community.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Map mock community program data to CommunityProgram type
function mapMockCommunityProgram(mock: typeof communityPrograms[0]): CommunityProgram {
  return {
    _id: mock.id,
    id: mock.id,
    tenantId: '1',
    title: mock.title,
    type: 'community' as ProgramType,
    category: mock.category,
    description: mock.description,
    image: mock.image,
    contact: mock.contact,
    skillsNeeded: [],
    isActive: true,
    isFeatured: false,
    participantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Map mock volunteer program data to CommunityProgram type
function mapMockVolunteerProgram(mock: typeof volunteerPrograms[0]): CommunityProgram {
  return {
    _id: `v-${mock.id}`,
    id: `v-${mock.id}`,
    tenantId: '1',
    title: mock.title,
    type: 'volunteer' as ProgramType,
    category: mock.category,
    description: mock.description,
    image: mock.image,
    contact: mock.coordinator,
    coordinator: mock.coordinator,
    timeCommitment: mock.timeCommitment,
    skillsNeeded: mock.skillsNeeded,
    isActive: true,
    isFeatured: false,
    participantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Get all programs (both community and volunteer combined)
export async function getAll(params?: { type?: ProgramType; category?: string; page?: number; limit?: number }): Promise<FetchProgramsResult> {
  if (DATA_SOURCE === 'api') return communityApi.fetchCommunityPrograms(params);

  // Combine both community programs and volunteer programs
  const allPrograms: CommunityProgram[] = [
    ...communityPrograms.map(mapMockCommunityProgram),
    ...volunteerPrograms.map(mapMockVolunteerProgram),
  ];

  // Apply filters if provided
  let filtered = allPrograms;
  if (params?.type) {
    filtered = filtered.filter((p) => p.type === params.type);
  }
  if (params?.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  // Apply pagination for mock data
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const start = (page - 1) * limit;
  const paginatedItems = filtered.slice(start, start + limit);

  return delay({
    items: paginatedItems,
    meta: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
  });
}

export async function getById(id: string): Promise<CommunityProgram | null> {
  if (DATA_SOURCE === 'api') return communityApi.fetchProgramById(id);

  // Check community programs
  const communityMock = communityPrograms.find((item) => item.id === id);
  if (communityMock) {
    return delay(mapMockCommunityProgram(communityMock));
  }

  // Check volunteer programs (strip 'v-' prefix if present)
  const volunteerId = id.startsWith('v-') ? id.substring(2) : id;
  const volunteerMock = volunteerPrograms.find((item) => item.id === volunteerId);
  if (volunteerMock) {
    return delay(mapMockVolunteerProgram(volunteerMock));
  }

  return delay(null);
}

export async function getCategories(): Promise<string[]> {
  if (DATA_SOURCE === 'api') return communityApi.fetchCategories();

  const categories = new Set<string>();
  communityPrograms.forEach((p) => categories.add(p.category));
  volunteerPrograms.forEach((p) => categories.add(p.category));
  return delay([...categories]);
}

export async function getFeatured(limit?: number): Promise<CommunityProgram[]> {
  if (DATA_SOURCE === 'api') return communityApi.fetchFeaturedPrograms(limit);

  // Return first few programs as "featured"
  const allPrograms = [
    ...communityPrograms.slice(0, 2).map(mapMockCommunityProgram),
    ...volunteerPrograms.slice(0, 2).map(mapMockVolunteerProgram),
  ];
  return delay(allPrograms.slice(0, limit || 4));
}

export async function create(dto: CreateProgramDto): Promise<CommunityProgram> {
  if (DATA_SOURCE === 'api') return communityApi.createProgram(dto);

  const mockProgram: CommunityProgram = {
    _id: `mock-${Date.now()}`,
    id: `mock-${Date.now()}`,
    tenantId: '1',
    ...dto,
    skillsNeeded: dto.skillsNeeded || [],
    isActive: true,
    isFeatured: dto.isFeatured || false,
    participantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return delay(mockProgram);
}

export async function join(id: string): Promise<CommunityProgram> {
  if (DATA_SOURCE === 'api') return communityApi.joinProgram(id);

  const program = await getById(id);
  if (!program) throw new Error('Program not found');
  return delay({ ...program, participantCount: program.participantCount + 1 });
}

export async function leave(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return communityApi.leaveProgram(id);
  return delay(undefined);
}

export async function remove(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return communityApi.deleteProgram(id);
  return delay(undefined);
}
