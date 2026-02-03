import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { biblePlans } from '@/data/mockData';
import { PlanCard } from '../component/PlanCard';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

export default function BiblePlansScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{
    from: string;
  }>();


  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar
        show={true}
        title={'Reading Plans'}
        navigateTo={from || '/bible'}
      />

      <FlatList
        data={biblePlans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: insets.bottom + 16,
        }}
        renderItem={({ item }) => (
          <PlanCard
            plan={item}
            onPress={() =>
              router.push({
                pathname: '/bible/plan-detail',
                params: { 
                  planId: item.id,
                  from:'/bible/plans'
                 },
              })
            }
          />
        )}
      />
    </View>
  );
}
