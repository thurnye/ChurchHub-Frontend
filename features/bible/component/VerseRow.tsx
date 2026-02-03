import { View, Text, Pressable } from 'react-native';
import { Bookmark, MessageSquare, Volume2, Pause } from 'lucide-react-native';
import type { BibleVerse } from '../services/bibleService';
import type { IBibleHighlight } from '@/data/mockData';

interface VerseRowProps {
  verse: BibleVerse;
  highlight?: IBibleHighlight;
  hasNote: boolean;
  hasBookmark: boolean;
  isSelected: boolean;
  isReading: boolean;
  showAudio: boolean;
  onPress: () => void;
  onAudioPress: () => void;
}

export function VerseRow({
  verse,
  highlight,
  hasNote,
  hasBookmark,
  isSelected,
  isReading,
  showAudio,
  onPress,
  onAudioPress,
}: VerseRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2.5 ${isReading ? 'bg-blue-100' : isSelected ? 'bg-indigo-50' : ''}`}
    >
      <View className='flex-row gap-3'>
        {/* Verse number + optional audio icon */}
        {showAudio ? (
          <View className='flex-row items-center gap-1 self-start'>
            <Pressable onPress={onAudioPress} hitSlop={8}>
              {isReading ? (
                <Pause size={14} color='#4f46e5' fill='#4f46e5' />
              ) : (
                <Volume2 size={14} color='#4f46e5' />
              )}
            </Pressable>
            <Text className='text-xs font-semibold text-indigo-400'>
              {verse.verseStart}
            </Text>
          </View>
        ) : (
          <Text className='text-xs font-semibold text-indigo-400 w-6 pt-0.5 text-right flex-shrink-0'>
            {verse.verseStart}
          </Text>
        )}

        {/* Text with optional highlight background */}
        <View className='flex-1'>
          {highlight ? (
            <View style={{ backgroundColor: highlight.color + '33' }} className='rounded px-1.5 py-0.5'>
              <Text className='text-sm text-gray-800 leading-relaxed'>{verse.text}</Text>
            </View>
          ) : (
            <Text className='text-sm text-gray-800 leading-relaxed'>{verse.text}</Text>
          )}
        </View>

        {/* Indicators */}
        <View className='flex-col items-center gap-1 flex-shrink-0' style={{ minWidth: 18 }}>
          {hasNote && <MessageSquare size={12} color='#6366f1' fill='#6366f1' />}
          {hasBookmark && <Bookmark size={12} color='#6366f1' fill='#6366f1' />}
        </View>
      </View>
    </Pressable>
  );
}
