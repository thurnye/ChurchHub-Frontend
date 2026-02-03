import { View, Text, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Download, DollarSign } from 'lucide-react-native';

import { Button, Card, CardContent } from '@/shared/components/ui';
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";

const donations = [
  {
    id: '1',
    church: 'Grace Community Church',
    amount: 100,
    date: 'Jan 15, 2026',
    type: 'Tithe',
  },
  {
    id: '2',
    church: 'St. James Cathedral',
    amount: 50,
    date: 'Jan 8, 2026',
    type: 'Offering',
  },
  {
    id: '3',
    church: 'Grace Community Church',
    amount: 100,
    date: 'Jan 1, 2026',
    type: 'Tithe',
  },
];

export function MyDonationsScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{
        from: string;
      }>();

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='My Donations' navigateTo={from}/>

      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        {/* Total Giving Card */}
        <Card className='mb-4 bg-indigo-600 border-0'>
          <CardContent className='p-6'>
            <Text className='text-sm text-white/80 mb-1'>
              Total Giving (2026)
            </Text>
            <Text className='text-3xl font-bold text-white'>$250.00</Text>
          </CardContent>
        </Card>

        {/* Donation History */}
        <Text className='font-semibold text-gray-900 mb-3'>
          Donation History
        </Text>
        <View className='gap-2'>
          {donations.map((donation) => (
            <Card key={donation.id}>
              <CardContent>
                <View className='flex-row items-start justify-between'>
                  <View className='flex-1'>
                    <Text className='font-medium text-gray-900 mb-1'>
                      {donation.church}
                    </Text>
                    <Text className='text-sm text-gray-600 mb-1'>
                      {donation.type}
                    </Text>
                    <Text className='text-xs text-gray-500'>
                      {donation.date}
                    </Text>
                  </View>
                  <View className='items-end'>
                    <Text className='font-semibold text-lg text-gray-900'>
                      ${donation.amount}
                    </Text>
                    <Pressable className='flex-row items-center gap-1 mt-2 px-2 py-1 rounded active:bg-gray-100'>
                      <Download size={12} color='#6b7280' />
                      <Text className='text-xs text-gray-600'>Receipt</Text>
                    </Pressable>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        <View className='h-8' />
      </ScrollView>
    </View>
  );
}
