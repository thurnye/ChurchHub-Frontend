import { View, Text, Pressable, FlatList, Modal } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type ApiBibleBook } from '../services/bibleService';

interface BooksPickerSheetProps {
  visible: boolean;
  books: ApiBibleBook[];
  currentFilter: string; // 'ALL' or bookId
  onSelect: (bookId: string) => void;
  onClose: () => void;
}

function getTestament(book: ApiBibleBook): 'Old' | 'New' {
  if (book.groups) {
    if (book.groups.some((g) => g.toLowerCase().includes('old'))) return 'Old';
    if (book.groups.some((g) => g.toLowerCase().includes('new'))) return 'New';
  }
  if (book.order !== undefined) return book.order <= 39 ? 'Old' : 'New';
  return 'Old';
}

type SectionItem =
  | { type: 'header'; title: string; key: string }
  | { type: 'all'; key: string }
  | { type: 'book'; book: ApiBibleBook; key: string };

export function BooksPickerSheet({
  visible,
  books,
  currentFilter,
  onSelect,
  onClose,
}: BooksPickerSheetProps) {
  const insets = useSafeAreaInsets();

  const oldTestament = books.filter((b) => getTestament(b) === 'Old');
  const newTestament = books.filter((b) => getTestament(b) === 'New');

  const data: SectionItem[] = [{ type: 'all', key: 'all' }];
  if (oldTestament.length > 0) {
    data.push({ type: 'header', title: 'Old Testament', key: 'header-ot' });
    oldTestament.forEach((b) => data.push({ type: 'book', book: b, key: b.id }));
  }
  if (newTestament.length > 0) {
    data.push({ type: 'header', title: 'New Testament', key: 'header-nt' });
    newTestament.forEach((b) => data.push({ type: 'book', book: b, key: b.id }));
  }

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <View className='flex-1 justify-end bg-black/50'>
        <View className='bg-white rounded-t-2xl' style={{ paddingBottom: insets.bottom }}>
          <View className='items-center pt-3 pb-1'>
            <View className='w-10 h-1 bg-gray-300 rounded-full' />
          </View>
          <View className='flex-row items-center justify-between px-4 py-3'>
            <Text className='font-semibold text-base text-gray-900'>Filter by Book</Text>
            <Pressable onPress={onClose} className='w-8 h-8 items-center justify-center'>
              <X size={20} color='#6b7280' />
            </Pressable>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.key}
            style={{ maxHeight: 420 }}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <Text className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1'>
                    {item.title}
                  </Text>
                );
              }

              if (item.type === 'all') {
                const isSelected = currentFilter === 'ALL';
                return (
                  <Pressable
                    onPress={() => onSelect('ALL')}
                    className={`flex-row items-center justify-between mx-4 px-3 py-2.5 rounded-lg ${isSelected ? 'bg-indigo-50' : ''}`}
                  >
                    <Text
                      className={`text-sm ${isSelected ? 'text-indigo-600 font-semibold' : 'text-gray-900'}`}
                    >
                      All Books
                    </Text>
                    {isSelected && <Check size={16} color='#4f46e5' />}
                  </Pressable>
                );
              }

              const book = item.book;
              const isSelected = currentFilter === book.id;
              const displayName = book.nameLocal ?? book.name;

              return (
                <Pressable
                  onPress={() => onSelect(book.id)}
                  className={`flex-row items-center justify-between mx-4 px-3 py-2 rounded-lg ${isSelected ? 'bg-indigo-50' : ''}`}
                >
                  <Text
                    className={`text-sm ${isSelected ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
                  >
                    {displayName}
                  </Text>
                  {isSelected && <Check size={16} color='#4f46e5' />}
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
