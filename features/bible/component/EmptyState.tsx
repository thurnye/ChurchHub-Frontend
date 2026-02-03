import { View, Text, Pressable } from 'react-native';
import { BookOpen } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className='flex-1 items-center justify-center px-6'>
      <View className='w-16 h-16 bg-indigo-50 rounded-2xl items-center justify-center mb-4'>
        <BookOpen size={28} color='#4f46e5' />
      </View>
      <Text className='font-semibold text-base text-gray-900 text-center'>{title}</Text>
      <Text className='text-sm text-gray-500 text-center mt-1.5 leading-relaxed'>{description}</Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className='mt-4 bg-indigo-600 px-5 py-2.5 rounded-xl'
        >
          <Text className='text-sm font-semibold text-white'>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
