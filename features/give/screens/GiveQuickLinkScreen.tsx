// GiveQuickLinkScreen.tsx (React Native + NativeWind)
// ✅ No Button component
// ✅ Uses Pressable
// ✅ Uses your Card/CardContent (shared/ui) style
// ✅ Uses lucide-react-native icons

import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import {
  ArrowLeft,
  Church,
  Calendar,
  Users,
  Heart,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';

import { Card, CardContent } from '@/shared/components/ui';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { router, useLocalSearchParams } from 'expo-router';

interface GiveQuickLinkScreenProps {
  // onSelectTarget: (target: "church" | "event" | "program" | "group" | "other") => void;
}

export function GiveQuickLinkScreen({}: GiveQuickLinkScreenProps) {
  const { from } = useLocalSearchParams<{
    from: string;
  }>();

  const donationTargets = [
    {
      id: 'church' as const,
      icon: Church,
      title: 'Church Tithe & Offering',
      description: 'Support your local church ministry and operations',
      iconColor: '#4f46e5', // indigo-600
      iconBg: 'bg-indigo-100',
      targetType: 'church',
    },
    {
      id: 'event' as const,
      icon: Calendar,
      title: 'Event Contribution',
      description: 'Support conferences, retreats, and special events',
      iconColor: '#16a34a', // green-600
      iconBg: 'bg-green-100',
      targetType: 'event',
    },
    {
      id: 'program' as const,
      icon: Heart,
      title: 'Community Program',
      description: 'Give to food banks, outreach, and charity programs',
      iconColor: '#e11d48', // rose-600
      iconBg: 'bg-rose-100',
      targetType: 'program',
    },
    {
      id: 'group' as const,
      icon: Users,
      title: 'Group Contribution',
      description: 'Support ministry groups and their activities',
      iconColor: '#7c3aed', // purple-600
      iconBg: 'bg-purple-100',
      targetType: 'group',
    },
    {
      id: 'other' as const,
      icon: Sparkles,
      title: 'Other / Special Giving',
      description: 'Missions, building fund, or special offerings',
      iconColor: '#d97706', // amber-600
      iconBg: 'bg-amber-100',
      targetType: 'others',
    },
  ];

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar
        show={true}
        title={`Give / Donations`}
        navigateTo={from}
      />
      {/* Header */}
      {/* <View className='bg-white border-b border-gray-200 px-4 py-3'>
        <View className='flex-row items-center gap-3'>
          <Pressable
            onPress={onBack}
            className="h-10 w-10 rounded-xl bg-white items-center justify-center border border-gray-200"
          >
            <ArrowLeft size={20} color="#111827" />
          </Pressable>
          <Text className='font-semibold text-lg text-gray-900'>Give</Text>
        </View>
      </View> */}

      <ScrollView contentContainerClassName='pb-8'>
        {/* Hero */}
        <View className='bg-indigo-600 px-6 py-6'>
          <View className='max-w-md mx-auto'>
            <Text className='text-white text-2xl font-bold mb-2'>
              Support God&apos;s Work
            </Text>
            <Text className='text-indigo-100'>
              Choose where you&apos;d like to give. Your generosity makes a
              difference in the lives of many.
            </Text>
          </View>
        </View>

        {/* Cards */}
        <View className='px-4 -mt-4'>
          <View className='gap-3'>
            {donationTargets.map((target) => {
              const Icon = target.icon;

              return (
                <Pressable
                  key={target.id}
                  // onPress={() => onSelectTarget(target.id)}
                  onPress={() =>
                    router.push({
                      pathname: '/give/give-quick-link-donation',
                      params: {
                        title: target.title ,
                        from: '/give/give-quick-link',
                        targetType: target.targetType,
                      },
                    })
                  }
                  className='active:opacity-90'
                >
                  <Card>
                    <CardContent className='p-4'>
                      <View className='flex-row items-start gap-4'>
                        <View
                          className={['p-3 rounded-2xl', target.iconBg].join(
                            ' ',
                          )}
                        >
                          <Icon size={24} color={target.iconColor} />
                        </View>

                        <View className='flex-1'>
                          <Text className='font-semibold text-gray-900 mb-1'>
                            {target.title}
                          </Text>
                          <Text className='text-sm text-gray-600'>
                            {target.description}
                          </Text>
                        </View>

                        <View className='justify-center'>
                          <ChevronRight size={20} color='#9ca3af' />
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </Pressable>
              );
            })}
          </View>

          {/* Info */}
          <View className='mt-6 p-4 bg-white rounded-2xl border border-gray-200'>
            <Text className='font-semibold text-gray-900 mb-2'>
              About Giving
            </Text>

            <View className='gap-2'>
              {[
                'All donations are secure and encrypted',
                'You can set up recurring donations',
                'Tax receipts are automatically generated',
                '100% of your donation goes to the selected cause',
              ].map((t, idx) => (
                <View key={idx} className='flex-row items-start gap-2'>
                  <Text className='text-indigo-600 mt-0.5'>•</Text>
                  <Text className='text-sm text-gray-600 flex-1'>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Scripture */}
          <View className='mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100'>
            <Text className='text-sm text-indigo-900 italic mb-2'>
              “Each of you should give what you have decided in your heart to
              give, not reluctantly or under compulsion, for God loves a
              cheerful giver.”
            </Text>
            <Text className='text-xs text-indigo-700 font-semibold'>
              2 Corinthians 9:7
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
