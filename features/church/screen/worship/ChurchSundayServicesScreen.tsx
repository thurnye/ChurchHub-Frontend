import React from 'react';
import { View, Text } from 'react-native';
import { Church as ChurchIcon, Video } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';

interface ChurchSundayServicesScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchSundayServicesScreen({ church }: ChurchSundayServicesScreenProps) {
  const sunday = church.serviceTimes.filter((s) => s.day === 'Sunday');

  return (
    <ChurchScreenTemplate
      church={church}
      title='Sunday Services'
      icon={ChurchIcon}
    >
      <View className='gap-3'>
        {sunday.map((service, idx) => (
          <Card key={idx}>
            <CardContent className='p-4'>
              <Text className='font-semibold text-gray-900 mb-2'>
                {service.type}
              </Text>
              <Text className='text-sm text-gray-600 mb-3'>
                {service.day} at {service.time}
              </Text>

              {church.hasLivestream ? (
                <AppPressable
                  label='Watch Online'
                  size='sm'
                  onPress={() => {}}
                  leftIcon={<Video size={16} color='#fff' />}
                />
              ) : null}
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
