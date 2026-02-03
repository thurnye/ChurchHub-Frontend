import { View, Text, Pressable } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { Badge } from '@/shared/components/ui';
import type { IBiblePlan } from '@/data/mockData';

interface PlanCardProps {
  plan: IBiblePlan;
  onPress: () => void;
}

export function PlanCard({ plan, onPress }: PlanCardProps) {
  const completedDays = plan.days.filter((d) => d.completed).length;
  const progress = plan.totalDays > 0 ? completedDays / plan.totalDays : 0;
  const isStarted = plan.startDate !== null;

  return (
    <Pressable
      onPress={onPress}
      className='bg-white rounded-xl border border-gray-200 p-4'
    >
      <View className='flex-row items-start gap-3'>
        <View className='w-10 h-10 bg-indigo-100 rounded-lg items-center justify-center flex-shrink-0'>
          <BookOpen size={20} color='#4f46e5' />
        </View>
        <View className='flex-1'>
          <Text className='font-semibold text-sm text-gray-900'>{plan.title}</Text>
          <Text className='text-xs text-gray-500 mt-0.5 leading-relaxed'>{plan.description}</Text>

          {/* Tags */}
          <View className='flex-row flex-wrap gap-1.5 mt-2'>
            {plan.tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </View>

          {/* Progress bar */}
          <View className='flex-row items-center gap-2 mt-3'>
            <View className='flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
              <View
                className='h-full bg-indigo-600 rounded-full'
                style={{ width: `${progress * 100}%` }}
              />
            </View>
            <Text className='text-xs text-gray-500'>
              {isStarted ? `${completedDays}/${plan.totalDays}` : `${plan.totalDays} days`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
