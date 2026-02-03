import React from 'react';
import { View, Text } from 'react-native';
import { BookOpen } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchBibleStudyScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchBibleStudyScreen({
  church,
}: ChurchBibleStudyScreenProps) {
  const sessions = [
    { title: 'Wednesday Night Study', time: '7:00 PM - 8:30 PM' },
    { title: 'Sunday Morning Class', time: '9:00 AM - 10:00 AM' },
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Bible Study / Catechism'
      icon={BookOpen}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Bible Study Groups
              </Text>
              <Text className='text-sm text-gray-600'>
                Join a small group for deep biblical study and fellowship.
              </Text>
            </View>

            <View className='gap-2'>
              {sessions.map((s, idx) => (
                <Card key={idx} className='bg-gray-50'>
                  <CardContent className='p-3'>
                    <Text className='font-medium text-sm text-gray-900 mb-1'>
                      {s.title}
                    </Text>
                    <Text className='text-xs text-gray-600'>{s.time}</Text>
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
