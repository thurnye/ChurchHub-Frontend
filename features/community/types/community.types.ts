// Backend Community Program entity types

export enum ProgramType {
  COMMUNITY = 'community',
  VOLUNTEER = 'volunteer',
}

export enum ProgramCategory {
  OUTREACH_CHARITY = 'Outreach & Charity',
  HEALTH_COUNSELING = 'Health & Counseling',
  COMMUNITY_PROGRAMS = 'Community Programs',
  VOLUNTEER_OPPORTUNITIES = 'Volunteer Opportunities',
  CHILDREN_MINISTRY = "Children's Ministry",
  YOUTH_MINISTRY = 'Youth Ministry',
  MUSIC_MINISTRY = 'Music Ministry',
  HOSPITALITY = 'Hospitality',
  MISSIONS = 'Missions',
  OTHER = 'Other',
}

export interface CommunityProgram {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  title: string;
  type: ProgramType;
  category: string;
  description: string;
  image?: string;
  contact?: string;
  coordinator?: string;
  coordinatorId?: string;
  church?: string; // For volunteer programs
  timeCommitment?: string;
  skillsNeeded: string[];
  location?: string;
  schedule?: string;
  isActive: boolean;
  isFeatured: boolean;
  participantCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backwards compatibility
export type CommunityItem = CommunityProgram;

export interface CreateProgramDto {
  title: string;
  type: ProgramType;
  category: string;
  description: string;
  image?: string;
  contact?: string;
  coordinator?: string;
  timeCommitment?: string;
  skillsNeeded?: string[];
  location?: string;
  schedule?: string;
  isFeatured?: boolean;
}

export interface CommunityState {
  items: CommunityProgram[];
  selected: CommunityProgram | null;
  selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
  // Pagination
  page: number;
  hasMore: boolean;
  loadingMore: boolean;
}
