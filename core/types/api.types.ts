// ─── Generic API envelope ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ─── Paginated list envelope ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// ─── Error shape returned by the backend ────────────────────────────────────

export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}
