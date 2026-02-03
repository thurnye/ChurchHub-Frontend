import Constants from 'expo-constants';
import {
  bibleTranslations,
  bibleBooks,
  type IBibleTranslation,
  type IBibleBook,
} from '@/data/mockData';

// ─── Config (resolved from .env at build time via app.config.js) ────────────

const API_KEY = Constants.expoConfig?.extra?.apiBibleKey as string;
const BASE_URL =
  (Constants.expoConfig?.extra?.bibleApiEndpoint as string) ??
  'https://rest.api.bible';

// ─── Public types (consumed by screens) ────────────────────────────────────

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

// ─── Internal API.Bible response shapes ─────────────────────────────────────

export interface ApiBible {
  id: string;
  name: string;
  abbreviation: string;
  abbreviationLocal?: string;
  description?: string;
  nameLocal?:string;
  language?: { name: string; direction: string };
}

export interface ApiBibleBook {
  id: string;
  name: string;
  nameLocal?: string;
  abbreviation?: string;
  abbreviationLocal?: string;
  groups?: string[];
  order?: number;
}

interface ApiVerse {
  id: string; // 'GEN.1.1'
  bookId: string; // 'GEN'
  chapterId: string; // 'GEN.1'
  verseStart?: number;
  verseEnd?: number;
  reference?: string; // 'Genesis 1:1'
  text?: string;
}

// ─── Cache & translation mapping ────────────────────────────────────────────

// Chapters: translationId|bookId|chapter → parsed data
const chapterCache = new Map<string, BibleChapterData>();

// One-time mapping: our internal translation ID ('kjv') → API.Bible bibleId ('kjv1769')
const translationIdMap = new Map<string, string>();
let translationsLoaded = false;

function chapterCacheKey(translationId: string, bookId: string, chapter: number) {
  return `${translationId}|${bookId}|${chapter}`;
}

// ─── HTTP helper ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'api-key': API_KEY },
    });
  } catch {
    throw new Error('Unable to connect. Check your internet connection.');
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('Bible API key is invalid or missing permissions.');
  }

  if (response.status === 429) {
    throw new Error('Rate limit reached. Please try again shortly.');
  }

  if (!response.ok) {
    throw new Error(`Bible API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ─── Translation mapping ────────────────────────────────────────────────────
// Fetches the API.Bible translation list once and builds a map from our
// internal abbreviation-based IDs ('kjv') to API.Bible's bibleId ('kjv1769').

async function ensureTranslationsLoaded(): Promise<void> {
  if (translationsLoaded) return;

  const json = await apiFetch<{ data: ApiBible[] }>('/v1/bibles?language=eng');

  for (const local of bibleTranslations) {
    const match = (json.data || []).find((t) => {
      const abbr = (t.abbreviationLocal ?? t.abbreviation).toLowerCase();
      return abbr === local.abbreviation.toLowerCase();
    });
    if (match) {
      translationIdMap.set(local.id, match.id);
    }
  }

  translationsLoaded = true;
}

function bibleId(translationId: string): string {
  return translationIdMap.get(translationId) ?? translationId;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function getTranslations(): IBibleTranslation[] {
  return bibleTranslations;
}

export function getBooks(): IBibleBook[] {
  return bibleBooks;
}

export function getBookName(bookId: string): string {
  return bibleBooks.find((b) => b.id === bookId)?.name ?? bookId;
}

export function getCachedChapter(
  translationId: string,
  bookId: string,
  chapter: number,
): BibleChapterData | undefined {
  return chapterCache.get(chapterCacheKey(translationId, bookId, chapter));
}

function parseChapterContent(
  content: string,
  bookId: string,
  chapter: number,
  translationId: string,
): BibleChapterData {
  const verses: BibleVerse[] = [];
  const pattern =
    /<span[^>]*class="v"[^>]*>\s*(\d+)\s*<\/span>([\s\S]*?)(?=<span[^>]*class="v"|$)/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const verseNum = Number(match[1]);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) {
      verses.push({
        verseId: `${bookId}.${chapter}.${verseNum}`,
        verseStart: verseNum,
        verseEnd: verseNum,
        text,
      });
    }
  }
  return { translationId, bookId, chapter, verses };
}

export async function getChapter(
  translationId: string,
  bookId: string,
  chapter: number,
): Promise<BibleChapterData> {
  const key = chapterCacheKey(translationId, bookId, chapter);
  const cached = chapterCache.get(key);
  if (cached) return cached;

  await ensureTranslationsLoaded();

  const chapterId = `${bookId}.${chapter}`;
  const json = await apiFetch<{ data: { content: string } }>(
    `/v1/bibles/${bibleId(translationId)}/chapters/${chapterId}`,
  );

  const data = parseChapterContent(json.data?.content || '', bookId, chapter, translationId);
  chapterCache.set(key, data);
  return data;
}

function parseReference(
  query: string,
): { bookId: string; chapter: number; verseStart: number; verseEnd: number } | null {
  const match = query.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i);
  if (!match) return null;

  const bookQuery = match[1].trim().toLowerCase();
  if (!bookQuery || bookQuery.length < 2) return null;

  const chapter = Number(match[2]);
  const verseStart = match[3] ? Number(match[3]) : 0;
  const verseEnd = match[4] ? Number(match[4]) : verseStart;

  // Exact match first, then shortest prefix match (avoids ambiguity)
  const exact = bibleBooks.find((b) => b.name.toLowerCase() === bookQuery);
  const book =
    exact ??
    bibleBooks
      .filter((b) => b.name.toLowerCase().startsWith(bookQuery))
      .sort((a, b) => a.name.length - b.name.length)[0];

  if (!book || chapter < 1 || chapter > book.chapters) return null;

  return { bookId: book.id, chapter, verseStart, verseEnd };
}

export async function searchPassage(
  query: string,
  translationId = 'kjv',
): Promise<BibleSearchResult[]> {
  if (!query.trim()) return [];

  // Try to resolve as a Bible reference (e.g. "Genesis 1:1-10", "John 3")
  const ref = parseReference(query.trim());
  if (ref) {
    const chapterData = await getChapter(translationId, ref.bookId, ref.chapter);
    const verses =
      ref.verseStart === 0
        ? chapterData.verses
        : chapterData.verses.filter(
            (v) => v.verseStart >= ref.verseStart && v.verseStart <= ref.verseEnd,
          );
    const bookName = getBookName(ref.bookId);
    return verses.map((v) => ({
      translationId,
      bookId: ref.bookId,
      bookName: `${bookName} ${ref.chapter}:${v.verseStart}`,
      chapter: ref.chapter,
      verse: v.verseStart,
      text: v.text,
    }));
  }

  // Fall back to keyword search via API
  await ensureTranslationsLoaded();

  let json: { data: { verses?: ApiVerse[] } };
  try {
    json = await apiFetch<{ data: { verses?: ApiVerse[] } }>(
      `/v1/bibles/${bibleId(translationId)}/search?query=${encodeURIComponent(query.trim())}&limit=20`,
    );
  } catch (err: any) {
    // 404 means no verses matched the query — not a failure
    if (err.message?.includes('404')) return [];
    throw err;
  }

  return (json.data?.verses || []).map((v) => {
    const idParts = v.id.split('.');
    return {
      translationId,
      bookId: idParts[0] || v.bookId || '',
      bookName: v.reference || '',
      chapter: Number(idParts[1]) || 0,
      verse: Number(idParts[2]) || 0,
      text: (v.text ?? '').trim(),
    };
  });
}

export async function fetchEnglishBibles(): Promise<ApiBible[]> {
  const json = await apiFetch<{ data: ApiBible[] }>('/v1/bibles?language=eng');
  return json.data || [];
}

export async function fetchBooksForBible(bibleId: string): Promise<ApiBibleBook[]> {
  const json = await apiFetch<{ data: ApiBibleBook[] }>(`/v1/bibles/${bibleId}/books`);
  return json.data || [];
}

export function clearCache(): void {
  chapterCache.clear();
  translationIdMap.clear();
  translationsLoaded = false;
}
