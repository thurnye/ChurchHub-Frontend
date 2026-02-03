import { View, Text, Pressable, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface BibleSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function BibleSearchBar({ value, onChangeText, placeholder = 'Search verses or references...' }: BibleSearchBarProps) {
  return (
    <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 gap-2'>
      <Search size={16} color='#9ca3af' />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#9ca3af'
        returnKeyType='search'
        autoCapitalize='none'
        autoCorrect={false}
        style={{ flex: 1, fontSize: 14, color: '#111827', paddingVertical: 0 }}
        cursorColor='#4f46e5'
        selectionColor='#4f46e5'
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} className='w-5 h-5 items-center justify-center'>
          <X size={14} color='#9ca3af' />
        </Pressable>
      )}
    </View>
  );
}
