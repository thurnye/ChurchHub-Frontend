import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchYouthFamilyScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchYouthFamilyScreen({
  church,
}: ChurchYouthFamilyScreenProps) {
  const childrenItems = [
    '• Sunday School (Ages 4-12)',
    "• Children's Worship",
    '• Vacation Bible School',
  ];
  const youthItems = [
    '• Youth Group (Ages 13-18)',
    '• Friday Night Fellowship',
    '• Youth Camps & Retreats',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Children, Youth & Family'
      icon={Users}
    >
      <View className='gap-4'>
        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Children's Ministry
            </Text>
            <Text className='text-sm text-gray-600 mb-3'>
              Nurturing young hearts for Jesus.
            </Text>
            <View className='gap-1'>
              {childrenItems.map((t, idx) => (
                <Text key={idx} className='text-sm text-gray-700'>
                  {t}
                </Text>
              ))}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Youth Ministry
            </Text>
            <Text className='text-sm text-gray-600 mb-3'>
              Building strong foundations in faith.
            </Text>
            <View className='gap-1'>
              {youthItems.map((t, idx) => (
                <Text key={idx} className='text-sm text-gray-700'>
                  {t}
                </Text>
              ))}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Family Ministry
            </Text>
            <Text className='text-sm text-gray-600'>
              Strengthening families through faith.
            </Text>
          </CardContent>
        </Card>
      </View>
    </ChurchScreenTemplate>
  );
}
