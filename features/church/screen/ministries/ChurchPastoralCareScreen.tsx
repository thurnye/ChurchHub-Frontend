import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';

interface ChurchPastoralCareScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchPastoralCareScreen({
  church,
}: ChurchPastoralCareScreenProps) {
  return (
    <ChurchScreenTemplate church={church} title='Pastoral Care' icon={Heart}>
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Pastoral Care Ministry
              </Text>
              <Text className='text-sm text-gray-600'>
                Our pastoral care team is here to support you through life's
                joys and challenges.
              </Text>
            </View>

            <View className='gap-2'>
              <AppPressable
                label='Request Prayer'
                variant='primary'
                onPress={() => {}}
              />
              <AppPressable
                label='Schedule Counseling'
                variant='outline'
                onPress={() => {}}
              />
              <AppPressable
                label='Hospital Visit Request'
                variant='outline'
                onPress={() => {}}
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
