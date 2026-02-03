import { View, Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View className='px-4 pt-4 pb-2'>
      <Text className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>{title}</Text>
      {subtitle && (
        <Text className='text-xs text-gray-400 mt-0.5'>{subtitle}</Text>
      )}
    </View>
  );
}
