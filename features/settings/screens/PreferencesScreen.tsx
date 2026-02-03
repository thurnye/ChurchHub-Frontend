import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, ChevronDown } from 'lucide-react-native';

import { Button, Card, CardContent } from '@/shared/components/ui';
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";

export function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const [preferences, setPreferences] = useState({
    denomination: 'All Denominations',
    church: 'None Selected',
    worshipStyle: 'All Styles',
  });
  const [notifications, setNotifications] = useState({
    serviceReminders: true,
    eventUpdates: true,
    newSermons: true,
    prayerRequests: false,
  });

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='Preferences' />

      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        {/* Preferences */}
        <Card className='mb-4'>
          <CardContent className='gap-4'>
            {/* Denomination */}
            <View>
              <Text className='text-sm font-medium text-gray-900 mb-2'>
                Preferred Denomination
              </Text>
              <Pressable className='flex-row items-center justify-between px-3 py-3 border border-gray-300 rounded-lg'>
                <Text className='text-gray-700'>
                  {preferences.denomination}
                </Text>
                <ChevronDown size={20} color='#6b7280' />
              </Pressable>
            </View>

            {/* Church */}
            <View>
              <Text className='text-sm font-medium text-gray-900 mb-2'>
                Preferred Church
              </Text>
              <Pressable className='flex-row items-center justify-between px-3 py-3 border border-gray-300 rounded-lg'>
                <Text className='text-gray-700'>{preferences.church}</Text>
                <ChevronDown size={20} color='#6b7280' />
              </Pressable>
            </View>

            {/* Worship Style */}
            <View>
              <Text className='text-sm font-medium text-gray-900 mb-2'>
                Worship Style
              </Text>
              <Pressable className='flex-row items-center justify-between px-3 py-3 border border-gray-300 rounded-lg'>
                <Text className='text-gray-700'>
                  {preferences.worshipStyle}
                </Text>
                <ChevronDown size={20} color='#6b7280' />
              </Pressable>
            </View>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Text className='font-semibold text-gray-900 mb-3'>Notifications</Text>
        <Card className='mb-6'>
          <CardContent className='gap-1'>
            {[
              { key: 'serviceReminders', label: 'Service Reminders' },
              { key: 'eventUpdates', label: 'Event Updates' },
              { key: 'newSermons', label: 'New Sermons' },
              { key: 'prayerRequests', label: 'Prayer Requests' },
            ].map((item) => (
              <View
                key={item.key}
                className='flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0'
              >
                <Text className='text-sm text-gray-900'>{item.label}</Text>
                <Switch
                  value={notifications[item.key as keyof typeof notifications]}
                  onValueChange={(value) =>
                    setNotifications({ ...notifications, [item.key]: value })
                  }
                  trackColor={{ false: '#e5e7eb', true: '#818cf8' }}
                  thumbColor={
                    notifications[item.key as keyof typeof notifications]
                      ? '#4f46e5'
                      : '#f3f4f6'
                  }
                />
              </View>
            ))}
          </CardContent>
        </Card>

        <Button className='w-full'>
          <Text className='text-white font-medium'>Save Preferences</Text>
        </Button>

        <View className='h-8' />
      </ScrollView>
    </View>
  );
}
