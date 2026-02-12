import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Check, BookOpen } from 'lucide-react-native';
import { biblePlans, bibleBooks, bibleUserState } from '@/data/mockData';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

export default function BiblePlanDetailScreen() {
  const insets = useSafeAreaInsets();
  const { planId, from } = useLocalSearchParams<{ planId?: string, from: string }>();
  const plan = biblePlans.find((p) => p.id === planId);

  // Force re-render after mutations
  const [, setTick] = useState(0);

  if (!plan) {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <Text className='text-sm text-gray-500'>Plan not found.</Text>
      </View>
    );
  }

  const completedCount = plan.days.filter((d) => d.completed).length;
  const progress = plan.totalDays > 0 ? completedCount / plan.totalDays : 0;
  const isStarted = plan.startDate !== null;

  const handleStart = () => {
    plan.startDate = new Date().toISOString().split('T')[0];
    bibleUserState.activePlanId = plan.id;
    setTick((t) => t + 1);
  };

  const toggleDay = (dayIndex: number) => {
    plan.days[dayIndex].completed = !plan.days[dayIndex].completed;
    setTick((t) => t + 1);
  };

  const getBookName = (bookId: string) =>
    bibleBooks.find((b) => b.id === bookId)?.name ?? bookId;

  const formatPassage = (p: { bookId: string; chapter: number; verseStart: number; verseEnd: number }) => {
    if (p.verseStart === p.verseEnd) return `${getBookName(p.bookId)} ${p.chapter}:${p.verseStart}`;
    return `${getBookName(p.bookId)} ${p.chapter}:${p.verseStart}-${p.verseEnd}`;
  };

    console.log('FROM::', from);

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title={plan.title} navigateTo={from || '/bible'} />
      

      <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
        {/* Plan header card */}
        <View className='px-4 pt-4'>
          <View className='bg-white rounded-xl border border-gray-200 p-4'>
            <Text className='text-sm text-gray-500 leading-relaxed'>{plan.description}</Text>

            {/* Tags */}
            <View className='flex-row flex-wrap gap-1.5 mt-3'>
              {plan.tags.map((tag) => (
                <View key={tag} className='bg-indigo-50 rounded-md px-2 py-0.5'>
                  <Text className='text-xs font-medium text-indigo-600'>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Progress bar */}
            <View className='mt-4'>
              <View className='flex-row items-center justify-between mb-1.5'>
                <Text className='text-xs text-gray-500'>Progress</Text>
                <Text className='text-xs font-semibold text-indigo-600'>
                  {completedCount}/{plan.totalDays} days
                </Text>
              </View>
              <View className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                <View className='h-full bg-indigo-600 rounded-full' style={{ width: `${progress * 100}%` }} />
              </View>
            </View>

            {/* Start button if not started */}
            {!isStarted && (
              <Pressable onPress={handleStart} className='mt-4 bg-indigo-600 py-3 rounded-xl items-center'>
                <Text className='text-sm font-semibold text-white'>Start Plan</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Day list */}
        <View className='px-4 pt-4 gap-2'>
          <Text className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Days</Text>
          {plan.days.map((day, idx) => (
            <View
              key={day.day}
              className={`bg-white rounded-xl border border-gray-200 p-3 ${day.completed ? 'border-indigo-200 bg-indigo-50' : ''}`}
            >
              <View className='flex-row items-start gap-3'>
                {/* Checkbox */}
                <Pressable
                  onPress={() => toggleDay(idx)}
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center flex-shrink-0 mt-0.5 ${
                    day.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                  }`}
                >
                  {day.completed && <Check size={13} color='#ffffff' strokeWidth={3} />}
                </Pressable>

                {/* Content */}
                <View className='flex-1'>
                  <Text className={`text-sm font-medium ${day.completed ? 'text-indigo-700' : 'text-gray-900'}`}>
                    Day {day.day}: {day.title}
                  </Text>
                  <Text className='text-xs text-gray-500 mt-0.5'>
                    {day.passages.map(formatPassage).join(', ')}
                  </Text>
                </View>

                {/* Read button */}
                <Pressable
                  onPress={() => {
                    const p = day.passages[0];
                    router.push({
                      pathname: '/bible/reader',
                      params: {
                        translationId: 'de4e12af7f28f599-02', // KJV
                        bookId: p.bookId,
                        chapter: String(p.chapter),
                        verse: String(p.verseStart),
                        from:'/bible/plan-detail',
                        planId
                        
                      },
                    });
                  }}
                  className='w-8 h-8 bg-indigo-100 rounded-lg items-center justify-center flex-shrink-0'
                >
                  <BookOpen size={16} color='#4f46e5' />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
