import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <View className='flex-row items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3'>
      <Flame size={22} color='#f59e0b' fill='#fbbf24' />
      <View>
        <Text className='text-lg font-bold text-amber-600'>{streak}</Text>
        <Text className='text-xs text-amber-500'>day streak</Text>
      </View>
    </View>
  );
}
