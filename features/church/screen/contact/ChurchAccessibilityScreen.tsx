import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Users } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchAccessibilityScreenProps {
  church: IChurch;
}

const openPhone = (phone: string) => Linking.openURL(`tel:${phone}`);

export function ChurchAccessibilityScreen({
  church,
}: ChurchAccessibilityScreenProps) {
  const items = [
    'Wheelchair accessible entrance',
    'Accessible restrooms',
    'Reserved parking spaces',
    'Hearing assistance available',
    'Large print materials available',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Accessibility'
      icon={Users}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='mb-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Accessibility Features
            </Text>
            <Text className='text-sm text-gray-600'>
              {church.accessibilityInfo}
            </Text>
          </View>

          <View className='gap-2 mb-4'>
            {items.map((t) => (
              <Text key={t} className='text-sm text-gray-900'>
                ✓ {t}
              </Text>
            ))}
          </View>

          <View className='bg-indigo-50 p-3 rounded-xl'>
            <Text className='text-sm text-gray-800'>
              For special accommodation requests, please contact our office at{' '}
              <Text
                className='text-indigo-600'
                onPress={() => openPhone(church.phone)}
              >
                {church.phone}
              </Text>
              .
            </Text>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
