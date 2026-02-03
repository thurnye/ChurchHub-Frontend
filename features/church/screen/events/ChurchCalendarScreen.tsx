import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchCalendarScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchCalendarScreen({ church }: ChurchCalendarScreenProps) {
  const items = [
    { title: 'Youth Revival', date: 'Jan 28, 2026', time: '6:00 PM' },
    { title: "Women's Conference", date: 'Feb 5, 2026', time: '10:00 AM' },
    { title: 'Church Picnic', date: 'Feb 15, 2026', time: '12:00 PM' },
  ];

  return (
    <ChurchScreenTemplate church={church} title="What's On" icon={Calendar}>
      <View className='gap-3'>
        {items.map((event, idx) => (
          <Card key={idx}>
            <CardContent className='p-4'>
              <Text className='font-semibold text-gray-900 mb-2'>
                {event.title}
              </Text>
              <Text className='text-sm text-gray-600 mb-3'>
                {event.date} at {event.time}
              </Text>

              <Button size='sm' className='w-full' onPress={() => {}}>
                <Text className='text-white font-medium'>RSVP</Text>
              </Button>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
