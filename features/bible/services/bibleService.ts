import { DATA_SOURCE } from '@/shared/utils/dataSource';
import {
  bibleTranslations,
  bibleBooks,
  type IBibleTranslation,
  type IBibleBook,
} from '@/data/mockData';
import * as bibleApi from './bible.api.service';

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

export interface ApiBible {
  id: string;
  name: string;
  abbreviation: string;
  abbreviationLocal?: string;
  description?: string;
  nameLocal?: string;
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

// ─── Cache ─────────────────────────────────────────────────────────────────

const chapterCache = new Map<string, BibleChapterData>();

function chapterCacheKey(translationId: string, bookId: string, chapter: number) {
  return `${translationId}|${bookId}|${chapter}`;
}

// ─── Helper ────────────────────────────────────────────────────────────────

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
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

export async function getChapter(
  translationId: string,
  bookId: string,
  chapter: number,
): Promise<BibleChapterData> {
  const key = chapterCacheKey(translationId, bookId, chapter);
  const cached = chapterCache.get(key);
  if (cached) {
    console.log('[getChapter] Cache hit:', key);
    return cached;
  }

  console.log('[getChapter] Cache miss, fetching:', { translationId, bookId, chapter });

  if (DATA_SOURCE === 'api') {
    // Call backend API
    const data = await bibleApi.fetchChapter(bookId, chapter, translationId);

    // Ensure verses is always an array
    if (!Array.isArray(data.verses)) {
      console.warn('[getChapter] Invalid verses in response, defaulting to empty array');
      data.verses = [];
    }

    console.log('[getChapter] API returned:', data.verses.length, 'verses');
    chapterCache.set(key, data);
    return data;
  }

  // Mock data fallback
  const mockData: BibleChapterData = {
    translationId,
    bookId,
    chapter,
    verses: [
      { verseId: `${bookId}.${chapter}.1`, verseStart: 1, verseEnd: 1, text: 'In the beginning God created the heaven and the earth.' },
      { verseId: `${bookId}.${chapter}.2`, verseStart: 2, verseEnd: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep.' },
      { verseId: `${bookId}.${chapter}.3`, verseStart: 3, verseEnd: 3, text: 'And the Spirit of God moved upon the face of the waters.' },
    ],
  };

  chapterCache.set(key, mockData);
  return delay(mockData);
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
  translationId = 'de4e12af7f28f599-02',
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

  // Fall back to keyword search via backend API
  if (DATA_SOURCE === 'api') {
    return bibleApi.searchVerses(query, translationId, 20);
  }

  // Mock search fallback
  return delay([
    {
      translationId,
      bookId: 'JHN',
      bookName: 'John 3:16',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world, that he gave his only begotten Son...',
    },
  ]);
}

export async function fetchEnglishBibles(): Promise<ApiBible[]> {
  if (DATA_SOURCE === 'api') {
    const translations = await bibleApi.fetchTranslations();
    return translations.map((t) => ({
      id: t.id,
      name: t.name,
      abbreviation: t.abbreviation,
      abbreviationLocal: t.abbreviationLocal,
      description: t.description,
      nameLocal: t.nameLocal,
      language: t.language,
    }));
  }

  // Mock fallback
  return delay(
    bibleTranslations.map((t) => ({
      id: t.id,
      name: t.name,
      abbreviation: t.abbreviation,
    })),
  );
}

export async function fetchBooksForBible(): Promise<ApiBibleBook[]> {
  if (DATA_SOURCE === 'api') {
    const books = await bibleApi.fetchBooks();
    return books.map((b) => ({
      id: b.id,
      name: b.name,
      nameLocal: b.nameLocal,
      abbreviation: b.abbreviation,
      order: b.order,
    }));
  }

  // Mock fallback
  return delay(
    bibleBooks.map((b) => ({
      id: b.id,
      name: b.name,
      abbreviation: b.name.substring(0, 3).toUpperCase(),
    })),
  );
}

export function clearCache(): void {
  chapterCache.clear();
}
