import apiClient from '@/core/services/apiClient.service';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  abbreviationLocal?: string;
  description?: string;
  nameLocal?: string;
  language?: {
    name: string;
    direction: string;
  };
}

export interface BibleBook {
  id: string;
  name: string;
  nameLocal?: string;
  abbreviation?: string;
  testament: string;
  chapters: number;
  order?: number;
}

export interface BibleVerse {
  verseId: string;
  verseStart: number;
  verseEnd: number;
  text: string;
}

export interface BibleChapterData {
  translationId: string;
  bookId: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleSearchResult {
  translationId: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

// ─── API Response Wrapper ───────────────────────────────────────────────────

interface ApiWrapper<T> {
  success: boolean;
  data: T;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Get available Bible translations (English)
 */
export async function fetchTranslations(): Promise<BibleTranslation[]> {
  const { data: response } = await apiClient.get<ApiWrapper<BibleTranslation[]>>(
    '/bible/translations',
  );
  return response.data ?? [];
}

/**
 * Get all Bible books
 */
export async function fetchBooks(): Promise<BibleBook[]> {
  const { data: response } = await apiClient.get<ApiWrapper<BibleBook[]>>(
    '/bible/books',
  );
  return response.data ?? [];
}

/**
 * Get a Bible chapter with all verses
 */
export async function fetchChapter(
  bookId: string,
  chapter: number,
  translationId?: string,
): Promise<BibleChapterData> {
  const params = translationId ? { translationId } : {};

  console.log('[fetchChapter] Fetching:', { bookId, chapter, translationId });

  const { data: response } = await apiClient.get<ApiWrapper<BibleChapterData>>(
    `/bible/chapters/${bookId}/${chapter}`,
    { params },
  );

  console.log('[fetchChapter] Response:', {
    success: response?.success,
    hasData: !!response?.data,
    versesLength: response?.data?.verses?.length ?? 0,
  });

  const data = response?.data;

  // Ensure we always return a valid structure
  const result: BibleChapterData = {
    translationId: data?.translationId || translationId || '',
    bookId: data?.bookId || bookId,
    chapter: data?.chapter || chapter,
    verses: Array.isArray(data?.verses) ? data.verses : [],
  };

  console.log('[fetchChapter] Returning:', {
    translationId: result.translationId,
    bookId: result.bookId,
    chapter: result.chapter,
    versesCount: result.verses.length,
  });

  return result;
}

/**
 * Search Bible verses
 */
export async function searchVerses(
  query: string,
  translationId?: string,
  limit?: number,
): Promise<BibleSearchResult[]> {
  const params: Record<string, string | number> = { query };
  if (translationId) params.translationId = translationId;
  if (limit) params.limit = limit;

  const { data: response } = await apiClient.get<ApiWrapper<BibleSearchResult[]>>(
    '/bible/search',
    { params },
  );
  return response.data ?? [];
}

/**
 * Get a single Bible verse
 */
export async function fetchVerse(
  bookId: string,
  chapter: number,
  verse: number,
  translationId?: string,
): Promise<BibleVerse | null> {
  const params = translationId ? { translationId } : {};
  const { data: response } = await apiClient.get<ApiWrapper<BibleVerse | null>>(
    `/bible/verses/${bookId}/${chapter}/${verse}`,
    { params },
  );
  return response.data ?? null;
}

/**
 * Get a range of Bible verses
 */
export async function fetchVerseRange(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  translationId?: string,
): Promise<BibleVerse[]> {
  const params = translationId ? { translationId } : {};
  const { data: response } = await apiClient.get<ApiWrapper<BibleVerse[]>>(
    `/bible/verses/${bookId}/${chapter}/${verseStart}/${verseEnd}`,
    { params },
  );
  return response.data ?? [];
}
