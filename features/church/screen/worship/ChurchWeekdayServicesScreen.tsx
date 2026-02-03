import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchWeekdayServicesScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchWeekdayServicesScreen({ church }: ChurchWeekdayServicesScreenProps) {
  const weekdays = church.serviceTimes.filter((s) => s.day !== 'Sunday');

  return (
    <ChurchScreenTemplate
      church={church}
      title='Weekday & Special Services'
      icon={Calendar}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='gap-3'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Weekday Services
              </Text>

              <View className='gap-2'>
                {weekdays.map((service, idx) => (
                  <View key={idx} className='py-2 border-b border-gray-100'>
                    <Text className='font-medium text-sm text-gray-900'>
                      {service.type}
                    </Text>
                    <Text className='text-sm text-gray-600'>
                      {service.day} at {service.time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Special Services
              </Text>
              <Text className='text-sm text-gray-600'>
                Check our events calendar for special services and celebrations.
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
