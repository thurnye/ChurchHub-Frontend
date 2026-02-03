import React from 'react';
import { View, Text } from 'react-native';
import { Music } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchLecturesScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchLecturesScreen({ church }: ChurchLecturesScreenProps) {
  const events = [
    { title: 'Theological Lecture Series', date: 'Feb 1, 2026' },
    { title: 'Choir Recital', date: 'Mar 8, 2026' },
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Lectures / Recitals'
      icon={Music}
    >
      <Card>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-3'>
            Upcoming Events
          </Text>

          <View className='gap-2'>
            {events.map((e, idx) => (
              <Card key={idx} className='bg-gray-50'>
                <CardContent className='p-3'>
                  <Text className='font-medium text-sm text-gray-900 mb-1'>
                    {e.title}
                  </Text>
                  <Text className='text-xs text-gray-600'>{e.date}</Text>
                </CardContent>
              </Card>
            ))}
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
