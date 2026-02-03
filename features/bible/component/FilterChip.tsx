import type { ComponentType } from 'react';
import { Pressable, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface FilterChipProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  badge?: string;
  onPress: () => void;
}

export function FilterChip({ icon: Icon, label, badge, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className='flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-600 bg-gray-100'
    >
      <Icon size={14} color='#111827' />
      <Text className='text-xs text-gray-900 font-medium'>{label}</Text>
      {badge && <Text className='text-xs text-indigo-400 font-semibold'>({badge})</Text>}
      <ChevronDown size={12} color='#6b7280' />
    </Pressable>
  );
}
