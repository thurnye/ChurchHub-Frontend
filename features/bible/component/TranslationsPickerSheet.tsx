import { View, Text, Pressable, FlatList, Modal } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type ApiBible } from '../services/bibleService';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface TranslationsPickerSheetProps {
  visible: boolean;
  currentBibleId: string;
  onSelect: (bibleId: string) => void;
  onClose: () => void;
}

export function TranslationsPickerSheet({
  visible,
  currentBibleId,
  onSelect,
  onClose,
}: TranslationsPickerSheetProps) {
  const insets = useSafeAreaInsets();
  const { bibles } = useSelector(
    (state: RootState) => state.bible,
  );

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <View className='flex-1 justify-end bg-black/50'>
        <View className='bg-white rounded-t-2xl' style={{ paddingBottom: insets.bottom }}>
          <View className='items-center pt-3 pb-1'>
            <View className='w-10 h-1 bg-gray-300 rounded-full' />
          </View>
          <View className='flex-row items-center justify-between px-4 py-3'>
            <Text className='font-semibold text-base text-gray-900'>Select Translation</Text>
            <Pressable onPress={onClose} className='w-8 h-8 items-center justify-center'>
              <X size={20} color='#6b7280' />
            </Pressable>
          </View>
          <FlatList
            data={bibles}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 360 }}
            renderItem={({ item }) => {
              const isSelected = currentBibleId === item.id;
              const abbr = item.abbreviationLocal ?? item.abbreviation;
              return (
                <Pressable
                  onPress={() => onSelect(item.id)}
                  className={`flex-row items-center justify-between mx-4 px-3 py-3 rounded-lg ${isSelected ? 'bg-indigo-50' : ''}`}
                >
                  <View>
                    <Text
                      className={`text-sm font-medium ${isSelected ? 'text-indigo-600' : 'text-gray-900'}`}
                    >
                      {abbr}
                    </Text>
                    <Text className='text-xs text-gray-400'>{item.name}</Text>
                  </View>
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
