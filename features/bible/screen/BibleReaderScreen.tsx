import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Type,
} from 'lucide-react-native';
import {
  bibleBooks,
  bibleHighlights,
  bibleNotes,
  bibleBookmarks,
  bibleUserState,
  type IBibleHighlight,
  type IBibleNote,
  type IBibleBookmark,
} from '@/data/mockData';
import * as Speech from 'expo-speech';
import {
  getChapter,
  getBookName,
  type BibleVerse,
  type BibleChapterData,
} from '../services/bibleService';
import { VerseRow } from '../component/VerseRow';
import { VerseActionSheet } from '../component/VerseActionSheet';
import { TranslationsPickerSheet } from '../component/TranslationsPickerSheet';
import { BookChapterPicker } from '../component/BookChapterPicker';
import { LoadingSkeleton } from '../component/LoadingSkeleton';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../redux/store';
import { loadBibles } from '../redux/bibleSlice';

export default function BibleReaderScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    translationId?: string;
    bookId?: string;
    chapter?: string;
    verse?: string;
    from: string;
    planId: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();
  const { bibles, selectedBibleId } = useSelector(
    (state: RootState) => state.bible,
  );
  // Default to KJV (API.Bible ID)
  const translationId = params.translationId ?? (selectedBibleId || 'de4e12af7f28f599-02');
  const bookId = params.bookId ?? 'JHN';
  const chapter = Number(params.chapter) || 3;
  const targetVerse = Number(params.verse) || 0;

  const [chapterData, setChapterData] = useState<BibleChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action sheet state
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  const listRef = useRef<FlatList>(null);
  const chapterDataRef = useRef(chapterData);
  chapterDataRef.current = chapterData;

  // Audio + double-tap state
  const [audioVerse, setAudioVerse] = useState<BibleVerse | null>(null);
  const [readingVerse, setReadingVerse] = useState<number | null>(null);
  const lastTapTimeRef = useRef(0);
  const lastTapVerseRef = useRef<number | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isReadingRef = useRef(false);
  const currentVerseRef = useRef<number | null>(null);
  const lastSpokeRef = useRef(0);

  const book = bibleBooks.find((b) => b.id === bookId);
  const selectedBible = bibles.find((b) => b.id === translationId);
  const displayTranslationLabel = selectedBible
    ? `${selectedBible.nameLocal ?? selectedBible.name ?? ''} (${(
        selectedBible.abbreviationLocal ??
        selectedBible.abbreviation ??
        translationId
      ).toUpperCase()})`
    : translationId.toUpperCase();

  useEffect(() => {
    dispatch(loadBibles());
  }, [dispatch]);

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChapter(translationId, bookId, chapter);
      setChapterData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load chapter.');
    } finally {
      setLoading(false);
    }
  }, [translationId, bookId, chapter]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  // Update user's last read position
  useEffect(() => {
    if (chapterData) {
      bibleUserState.lastRead = {
        translationId,
        bookId,
        chapter,
        verse: targetVerse || 1,
      };
    }
  }, [chapterData]);

  // Scroll to target verse after load
  useEffect(() => {
    if (chapterData?.verses && targetVerse > 0 && listRef.current) {
      const idx = chapterData.verses.findIndex(
        (v) => v.verseStart === targetVerse,
      );
      if (idx >= 0) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index: idx, animated: true });
        }, 300);
      }
    }
  }, [chapterData, targetVerse]);

  // Auto-scroll to the verse currently being read
  useEffect(() => {
    if (readingVerse !== null && chapterData?.verses && listRef.current) {
      const idx = chapterData.verses.findIndex(
        (v) => v.verseStart === readingVerse,
      );
      if (idx >= 0) {
        listRef.current.scrollToIndex({ index: idx, animated: true });
      }
    }
  }, [readingVerse, chapterData]);

  // ── Highlight / Note / Bookmark helpers ──────────────────────────────────
  const getHighlight = (verse: BibleVerse): IBibleHighlight | undefined =>
    bibleHighlights.find(
      (h) =>
        h.ref.translationId === translationId &&
        h.ref.bookId === bookId &&
        h.ref.chapter === chapter &&
        h.ref.verse === verse.verseStart,
    );

  const hasNote = (verse: BibleVerse): boolean =>
    bibleNotes.some(
      (n) =>
        n.ref.translationId === translationId &&
        n.ref.bookId === bookId &&
        n.ref.chapter === chapter &&
        n.ref.verse === verse.verseStart,
    );

  const hasBookmark = (verse: BibleVerse): boolean =>
    bibleBookmarks.some(
      (bm) =>
        bm.ref.translationId === translationId &&
        bm.ref.bookId === bookId &&
        bm.ref.chapter === chapter &&
        bm.ref.verse === verse.verseStart,
    );

  const handleHighlight = (color: string | null) => {
    if (!selectedVerse) return;
    const ref = {
      translationId,
      bookId,
      chapter,
      verse: selectedVerse.verseStart,
    };
    const idx = bibleHighlights.findIndex(
      (h) =>
        h.ref.translationId === ref.translationId &&
        h.ref.bookId === ref.bookId &&
        h.ref.chapter === ref.chapter &&
        h.ref.verse === ref.verse,
    );
    if (color === null) {
      if (idx >= 0) bibleHighlights.splice(idx, 1);
    } else {
      if (idx >= 0) {
        bibleHighlights[idx].color = color;
      } else {
        bibleHighlights.push({
          id: `hl-${Date.now()}`,
          ref,
          text: selectedVerse.text,
          color,
          createdAt: new Date().toISOString(),
        });
      }
    }
    // Force re-render
    setChapterData((prev) => (prev ? { ...prev } : null));
  };

  const handleBookmark = () => {
    if (!selectedVerse) return;
    const ref = {
      translationId,
      bookId,
      chapter,
      verse: selectedVerse.verseStart,
    };
    const idx = bibleBookmarks.findIndex(
      (bm) =>
        bm.ref.translationId === ref.translationId &&
        bm.ref.bookId === ref.bookId &&
        bm.ref.chapter === ref.chapter &&
        bm.ref.verse === ref.verse,
    );
    if (idx >= 0) {
      bibleBookmarks.splice(idx, 1);
    } else {
      bibleBookmarks.push({
        id: `bm-${Date.now()}`,
        ref,
        label: `${getBookName(bookId)} ${chapter}:${selectedVerse.verseStart}`,
        createdAt: new Date().toISOString(),
      });
    }
    setChapterData((prev) => (prev ? { ...prev } : null));
  };

  const handleNote = () => {
    if (!selectedVerse) return;
    const ref = {
      translationId,
      bookId,
      chapter,
      verse: selectedVerse.verseStart,
    };
    const existingIdx = bibleNotes.findIndex(
      (n) =>
        n.ref.translationId === ref.translationId &&
        n.ref.bookId === ref.bookId &&
        n.ref.chapter === ref.chapter &&
        n.ref.verse === ref.verse,
    );
    const existing = existingIdx >= 0 ? bibleNotes[existingIdx] : null;
    setNoteText(existing?.text ?? '');
    setShowNoteInput(true);
  };

  const saveNote = () => {
    if (!selectedVerse) return;
    const ref = {
      translationId,
      bookId,
      chapter,
      verse: selectedVerse.verseStart,
    };
    const idx = bibleNotes.findIndex(
      (n) =>
        n.ref.translationId === ref.translationId &&
        n.ref.bookId === ref.bookId &&
        n.ref.chapter === ref.chapter &&
        n.ref.verse === ref.verse,
    );
    if (noteText.trim() === '') {
      if (idx >= 0) bibleNotes.splice(idx, 1);
    } else {
      if (idx >= 0) {
        bibleNotes[idx].text = noteText.trim();
      } else {
        bibleNotes.push({
          id: `note-${Date.now()}`,
          ref,
          text: noteText.trim(),
          createdAt: new Date().toISOString(),
        });
      }
    }
    setShowNoteInput(false);
    setNoteText('');
    setChapterData((prev) => (prev ? { ...prev } : null));
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateChapter = (delta: number) => {
    const newChapter = chapter + delta;
    if (!book || newChapter < 1 || newChapter > book.chapters) return;
    router.push({
      pathname: '/bible/reader',
      params: {
        translationId,
        bookId,
        chapter: String(newChapter),
        from: params.from,
      },
    });
  };

  const navigateTranslation = (newTranslationId: string) => {
    router.push({
      pathname: '/bible/reader',
      params: {
        translationId: newTranslationId,
        bookId,
        chapter: String(chapter),
        from: params.from,
      },
    });
  };

  const navigateBook = (newBookId: string, newChapter: number) => {
    router.push({
      pathname: '/bible/reader',
      params: {
        translationId,
        bookId: newBookId,
        chapter: String(newChapter),
        from: params.from,
      },
    });
  };

  // ── Audio + double-tap ──────────────────────────────────────────────────

  const handleVersePress = (verse: BibleVerse) => {
    const now = Date.now();
    const isDoubleTap =
      now - lastTapTimeRef.current < 300 &&
      lastTapVerseRef.current === verse.verseStart;

    lastTapTimeRef.current = now;
    lastTapVerseRef.current = verse.verseStart;

    setAudioVerse(verse);

    if (isDoubleTap) {
      setSelectedVerse(verse);
    }
  };

  const handleAudioPress = () => {
    if (!audioVerse) return;

    // Pause if currently reading
    if (isReadingRef.current) {
      Speech.stop();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      isReadingRef.current = false;
      currentVerseRef.current = null;
      setReadingVerse(null);
      setAudioVerse(null);
      return;
    }

    // Start reading from current verse
    isReadingRef.current = true;
    currentVerseRef.current = audioVerse.verseStart;
    lastSpokeRef.current = Date.now();
    setReadingVerse(audioVerse.verseStart);
    Speech.speak(audioVerse.text,{
      rate: 0.75,  //speed
      pitch: 1
    });

    // Poll for speech completion — delay start to let first utterance begin
    setTimeout(() => {
      if (!isReadingRef.current) return;
      pollingRef.current = setInterval(async () => {
        if (!isReadingRef.current) {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          return;
        }
        const speaking = await Speech.isSpeakingAsync();
        if (!speaking && Date.now() - lastSpokeRef.current > 200) {
          const verses = chapterDataRef.current?.verses ?? [];
          const idx = verses.findIndex((v) => v.verseStart === currentVerseRef.current);
          const nextIdx = idx + 1;
          if (nextIdx >= verses.length) {
            clearInterval(pollingRef.current!);
            pollingRef.current = null;
            isReadingRef.current = false;
            currentVerseRef.current = null;
            setReadingVerse(null);
            setAudioVerse(null);
            return;
          }
          const nextVerse = verses[nextIdx];
          currentVerseRef.current = nextVerse.verseStart;
          lastSpokeRef.current = Date.now();
          setReadingVerse(nextVerse.verseStart);
          setAudioVerse(nextVerse);
          Speech.speak(nextVerse.text, { rate: 0.75, pitch: 1 });
        }
      }, 300);
    }, 200);
  };

  // Stop speech when chapter changes
  useEffect(() => {
    Speech.stop();
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    isReadingRef.current = false;
    currentVerseRef.current = null;
    setAudioVerse(null);
    setReadingVerse(null);
  }, [bookId, chapter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      isReadingRef.current = false;
      currentVerseRef.current = null;
    };
  }, []);

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View
        className='border-b border-gray-100'
        style={{ paddingTop: insets.top }}
      >
        <View className='flex-row items-center justify-between px-4 h-14'>
          <Pressable
            onPress={() =>
              router.push({
                pathname: params.from as any || '/bible',
                params: {
                  planId: params.planId,
                },
              })
            }
            className='w-10 h-10 items-center justify-center'
          >
            <ChevronLeft size={24} color='#374151' />
          </Pressable>
          <Pressable
            onPress={() => setShowBookPicker(true)}
            className='flex-1 items-center'
          >
            <Text className='font-semibold text-base text-gray-900'>
              {book?.name ?? bookId} {chapter}
            </Text>
            <Text className='text-xs text-gray-400'>
              {displayTranslationLabel}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowTranslationPicker(true)}
            className='w-10 h-10 items-center justify-center'
          >
            <Type size={20} color='#4f46e5' />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View className='flex-1'>
        {loading && <LoadingSkeleton />}

        {error && (
          <View className='flex-1 items-center justify-center px-6'>
            <Text className='text-sm text-red-500 text-center mb-4'>
              {error}
            </Text>
            <Pressable
              onPress={fetchChapter}
              className='bg-indigo-600 px-5 py-2.5 rounded-xl'
            >
              <Text className='text-sm font-semibold text-white'>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && chapterData && chapterData.verses?.length === 0 && (
          <View className='flex-1 items-center justify-center px-6'>
            <Text className='text-sm text-gray-500 text-center mb-4'>
              No verses found for this chapter. The content may not be available for this translation.
            </Text>
            <Pressable
              onPress={fetchChapter}
              className='bg-indigo-600 px-5 py-2.5 rounded-xl'
            >
              <Text className='text-sm font-semibold text-white'>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && chapterData?.verses && chapterData.verses.length > 0 && (
          <FlatList
            ref={listRef}
            data={chapterData.verses}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item }) => (
              <VerseRow
                verse={item}
                highlight={getHighlight(item)}
                hasNote={hasNote(item)}
                hasBookmark={hasBookmark(item)}
                isSelected={selectedVerse?.verseStart === item.verseStart}
                isReading={readingVerse === item.verseStart}
                showAudio={audioVerse?.verseStart === item.verseStart}
                onPress={() => handleVersePress(item)}
                onAudioPress={handleAudioPress}
              />
            )}
            initialNumToRender={20}
            windowSize={30}
            onScrollToIndexFailed={() => {}}
          />
        )}
      </View>

      {/* Chapter navigation footer */}
      <View className='flex-row items-center justify-between px-4 py-3 border-t border-gray-100 bg-white'>
        <Pressable
          onPress={() => navigateChapter(-1)}
          disabled={chapter <= 1}
          className={`flex-row items-center gap-1 px-3 py-2 rounded-lg ${chapter <= 1 ? 'opacity-30' : ''}`}
        >
          <ChevronLeft size={18} color='#4f46e5' />
          <Text className='text-sm text-indigo-600 font-medium'>Previous</Text>
        </Pressable>
        <Text className='text-xs text-gray-400'>
          {chapter} / {book?.chapters ?? '?'}
        </Text>
        <Pressable
          onPress={() => navigateChapter(1)}
          disabled={book ? chapter >= book.chapters : false}
          className={`flex-row items-center gap-1 px-3 py-2 rounded-lg ${book && chapter >= book.chapters ? 'opacity-30' : ''}`}
        >
          <Text className='text-sm text-indigo-600 font-medium'>Next</Text>
          <ChevronRight size={18} color='#4f46e5' />
        </Pressable>
      </View>

      {/* Note input overlay */}
      {showNoteInput && selectedVerse && (
        <View className='absolute inset-0 bg-black/40 justify-end'>
          <View
            className='bg-white rounded-t-2xl px-4 py-4'
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='font-semibold text-sm text-gray-900'>
                {getBookName(bookId)} {chapter}:{selectedVerse.verseStart}
              </Text>
              <Pressable
                onPress={() => setShowNoteInput(false)}
                className='px-3 py-1'
              >
                <Text className='text-sm text-gray-500'>Cancel</Text>
              </Pressable>
            </View>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder='Write your note...'
              placeholderTextColor='#9ca3af'
              multiline
              autoFocus
              style={{
                minHeight: 100,
                maxHeight: 200,
                fontSize: 14,
                color: '#111827',
                lineHeight: 22,
                textAlignVertical: 'top',
              }}
              cursorColor='#4f46e5'
              selectionColor='#4f46e5'
            />
            <Pressable
              onPress={saveNote}
              className='mt-3 bg-indigo-600 py-3 rounded-xl items-center'
            >
              <Text className='text-sm font-semibold text-white'>
                Save Note
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Action Sheet */}
      <VerseActionSheet
        visible={selectedVerse !== null && !showNoteInput}
        verseText={selectedVerse?.text ?? ''}
        verseLabel={`${getBookName(bookId)} ${chapter}:${selectedVerse?.verseStart ?? ''}`}
        currentHighlightColor={
          selectedVerse ? (getHighlight(selectedVerse)?.color ?? null) : null
        }
        hasNote={selectedVerse ? hasNote(selectedVerse) : false}
        hasBookmark={selectedVerse ? hasBookmark(selectedVerse) : false}
        onHighlight={handleHighlight}
        onNote={handleNote}
        onBookmark={handleBookmark}
        onClose={() => setSelectedVerse(null)}
      />

      {/* Translation Picker */}
      <TranslationsPickerSheet
        visible={showTranslationPicker}
        currentBibleId={translationId}
        onSelect={navigateTranslation}
        onClose={() => setShowTranslationPicker(false)}
      />

      {/* Book/Chapter Picker */}
      <BookChapterPicker
        visible={showBookPicker}
        currentBookId={bookId}
        currentChapter={chapter}
        onSelect={navigateBook}
        onClose={() => setShowBookPicker(false)}
      />
    </View>
  );
}
