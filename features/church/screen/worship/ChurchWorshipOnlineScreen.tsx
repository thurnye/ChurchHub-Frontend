import React from 'react';
import { View, Text } from 'react-native';
import { Video } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';

interface ChurchWorshipOnlineScreenProps {
  church: IChurch;
}

export function ChurchWorshipOnlineScreen({ church }: ChurchWorshipOnlineScreenProps) {
  return (
    <ChurchScreenTemplate church={church} title='Online Services' icon={Video}>
      <Card className='mb-4'>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-2'>
            Join Us Online
          </Text>
          <Text className='text-sm text-gray-600 mb-4'>
            Experience worship from anywhere with our live streaming services.
          </Text>

          <AppPressable
            label='Watch Live Stream'
            onPress={() => {}}
            leftIcon={<Video size={18} color='#fff' />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-2'>
            Live Stream Schedule
          </Text>

          <View className='gap-2'>
            {church.serviceTimes.map((service, idx) => (
              <View
                key={idx}
                className='flex-row items-center justify-between py-2 border-b border-gray-100'
              >
                <View>
                  <Text className='font-medium text-sm text-gray-900'>
                    {service.type}
                  </Text>
                  <Text className='text-xs text-gray-600'>{service.day}</Text>
                </View>

                <Text className='text-sm font-medium text-gray-900'>
                  {service.time}
                </Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
