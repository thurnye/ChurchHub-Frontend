import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, ScrollView } from 'react-native';
import { X, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBooks } from '../services/bibleService';

interface BookChapterPickerProps {
  visible: boolean;
  currentBookId: string;
  currentChapter: number;
  onSelect: (bookId: string, chapter: number) => void;
  onClose: () => void;
}

export function BookChapterPicker({
  visible,
  currentBookId,
  currentChapter,
  onSelect,
  onClose,
}: BookChapterPickerProps) {
  const insets = useSafeAreaInsets();
  const books = getBooks();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const book = books.find((b) => b.id === selectedBook);

  const handleClose = () => {
    setSelectedBook(null);
    onClose();
  };

  // Chapter grid
  if (selectedBook && book) {
    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
    return (
      <Modal visible={visible} animationType='slide' transparent>
        <View className='flex-1 justify-end bg-black/40'>
          <View className='bg-white rounded-t-2xl' style={{ paddingBottom: insets.bottom, maxHeight: '75%' }}>
            <View className='flex-row items-center justify-between px-4 py-4 border-b border-gray-100'>
              <Pressable
                onPress={() => setSelectedBook(null)}
                className='flex-row items-center gap-1'
              >
                <ChevronLeft size={18} color='#4f46e5' />
                <Text className='text-sm text-indigo-600 font-medium'>Books</Text>
              </Pressable>
              <Text className='font-semibold text-base text-gray-900'>{book.name}</Text>
              <Pressable onPress={handleClose} className='w-8 h-8 items-center justify-center'>
                <X size={20} color='#6b7280' />
              </Pressable>
            </View>
            <ScrollView className='px-4 py-3'>
              <View className='flex-row flex-wrap gap-2'>
                {chapters.map((ch) => {
                  const isSelected = selectedBook === currentBookId && ch === currentChapter;
                  return (
                    <Pressable
                      key={ch}
                      onPress={() => {
                        onSelect(selectedBook, ch);
                        handleClose();
                      }}
                      className={`w-11 h-11 rounded-lg items-center justify-center ${
                        isSelected ? 'bg-indigo-600' : 'bg-gray-100'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                        {ch}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  // Book list
  const oldTestament = books.filter((b) => b.testament === 'Old Testament');
  const newTestament = books.filter((b) => b.testament === 'New Testament');

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View className='flex-1 justify-end bg-black/40'>
        <View className='bg-white rounded-t-2xl' style={{ paddingBottom: insets.bottom, maxHeight: '80%' }}>
          <View className='flex-row items-center justify-between px-4 py-4 border-b border-gray-100'>
            <Text className='font-semibold text-lg text-gray-900'>Select Book</Text>
            <Pressable onPress={handleClose} className='w-8 h-8 items-center justify-center'>
              <X size={20} color='#6b7280' />
            </Pressable>
          </View>
          <ScrollView>
            <Text className='px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Old Testament
            </Text>
            {oldTestament.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => setSelectedBook(b.id)}
                className={`px-4 py-2.5 ${b.id === currentBookId ? 'bg-indigo-50' : ''}`}
              >
                <Text className={`text-sm ${b.id === currentBookId ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}>
                  {b.name}
                </Text>
              </Pressable>
            ))}
            <Text className='px-4 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              New Testament
            </Text>
            {newTestament.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => setSelectedBook(b.id)}
                className={`px-4 py-2.5 ${b.id === currentBookId ? 'bg-indigo-50' : ''}`}
              >
                <Text className={`text-sm ${b.id === currentBookId ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}>
                  {b.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
