import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

interface BibleSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function BibleSearchInput({ value, onChangeText }: BibleSearchInputProps) {
  return (
    <View className='flex-row items-center border border-gray-900 bg-gray-100 rounded-xl px-3 py-2.5 gap-2'>
      <Search size={16} color='#6b7280' />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder='Search Bible, Topics, or Questions'
        placeholderTextColor='#6b7280'
        className='flex-1 text-sm'
        autoCorrect={false}
        spellCheck={false}
      />
    </View>
  );
}
