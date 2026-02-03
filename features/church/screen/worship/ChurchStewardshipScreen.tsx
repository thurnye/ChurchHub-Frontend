import React from 'react';
import { View, Text } from 'react-native';
import { Gift } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchStewardshipScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchStewardshipScreen({
  church,
}: ChurchStewardshipScreenProps) {
  const items = [
    'Biblical Principles of Giving',
    'Tithing and Offerings',
    'Financial Stewardship',
  ];

  return (
    <ChurchScreenTemplate church={church} title='Stewardship' icon={Gift}>
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Biblical Stewardship
              </Text>
              <Text className='text-sm text-gray-600'>
                Stewardship is about managing God's gifts wisely — our time,
                talents, and treasures.
              </Text>
            </View>

            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Teaching Resources
              </Text>
              <View className='gap-2'>
                {items.map((it) => (
                  <Text key={it} className='text-sm text-gray-700'>
                    • {it}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
