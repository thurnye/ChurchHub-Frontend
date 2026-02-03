import React from 'react';
import { View, Text } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchPastEventsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchPastEventsScreen({
  church,
}: ChurchPastEventsScreenProps) {
  const past = [
    { title: 'Christmas Service 2025', date: 'Dec 25, 2025' },
    { title: 'Harvest Festival', date: 'Nov 15, 2025' },
    { title: 'Youth Camp', date: 'Aug 10-15, 2025' },
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Past Events Archive'
      icon={FileText}
    >
      <Text className='text-sm text-gray-600 mb-4'>
        Browse our past events and activities.
      </Text>

      <View className='gap-2'>
        {past.map((event, idx) => (
          <Card key={idx}>
            <CardContent className='p-3'>
              <Text className='font-medium text-sm text-gray-900'>
                {event.title}
              </Text>
              <Text className='text-xs text-gray-600'>{event.date}</Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
