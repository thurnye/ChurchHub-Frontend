import { ScrollView, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  BookOpen,
  Star,
  FileText,
  Bookmark,
  Music,
} from 'lucide-react-native';
import { TopBar } from '@/shared/components';
import { Card, CardContent } from '@/shared/components/ui';
import { StreakCard } from '../component/StreakCard';
import { bibleUserState, biblePlans, bibleBooks } from '@/data/mockData';
import { getBookName } from '../services/bibleService';

export default function BibleHomeScreen() {
  const insets = useSafeAreaInsets();
  const { lastRead, currentStreak, activePlanId } = bibleUserState;
  const lastReadBook = bibleBooks.find((b) => b.id === lastRead.bookId);
  const activePlan = biblePlans.find((p) => p.id === activePlanId);

  const quickActions = [
    { label: 'Highlights', icon: Star, route: '/bible/highlights' as const },
    { label: 'Bookmarks', icon: Bookmark, route: '/bible/bookmarks' as const },
    { label: 'Notes', icon: FileText, route: '/bible/notes' as const },
    { label: 'Plans', icon: BookOpen, route: '/bible/plans' as const },
    // { label: 'Audio', icon: Music, route: '/bible/audio' as const },
  ];

  return (
    <View className='flex-1 bg-gray-50'>
      <TopBar title='The Holy Bible' />
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className='px-4 pt-4 gap-4'>
          {/* Continue Reading Card */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/bible/reader',
                params: {
                  translationId: lastRead.translationId,
                  bookId: lastRead.bookId,
                  chapter: String(lastRead.chapter),
                  verse: String(lastRead.verse),
                  from:'bible'
                },
              })
            }
          >
            <Card>
              <CardContent>
                <View className='flex-row items-center gap-3'>
                  <View className='w-11 h-11 bg-indigo-100 rounded-xl items-center justify-center flex-shrink-0'>
                    <BookOpen size={22} color='#4f46e5' />
                  </View>
                  <View className='flex-1'>
                    <Text className='text-xs text-indigo-600 font-semibold uppercase tracking-wider'>
                      Continue Reading
                    </Text>
                    <Text className='font-semibold text-sm text-gray-900 mt-0.5'>
                      {lastReadBook?.name ?? lastRead.bookId} {lastRead.chapter}
                      :{lastRead.verse}
                    </Text>
                    <Text className='text-xs text-gray-500'>
                      {lastRead.translationId.toUpperCase()} &middot; Tap to
                      continue
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Pressable>

          {/* Streak + Search row */}
          <View className='flex-row gap-3'>
            <View className='flex-1'>
              <StreakCard streak={currentStreak} />
            </View>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/bible/search',
                  params: { from: 'bible' },
                })
              }
              className='w-14 bg-white border border-gray-200 rounded-xl items-center justify-center'
            >
              <Search size={20} color='#4f46e5' />
            </Pressable>
          </View>

          {/* Today's Plan */}
          {activePlan && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/bible/plan-detail',
                  params: {
                    planId: activePlan.id,
                    from: 'bible',
                  },
                })
              }
            >
              <Card>
                <CardContent>
                  <Text className='text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1'>
                    Today's Plan
                  </Text>
                  <Text className='font-semibold text-sm text-gray-900'>
                    {activePlan.title}
                  </Text>
                  {(() => {
                    const nextDay = activePlan.days.find((d) => !d.completed);
                    return nextDay ? (
                      <Text className='text-xs text-gray-500 mt-0.5'>
                        Day {nextDay.day}: {nextDay.title}
                      </Text>
                    ) : null;
                  })()}
                  {/* Progress */}
                  <View className='mt-3'>
                    <View className='h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                      <View
                        className='h-full bg-indigo-600 rounded-full'
                        style={{
                          width: `${(activePlan.days.filter((d) => d.completed).length / activePlan.totalDays) * 100}%`,
                        }}
                      />
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          )}

          {/* Quick Actions Grid */}
          <View>
            <Text className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
              Quick Access
            </Text>
            <View className='flex-row flex-wrap gap-2'>
              {quickActions.map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() =>
                    router.push({
                      pathname: action.route,
                      params: {
                        from: '/bible',
                      },
                    })
                  }
                  className='flex-1 bg-white border border-gray-200 rounded-xl p-3 items-center gap-2'
                  style={{ minWidth: '28%' }}
                >
                  <View className='w-9 h-9 bg-indigo-50 rounded-lg items-center justify-center'>
                    <action.icon size={18} color='#4f46e5' />
                  </View>
                  <Text className='text-xs font-medium text-gray-700'>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
