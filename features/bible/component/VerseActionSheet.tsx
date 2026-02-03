import { View, Text, Pressable, Modal, Share } from 'react-native';
import {
  X,
  Bookmark,
  MessageSquare,
  Share2,
  AudioLines,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HIGHLIGHT_COLORS = [
  { id: '#fbbf24', label: 'Gold' },
  { id: '#86efac', label: 'Green' },
  { id: '#93c5fd', label: 'Blue' },
  { id: '#f9a8d4', label: 'Pink' },
  { id: '#c4b5fd', label: 'Purple' },
];

interface VerseActionSheetProps {
  visible: boolean;
  verseText: string;
  verseLabel: string; // e.g. "John 3:16"
  currentHighlightColor: string | null;
  hasNote: boolean;
  hasBookmark: boolean;
  onHighlight: (color: string | null) => void;
  onNote: () => void;
  onBookmark: () => void;
  onClose: () => void;
}

export function VerseActionSheet({
  visible,
  verseText,
  verseLabel,
  currentHighlightColor,
  hasNote,
  hasBookmark,
  onHighlight,
  onNote,
  onBookmark,
  onClose,
}: VerseActionSheetProps) {
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${verseLabel}\n\n${verseText}`,
      });
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View className='flex-1 justify-end bg-black/40'>
        <View
          className='bg-white rounded-t-2xl px-4 py-4'
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          {/* Header */}
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='font-semibold text-sm text-gray-900'>
              {verseLabel}
            </Text>
            <Pressable className='w-10 h-10 items-center justify-center'>
              <AudioLines size={20} color='#4f46e5' />
            </Pressable>
            <Pressable
              onPress={onClose}
              className='w-8 h-8 items-center justify-center'
            >
              <X size={20} color='#6b7280' />
            </Pressable>
          </View>

          {/* Verse preview */}
          <Text
            className='text-xs text-gray-500 mb-4 leading-relaxed'
            numberOfLines={3}
          >
            {verseText}
          </Text>

          {/* Highlight colours */}
          <Text className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
            Highlight
          </Text>
          <View className='flex-row gap-3 mb-4'>
            {HIGHLIGHT_COLORS.map((c) => {
              const isActive = currentHighlightColor === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => onHighlight(isActive ? null : c.id)}
                  className='items-center'
                >
                  <View
                    className={`w-8 h-8 rounded-full ${isActive ? 'border-2 border-indigo-600' : 'border border-gray-200'}`}
                    style={{ backgroundColor: c.id }}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Actions row */}
          <View className='flex-row gap-3'>
            <Pressable
              onPress={onNote}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                hasNote ? 'bg-indigo-600' : 'bg-gray-100'
              }`}
            >
              <MessageSquare
                size={16}
                color={hasNote ? '#ffffff' : '#4f46e5'}
              />
              <Text
                className={`text-sm font-medium ${hasNote ? 'text-white' : 'text-indigo-600'}`}
              >
                Note
              </Text>
            </Pressable>

            <Pressable
              onPress={onBookmark}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                hasBookmark ? 'bg-indigo-600' : 'bg-gray-100'
              }`}
            >
              <Bookmark
                size={16}
                color={hasBookmark ? '#ffffff' : '#4f46e5'}
                fill={hasBookmark ? '#ffffff' : 'transparent'}
              />
              <Text
                className={`text-sm font-medium ${hasBookmark ? 'text-white' : 'text-indigo-600'}`}
              >
                Bookmark
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              className='flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-gray-100'
            >
              <Share2 size={16} color='#4f46e5' />
              <Text className='text-sm font-medium text-indigo-600'>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
